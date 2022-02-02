const fs = require('fs')
const path = require('path')

const wordleDictPath = path.join(__dirname, '..', 'public', 'wordle.txt')
const wordleDict = fs.readFileSync(wordleDictPath, 'utf8').split('\n')

// 统计每个字母的出现次数
const letter2Count = {}
wordleDict.forEach(word => {
  word.split('').forEach(letter => {
    if (letter2Count[letter]) {
      letter2Count[letter]++
    } else {
      letter2Count[letter] = 1
    }
  })
})

const computeWordValue = (word) => {
  return Array.from(new Set(word.split(''))).reduce((value, letter) => {
    return value + letter2Count[letter]
  }, 0)
}

// 使用出现频率排序，为使包含相同字符的排到后面，不重复统计，即如果是 three 这样的单词，只统计 thre，另一个 e 不统计
const sortedDict = wordleDict.sort((a, b) => {
  return computeWordValue(b) - computeWordValue(a)
})

const outputPath = path.join(__dirname, '..', 'public', 'wordle-sorted.txt')
fs.writeFileSync(outputPath, sortedDict.join('\n'))
