import React, { FC } from 'react'
import Layout from 'components/layout'

// 可以通过Homebrew安装的应用，如 zsh、jq、nginx、redis 等
interface BrewApp {
  title?: string
  brew: string
  cask?: boolean // 若为 true，则使用 brew cask install
  dependencies?: string[]
}

// 需要通过 Curl 安装的应用，如 oh-my-zsh、nvm、以及 homebrew 自身等
interface CurlApp {
  title: string
  curl: string
  dependencies?: string[]
}

interface VSCodeExtensionCategory {
  title: string
  extensions: string[]
}

interface WebStormExtensionCategory {
  title: string
  extensions: string[]
}

// 编辑器
type EditorApp =
  | {
      editor: 'vscode'
      extensions?: VSCodeExtensionCategory[]
      dependencies?: string[]
    }
  | {
      editor: 'webstorm'
      extensions?: WebStormExtensionCategory[]
      dependencies?: string[]
    }

type ShellApp = {
  shell: string
  dependencies?: string[]
}

type App = BrewApp | CurlApp | EditorApp | ShellApp

const curl = (title: string, link: string, dependencies?: string[]): CurlApp => {
  return {
    title,
    curl: link,
    dependencies
  }
}

const brew = (pkg: string, cask: boolean = false): BrewApp => {
  return { brew: pkg, cask, dependencies: ['brew'] }
}

const brewCask = (pkg: string): BrewApp => {
  return brew(pkg, true)
}

const apps: Record<string, App> = {
  clashx: brewCask('clashx'), // 代理软件
  commandLineTools: {
    // xcode 命令行工具集
    shell: 'xcode-select -p || xcode-select --install'
  },
  cpulimit: brew('cpulimit'),
  deno: brew('deno'),
  graphiql: brewCask('graphiql'),
  // home brew，用于安装一从brew应用，依赖于 command line tools
  homebrew: curl('HomeBrew', 'https://raw.githubusercontent.com/Homebrew/install/master/install.sh', ['commandLineTools']),
  imagemagick: brew('imagemagick'),
  iterm2: brewCask('iterm2'), // 终端模拟器
  jq: brew('jq'), // JSON 处理工具
  maven: brew('maven'), // Java 依赖管理工具
  mkcert: brew('mkcert'),
  nginx: brew('nginx'), // HTTP 服务及反向代理工具
  nvm: brew('nvm'), // Node.js 运行时管理工具
  'oh-my-zsh': curl('oh-my-zsh', 'https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh'), // zsh 配置文件
  picgo: brewCask('picgo'), // 图床工具
  postman: brewCask('postman'), // 接口请求工具
  redis: brew('redis'), // Redis KV存储
  rustup: curl('Rust安装器', 'https://sh.rustup.rs'), // Rust 版本管理工具
  sqlite: brew('sqlite'),
  vscode: brewCask('visual-studio-code'), // 编辑器
  webstorm: brewCask('webstorm'), // 编辑器
  wrk: brew('wrk'), // 性能测试工具
  xz: brew('xz'), // 使用Node.js编写系统脚本
  zsh: brew('zsh'), // 终端
}

const SetupMacOS: FC<{}> = () => {
  const renderIntroduction = () => {
    return (
      <article className='introduction'>
        如何在不使用 Time Machine 等备份手段的情况下，快速搭建一套前端开发环境？
        <br />
        网上可能会有一些设置脚本，如
        <a
          target='blank'
          rel='noopener noreferrer'
          href='https://github.com/mathiasbynens/dotfiles'
        >
          dotfiles
        </a>
        ，但是不够灵活。
        <br />
        我为此开发了一个网页，动态地生成初始化脚本。
      </article>
    )
  }

  const renderBasicForm = () => {
    return <div></div>
  }

  const renderFrontendForm = () => {
    return <div></div>
  }

  const renderBackendForm = () => {
    return <div></div>
  }

  const renderForm = () => {
    // Form 表单分为如下几个部分
    // 1. 通用开发工具，如 homebrew、git、Docker等
    // 2. 前端开发工具，如 node.js、nvm 等
    // 3. 后端开发工具，如 Java、数据库等
    return (
      <div className='form'>
        {renderBasicForm()}
        {renderFrontendForm()}
        {renderBackendForm()}
      </div>
    )
  }

  const renderScript = () => {
    return <div className='script'></div>
  }

  const renderApp = () => {
    return (
      <div className='app'>
        {renderForm()}
        {renderScript()}
      </div>
    )
  }

  return (
    <Layout title='搭建Mac开发环境'>
      <div>
        {renderIntroduction()}
        {renderApp()}
      </div>
    </Layout>
  )
}

export default SetupMacOS
