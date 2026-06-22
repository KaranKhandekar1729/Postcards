import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateEnvelopeForm ({ open, onClose }) {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [to, setTo] = useState('')
    const [from, setFrom] = useState('')

    if (!open) return null;

    function handleSubmit() {
        navigate('/envelope/new', {
            state: { title, to, from }
        })
    }

    return (
        createPortal(
        <div className='fixed inset-0 flex justify-center items-center bg-black/50 z-50'>
            <div className="p-6 sm:p-8 bg-amber-200 rounded-md w-[90%] sm:w-fit flex-col space-y-10">
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-red-900 font-advercase text-lg">Give a name to your envelope</label>
                    <input 
                        className="border border-orange-900/50 focus:outline-2 focus:outline-red-900 p-3 rounded-md font-advercase placeholder:text-red-900/50 text-red-900"
                        type="text" name="title"
                        autoFocus="true" 
                        placeholder="Letter for mom's birthday" 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-8 sm:flex-row justify-between">
                    <div className="flex flex-col gap-2">
                        <label className="text-red-900 font-advercase text-lg">To</label>
                        <input className="border border-orange-900/50 focus:outline-2 focus:outline-red-900 p-3 rounded-md font-advercase placeholder:text-red-900/50 text-red-900" type="text" name="to" placeholder="Receiver's name" onChange={(e) => setTo(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-red-900 font-advercase text-lg">From</label>
                        <input className="border border-orange-900/50 focus:outline-2 focus:outline-red-900 p-3 rounded-md font-advercase placeholder:text-red-900/50 text-red-900" type="text" name="from" placeholder="Your name" onChange={(e) => setFrom(e.target.value)}/>
                    </div>
                </div>

                <div className='flex justify-end gap-2 mt-2'>
                    <button onClick={onClose} className='px-4 py-2 rounded-md font-advercase text-red-900/50 hover:text-red-900 cursor-pointer transition-all duration-300'>Cancel</button>
                    <button onClick={handleSubmit} className='px-4 py-2 rounded-md font-advercase bg-red-900/90 cursor-pointer text-orange-300 hover:bg-red-900 hover:text-amber-300 transition-all duration-300'>Next</button>
                </div>
            </div>
        </div>,
        document.getElementById('create-form-modal')
        )
    )
}