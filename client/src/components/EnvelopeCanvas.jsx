import { useState, useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import useFabricCanvas from "../hooks/useFabricCanvas";
import '../styles/envelope.css';

export default function CardCanvas({ 
    fontOptions, 
    preloadFonts, 
    envelopeFabricRef, 
    letterFabricRef, 
    envelopeData, 
    activeCanvas, 
    setActiveCanvas,
    isFlipped,
    isOpen,
    letterState,
    toolbarPos,
    setToolbarPos,
    handleEnvelopeOpen
 }) {
    const envelopeCanvasRef = useRef(null)
    const envelopeRef = useRef(null)
    const letterCanvasRef = useRef(null)
    const letterRef = useRef(null)
    const [showLayerOptions, setShowLayerOptions] = useState(false)
    const [isTextObj, setIsTextObj] = useState(false)
    const [selectedFont, setSelectedFont] = useState('Arial')
    const [fontDropdownOpen, setFontDropdownOpen] = useState(false)
    const [fontSize, setFontSize] = useState(40)
    const [fontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false)
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

    const resolveFontValue = (fontFamily) => {
        const match = fontOptions.find(
            f => f.label === fontFamily || f.value === fontFamily
        );
        return match ? match.value : 'Arial'
    }

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
        setFontSizeDropdownOpen,
        setSelectedFont: (fontFamily) => setSelectedFont(resolveFontValue(fontFamily)),
        setFontSize
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
        setFontSizeDropdownOpen,
        setFontSize,
        setSelectedFont
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

        if (obj.fontWeight === 'Bold') {
            obj.set({ fontWeight: 'Normal' })
            canvas.renderAll()
            return
        }

        obj.set({ fontWeight: 'Bold' })
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

    useEffect(() => {
        const envelopeCanvas = envelopeFabricRef.current;
        const letterCanvas = letterFabricRef.current;

        if (!envelopeCanvas || !letterCanvas) return;
        if (!envelopeData?.envelope?.fabricData) return;
        if (!envelopeData?.letter?.fabricData) return;

        const loadCanvas = async () => {
            try {
                await preloadFonts()
                console.log(envelopeData)
                const envelopeFabricJson =
                    typeof envelopeData?.envelope?.fabricData === "string"
                        ? JSON.parse(envelopeData?.envelope?.fabricData)
                        : envelopeData?.envelope?.fabricData;
                console.log("envelope fabric", envelopeFabricJson)

                const letterFabricJson =
                    typeof envelopeData?.letter?.fabricData === "string"
                        ? JSON.parse(envelopeData?.letter?.fabricData)
                        : envelopeData?.letter?.fabricData;

                console.log("letter fabric json", letterFabricJson)
                await envelopeCanvas.loadFromJSON(envelopeFabricJson);
                envelopeCanvas.renderAll();
                await letterCanvas.loadFromJSON(letterFabricJson);
                letterCanvas.renderAll();
            } catch (err) {
                console.error("Error loading fabric JSON:", err);
            }
        };

        setTimeout(loadCanvas, 0);
    }, [envelopeData]);

    return (
        <>
            {/* Envelope */}
            <div
                ref={envelopeRef}
                className={`group relative
                    bg-white w-[95%] h-[200px] xs:w-[90%] xs:h-[40%] sm:h-[50%] md:w-[700px] md:h-[360px] 
                    shadow-2xl drop-shadow-black transition-transform 
                    transform-3d duration-1000
                    ${isFlipped ? 'rotate-y-180' : ''} origin-center`}>

                {/* Back */}
                <div
                    className="absolute shadow-[inset_0_0_20px_10px_rgba(0,0,0,0.2)] inset-0 backface-hidden flex items-center justify-center z-50"
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
                <div onClick={() => { letterState === 'idle' && handleEnvelopeOpen();}} className="absolute inset-0 backface-hidden bg-white shadow-md rotate-y-180 cursor-pointer">

                    <div className={`absolute left-2/4 right-2/4 top-2/4 -translate-x-2/4 z-[31] animate-bounce -rotate-10 transition-opacity duration-300
                            ${!isOpen && letterState === 'idle' ? 'opacity-100' : 'opacity-0'}
                        `}>
                        <span className="text-5xl md:text-8xl">👆</span>
                    </div>

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
                        className={`shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.1),inset_-12px_0_20px_-12px_rgba(0,0,0,0.1)] absolute bg-(--letter-color)
                                bg-cover bg-no-repeat
                                border border-y-0 border-black/10
                                w-11/12 h-[160px] xs:h-[210px] sm:h-[240px] md:w-[550px] md:h-[230px] lg:h-[250px] xl:h-[280px] top-8 md:top-15 z-10
                                left-2/4 md:right-2/4 -translate-x-2/4  perspective-distant 
                                before:content-[''] before:bg-(--letter-color)
                                before:shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.1),inset_-12px_0_20px_-12px_rgba(0,0,0,0.1)]
                                before:bg-cover before:bg-no-repeat
                                before:border before:border-t-0 before:border-black/10
                                before:absolute before:h-3/4 before:w-full 
                                before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-(--letter-color)
                                after:shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.1),inset_-12px_0_20px_-12px_rgba(0,0,0,0.1)]
                                after:bg-cover after:bg-no-repeat
                                after:border after:border-b-0 after:border-black/10
                                after:bottom-0 
                                after:origin-bottom 
                                after:absolute after:h-3/4 after:w-full 
                                after:transform-3d
                                transition-all
                                duration-2000
                                ${letterState === 'removing' ? 'letter-remove' : ''} 
                                ${letterState === 'returning' ? 'letter-return' : ''}
                                ${letterState === 'opened' ? 'before:rotate-x-180 after:-rotate-x-180 z-40 before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : ''}
                                ${letterState === 'closed' ? 'before:rotate-x-5 after:rotate-x-[-5deg] z-40 before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : ''} 
                            `}
                        style={{
                            "--letter-color": envelopeData?.letter?.color
                        }}
                    >
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
                            transition: `opacity ${letterState === 'closed' ? 800 : 4600}ms ease-in-out`
                        }}
                    >
                        <canvas ref={letterCanvasRef} />
                        {isFlipped &&
                            <button onClick={() => handleEnvelopeOpen()} className={`absolute top-2 p-2 w-6 h-6 flex items-center justify-center sm:w-9 sm:h-9 right-2 bg-white/30 border-2 border-black/20 cursor-pointer rounded-full
                                    ${letterState === 'opened' ? 'visible' : 'invisible'}    
                                `}>
                                <span className="text-black/30 font-bold">&#10005;</span>
                            </button>
                        }
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
                    <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/10 opacity-40 pointer-events-none" />
                    {/* Envelope Front */}
                    <div className="h-full w-full absolute bottom-0 z-20">
                        <div className="before:shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.5)] shadow-[inset_0_0_20px_3px_rgba(0,0,0,0.5)] [clip-path:polygon(50%_50%,100%_0,100%_100%,0_100%,0_0)] bg-white w-full h-full before:content-[''] before:absolute before:bg-[#f8f6f7] before:w-2/4 before:h-full before:[clip-path:polygon(100%_50%,0_0,0_100%)] after:content-[''] after:bg-[#f8f6f7] after:absolute after:w-2/4 after:h-full after:right-0 after:[clip-path:polygon(0%_50%,100%_0,100%_100%)]
                                after:shadow-[inset_-12px_0_20px_-12px_rgba(0,0,0,0.5)]"></div>
                    </div>

                </div>
            </div>
        </>
    )
}