import React, { FC } from 'react'
import Head from 'next/head'

interface LayoutProps {
  children: React.ReactElement
  title: string
}

const Layout: FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className='w-screen h-screen max-w-full'>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='prose w-full max-w-6xl px-12 py-8 mx-auto'>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  )
}

export default Layout
