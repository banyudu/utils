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
    <div className='w-screen h-screen max-w-full text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900'>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='prose dark:prose-invert w-full h-full max-w-6xl px-2 sm:px-4 md:px-8 lg:px-12 py-8 mx-auto flex flex-col'>
        <div className='flex flex-row items-center mb-8 justify-between'>
          <h1 className='m-0'>{title}</h1>
          <a
            href={`https://github.com/banyudu/utils/tree/main/pages${router.pathname}`}
            target='_blank'
            rel='noopener noreferer'
          >
            <img
              width={36}
              src="/github.svg"
              alt="Github"
              className='dark:bg-white rounded-full'
            />
          </a>
        </div>
        <div className='flex-1'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
