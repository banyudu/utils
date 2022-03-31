import React, { FC, useEffect, useRef } from 'react'
import Layout from 'components/layout'

const Mirror: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        width: screen.width,
        height: screen.height,
        facingMode: 'user',
      }
    }
    navigator.mediaDevices?.getUserMedia?.(constraints)
      .then(async function(stream) {
        /* 使用这个stream stream */
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.requestFullscreen()
            .then(() => console.log('request full screen resolved'))
            .catch(() => console.log('request full screen rejected'))
          videoRef.current.play()
        }
      })
      .catch(function(err) {
        /* 处理error */
      });
  }, [videoRef.current])
  return (
    <video
      ref={videoRef}
      // className='w-full h-full'
      className='w-screen h-screen'
      controls
      playsInline
      muted
      autoPlay
    />
  )
}

export default Mirror
