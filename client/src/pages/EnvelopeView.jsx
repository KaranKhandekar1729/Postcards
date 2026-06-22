import Envelope from '../components/Envelope'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function EnvelopeView({ preloadFonts }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [letterState, setLetterState] = useState('idle')
    const [envelopeData, setEnvelopeData] = useState(null)
    const {slug} = useParams()

    // fetch envelope
    useEffect(() => {
        if (!slug) return;

        const getEnvelopeData = async () => {
            const res = await fetch(
                `http://localhost:3000/api/envelope/${slug}`, {
                    credentials: 'include'
                }
            );
            const data = await res.json();
            setEnvelopeData(data.data);
            console.log(data.data)
        };

        getEnvelopeData();
    }, [slug]);

    const handleEnvelopeFlip = () => {
        setIsFlipped(prev => !prev); 
        setIsOpen(false); 
        setLetterState('idle')
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    const handleEnvelopeOpen = async () => { 
        if (!isFlipped) return

        if (!isOpen && (letterState === 'idle')) {
            // OPEN flap
            setIsOpen(true) 
            await sleep(1200)
    
            setLetterState('removing')
            await sleep(600)
            setIsOpen(false)
            await sleep(2500)
            setLetterState('opened')
        } else {
            // CLOSE flap
            setLetterState('closed')
            await sleep(2000)
            setIsOpen(true)
            await sleep(1200)
            setLetterState('returning')
            await sleep(1200)
            setIsOpen(false)
            await sleep(200)        
            setLetterState('idle')
        }
    }


  return (
    <>
        <Envelope
            preloadFonts={preloadFonts}
            isFlipped={isFlipped}
            isOpen={isOpen}
            letterState={letterState}
            envelopeData={envelopeData}
        />
        <div className="relative top-[85px] flex gap-3">
            <button
                onClick={handleEnvelopeFlip}
                className='bg-white p-4 w-[100px] lg:w-32 cursor-pointer'
            >
                Flip
            </button>
            { isFlipped &&
                <button onClick={() => handleEnvelopeOpen()} className='bg-white p-4 w-[100px]'>{letterState === "opened" ? 'Close' : 'Open'}</button>
            }
        </div>
    </>
    
  )
}
