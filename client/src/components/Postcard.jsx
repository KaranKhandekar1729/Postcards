import { useState } from "react";
import '../styles/postcard.css';

export default function Postcard({ cardData }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [letterState, setLetterState] = useState('idle')

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
            <div className="perspective-distant h-screen flex flex-1 flex-col gap-3 justify-center items-center bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover">
                <div className="absolute inset-0 backdrop-blur-xs bg-black/30" />

                {/* Envelope */}
                <div 
                    className={`group relative 
                    top-20 bg-white w-[95%] h-[200px] xs:w-[90%] xs:h-[40%] sm:h-[50%] md:w-[700px] md:h-[360px]  
                    shadow-2xl drop-shadow-black transition-transform 
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
                                shadow-lg border border-[#ccccccb7] 
                                w-11/12 h-3/4 top-8 md:top-15 z-10
                                left-4 xs:left-5 sm:left-6 md:left-8 perspective-distant 
                                before:content-[''] before:bg-[#fdf6d3] 
                                before:border before:border-[#ccccccb7] 
                                before:absolute before:h-3/4 before:w-full 
                                before:origin-top 
                                before:transform-3d after:content-['']
                                after:bg-[#fdf6d3] after:border 
                                after:border-[#ccccccb7] after:bottom-0 
                                after:origin-bottom 
                                after:absolute after:h-3/4 after:w-full 
                                after:transform-3d
                                transition-all
                                duration-2000
                                ${ letterState === 'removing' ? 'letter-remove': ''} 
                                ${ letterState === 'returning' ? 'letter-return': ''}
                                ${ letterState === 'opened' ? 'before:rotate-x-180 after:-rotate-x-180 z-40 -top-12! before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : '' }
                                ${ letterState === 'closed' ? 'before:rotate-x-5 after:rotate-x-[-5deg] z-40 before:transition-all before:duration-2000 before:ease-in-out after:transition-all after:duration-2000 after:ease-in-out' : '' } 
                            `}>
                        </div>
                        
                        {/* Inner gradient for depth */}
                        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10 opacity-40 pointer-events-none" />
                        {/* Envelope Front */}
                        <div className="h-full w-full absolute bottom-0 z-20">
                            <div className="[clip-path:polygon(50%_50%,100%_0,100%_100%,0_100%,0_0)] bg-white w-full h-full before:content-[''] before:absolute before:bg-[#f8f6f7] before:w-2/4 before:h-full before:[clip-path:polygon(100%_50%,0_0,0_100%)] after:content-[''] after:bg-[#f8f6f7] after:absolute after:w-2/4 after:h-full after:right-0 after:[clip-path:polygon(0%_50%,100%_0,100%_100%)]"></div>
                        </div>

                    </div>
                </div>

                {/* Buttons */}
                <div className='relative top-[85px] flex flex-row gap-4'>
                    <button onClick={() => { setIsFlipped(prev => !prev); setIsOpen(false); setLetterState('idle') }} className='bg-white p-4 w-32'>Flip</button>
                    { isFlipped &&
                        <button onClick={() => handleEnvelopeOpen()} className='bg-white p-4 w-[100px]'>{letterState === "opened" ? 'Close' : 'Open'}</button>
                    }
                </div>
            </div>
        </>
    )
}