import React, { FC, useEffect, useRef, useState } from 'react'
import Layout from 'components/layout'

const Mirror: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [errMsg, setErrMsg] = useState('')
  useEffect(() => {
    let mediaStream: MediaStream | null = null

    const constraints = {
      audio: false,
      video: {
        width: window.innerWidth,
        height: window.innerHeight,
        facingMode: 'user',
      }
    }

    navigator.mediaDevices?.getUserMedia?.(constraints)
      .then(async function(stream) {
        /* 使用这个stream stream */
        if (videoRef.current) {
          mediaStream = stream
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch(function(err: Error) { /* 处理error */
        console.error(err.message)
        setErrMsg('获取视频失败，请检查权限')
      });

    return () => {
      mediaStream?.getTracks().forEach(track => track.stop())
    }
  }, [videoRef.current])
  if (errMsg) {
    return (
      <Layout title='Mirror'>
        <div className='w-72 h-24 m-auto flex flex-col items-center justify-center'>
          <h3>{errMsg}</h3>
          <button className='font-bold py-1 px-12 rounded border' onClick={() => location.reload()}>重试</button>
        </div>
      </Layout>
    )
  }
  return (
    <video
      ref={videoRef}
      // className='w-full h-full'
      className='w-screen h-screen object-fill'
      // controls
      playsInline
      muted
      autoPlay
    />
  )
}

export default Mirror
