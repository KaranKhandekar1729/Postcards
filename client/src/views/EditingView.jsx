import { useState, useRef } from "react"
import { FabricImage, IText } from 'fabric';
import Sidebar from "../components/Sidebar";
import CardCanvas from "../components/CardCanvas";

export default function EditingView () {
    const [isUploading, setIsUploading] = useState(false)
    const fabricRef = useRef(null)

    const uploadToCloudinary = async (file) => {
        if (!file) return
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data =  await res.json()
        return data.url;
    }
    
    const addText = () => {
        const text =  new IText('Hello', {
            fontFamily: 'Arial',
            fill: '#000',
            editable: true
        })

        fabricRef.current?.add(text)
        fabricRef.current?.centerObject(text)
    }

    const addImage = async (e) => {
        const file = e.target.files[0]
        setIsUploading(true)
        const url = await uploadToCloudinary(file)
        setIsUploading(false)
        const img =  await FabricImage.fromURL(url, {
            crossOrigin: 'anonymous',
        })

        img.scaleToWidth(150)
        fabricRef.current?.add(img)
        fabricRef.current?.centerObject(img);
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row w-screen h-screen">
            <Sidebar onAddText={addText} onAddImage={addImage} isUploading={isUploading} />
            <CardCanvas fabricRef={fabricRef} />
        </div>
    )
}