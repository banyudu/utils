import { useEffect, useState } from 'react'
import axios from 'axios'
import useSWRImmutable from 'swr/immutable'

const fetcher = (url: string) => axios.get(url).then(res => res.data.split('\n'))

type FilterFunction = (w: string) => boolean

const maxSuggestions = 30

const useWordle = () => {
  const { data: words, error } = useSWRImmutable('/wordle.txt', fetcher)
  const [filterFunction, setFilterFunction] = useState<null | FilterFunction>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const newSuggestions: string[] = []
    if (filterFunction && words?.length) {
      for (let i = 0; i < words.length && newSuggestions.length < maxSuggestions; i++) {
        if (filterFunction(words[i])) {
          newSuggestions.push(words[i])
        }
      }
    }
    setSuggestions(newSuggestions)
  }, [filterFunction, words])

  return { suggestions, setFilterFunction: (v: FilterFunction) => {
    setFilterFunction(() => v)
  } }
}

export default useWordle
