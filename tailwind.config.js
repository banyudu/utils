module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        id: ['FZHei-B01S', 'Microsoft JhengHei', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'Source Han Sans CN', 'WenQuanYi Micro Hei', 'SimHei'],
        simsum: ['STSong', 'SimSun', 'NSimSun', 'Songti SC', 'Source Han Serif SC']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
