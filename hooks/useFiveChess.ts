import { useEffect, useRef, useState } from 'react'

export interface Position {
  // 以中心点为 0,0，向左向上为负，向右向下为正
  x: number
  y: number
}

type Delta = Position

type Player = 'black' | 'white' | null

export interface FiveChessHooksParams {
  initialSteps: Position[] // 初始状态，代表已经下过的棋子列表。每个元素是一个坐标，黑白颜色由奇偶顺序自动推导，即第0、2、4个元素是黑棋，第1、3、5个元素是白棋。
}

const useFiveChess = (params: FiveChessHooksParams) => {
  /**
   * 参数处理
   */
  const { initialSteps } = params
  const boardSize = 15 // 棋盘大小，默认使用15，即15x15，暂不支持修改

  // 最大坐标和最小坐标
  const maxPos = (boardSize - 1) / 2
  const minPos = 0 - maxPos
  const successCount = 5

  /**
   * 内部状态
   */
  const [error, setError] = useState('') // 错误信息
  const [steps, setSteps] = useState<Position[]>(initialSteps ?? []) // 棋子记录
  const [winner, setWinner] = useState<Player>(null) // 赢家，null 代表棋局尚未结束
  const board = useRef<Record<string, Player>>({}) // key是 x,y 的字符串形式，value 是 black 或 white 或 null

  /**
   * 函数列表
   */

  /**
   * 判断一个位置是不是合法的坐标
   * @param pos 要判断的位置
   * @returns 判断结果
   */
  const isValidPositoin = (pos: Position): boolean => {
    const isValidIndex = (num: number) => num >= minPos && num <= maxPos
    return isValidIndex(pos.x) && isValidIndex(pos.y)
  }

  const getBoardIndexByPos = (pos: Position): string => [pos.x, pos.y].join(',')
  const getPlayerByPos = (pos: Position) => board.current[getBoardIndexByPos(pos)]

  const judegeByDelta = (player: Player, lastPos: Position, delta: Delta): boolean => {
    if (!player) return false
    let count = 1

    const loop = (factor: 1 | -1) => {
      for (let i = 1; i < successCount; i++) {
        const realFactor = i * factor
        const newPos: Position = {
          x: lastPos.x + delta.x * realFactor,
          y: lastPos.y + delta.y * realFactor,
        }

        if (isValidPositoin(newPos) && getPlayerByPos(newPos) === player) {
          count++
        } else {
          break
        }
      }
    }

    // 正向寻找相同颜色的棋子
    loop(1)

    // 反向寻找相同颜色的棋子
    loop(-1)

    // 如果加和大于5，则说明成功
    return count >= successCount
  }

  // 判断胜负，传入参数为最后一步棋子。会判断此棋子参与的各个方向
  const judge = (lastPos: Position): Player => {
    const lastPlayer = getPlayerByPos(lastPos)
    if (!lastPlayer) {
      return null
    }

    const deltas: Delta[] = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 }
    ]

    for (const delta of deltas) {
      if (judegeByDelta(lastPlayer, lastPos, delta)) {
        return lastPlayer
      }
    }
    return null
  }

  // 重置状态
  const reset = () => {
    setError('')
    setSteps([])
    board.current = {}

    if (initialSteps) {
      init(initialSteps)
    }
  }

  const validate = (pos: Position) => {
    return isValidPositoin(pos) && getPlayerByPos(pos) === null
  }

  // 下新的一步
  const move = (pos: Position) => {
    if (!validate(pos)) {
      const errMsg = `invalid initialStep: ${pos.x},${pos.y}`
      setError(errMsg)
      console.warn(errMsg)
      return null
    }
    const player = steps.length % 2 === 0 ? 'black' : 'white'
    board.current[getBoardIndexByPos(pos)] = player
    setSteps(steps.concat([pos]))
    const judgeResult = judge(pos)
    if (judgeResult) {
      setWinner(judgeResult)
    }
  }

  const init = (moves: Position[]) => {
    let i = 0
    for (i = 0; i < moves.length; i++) {
      const step = moves[i]
      const player: Player = i % 2 === 0 ? 'black' : 'white'
      if (!validate(step)) {
        const errMsg = `invalid initialStep: ${step.x},${step.y}`
        setError(errMsg)
        console.warn(errMsg)
        break
      }
      board.current[getBoardIndexByPos(step)] = player

      const judgeResult = judge(step)
      if (judgeResult) {
        setWinner(judgeResult)
        break
      }
    }
    setSteps(moves.slice(0, i - 1))
  }

  // 悔棋
  const rollback = () => {
    const lastStep = steps[steps.length - 1]
    delete board.current[getBoardIndexByPos(lastStep)]
    setSteps(steps.splice(-1))
  }

  useEffect(() => {
    // 初始化时如果有提供initialSteps就录入数据，之后再变化则不再处理
    if (initialSteps) {
      init(initialSteps)
    }
  }, [])

  return { reset, move, rollback, error, steps, winner }
}

export default useFiveChess
