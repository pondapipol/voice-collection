import { useState, useEffect } from 'react'
import './App.css'
// import { Formik, Form, Field } from 'formik'
// import Dictaphone from './components/Dictaphone'
// import ThaiDictaphone from './components/DictaphoneThai'
// import { useReactMediaRecorder } from 'react-media-recorder'
import useMediaRecorder from '@wmik/use-media-recorder'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import storage from './firebase'
import axios from 'axios'
// import { stat } from 'fs'

// @ts-ignore
const speechRecognition =
    // @ts-ignore
    window.SpeechRecognition ||
    // @ts-ignore
    window.webkitSpeechRecognition ||
    // @ts-ignore
    webkitSpeechRecognition
const mic = new speechRecognition()
mic.continuous = false
mic.interimResults = true
mic.lang = 'th-TH'

// @ts-ignore
// function Player({ srcBlob, audio }) {
//     if (!srcBlob) {
//         return null
//     }

//     if (audio) {
//         return <audio src={URL.createObjectURL(srcBlob)} controls />
//     }

//     return (
//         <video
//             src={URL.createObjectURL(srcBlob)}
//             width={520}
//             height={480}
//             controls
//         />
//     )
// }

function App() {
    const [uploading, setUploading] = useState<boolean>()
    const [latitude, setLat] = useState<number>()
    const [longtidue, setLong] = useState<number>()
    // const [timestamp, setTime] = useState<number>()
    const [islistening, setIslistening] = useState(false)
    const [note, setNote] = useState<string>()
    const [sentiment, setSentiment] = useState<string>()
    const [statcolor, setstatcolor] = useState<string>()
    const [startstopcolor, setstartcolor] = useState<string>()
    let bordercolor = `1px solid ${statcolor}`
    const storageRef = ref(storage, 'audio')

    const uptoCloud = async (fileName: string) => {
        // file = mediaBlob
        if (mediaBlob) {
            const spaceRef = ref(storageRef, fileName)
            await uploadBytes(spaceRef, mediaBlob).then((snapshot) => {
                console.log(snapshot)
                console.log('Uploaded a blob or file!')
            })
            // console.log('Uploaded to cloud storage')
            // console.log()
        } else {
            console.log('No input')
            console.log(process.env.API_KEY)
        }
    }

    const {
        error,
        status,
        mediaBlob,
        stopRecording,
        getMediaStream,
        startRecording,
        clearMediaBlob,
    } = useMediaRecorder({
        recordScreen: false,
        blobOptions: { type: 'audio/mpeg' },
        mediaStreamConstraints: { audio: true, video: false },
    })

    useEffect(() => {
        if (status === 'idle') {
            setstatcolor('grey')
        } else if (status === 'recording') {
            setstatcolor('red')
        } else if (status === 'stopped') {
            setstatcolor('green')
        }
    }, [status])

    // let timeout: any
    const [timeout, setout] = useState<any>()

    useEffect(() => {
        handleListen()
    }, [islistening])
    const handleListen = async () => {
        if (islistening) {
            await mic.start()
            setstartcolor('red')
            startRecording()
            // console.log('set time out')
            setout(
                setTimeout(() => {
                    // console.log('time out execute')
                    setIslistening(false)
                }, 5000)
            )
            // mic.onend = () => {
            //     console.log('continue...')
            //     mic.start()
            // }
        } else {
            await mic.stop()
            setIslistening(false)
            clearTimeout(timeout)
            setout(null)
            setstartcolor('green')
            stopRecording()
            mic.onend = () => {
                console.log('Stopped Mic')
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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((location) => {
            setLat(location.coords.latitude)
            setLong(location.coords.longitude)
            // setTime(location.timestamp)
        })
    }, [])

    const handleSentiment = (event: any) => {
        setSentiment(event.target.value)
    }

    const handleRequest = async (data: any) => {
        const json = JSON.stringify(data)
        await axios
            .post(
                'https://senior-voice-server.vercel.app/api/voicedata',
                json,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((res) => {
                console.log(res)
            })
    }

    return (
        <div className="App">
            <div className="Main-box">
                <h2>
                    Feedback <br />
                    What You're Facing
                </h2>

                <div>
                    <div
                        className="recording-status"
                        style={{
                            border: `1px solid ${statcolor}`,
                            color: statcolor,
                        }}
                    >
                        {error ? `${status} ${error.message}` : status}
                    </div>

                    {/* <Player srcBlob={mediaBlob} audio={true} /> */}
                </div>

                <div>
                    <div className="middle-wrapper">
                        {/* <h3>Current Note</h3> */}
                        <div className="transcript-box">
                            <p>{note}</p>
                        </div>
                        <button
                            className="startstop-but"
                            onClick={() =>
                                setIslistening((prevState) => !prevState)
                            }
                            style={{ backgroundColor: startstopcolor }}
                        >
                            {!islistening ? 'Start' : 'Stop'}
                        </button>
                    </div>
                </div>
                {/* <previewAudioStream /> */}
                {/* <div>
                    <div>Longtitude: {longtidue}</div>
                    <div>Latitude: {latitude}</div>
                </div> */}
                <div className="radio-wrapper">
                    <div className="radio">
                        <div className="selector-item">
                            <input
                                className="radio-item"
                                type="radio"
                                value="Positive"
                                name="positive"
                                id="positive"
                                checked={sentiment === 'Positive'}
                                onChange={handleSentiment}
                            />
                            <label htmlFor="positive" className="radio-label">
                                😊Positive
                            </label>
                        </div>
                        <div className="selector-item">
                            <input
                                className="radio-item"
                                type="radio"
                                value="Neutral"
                                name="neutral"
                                id="neutral"
                                checked={sentiment === 'Neutral'}
                                onChange={handleSentiment}
                            />
                            <label htmlFor="neutral" className="radio-label">
                                😑Neutral
                            </label>
                        </div>
                        <div className="selector-item">
                            <input
                                className="radio-item"
                                type="radio"
                                value="Negative"
                                name="negative"
                                id="negative"
                                checked={sentiment === 'Negative'}
                                onChange={handleSentiment}
                            />
                            <label htmlFor="negative" className="radio-label">
                                😠Negative
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        className="submit-but"
                        disabled={uploading}
                        onClick={async (e) => {
                            setUploading(true)
                            const fileName = `audio-${Date.now()}.mpeg`
                            await uptoCloud(fileName)
                            const data = {
                                latitude: latitude,
                                longitude: longtidue,
                                fileName: fileName,
                                text: note,
                                timestamp: Date.now(),
                                sentiment: sentiment,
                            }
                            await handleRequest(data)
                            // console.log(await data)
                            clearMediaBlob()
                            setNote('')
                            setSentiment('')
                            setUploading(false)
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
