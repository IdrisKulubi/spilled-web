import { ImageResponse } from 'next/og'
import { metaData } from '@/lib/constants'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = metaData.title
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF8F9 0%, #FDECEF 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              background: '#D96BA0',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '80px',
              fontWeight: 'bold',
              marginRight: '30px',
            }}
          >
            S
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#3B3B3B',
                margin: '0',
                lineHeight: '1',
              }}
            >
              Spilled
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#64748b',
                margin: '10px 0 0 0',
                fontWeight: '500',
              }}
            >
              Your Safety Network
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: '28px',
            color: '#3B3B3B',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: '1.4',
            margin: '0',
          }}
        >
          The women-only platform where you can safely share experiences and make informed decisions about the people in your life.
        </p>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}