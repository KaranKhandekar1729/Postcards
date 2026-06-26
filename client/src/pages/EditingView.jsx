import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FabricImage, Textbox } from "fabric";
import Sidebar from "../components/Sidebar";
import AuthModal from "../components/AuthModal";
import EnvelopeCanvas from "../components/EnvelopeCanvas";
import ShareModal from "../components/ShareModal";
import { FlipHorizontal, Save } from "lucide-react";

export default function EditingView({ fontOptions, preloadFonts }) {
    const [isUploading, setIsUploading] = useState(false);
    const envelopeFabricRef = useRef(null);
    const letterFabricRef = useRef(null);
    const [envelope, setEnvelope] = useState(null);
    const [envelopeId, setEnvelopeId] = useState(null);
    const [activeCanvas, setActiveCanvas] = useState('envelope')
    const [isFlipped, setIsFlipped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [letterState, setLetterState] = useState('idle')
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0, visible: false });
    const [authOpen, setAuthOpen] = useState(false)
    const [saveStatus, setSaveStatus] = useState('idle')
    const [openShareModal, setOpenShareModal] = useState(false)

    const navigate = useNavigate();
    const { slug } = useParams();
    const { state } = useLocation();
    const { isAuthenticated, loading } = useAuth()

    const visibleCanvas = (!isFlipped) 
        ? 'envelope'
        : (letterState === 'opened' ? 'letter' : null);

    const uploadToCloudinary = async (file) => {
        if (!file) return;

        const sigRes = await fetch('/api/upload/signature', { credentials: 'include' });
        const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json()
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        )

        const data = await uploadRes.json();

        // Url with transformations
        const optimizedUrl = (url, width=700) => {
            return url.replace('/upload/', `/upload/w_${width},c_limit,f_auto,q_auto/`)
        }

        return optimizedUrl(data.secure_url);
    };

    const addText = (canvas) => {
        const text = new Textbox("Hello", {
            fontFamily: "Arial",
            fill: "#000",
            editable: true,
        });
        canvas?.add(text);
        canvas?.centerObject(text);
        canvas?.renderAll()
    };

    const addImage = async (e, canvas) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadToCloudinary(file);
        setIsUploading(false);

        const img = await FabricImage.fromURL(url, {
            crossOrigin: "anonymous",
        });

        img.scaleToWidth(150);
        canvas?.add(img);
        canvas?.centerObject(img);
        canvas?.renderAll()
    };

    // fetch envelope
    useEffect(() => {
        if (!slug) return;

        const getEnvelope = async () => {
            const res = await fetch(
                `/api/envelope/${slug}`, {
                credentials: 'include'
            }
            );
            const data = await res.json();
            setEnvelope(data.data);
            setEnvelopeId(data.data._id)
            console.log(data.data)
        };

        getEnvelope();
    }, [slug]);

    const handleEnvelopeFlip = () => {
        console.log("Clicked flip")
        setIsFlipped(prev => !prev);
        setIsOpen(false);
        setLetterState('idle')
        envelopeFabricRef.current?.discardActiveObject()
        envelopeFabricRef.current?.renderAll()
        letterFabricRef.current?.discardActiveObject()
        letterFabricRef.current?.renderAll()
        setActiveCanvas(null)
        setToolbarPos(prev => ({ ...prev, visible: false }));
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleEnvelopeOpen = async () => { 
        if (!isFlipped) return

        if (!isOpen && (letterState === 'idle')) {
            // OPEN flap
            setIsOpen(true) 
            await sleep(1200)
    
            setLetterState('removing')
            await sleep(600)
            setIsOpen(false)
            await sleep(2500)
            setLetterState('opened')
        } else {
            // CLOSE flap
            setToolbarPos(prev => ({...prev, visible: false}))
            letterFabricRef.current?.discardActiveObject()
            letterFabricRef.current?.renderAll()
            setActiveCanvas(null)
            setLetterState('closed')
            await sleep(2000)
            setIsOpen(true)
            await sleep(1200)
            setLetterState('returning')
            await sleep(1200)
            setIsOpen(false)
            await sleep(200)        
            setLetterState('idle')
        }
    }

    const saveEnvelope = async (envelopeFabricRef, letterFabricRef) => {
        if (saveStatus === 'saving') return
        try {
            setSaveStatus('saving')
            const envelopeFabric = envelopeFabricRef?.current
            const letterFabric = letterFabricRef?.current
    
            const payload = {
                title: state?.title,
                from: state?.from,
                to: state?.to,
                envelope: {
                    fabricData: envelopeFabric?.toJSON(),
                    canvasWidth: envelopeFabric?.width,
                    canvasHeight: envelopeFabric?.height,
                },
                letter: {
                    color: '#fdf6d3',
                    fabricData: letterFabric?.toJSON(),
                    canvasWidth: letterFabric?.width,
                    canvasHeight: letterFabric?.height,
                }
            }
    
            if (!envelopeId) {
                const res = await fetch('/api/envelope', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
                const data = await res.json();
                setEnvelopeId(data.data._id)
                navigate(`/envelope/edit/${data.data.slug}`, { replace: true });
            } else {
                await fetch(`/api/envelope/${envelopeId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
            }
            setTimeout(() => setSaveStatus('saved'), 500)
            setTimeout(() => setSaveStatus('idle'), 800)
        } catch (error) {
            console.error('Error saving envelope: ', error)
        }
    }

    const handleSave = async () => {
        if (loading) return

        if (!isAuthenticated) {
            setAuthOpen(true)
            return
        }

        await saveEnvelope(envelopeFabricRef, letterFabricRef)
    }


    return (
        <div className="transition-opacity duration-1000 animate-fade-in flex flex-col-reverse lg:flex-row w-screen h-screen overflow-hidden">
            <Sidebar
                onAddText={addText}
                onAddImage={addImage}
                isUploading={isUploading}
                envelopeFabricRef={envelopeFabricRef}
                letterFabricRef={letterFabricRef}
                activeCanvas={activeCanvas}
                visibleCanvas={visibleCanvas}
                openShareModal={() => setOpenShareModal(true)}
            />

            <div className="perspective-distant h-screen flex flex-1 flex-col gap-3 justify-center items-center bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover">
                <div className="absolute inset-0 backdrop-blur-xs bg-black/30" />
                <EnvelopeCanvas
                    fontOptions={fontOptions}
                    preloadFonts={preloadFonts}
                    envelopeFabricRef={envelopeFabricRef}
                    letterFabricRef={letterFabricRef}
                    envelopeData={envelope}
                    activeCanvas={activeCanvas}
                    setActiveCanvas={setActiveCanvas}
                    isFlipped={isFlipped}
                    isOpen={isOpen}
                    letterState={letterState}
                    toolbarPos={toolbarPos}
                    setToolbarPos={setToolbarPos}
                    handleEnvelopeOpen={handleEnvelopeOpen}
                />
                { (!isOpen && letterState === 'idle') && (
                        <div className="absolute top-2 right-2 flex gap-3">
                            <button
                                onClick={() => handleEnvelopeFlip()}
                                disabled={isOpen && letterState === 'idle'}
                                className='bg-amber-300 flex gap-4 justify-center hover:bg-red-950 font-bold text-red-950 hover:text-amber-300 p-2 px-4 rounded-sm w-fit lg:w-32 cursor-pointer transition-all duration-300 disabled:b'
                            >
                                Flip
                                <FlipHorizontal /> 
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveStatus === 'saving'}
                                className='bg-amber-300 flex gap-4 justify-center hover:bg-red-950 font-bold text-red-950 hover:text-amber-300 p-2 px-4 rounded-sm w-fit lg:w-32 cursor-pointer transition-all duration-300'
                            >
                                {saveStatus === 'saving' ? 
                                    'Saving...' 
                                    : saveStatus === 'saved' 
                                    ? 'Saved' 
                                    : (
                                        <>
                                            <Save />
                                            Save
                                        </>
                                    )}
                            </button>
                        </div>
                    )
                }
                { openShareModal && (
                    <ShareModal
                        openShareModal={openShareModal}
                        onClose={() => setOpenShareModal(false)}
                    />
                )}  
                <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                onSuccess={async () => {
                    setAuthOpen(false)
                    await saveEnvelope()
                }}
            />
            </div>
        </div>
    );
}