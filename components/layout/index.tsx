import React, { FC } from 'react'
import Head from 'next/head'

interface LayoutProps {
  children: React.ReactElement
  title: string
}

const Layout: FC<LayoutProps> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  )
}

export default Layout
