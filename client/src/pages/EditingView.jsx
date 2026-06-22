import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FabricImage, Textbox } from "fabric";
import Sidebar from "../components/Sidebar";
import EnvelopeCanvas from "../components/EnvelopeCanvas";

export default function EditingView({ fontOptions, preloadFonts }) {
    const [isUploading, setIsUploading] = useState(false);
    const envelopeFabricRef = useRef(null);
    const letterFabricRef = useRef(null);
    const { slug } = useParams();
    const [envelope, setEnvelope] = useState(null);
    const [envelopeId, setEnvelopeId] = useState(null);
    const [activeCanvas, setActiveCanvas] = useState('envelope')

    const uploadToCloudinary = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.url;
    };

    const addText = (canvas) => {
        console.log("Clicked addText")
        console.log(canvas)
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
                `http://localhost:3000/api/envelope/${slug}`, {
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


    return (
        <div className="flex flex-col-reverse lg:flex-row w-screen h-screen overflow-hidden">
            <Sidebar
                onAddText={addText}
                onAddImage={addImage}
                isUploading={isUploading}
                envelopeFabricRef={envelopeFabricRef}
                letterFabricRef={letterFabricRef}
                activeCanvas={activeCanvas}
            />

            <EnvelopeCanvas
                fontOptions={fontOptions}
                preloadFonts={preloadFonts}
                envelopeFabricRef={envelopeFabricRef}
                letterFabricRef={letterFabricRef}
                envelopeData={envelope}
                envelopeId={envelopeId}
                setEnvelopeId={setEnvelopeId}
                activeCanvas={activeCanvas}
                setActiveCanvas={setActiveCanvas}
            />
        </div>
    );
}