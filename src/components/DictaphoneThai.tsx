import { useState, useEffect } from 'react'

const speechRecognition =
    // @ts-ignore
    window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new speechRecognition()
mic.continuous = true
mic.interimResults = true
mic.lang = 'th-TH'

const ThaiDictaphone = () => {
    const [islistening, setIslistening] = useState(false)
    const [note, setNote] = useState<string>()

    useEffect(() => {
        handleListen()
    }, [islistening])

    const handleListen = () => {
        if (islistening) {
            mic.start()
            setTimeout(() => {
                setIslistening(!islistening)
            }, 5000)
            mic.onend = () => {
                console.log('continue...')
                mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Stopped Mic on Click')
            }
        }

        mic.onstart = () => {
            console.log('Mic on')
        }

        mic.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                // @ts-ignore
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('')
            // const transcript = event.results
            setNote(transcript)
            console.log(transcript)
            mic.onerror = (event: any) => {
                console.log(event.error)
            }
        }
    }

    return (
        <div>
            <h3>Current Note</h3>
            <p>{note}</p>
            <button onClick={() => setIslistening((prevState) => !prevState)}>
                Start / Stop
            </button>
        </div>
    )
}

export default ThaiDictaphone
