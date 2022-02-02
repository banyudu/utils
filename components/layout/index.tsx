import React, { FC } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: React.ReactElement
  title: string
  showGithub?: boolean
}

const Layout: FC<LayoutProps> = ({ children, title, showGithub = true }) => {
  const router = useRouter()
  return (
    <div className='w-screen h-screen max-w-full'>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='prose w-full max-w-6xl px-12 py-8 mx-auto'>
        <div className='flex flex-row items-center mb-8 justify-between'>
          <h1 className='m-0'>{title}</h1>
          <a
            href={`https://github.com/banyudu/utils/tree/main/pages${router.pathname}`}
            target='_blank'
            rel='noopener noreferer'>
            <img width={36} src="/github.svg" alt="Github" />
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout
