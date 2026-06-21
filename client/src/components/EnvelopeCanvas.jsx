import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import Toolbar from "./Toolbar";
import useFabricCanvas from "../hooks/useFabricCanvas";
import '../styles/envelope.css';

export default function CardCanvas({ envelopeFabricRef, letterFabricRef, fabricData, envelopeId, setEnvelopeId, activeCanvas, setActiveCanvas }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth()
    const [authOpen, setAuthOpen] = useState(false)
    const envelopeCanvasRef = useRef(null)
    const envelopeRef = useRef(null)
    const letterCanvasRef = useRef(null)
    const letterRef = useRef(null)
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0, visible: false });
    const [showLayerOptions, setShowLayerOptions] = useState(false)
    const [isTextObj, setIsTextObj] = useState(false)
    const [selectedFont, setSelectedFont] = useState('Arial')
    const [fontDropdownOpen, setFontDropdownOpen] = useState(false)
    const [fontSize, setFontSize] = useState(40)
    const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [letterState, setLetterState] = useState('idle')
    const letterFoldRef = useRef(null)
    const [letterCanvasHeight, setLetterCanvasHeight] = useState()
    const [letterCanvasTop, setLetterCanvasTop] = useState()

    useEffect(() => {
        if (!letterFoldRef.current) return
        const measure = () => {
            const middleDivHeight = letterFoldRef.current.offsetHeight
            const foldDivTop = letterFoldRef.current.offsetTop 
            setLetterCanvasHeight(middleDivHeight * 2.5)
            setLetterCanvasTop(foldDivTop - middleDivHeight * 0.75)
        }

        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(letterFoldRef.current)
        return () => observer.disconnect()
    })

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

    const fontOptions = [
        { label: 'Arial', value: 'Arial', url: null },
        { label: 'Times New Roman', value: 'TimesNewRoman', url: null },
        { label: 'Cedarville Cursive', value: 'CedarvilleCursive', googleFont: true },
        { label: 'Instrument Serif', value: 'InstrumentSerif', googleFont: true },
        { label: 'Shadows Into Light', value: 'ShadowsIntoLight', googleFont: true },
        { label: 'Adversecase', value: 'Adversecase', url: 'https://res.cloudinary.com/docidcbkt/raw/upload/v1781364541/liypsjxnxyjxpmvrcur3.woff2' }
    ]

    const fontSizeOptions = [12, 14, 16, 18, 20, 24, 30, 36, 40, 48, 56, 64]

    useFabricCanvas({
        canvasElRef: envelopeCanvasRef,
        containerElRef: envelopeRef,
        fabricRef: envelopeFabricRef,
        otherFabricRef: letterFabricRef,
        canvasName: 'envelope',
        setActiveCanvas,
        setToolbarPos,
        setIsTextObj,
        setShowLayerOptions,
        setFontDropdownOpen,
        setFontSizeDropdownOpen
    })

    useFabricCanvas({
        canvasElRef: letterCanvasRef,
        containerElRef: letterRef,
        fabricRef: letterFabricRef,
        otherFabricRef: envelopeFabricRef,
        canvasName: 'letter',
        setActiveCanvas,
        setToolbarPos,
        setIsTextObj,
        setShowLayerOptions,
        setFontDropdownOpen,
        setFontSizeDropdownOpen
    })

    // DELETE OBJECT FUNCTION
    const deleteSelected = (ref) => {
        const canvas = ref?.current;
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
    const duplicate = async (ref) => {
        const canvas = ref?.current;

        const activeObject = canvas.getActiveObject()

        if (!activeObject) return;

        const clipboard = await activeObject.clone()
        const clonedObj = await clipboard?.clone()
        console.log(activeObject)
        console.log(canvas)
        console.log(letterFabricRef)
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

    const setLayerPosition = (position, ref) => {
        const canvas = ref?.current;
        const obj = canvas?.getActiveObject();
        console.log(obj, canvas)

        if (!obj) return;

        position === 'front' ? canvas?.bringObjectToFront(obj) : canvas?.sendObjectToBack(obj)
        canvas.renderAll();
        setShowLayerOptions(false)
    };

    const preloadFonts = async () => {
        const customFonts = fontOptions.filter(fontOption => fontOption.url)
        await Promise.all(customFonts.map(async font => {
            if (font.url) {
                const fontFace = new FontFace(font.value, `url(${font.url})`)
                await fontFace.load()
                document.fonts.add(fontFace)
            } else if (font.googleFont) {
                await document.fonts.load(`16px "${font.label}"`)
            }
        }))
    }

    const updateFontFamily = async (fontValue, ref) => {
        const selected = fontOptions.find(f => f.value === fontValue)

        if (!selected) return
        
        setSelectedFont(selected.value)

        if (selected.url) {
            const fontFace = new FontFace(selected.value, `url(${selected.url})`)
            await fontFace.load()
            document.fonts.add(fontFace)
        } else if (selected.googleFont) {
            try {
                await document.fonts.load(`16px "${selected.label}"`) 
            } catch {
                console.warn(`Could not load font: ${selected.label}`)
            }
        }
        
        const canvas = ref?.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        obj.set({ fontFamily: selected.googleFont ? selected.label : selected.value })
        canvas.renderAll();
    }

    const updateFontWeight = (ref) => {
        const canvas = ref?.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        obj.set({
            fontWeight: 'Bold'
        })

        canvas.renderAll();
    }

    const updateFontSize = (size, ref) => {
        setFontSize(size);

        const canvas = ref?.current;
        const obj = canvas?.getActiveObject();
        if (!obj) return;

        if (!size) return

        obj.set({ fontSize: size })
        canvas.renderAll();
    }

    const saveEnvelope = async (ref) => {
        const canvas = ref?.current
        if (!canvas) return

        const payload = {
            title: state?.title,
            from: state?.from,
            to: state?.to,
            fabricData: canvas.toJSON()
        }

        if (!envelopeId) {
            const res = await fetch('http://localhost:3000/api/envelope', {
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
            await fetch(`http://localhost:3000/api/envelope/${envelopeId}`, {
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

        await saveEnvelope()
    }

    useEffect(() => {
        const canvas = envelopeFabricRef.current;
        if (!canvas || !fabricData) return;

        const loadCanvas = async () => {
            try {
                const json =
                    typeof fabricData === "string"
                        ? JSON.parse(fabricData)
                        : fabricData;
                await preloadFonts()        
                await canvas.loadFromJSON(json);
                canvas.renderAll();
            } catch (err) {
                console.error("Error loading fabric JSON:", err);
            }
        };

        setTimeout(loadCanvas, 0);
    }, [fabricData]);


    const handleEnvelopeFlip = () => {
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
                        <canvas ref={envelopeCanvasRef} />
                        {(toolbarPos.visible && activeCanvas === 'envelope') && (
                            <Toolbar
                                fabricRef={envelopeFabricRef}
                                toolbarPos={toolbarPos}
                                isTextObj={isTextObj}
                                updateFontFamily={updateFontFamily}
                                updateFontSize={updateFontSize}
                                updateFontWeight={updateFontWeight}
                                fontOptions={fontOptions}
                                selectedFont={selectedFont}
                                fontSizeOptions={fontSizeOptions}
                                fontDropdownOpen={fontDropdownOpen}
                                setFontDropdownOpen={setFontDropdownOpen}
                                fontSize={fontSize}
                                fontSizeDropdownOpen={fontSizeDropdownOpen}
                                setFontSizeDropdownOpen={setFontSizeDropdownOpen}
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
                            ${isOpen ? 'rotate-x-180 z-10' : 'z-30'}
                            before:transition-all before:duration-200 before:ease-in-out`}>
                        </div>

                        {/* Letter */}
                        <div
                            ref={letterFoldRef}
                            className={`absolute bg-[#fdf6d3] 
                                shadow-lg border border-[#ccccccb7] 
                                w-11/12 h-[160px] xs:h-[210px] sm:h-[240px] md:w-[550px] md:h-[230px] lg:h-[250px] xl:h-[280px] top-8 md:top-15 z-10
                                left-2/4 md:right-2/4 -translate-x-2/4  perspective-distant 
                                before:content-[''] before:bg-[#fdf6d3] 
                                before:border before:border-[#ccccccb7] 
                                before:absolute before:h-3/4 before:w-full 
                                before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-[#fdf6d3] after:border 
                                after:border-[#ccccccb7] after:bottom-0 
                                after:origin-bottom 
                                after:absolute after:h-3/4 after:w-full 
                                after:transform-3d
                                transition-all
                                duration-2000
                                ${ letterState === 'removing' ? 'letter-remove': ''} 
                                ${ letterState === 'returning' ? 'letter-return': ''}
                                ${ letterState === 'opened' ? 'before:rotate-x-180 after:-rotate-x-180 z-40 -top-1! before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : '' }
                                ${ letterState === 'closed' ? 'before:rotate-x-5 after:rotate-x-[-5deg] z-40 before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : '' } 
                            `}>
                        </div>
                        <div 
                            ref={letterRef}
                            className="absolute w-11/12 md:w-[550px] left-2/4 md:right-2/4 -translate-x-2/4"
                            style={{
                                height: letterCanvasHeight ? `${letterCanvasHeight}px` : undefined,
                                top: letterCanvasTop ? `${letterCanvasTop}px` : undefined,
                                opacity: letterState === 'opened' ? 1 : 0,
                                zIndex: '40',
                                pointerEvents: letterState === 'opened' ? 'auto' : 'none',
                                transition: `opacity ${letterState === 'closed' ? 800: 4600}ms ease-in-out`
                            }}
                        >
                            <canvas ref={letterCanvasRef} />
                            {(toolbarPos.visible && activeCanvas === 'letter') && (
                                <Toolbar
                                    fabricRef={letterFabricRef}
                                    toolbarPos={toolbarPos}
                                    isTextObj={isTextObj}
                                    updateFontFamily={updateFontFamily}
                                    updateFontSize={updateFontSize}
                                    updateFontWeight={updateFontWeight}
                                    fontOptions={fontOptions}
                                    selectedFont={selectedFont}
                                    fontSizeOptions={fontSizeOptions}
                                    fontDropdownOpen={fontDropdownOpen}
                                    setFontDropdownOpen={setFontDropdownOpen}
                                    fontSize={fontSize}
                                    fontSizeDropdownOpen={fontSizeDropdownOpen}
                                    setFontSizeDropdownOpen={setFontSizeDropdownOpen}
                                    duplicate={duplicate}
                                    deleteSelected={deleteSelected}
                                    showLayerOptions={showLayerOptions}
                                    setShowLayerOptions={setShowLayerOptions}
                                    setLayerPosition={setLayerPosition}
                                />
                            )}
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
                        onClick={handleEnvelopeFlip}
                        className='bg-white p-4 w-[100px] lg:w-32 cursor-pointer'
                    >
                        Flip
                    </button>
                    { isFlipped &&
                        <button onClick={() => handleEnvelopeOpen()} className='bg-white p-4 w-[100px]'>{letterState === "opened" ? 'Close' : 'Open'}</button>
                    }
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
                    await saveEnvelope()
                }}
            />
        </>
    )
}