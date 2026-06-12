import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FabricImage, IText } from "fabric";
import Sidebar from "../components/Sidebar";
import CardCanvas from "../components/CardCanvas";

export default function EditingView() {
    const [isUploading, setIsUploading] = useState(false);
    const fabricRef = useRef(null);
    const { slug } = useParams();
    const [postcard, setPostcard] = useState(null);
    const [postcardId, setPostcardId] = useState(null);

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

    const addText = () => {
        const text = new IText("Hello", {
            fontFamily: "Arial",
            fill: "#000",
            editable: true,
        });

        fabricRef.current?.add(text);
        fabricRef.current?.centerObject(text);
        fabricRef.current?.renderAll()
    };

    const addImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadToCloudinary(file);
        setIsUploading(false);

        const img = await FabricImage.fromURL(url, {
            crossOrigin: "anonymous",
        });

        img.scaleToWidth(150);
        fabricRef.current?.add(img);
        fabricRef.current?.centerObject(img);
        fabricRef.current?.renderAll()
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
        <div className="flex flex-col-reverse lg:flex-row w-screen h-screen">
            <Sidebar
                onAddText={addText}
                onAddImage={addImage}
                isUploading={isUploading}
            />

            <CardCanvas
                fabricRef={fabricRef}
                fabricData={postcard?.fabricData}
                postcardId={postcardId}
                setPostcardId={setPostcardId}
            />
        </div>
    );
}