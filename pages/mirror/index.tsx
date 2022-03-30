import React, { FC, useEffect, useRef } from 'react'
import Layout from 'components/layout'

const Mirror: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        width: screen.width,
        height: screen.height
      }
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        /* 使用这个stream stream */
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch(function(err) {
        /* 处理error */
      });
  }, [videoRef.current])
  return (
    <Layout title='Mirror'>
      <video
        ref={videoRef}
        className='w-full h-full'
        controls
        autoPlay
      />
    </Layout>
  )
}

export default Mirror
