# Wordle Crack

Wordle 解题助手

## 使用说明

Wordle 解题助手可以在一定程度上帮助你完成 Wordle 题目，但是不保证能产生正确的答案。

### 访问地址

[https://utils.banyudu.com/wordle](https://utils.banyudu.com/wordle)。

### 使用方法

Wordle 中允许用户进行 6 次尝试，每次尝试后，会按字母是否被包含、是否在正确的位置，分为以下三种情况：

1. 在单词中，且位置正确，显示为绿色。
1. 在单词中，但位置不正确，显示为黄色。
1. 不在单词中，显示为灰色。（注意重复的单词也会显示灰色）

本助手页面中提供了三种用户输入框：

![输入框示意图](https://banyudu.github.io/images/20220202191503.png)

每当在 Wordle 中提交一次后，按照其给出的反馈，将灰显的字母填入最上面的输入框，并将各个位置中显示绿色和黄色的字母填入相应的位置。

举例来说，假如已经有两次尝试，结果如下图：

![Wordle截图](https://banyudu.github.io/images/20220202195505.png)

则对应的输入框内容如下：

![输入框示意图](https://banyudu.github.io/images/20220202195719.png)

最后在 Suggestions 中就会出现推荐的单词了。

### 注意事项

- 如果助手中显示出红框，则说明填入的规则彼此冲突，如一个字母既在灰显列表中，又在给定位置的 绿色或黄色格内，就是不合理的。
- 绿色格最多输入一个字母，黄色格最多输入5个字母。
- 单词的排序规则是，尽量将出现频率比较高的字母排在前面，如 a e i r s 等，未考虑此单词是否常见。
- 本项目中使用的[字典](https://utils.banyudu.com/wordle.txt)来自[Wordle的JS文件](https://www.powerlanguage.co.uk/wordle/main.e65ce0a5.js)，经过了排序处理。
