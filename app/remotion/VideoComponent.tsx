import { AbsoluteFill, Img, Audio, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

interface Caption {
    text: string
    startFrame: number
    endFrame: number
}

interface VideoProps {
    imageLinks: string[]
    audio: string;
    captions: Caption[]
}


export const VideoComponent = ({ imageLinks, audio, captions }: VideoProps) => {
    const frame = useCurrentFrame()
    const { width, durationInFrames } = useVideoConfig()

    const framesPerImage = Math.ceil(durationInFrames / imageLinks.length)

    const chunkSize = 3
    const chunks = []
    for (let i = 0; i < captions.length; i += chunkSize) {
        chunks.push(captions.slice(i, i + chunkSize))
    }

    const activeChunkIndex = chunks.findIndex((chunk) =>
        frame >= chunk[0].startFrame &&
        frame <= chunk[chunk.length - 1].endFrame
    )

    const currentChunk = chunks[activeChunkIndex] || []

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {imageLinks.map((imageLink, index) => {
                const startFrame = index * framesPerImage
                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={framesPerImage}
                    >
                        <Img
                            src={imageLink}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Sequence>
                )
            })}
            //leo messi was

            <Audio src={audio} />

            {currentChunk.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        display: 'flex',
                        gap: '20px'
                    }}
                >
                    {currentChunk.map((caption, i) => {
                        const isCurrent = frame >= caption.startFrame && frame <= caption.endFrame;
                        return (
                            <span
                                key={i}
                                style={{
                                    color: isCurrent ? '#FF0055' : '#FFFFFF',
                                    fontWeight: isCurrent ? 'bold' : 'normal',
                                    fontFamily: 'Impact, Arial, sans-serif',
                                    fontSize: width * 0.07,
                                    textShadow: `
                                    -2px -2px 2px black,
                                    2px -2px 2px black,
                                    -2px 2px 2px black,
                                    2px 2px 2px black
                                    `
                                }}
                            >
                                {caption.text}
                            </span>
                        )
                    })}

                </div>
            )}


        </AbsoluteFill>
    )
}