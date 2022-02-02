import React, { FC, useEffect, useState, ComponentProps } from 'react'
import Layout from 'components/layout'
import useWordle from 'hooks/useWordle'
import { flatMap, uniq } from 'lodash'

const fields = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

const WordleCrack: FC<{}> = () => {
  const [filter, setFilter] = useState<Record<string, string>>({})
  const [conflictFields, setConflictFields] = useState<string[]>([])
  const { suggestions, setFilterFunction } = useWordle()

  const getOnChange = (key: string) => (e: any) => {
    const formatStr = (str: string) =>
      str.replace(/[^a-zA-Z]/g, '').toLowerCase()
    setFilter(filter => ({ ...filter, [key]: formatStr(e.target.value ?? '') }))
  }

  const renderInput = ({ className, field, ...props}: ComponentProps<'input'> & { field: string }) => {
    const warnClassname = conflictFields.includes(field) ? 'border-red-500' : ''
    return (
      <input
        {...props}
        defaultValue=''
        autoComplete='off'
        onChange={getOnChange(field)}
        className={['border outline-0 focus-visible:outline-0 px-2 w-24', className ?? '', warnClassname].join(' ')}
      />
    )
  }

  useEffect(() => {
    // 当 filter 变化时，重新计算是否有冲突

    // 如果一个字母既在灰显列表中，又在正确列表中，则说明输入有误
    const newConflictFields: string[] = []
    if (filter.none) {
      const regexp = new RegExp(`[${filter.none}]`, 'i')
      for (const field of fields) {
        for (const suffix of ['correct', 'incorrect']) {
          const key = [field, suffix].join('.')
          if (regexp.test(filter[key] ?? '')) {
            newConflictFields.push(key)
          }
        }
      }
    }
    if (newConflictFields.length) {
      newConflictFields.push('none')
    }
    setConflictFields(Array.from(new Set(newConflictFields)))
  }, [filter])

  useEffect(() => {
    // 当 filter 或 冲突条件变化时，重新计算过滤函数
    if (conflictFields.length) {
      setFilterFunction((_word: string) => false)
      return
    }
    const filterFunctions: Array<(word: string) => boolean> = []
    // 给定字符有三种情况，一是不存在，二是存在且位置正确，三是存在且位置不正确
    // 前两者都可以通过正则表达式匹配，第三种情况需要使用函数过滤
    const unknownChar = filter.none ? `[^${filter.none}]` : '.'
    const chars = fields.map(field => {
      const correct = filter[`${field}.correct`]
      const incorrect = filter[`${field}.incorrect`]
      if (correct) {
        return `[${correct[0]}]`
      } else if (incorrect) {
        return filter.none ? `[^${incorrect}${filter.none}]` : `[^${incorrect}]`
      } else {
        return unknownChar
      }
    })

    const regexp = new RegExp(`^${chars.join('')}$`, 'i')
    filterFunctions.push(word => {
      const result = regexp.test(word)
      return result
    })

    // 对于包含 xx 字符的校验，正则表达式不太好写，需要单独列一个函数
    const includeChars = uniq(flatMap(fields.map(field => (filter[`${field}.incorrect`] ?? '').split(''))))
    filterFunctions.push((word: string) => {
      const result = includeChars.every(ch => word.includes(ch))
      return result
    })

    setFilterFunction((word: string) => filterFunctions.every(f => f(word)))
  }, [filter, conflictFields])

  const renderIntroduction = () => {
    return (
      <article className='introduction'>
        <a
          href='https://www.powerlanguage.co.uk/wordle/'
          target='_blank'
          rel='noopener noreferer'
        >
          Wordle
        </a>
        &nbsp;is a bit hard, this front-end application can help you make
        decisions quickly
      </article>
    )
  }

  const renderApp = () => {
    return (
      <div className='app'>
        <div className='input'>
          <div>
            <h3 className='text-gray-600'>Letters not in the word</h3>
            {renderInput({
              type: 'text',
              placeholder: 'gray letters',
              className: 'w-48',
              maxLength: 30,
              field: 'none'
            })}
          </div>
          <div>
            <h3>Letters in the word</h3>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Spot</th>
                    <th className='text-green-600'>Correct letter</th>
                    <th className='text-yellow-600'>Incorrect but in the word</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(field => (
                    <tr key={field}>
                      <td>{field}</td>
                      <td>
                        {renderInput({
                          type: 'text',
                          field: `${field}.correct`,
                          maxLength: 1,
                        })}
                      </td>
                      <td>
                        {renderInput({
                          type: 'text',
                          field: `${field}.incorrect`,
                          maxLength: 4,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='suggestion'>
          <h2>Suggestions:</h2>
          <ul className='list-none flex flex-row flex-wrap pl-1'>
            {suggestions.map(word => (
              <li key={word}>
                <span className='text-blue-500 bg-blue-100 px-2 py-1 rounded-sm w-16 text-center inline-block'>{word}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <Layout title='Wordle Crack'>
      <div>
        {renderIntroduction()}
        {renderApp()}
      </div>
    </Layout>
  )
}

export default WordleCrack
