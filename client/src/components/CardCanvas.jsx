import { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";
import { Trash, Copy, Layers, Bold } from 'lucide-react'
import { useNavigate } from "react-router-dom";

export default function CardCanvas({ fabricRef, fabricData, postcardId, setPostcardId }) {
    const navigate = useNavigate();
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
        { Arial: 'Arial' },
        { TimesNewRoman: 'Times New Roman' },
        { Roboto: 'Roboto' },
        { ComicSans: 'Comic Sans' }
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
        const thumbnailUrl = uploadData.url;

        console.log('objects on canvas at save:', canvas.getObjects()); // add this
        console.log('canvas JSON:', canvas.toJSON());                    // and this


        const payload = {
            title: 'New Postcard',
            thumbnail: thumbnailUrl,
            fabricData: canvas.toJSON()
        }

        if (!postcardId) {
            try {
                const res = await fetch('http://localhost:3000/api/postcards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
                const data = await res.json();
                console.log('Saved postcard: ', data);
                setPostcardId(data.data._id)
                navigate(`/postcard/edit/${data.data.slug}`, { replace: true });
            } catch (error) {
                console.error('Error saving postcard: ', error)
            }
        } else {
            try {
                console.log('PATCH with id:', postcardId); 
                const res = await fetch(`http://localhost:3000/api/postcards/${postcardId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })
                const data = await res.json();
                console.log('PATCH response:', data); 
            } catch (error) {
                console.error('Error updating postcard: ', error)
            }
        }
    }
    
    useEffect(() => {
        console.log("fabricData:", fabricData);
        console.log("canvas:", fabricRef.current);
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
                            <div
                                className="absolute z-9999 bg-white w-max rounded-xl shadow-lg border border-[#ccccccb7] px-3 py-2 flex gap-2"
                                style={{
                                    left: toolbarPos.x,
                                    top: toolbarPos.y,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                { isTextObj && (
                                    <div className="flex flex-row gap-2">
                                        <div className={`px-2 py-1 hover:bg-gray-100 rounded
                                                ${isTextObj ? 'visible' : 'hidden'}`}
                                        >
                                            <select value={selectedFont} onChange={(e) => updateFontFamily(e)} name="font-family" id="font-family">
                                                { fontOptions.map((fontOption, index) => {
                                                    const [key, value] = Object.entries(fontOption)[0];
                                                    return (
                                                        <option 
                                                            key={index}
                                                            value={key}
                                                            className="shadow-md border border-[#cccccc86] rounded-lg"
                                                        >{value}</option>
                                                    )}
                                                )}
                                            </select>
                                        </div>
                                        <div className={`px-2 py-1 hover:bg-gray-100 rounded
                                            ${isTextObj ? 'visible' : 'hidden'}`}
                                        >
                                            <select value={fontSize} onChange={(e) => updateFontSize(e)} name="font-size" id="font-size">
                                                {fontSizeOptions.map((fontSize, index) => (
                                                    <option key={index} value={fontSize}>{fontSize}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={updateFontWeight}
                                            className={`px-2 py-1 hover:bg-gray-100 rounded
                                            ${isTextObj ? 'visible' : 'hidden'}`}
                                        >
                                            <Bold size="20"/>
                                        </button>
                                    </div>
                                )}
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
                        onClick={() => setIsFlipped(prev => !prev)}
                        className='bg-white p-4 w-[100px] lg:w-32 cursor-pointer'
                    >
                        Flip
                    </button>
                    <button 
                        onClick={() => savePostCard()}
                        className="cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}