import { useEffect } from "react";
import { Canvas } from "fabric";

export default function useFabricCanvas({
    canvasElRef,
    containerElRef,
    fabricRef,
    otherFabricRef,
    canvasName,
    setActiveCanvas,
    setToolbarPos,
    setIsTextObj,
    setShowLayerOptions,
    setFontDropdownOpen,
    setFontSizeDropdownOpen,
    setFontSize,
    setSelectedFont
}) {
    useEffect(() => {
        if (fabricRef?.current) return

        const container = containerElRef?.current;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        const canvas = new Canvas(canvasElRef.current, {
            width: width,
            height: height,
            backgroundColor: 'transparent'
        });
        canvas.renderAll();
        fabricRef.current = canvas;

        const updateToolbar = () => {
            const obj = canvas.getActiveObject();
            if (!obj) {
                setToolbarPos(prev => ({ ...prev, visible: false }));
                return;
            }

            obj.borderColor = "brown"
            obj.cornerColor = "brown"
            obj.cornerStyle = "circle"
            obj.cornerStrokeColor = "brown"
            obj.cornerSize = 8
            obj.transparentCorners = false
            obj.controls.mtr.visible = false
            obj.flipX = false
            obj.flipY = false
            
            const rect = obj.getBoundingRect();

            if (obj.type === 'textbox') {
                setIsTextObj(true)

                obj.controls.mt.visible = false
                obj.controls.mb.visible = false

                setToolbarPos({
                    visible: true,
                    x: rect.left + canvas.width/8,
                    y: rect.top - 80,
                });
            } else {
                setToolbarPos({
                    visible: true,
                    x: rect.left + canvas.width/4,
                    y: rect.top - 80,
                });
            }

        };
        
        canvas.on("selection:created", () => {
            const obj = canvas.getActiveObject()
            setActiveCanvas(canvasName)
            otherFabricRef.current?.discardActiveObject()
            otherFabricRef.current?.renderAll()
            updateToolbar()
            if (!obj || obj.type !== 'textbox' ) return
            console.log(obj.fontFamily)
            setFontSize(obj.fontSize ?? 40)
            setSelectedFont(obj.fontFamily ?? 'Arial')
        });

        canvas.on("selection:updated", () => {
            const obj = canvas.getActiveObject()
            setActiveCanvas(canvasName)
            setShowLayerOptions(false)
            setFontDropdownOpen(false)
            setFontSizeDropdownOpen(false)
            updateToolbar()
            if (!obj || obj.type !== 'textbox' ) return
            console.log(obj.fontFamily)
            setFontSize(obj.fontSize ?? 40)
            setSelectedFont(obj.fontFamily ?? 'Arial')
        });

        canvas.on("selection:cleared", () => {
            setActiveCanvas(null)
            setToolbarPos(prev => ({ ...prev, visible: false }));
            setIsTextObj(false);
            setShowLayerOptions(false)
            setFontDropdownOpen(false)
            setFontSizeDropdownOpen(false)
            setFontSize(40)
            setSelectedFont('Arial')
        }); 

        canvas.on("object:moving", updateToolbar);
        canvas.on("object:scaling", updateToolbar);
        canvas.on("object:rotating", updateToolbar);

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
            observer.disconnect();
            canvas.dispose();
            fabricRef.current = null
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
}
