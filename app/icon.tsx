import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A192F', // Navy Dark
                    fontFamily: 'sans-serif',
                    fontWeight: 800,
                    position: 'relative',
                }}
            >
                W
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        background: '#2563EB', // Primary Blue
                        borderRadius: '50%',
                        border: '2px solid white',
                    }}
                />
            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported icons size metadata
            // config to also set the ImageResponse's width and height.
            ...size,
        }
    )
}
