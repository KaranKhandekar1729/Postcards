import { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";

export default function CardCanvas({ fabricRef }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const canvasRef = useRef(null)
    const envelopeRef = useRef(null)

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
                        onClick={() => { setIsFlipped(prev => !prev) }} 
                        className='bg-white p-4 w-[100px] lg:w-32'
                    >
                        Flip
                    </button>
                    
                </div>
            </div>
        </>
    )
}