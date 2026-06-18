import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FabricImage, IText } from "fabric";
import Sidebar from "../components/Sidebar";
import CardCanvas from "../components/CardCanvas";

export default function EditingView() {
    const [isUploading, setIsUploading] = useState(false);
    const envelopeFabricRef = useRef(null);
    const letterFabricRef = useRef(null);
    const { slug } = useParams();
    const [postcard, setPostcard] = useState(null);
    const [postcardId, setPostcardId] = useState(null);
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
        const text = new IText("Hello", {
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

    // fetch postcard
    useEffect(() => {
        if (!slug) return;

        const getPostcard = async () => {
            const res = await fetch(
                `http://localhost:3000/api/postcards/${slug}`, {
                    credentials: 'include'
                }
            );
            const data = await res.json();
            setPostcard(data.data);
            setPostcardId(data.data._id)
            console.log(data.data)
        };

        getPostcard();
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

            <CardCanvas
                envelopeFabricRef={envelopeFabricRef}
                letterFabricRef={letterFabricRef}
                fabricData={postcard?.fabricData}
                postcardId={postcardId}
                setPostcardId={setPostcardId}
                activeCanvas={activeCanvas}
                setActiveCanvas={setActiveCanvas}
            />
        </div>
    );
}