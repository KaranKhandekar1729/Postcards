import { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";
import '../styles/envelope.css';

export default function Envelope({
    preloadFonts,
    isFlipped,
    isOpen,
    letterState,
    envelopeData,
    handleEnvelopeOpen
}) {
    const envelopeCanvasRef = useRef(null)
    const envelopeFabricRef = useRef(null)
    const envelopeRef = useRef(null)
    const letterCanvasRef = useRef(null)
    const letterFabricRef = useRef(null)
    const letterRef = useRef(null)
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

    const setupFabricCanvas = (fabricRef, containerElRef, canvasElRef) => {
        if (fabricRef?.current) return () => { }

        const container = containerElRef?.current;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        const canvas = new Canvas(canvasElRef.current, {
            width,
            height,
            backgroundColor: 'transparent',
            selection: false,
            skipTargetFind: true
        });
        canvas.renderAll();
        fabricRef.current = canvas;

        const observer = new ResizeObserver(() => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;

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
        observer.observe(container);

        return () => {
            observer.disconnect()
            canvas.dispose()
            fabricRef.current = null
        }
    }

    useEffect(() => {
        const cleanupEnvelope = setupFabricCanvas(envelopeFabricRef, envelopeRef, envelopeCanvasRef)
        const cleanupLetter = setupFabricCanvas(letterFabricRef, letterRef, letterCanvasRef)

        return () => {
            cleanupEnvelope()
            cleanupLetter()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const envelopeCanvas = envelopeFabricRef?.current;
        const letterCanvas = letterFabricRef?.current;
        if (!envelopeData?.envelope?.fabricData) return;
        if (!envelopeData?.letter?.fabricData) return;

        if (!envelopeCanvas || !letterCanvas) return;

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
                    className="absolute inset-0 backface-hidden shadow-inner flex items-center justify-center z-50"
                >
                    <canvas ref={envelopeCanvasRef} />
                </div>

                {/* Front */}
                <div onClick={() => handleEnvelopeOpen()} className="absolute inset-0 backface-hidden bg-white shadow-md rotate-y-180">

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
                                bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1782036667/envelope-uploads/d9prpf2m5bfn3saotmqi.jpg')]
                                bg-cover bg-no-repeat
                                border border-y-0 border-black/10
                                w-11/12 h-[160px] xs:h-[210px] sm:h-[240px] md:w-[550px] md:h-[230px] lg:h-[250px] xl:h-[280px] top-8 md:top-15 z-10
                                left-2/4 md:right-2/4 -translate-x-2/4  perspective-distant 
                                before:content-[''] before:bg-(--letter-color)
                                before:shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.1),inset_-12px_0_20px_-12px_rgba(0,0,0,0.1)]
                                before:bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1782036667/envelope-uploads/d9prpf2m5bfn3saotmqi.jpg')]
                                before:bg-cover before:bg-no-repeat
                                before:border before:border-t-0 before:border-black/10
                                before:absolute before:h-3/4 before:w-full 
                                before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-(--letter-color)
                                after:shadow-[inset_12px_0_20px_-12px_rgba(0,0,0,0.1),inset_-12px_0_20px_-12px_rgba(0,0,0,0.1)]
                                after:bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1782036667/envelope-uploads/d9prpf2m5bfn3saotmqi.jpg')]
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
                            <button onClick={() => handleEnvelopeOpen()} className={`absolute top-2 p-2 w-6 h-6 flex items-center justify-center sm:w-9 sm:h-9 right-2 bg-gray-300/70 border-2 border-black/20 rounded-full
                                    ${letterState === 'opened' ? 'visible' : 'invisible'}    
                                `}>
                                <span className="text-black/30 font-bold">&#10005;</span>
                            </button>
                        }
                    </div>

                    {/* Inner gradient for depth */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10 opacity-40 pointer-events-none" />
                    {/* Envelope Front */}
                    <div className="h-full w-full absolute bottom-0 z-20">
                        <div className="[clip-path:polygon(50%_50%,100%_0,100%_100%,0_100%,0_0)] bg-white w-full h-full before:content-[''] before:absolute before:bg-[#f8f6f7] before:w-2/4 before:h-full before:[clip-path:polygon(100%_50%,0_0,0_100%)] after:content-[''] after:bg-[#f8f6f7] after:absolute after:w-2/4 after:h-full after:right-0 after:[clip-path:polygon(0%_50%,100%_0,100%_100%)]"></div>
                    </div>
                </div>
            </div>
        </>
    )
}