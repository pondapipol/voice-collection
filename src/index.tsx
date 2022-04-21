import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MediaStreamProvider } from './components/contexts/MediaStreamContext'
import { AudioAnalyserProvider } from './components/contexts/AudioAnalyzerContext'
import { InputAudioProvider } from './components/contexts/InputAudioContext'

ReactDOM.render(
    <MediaStreamProvider video={false} audio={true}>
        <InputAudioProvider>
            <AudioAnalyserProvider>
                <App />
            </AudioAnalyserProvider>
        </InputAudioProvider>
    </MediaStreamProvider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
