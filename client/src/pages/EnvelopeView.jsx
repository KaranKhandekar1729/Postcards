import { FlipHorizontal } from 'lucide-react'
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
                '/api/envelope/${slug}', {
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
    <div className="transition-opacity duration-1000 animate-fade-in perspective-distant h-screen overflow-hidden flex flex-col gap-3 justify-center items-center bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover">
        <div className="absolute inset-0 backdrop-blur-xs bg-black/30" />

        <Envelope
            preloadFonts={preloadFonts}
            isFlipped={isFlipped}
            isOpen={isOpen}
            letterState={letterState}
            envelopeData={envelopeData}
            handleEnvelopeOpen={handleEnvelopeOpen}
        />

        { (!isOpen && letterState === 'idle') && (
                <div className="absolute top-2 right-2 flex gap-3">
                    <button
                        onClick={handleEnvelopeFlip}
                        className='bg-amber-300 flex gap-4 justify-center hover:bg-red-950 font-bold text-red-950 hover:text-amber-300 p-2 px-4 rounded-sm w-fit lg:w-32 cursor-pointer transition-all duration-300'
                    >
                        Flip
                        <FlipHorizontal /> 
                    </button>
                </div>
            )
        }
    </div>  
  )
}
