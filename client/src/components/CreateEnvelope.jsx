import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateEnvelopeForm({ open, onClose }) {
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
            <>
                <div className='fixed inset-0 flex justify-center items-center'>
                    <div onClick={onClose} className='absolute inset-0 bg-black/50' />
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                        <div className="absolute inset-0 p-6 sm:p-8 z-2 bg-[#24231d] rounded-md w-[90%] sm:w-fit h-fit m-auto flex-col space-y-10">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-white font-advercase text-lg">Give a name to your envelope</label>
                                <input
                                    className="border border-white/50 focus:outline-2 focus:outline-white p-3 rounded-md font-advercase placeholder:text-white/50 text-white"
                                    type="text" name="title"
                                    autoFocus
                                    required
                                    placeholder="Birthday letter"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-8 sm:flex-row justify-between">
                                <div className="flex flex-col gap-2">
                                    <label className="text-white font-advercase text-lg">To</label>
                                    <input required className="border border-white/50 focus:outline-2 focus:outline-white p-3 rounded-md font-advercase placeholder:text-white/50 text-white" type="text" name="to" placeholder="Receiver's name" onChange={(e) => setTo(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-white font-advercase text-lg">From</label>
                                    <input required className="border border-white/50 focus:outline-2 focus:outline-white p-3 rounded-md font-advercase placeholder:text-white/50 text-white" type="text" name="from" placeholder="Your name" onChange={(e) => setFrom(e.target.value)} />
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 mt-2'>
                                <button type="button" onClick={onClose} className='px-4 py-2 rounded-md font-advercase text-white/50 hover:text-white cursor-pointer transition-all duration-300'>Cancel</button>
                                <button type="submit" className='px-4 py-2 rounded-md font-advercase bg-white/10 cursor-pointer text-white/50 hover:bg-white hover:text-black transition-all duration-300'>Next</button>
                            </div>
                        </div>
                    </form>
                </div>
            </>,
            document.getElementById('create-form-modal')
        )
    )
}