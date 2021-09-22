import React, { FC } from 'react'
import Layout from 'components/layout'
import FiveChessComponent from 'components/five-chess'

interface FiveChessProps {

}

const FiveChess: FC<FiveChessProps> = () => {
  return (
    <Layout title='五子棋'>
      <FiveChessComponent />
    </Layout>
  )
}

export default FiveChess
