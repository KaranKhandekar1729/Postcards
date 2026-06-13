import { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import Toolbar from "./Toolbar";

export default function CardCanvas({ fabricRef, fabricData, postcardId, setPostcardId }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth()
    const [authOpen, setAuthOpen] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const canvasRef = useRef(null)
    const envelopeRef = useRef(null)
    const [toolbarPos, setToolbarPos] = useState({
        x: 0,
        y: 0,
        visible: false,
    });
    const [showLayerOptions, setShowLayerOptions] = useState(false)
    const [isTextObj, setIsTextObj] = useState(false)
    const [selectedFont, setSelectedFont] = useState('Arial')
    const [fontSize, setFontSize] = useState(40)

    const fontOptions = [
        { label: 'Arial', value: 'Arial' },
        { label: 'Times New Roman', value: 'TimesNewRoman' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Comic Sans', value: 'ComicSans' }
    ]

    const fontSizeOptions = [12, 14, 16, 18, 20, 24, 30, 36, 40, 48, 56, 64]

    useEffect(() => {
        if (fabricRef?.current) return

        const envelope = envelopeRef?.current;
        const width = envelope.offsetWidth;
        const height = envelope.offsetHeight;


        const canvas = new Canvas(canvasRef.current, {
            width: width,
            height: height,
            backgroundColor: '#fff'
        });
        canvas.renderAll();
        fabricRef.current = canvas;

        const updateToolbar = () => {
            const obj = canvas.getActiveObject();

            if (!obj) {
                setToolbarPos(prev => ({
                    ...prev,
                    visible: false,
                }));
                return;
            }

            obj.borderColor = "brown"
            obj.cornerColor = "brown"
            obj.cornerStyle = "circle"
            obj.cornerStrokeColor = "brown"
            obj.cornerSize = 8
            obj.transparentCorners = false
            obj.controls.mtr.visible = false

            // Set state to true if object is of text type~
            if (canvas.getActiveObject().type === 'i-text') setIsTextObj(true)

            const rect = obj.getBoundingRect();

            setToolbarPos({
                visible: true,
                x: rect.left + rect.width / 2,
                y: rect.top - 80,
            });
        };

        canvas.on("selection:created", updateToolbar);
        canvas.on("selection:updated", () => {
            setShowLayerOptions(false)
            updateToolbar()
        });
        canvas.on("selection:cleared", () => {
            setToolbarPos(prev => ({
                ...prev,
                visible: false,
            }));
            setIsTextObj(false);
            setShowLayerOptions(false)
        });

        canvas.on("object:moving", updateToolbar);
        canvas.on("object:scaling", updateToolbar);
        canvas.on("object:rotating", updateToolbar);

        const observer = new ResizeObserver(() => {
            const w = envelope.offsetWidth;
            const h = envelope.offsetHeight;

            const scaleX = w / canvas.width;
            const scaleY = h / canvas.height;

            canvas.setDimensions({ width: w, height: h });

            canvas.getObjects().forEach(obj => {
                obj.set({
                    left: obj.left * scaleX,
                    top: obj.top * scaleY,
                    scaleX: obj.scaleX * scaleX,
                    scaleY: obj.scaleY * scaleY,
                });
                obj.setCoords();
            });


            canvas.renderAll();
        });
        observer.observe(envelope);

        return () => {
            observer.disconnect();
            canvas.dispose();
            fabricRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // DELETE OBJECT FUNCTION
    const deleteSelected = () => {
        const canvas = fabricRef.current;
        const activeObject = canvas?.getActiveObject();
        if (!activeObject) return;

        // Delete selected object group
        if (activeObject.type === 'activeselection') {
            const selectedObj = canvas.getActiveObject()
            selectedObj.forEachObject((obj) => canvas.remove(obj))
            canvas.discardActiveObject()
        } else {
            canvas.remove(activeObject)
        }

        canvas.renderAll();
    };

    // COPY-PASTE OBJECT FUNCTION
    const duplicate = async () => {
        const canvas = fabricRef.current;

        const activeObject = canvas.getActiveObject()

        if (!activeObject) return;

        const clipboard = await activeObject.clone()
        const clonedObj = await clipboard?.clone()

        canvas.discardActiveObject();

        clonedObj.set({
            left: clonedObj.left + 20,
            top: clonedObj.top + 20,
            evented: true
        });

        if (clonedObj.type === 'activeselection') {
            clonedObj.canvas = canvas;
            clonedObj.forEachObject((obj) => {
                canvas.add(obj)
                clonedObj.setCoords();
            })
        } else {
            canvas.add(clonedObj);
        }

        clipboard.top += 20;
        clipboard.left += 20;

        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    }

    const setLayerPosition = (position) => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        console.log(obj, canvas)

        if (!obj) return;

        position === 'front' ? canvas?.bringObjectToFront(obj) : canvas?.sendObjectToBack(obj)
        canvas.renderAll();
        setShowLayerOptions(false)
    };

    const updateFontFamily = (e) => {
        const font = e.target.value
        setSelectedFont(font)

        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        obj.set({
            fontFamily: font
        })

        canvas.renderAll();
    }

    const updateFontWeight = () => {
        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        obj.set({
            fontWeight: 'Bold'
        })

        canvas.renderAll();
    }

    const updateFontSize = (e) => {
        const fontSize = e.target.value
        setFontSize(fontSize);

        const canvas = fabricRef.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        if (!fontSize) return

        obj.set({
            fontSize: fontSize
        })

        canvas.renderAll();
    }

    const savePostCard = async () => {
        const canvas = fabricRef?.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL({
            format: 'webp',
            quality: 0.7
        })

        const blob = await (await fetch(dataUrl)).blob();

        const formData = new FormData();
        formData.append('file', blob, 'thumbnail.webp');

        const res = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        const uploadData = await res.json();

        console.log('objects on canvas at save:', canvas.getObjects()); // add this
        console.log('canvas JSON:', canvas.toJSON());                    // and this


        const payload = {
            title: state?.title,
            from: state?.from,
            to: state?.to,
            thumbnail: uploadData.url,
            fabricData: canvas.toJSON()
        }

        if (!postcardId) {
            const res = await fetch('http://localhost:3000/api/postcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })
            const data = await res.json();
            setPostcardId(data.data._id)
            navigate(`/postcard/edit/${data.data.slug}`, { replace: true });
        } else {
            await fetch(`http://localhost:3000/api/postcards/${postcardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })
        }
    }

    const handleSave = async () => {
        if (loading) return

        if (!isAuthenticated) {
            setAuthOpen(true)
            return
        }

        await savePostCard()
    }

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !fabricData) return;

        const loadCanvas = async () => {
            try {
                const json =
                    typeof fabricData === "string"
                        ? JSON.parse(fabricData)
                        : fabricData;

                await canvas.loadFromJSON(json);
                canvas.renderAll();
            } catch (err) {
                console.error("Error loading fabric JSON:", err);
            }
        };

        setTimeout(loadCanvas, 0);
    }, [fabricData]);

    return (
        <>
            <div className="perspective-distant h-screen flex flex-1 flex-col gap-3 justify-center items-center bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover">
                <div className="absolute inset-0 backdrop-blur-xs bg-black/30" />

                {/* Envelope */}
                <div
                    ref={envelopeRef}
                    className={`group relative
                    top-20 bg-white w-[95%] h-[200px] xs:w-[90%] xs:h-[40%] sm:h-[50%] md:w-[700px] md:h-[360px] 
                    shadow-2xl drop-shadow-black transition-transform 
                    transform-3d duration-1000 
                    ${isFlipped ? 'rotate-y-180' : ''} origin-center`}>

                    {/* Back */}
                    <div

                        className="absolute inset-0 backface-hidden shadow-inner flex items-center justify-center z-50"
                    >
                        <canvas ref={canvasRef} />
                        {toolbarPos.visible && (
                            <Toolbar
                                toolbarPos={toolbarPos}
                                isTextObj={isTextObj}
                                updateFontFamily={updateFontFamily}
                                updateFontSize={updateFontSize}
                                updateFontWeight={updateFontWeight}
                                fontOptions={fontOptions}
                                selectedFont={selectedFont}
                                fontSizeOptions={fontSizeOptions}
                                fontSize={fontSize}
                                duplicate={duplicate}
                                deleteSelected={deleteSelected}
                                showLayerOptions={showLayerOptions}
                                setShowLayerOptions={setShowLayerOptions}
                                setLayerPosition={setLayerPosition}
                            />
                        )}

                    </div>

                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white shadow-md rotate-y-180">

                        {/* Flap */}
                        <div
                            className={`drop-shadow-lg 
                            absolute w-full h-2/3 
                            transition-all duration-1000 delay-200 
                            ease-in-out origin-top before:content-[''] 
                            before:origin-top before:w-full before:h-full 
                            before:bg-white before:absolute before:[clip-path:polygon(50%_100%,0_0,100%_0)] 
                            z-30
                            before:transition-all before:duration-200 before:ease-in-out`}>
                        </div>

                        {/* Letter */}
                        <div
                            className={`absolute bg-[#fdf6d3] 
                                shadow-lg border border-[#ccc] 
                                w-11/12 h-3/4 top-8 md:top-15
                                left-4 xs:left-5 sm:left-6 md:left-8 perspective-distant 
                                before:content-[''] before:bg-[#fdf6d3] 
                                before:border before:border-[#ccc] 
                                before:absolute before:h-3/4 before:w-full 
                                before:rotate-x-5 before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-[#fdf6d3] after:border 
                                after:border-[#ccc] after:bottom-0 
                                after:rotate-x-[-5deg] after:origin-bottom 
                                after:absolute after:h-3/4 after:w-full 
                                after:transform-3d
                                transition-all
                                duration-2000 z-10
                            `}>
                        </div>

                        {/* Inner gradient for depth */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10 opacity-40 pointer-events-none" />
                        {/* Envelope Front */}
                        <div className="h-full w-full absolute bottom-0 z-20">
                            <div className="[clip-path:polygon(50%_50%,100%_0,100%_100%,0_100%,0_0)] bg-white w-full h-full before:content-[''] before:absolute before:bg-[#f8f6f7] before:w-2/4 before:h-full before:[clip-path:polygon(100%_50%,0_0,0_100%)] after:content-[''] after:bg-[#f8f6f7] after:absolute after:w-2/4 after:h-full after:right-0 after:[clip-path:polygon(0%_50%,100%_0,100%_100%)]"></div>
                        </div>

                    </div>
                </div>
                <div className="relative top-[85px] flex gap-3">
                    <button
                        onClick={() => setIsFlipped(prev => !prev)}
                        className='bg-white p-4 w-[100px] lg:w-32 cursor-pointer'
                    >
                        Flip
                    </button>
                    <button
                        onClick={() => handleSave()}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>

            <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                onSuccess={async () => {
                    setAuthOpen(false)
                    await savePostCard()
                }}
            />
        </>
    )
}