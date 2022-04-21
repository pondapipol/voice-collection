import { useEffect, useState, createRef } from 'react'
// import AudioVisualiser from './AudioVisualizer'

interface VisualizerProps {
    audioStream: MediaStream
}

const Visualizer = ({ audioStream }: any) => {
    // @ts-ignore
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    const canvasRef = createRef<HTMLCanvasElement>()
    const [analyser, setAnalyser] = useState<any>()
    // let source = audioCtx.createMediaStreamSource(audioStream)

    const [source, setsource] = useState<any>()

    // source.connect(analyser)
    useEffect(() => {
        console.log(typeof audioStream)
        const analyserNode = audioCtx.createAnalyser()
        // setsource(audioCtx.createMediaStreamSource(audioStream))
        setsource(audioStream)
        source.connect(analyserNode)
        analyser.smoothingTimeConstant = 1
        setAnalyser(analyserNode)
        // source.connect(analyserNode)
    }, [])

    // useEffect(() => {
    //     if (analyser && source) {
    //         source.connect(analyser)
    //     }

    //     if (!source) {
    //         if (analyser) {
    //             analyser.disconnect()
    //             setAnalyser(undefined)
    //         }
    //     }

    //     return () => {
    //         if (analyser) {
    //             analyser.disconnect()
    //             setAnalyser(undefined)
    //         }
    //     }
    // }, [analyser, source])

    useEffect(() => {
        if (!analyser) {
            return
        }

        let raf: number

        const data = new Uint8Array(analyser.frequencyBinCount)

        const draw = () => {
            raf = requestAnimationFrame(draw)
            analyser.getByteTimeDomainData(data)
            const canvas = canvasRef.current
            if (canvas) {
                const { height, width } = canvas
                const context = canvas.getContext('2d')
                let x = 0
                const sliceWidth = (width * 1.0) / data.length

                if (context) {
                    context.lineWidth = 2
                    context.strokeStyle = '#fff'
                    context.clearRect(0, 0, width, height)

                    context.beginPath()
                    context.moveTo(0, height / 2)
                    // @ts-ignore
                    for (const item of data) {
                        const y = (item / 255.0) * height
                        context.lineTo(x, y)
                        x += sliceWidth
                    }
                    context.lineTo(x, height / 2)
                    context.stroke()
                }
            }
        }
        draw()

        return () => {
            cancelAnimationFrame(raf)
        }
    }, [canvasRef, analyser])

    return source && analyser ? (
        <canvas width="600" height="300" ref={canvasRef} />
    ) : null
}

export default Visualizer
