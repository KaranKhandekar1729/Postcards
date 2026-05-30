import { useState } from "react";
import '../styles/postcard.css';

export default function Postcard({ cardData }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [letterState, setLetterState] = useState('idle')

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleEnvelopeOpen = async () => { 
        if (!isFlipped) return

        if (!isOpen) {
            // OPEN flap
            setIsOpen(true) 
            await sleep(1200)
    
            setLetterState('removing')
        } else {
            // CLOSE flap
            setLetterState('returning')
            await sleep(1200)
            setIsOpen(false)
            await sleep(200)        
            setLetterState('idle')
        }
    }

    return (
        <>
            <div className='perspective-distant bg-red-950 w-screen h-screen flex flex-col gap-3 justify-center items-center'>

                {/* Envelope */}
                <div 
                    className={`group relative 
                    top-20 bg-yellow-50 w-175 h-90 
                    shadow-sm shadow-white transition-transform 
                    transform-3d duration-1000 
                    ${isFlipped ? 'rotate-y-180' : ''} origin-center`}>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden shadow-inner flex items-center justify-center"
                        style={{ backgroundColor: `${cardData[0].envelope.envelopeColor}` }}
                    >
                        {cardData && (
                            cardData[0].envelope.elements.map((element) => (
                                element.type === 'sticker'
                                    ? <img
                                        key={element._id}
                                        src={element.assetUrl}
                                        style={{
                                            position: 'absolute',
                                            width: `${element.width * 100}%`,
                                            height: `${element.height * 100}%`,
                                            left: `${element.x * 100}%`,
                                            top: `${element.y * 100}%`,
                                            zIndex: element.zIndex,
                                            transform: `rotate(${element.rotation}deg)`
                                        }}
                                    />
                                    : <p
                                        key={element._id}
                                        style={{
                                            position: 'absolute',
                                            width: `${element.width * 100}%`,
                                            height: `${element.height * 100}%`,
                                            left: `${element.x * 100}%`,
                                            top: `${element.y * 100}%`,
                                            zIndex: element.zIndex,
                                            transform: `rotate(${element.rotation}deg)`,
                                            fontSize: `${element.fontSize}px`,
                                            fontFamily: element.fontFamily,
                                            color: element.color
                                        }}
                                    >
                                        {element.content}
                                    </p>
                            ))
                        )}
                    </div>

                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white shadow-md rotate-y-180">
                        
                        {/* Flap */}
                        <div
                            className={`drop-shadow-lg 
                            absolute w-full h-2/3 
                            transition-all duration-1000 delay-200 
                            ease-in-out origin-top before:content-[''] 
                            before:origin-top before:w-full before:h-full 
                            before:bg-white before:absolute before:[clip-path:polygon(50%_100%,0_0,100%_0)] 
                            ${isOpen ? 'rotate-x-180 z-10' : 'z-30'} 
                            before:transition-all before:duration-200 before:ease-in-out`}>
                        </div>

                        {/* Letter */}
                        <div
                            className={`absolute bg-[#fdf6d3] 
                                shadow-lg border border-[#ccc] 
                                w-11/12 h-3/4 top-18 z-10 
                                left-8 perspective-distant 
                                before:content-[''] before:bg-[#fdf6d3] 
                                before:border before:border-[#ccc] 
                                before:absolute before:h-3/4 before:w-full 
                                before:rotate-x-5 before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-[#fdf6d3] after:border 
                                after:border-[#ccc] after:bottom-0 
                                after:rotate-x-[-5deg] after:origin-bottom 
                                after:absolute after:h-3/4 after:w-full 
                                after:transform-3d
                                transition-all
                                duration-2000
                                ${ letterState === 'removing' ? 'letter-remove': ''} 
                                ${ letterState === 'returning' ? 'letter-return': ''}
                                ${ letterState === 'front' ? '-translate-y-20 z-40' : 'z-10'} 
                            `}>
                        </div>
                        
                        {/* Inner gradient for depth */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10 opacity-40 pointer-events-none" />
                        {/* Envelope Front */}
                        <div className="h-full w-full absolute bottom-0 z-20 [clip-path:polygon(20px_-6px_3px_rgba(50,50,0,0.1))]">
                            <div className="[clip-path:polygon(50%_50%,100%_0,100%_100%,0_100%,0_0)] bg-white w-full h-full before:content-[''] before:absolute before:bg-[#f8f6f7] before:w-2/4 before:h-full before:[clip-path:polygon(100%_50%,0_0,0_100%)] after:content-[''] after:bg-[#f8f6f7] after:absolute after:w-2/4 after:h-full after:right-0 after:[clip-path:polygon(0%_50%,100%_0,100%_100%)]"></div>
                        </div>

                    </div>
                </div>

                {/* Buttons */}
                <div className='relative top-30 flex flex-row gap-4'>
                    <button onClick={() => { setIsFlipped(prev => !prev); setIsOpen(false) }} className='bg-white p-4 w-32'>Flip</button>
                    <button onClick={handleEnvelopeOpen} className='bg-white p-4 w-32'>{isOpen ? 'Close' : 'Open'}</button>
                </div>
            </div>
        </>
    )
}