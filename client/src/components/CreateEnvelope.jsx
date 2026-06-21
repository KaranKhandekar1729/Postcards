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
            <div className="p-8 bg-amber-200 rounded-md w-[50%] flex-col space-y-10">
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-orange-900 font-sans text-lg">Give a name to your envelope</label>
                    <input className="border border-orange-900/50 outline-none p-2 rounded-md font-sans" type="text" name="title" placeholder="Letter for mom's birthday" onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <label className="text-orange-900">To</label>
                        <input className="border border-orange-900/50 outline-none p-2 rounded-md font-sans" type="text" name="to" placeholder="Receiver's name" onChange={(e) => setTo(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-orange-900">From</label>
                        <input className="border border-orange-900/50 outline-none p-2 rounded-md font-sans" type="text" name="from" placeholder="Your name" onChange={(e) => setFrom(e.target.value)}/>
                    </div>
                </div>

                <div className='flex justify-end gap-2 mt-2'>
                    <button onClick={onClose} className='px-4 py-2 rounded-md text-orange-900 hover:bg-orange-300 transition-all'>Cancel</button>
                    <button onClick={handleSubmit} className='px-4 py-2 rounded-md bg-amber-800 text-amber-300 hover:bg-yellow-400 hover:text-orange-900 transition-all'>Next</button>
                </div>
            </div>
        </div>,
        document.getElementById('create-form-modal')
        )
    )
}