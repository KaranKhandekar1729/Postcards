import { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";
import { Trash, Copy, Layers } from 'lucide-react'

export default function CardCanvas({ fabricRef }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const canvasRef = useRef(null)
    const envelopeRef = useRef(null)
    const [toolbarPos, setToolbarPos] = useState({
        x: 0,
        y: 0,
        visible: false,
    });
    const [showLayerOptions, setShowLayerOptions] = useState(false)

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

            const rect = obj.getBoundingRect();

            setToolbarPos({
                visible: true,
                x: rect.left + rect.width / 2,
                y: rect.top - 80,
            });
        };

        canvas.on("selection:created", updateToolbar);
        canvas.on("selection:updated", updateToolbar);
        canvas.on("selection:cleared", () => {
            setToolbarPos(prev => ({
                ...prev,
                visible: false,
            }));
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

        position === 'front' ? canvas?.bringObjectToFront(obj) : canvas?.sendObjectToBack()
        canvas.renderAll();
    };


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
                            <div
                                className="absolute z-9999 bg-white rounded-xl shadow-lg border border-[#ccccccb7] px-3 py-2 flex gap-2"
                                style={{
                                    left: toolbarPos.x,
                                    top: toolbarPos.y,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <button
                                    onClick={duplicate}
                                    className="px-2 py-1 hover:bg-gray-100 rounded"
                                >
                                    <Copy size="20" />
                                </button>

                                <button
                                    onClick={deleteSelected}
                                    className="px-2 py-1 hover:bg-gray-100 rounded"
                                >
                                    <Trash size="20" />
                                </button>

                                <button
                                    onClick={() => setShowLayerOptions((prev) => !prev)}
                                    className="relative px-2 py-1 hover:bg-gray-100 rounded"
                                >
                                    <Layers size="20" />
                                </button>
                                { showLayerOptions && (
                                    <div className="absolute top-12 right-0 p-1 bg-white flex flex-col gap-1 shadow-md rounded-lg">
                                        <div onClick={() => setLayerPosition('front')} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Bring to Front</div>
                                        <div onClick={() => setLayerPosition('back')} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Send to Back</div>
                                    </div>
                                )}
                            </div>
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