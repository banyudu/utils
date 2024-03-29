import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import Layout from 'components/layout'
import { Random } from 'mockjs'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import areas_ from '../../public/areas.json'

interface County {
  name: string,
  id: number
}

interface City extends County {
  counties: County[]
}

interface Province extends County {
  cities: City[]
}

const provinces: Province[] = areas_

const defaultAvatars = [
  'https://banyudu.github.io/images/20221127025035.png', // 哆啦a梦
  'https://banyudu.github.io/images/20221127025334.png', // 孙悟空
  'https://banyudu.github.io/images/20221127025703.png', // 哪吒
  'https://banyudu.github.io/images/20221127184026.png', // 猫咪
  'https://banyudu.github.io/images/20221127184215.png', // 阿尼亚
]

const defaultEthnics = [
  '阿昌',
  '鄂温克',
  '傈僳',
  '水',
  '白',
  '高山',
  '珞巴',
  '塔吉克',
  '保安',
  '仡佬',
  '满',
  '塔塔尔',
  '布朗',
  '哈尼',
  '毛南',
  '土家',
  '布依',
  '哈萨克',
  '门巴',
  '土',
  '朝鲜',
  '汉',
  '蒙古',
  '佤',
  '达斡尔',
  '赫哲',
  '苗',
  '维吾尔',
  '傣',
  '回',
  '仫佬',
  '乌孜别克',
  '德昂',
  '基诺',
  '纳西',
  '锡伯',
  '东乡',
  '京',
  '怒',
  '瑶',
  '侗',
  '景颇',
  '普米',
  '彝',
  '独龙',
  '柯尔克孜',
  '羌',
  '裕固',
  '俄罗斯',
  '拉祜',
  '撒拉',
  '藏',
  '鄂伦春',
  '黎',
  '畲',
  '壮'
]

const apartmentSuffixes = [
  '苑',
  '园',
  '佳苑',
  '佳园',
  '里',
  '村',
  '大厦',
  '家园',
  '中心',
  '小镇',
  '新城',
  '新干线',
  '城',
  '东方城',
  '公寓',
  '都市',
  '天地',
  '阁',
  '山水',
  '庭',
  '小区',
  '湾',
  '家',
  '谷',
  '馆',
  '豪庭',
  '国度',
  '国际',
  '府',
  '岛',
  '庄',
  '院',
  '湖',
  '山'
]

const getMockGenderFromName = (name: string): '男' | '女' => {
  /**
   * Mockjs 中的人名列表为
   * '伟 芳 娜 秀英 敏 静 丽 强 磊 军 ' +
			'洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 ' +
			'平 刚 桂英'

      根据人名，可以粗略推测出可能的性别。给出更合理的默认值
   */

  const maleSuffixes = ['伟', '强', '磊', '军', '洋', '勇', '杰', '涛', '明', '超', '平', '刚']
  return maleSuffixes.some(item => name.endsWith(item)) ? '男' : '女'
}

function saveAs (uri: string, filename: string) {
  var link = document.createElement('a')

  if (typeof link.download === 'string') {
    link.href = uri
    link.download = filename

    //Firefox requires the link to be in the body
    document.body.appendChild(link)

    //simulate click
    link.click()

    //remove the link when done
    document.body.removeChild(link)
  } else {
    window.open(uri)
  }
}

async function exportDom (dom: HTMLDivElement, filename: string) {
  const canvas = await html2canvas(dom, {
    allowTaint: true,
    useCORS: true
  })
  saveAs(canvas.toDataURL(), filename);
}

const IDGenerator: FC<{}> = () => {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [ethnic, setEthnic] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const [validateStart, setValidateStart] = useState('')
  const [province, setProvince] = useState(provinces[0])
  const [city, setCity] = useState(province.cities[0])
  const [county, setCounty] = useState(city.counties[0])
  const [orderNo, setOrderNo] = useState(String(Math.round((Math.random() * 1000 + 1)) % 1000))

  const [refreshKey, setRefreshKey] = useState(Math.random())

  useEffect(() => {
    // random values
    const newName = Random.cname()
    setName(newName)
    setGender(getMockGenderFromName(newName))

    let newBirthday = Random.date()
    while (newBirthday > dayjs().format('YYYY-MM-DD') || newBirthday < dayjs().subtract(200, 'years').format('YYYY-MM-DD')) {
      // 不能超过当前日期，也不能超过200岁
      newBirthday = Random.date()
    }
    setBirthday(newBirthday)
    setEthnic(Math.random() > 0.9 ? Random.pick(defaultEthnics) : '汉')

    const apartmentName = Random.ctitle(2, 4)
    const apartmentSuffix = Random.pick(apartmentSuffixes)
    const house = Random.integer(1, 30)
    const unit = Random.integer(1, 6)
    const floor = Random.integer(1, 30)
    const door = Random.integer(1, 4)
    const houseId = `${house}号楼${unit}单元${floor}0${door}号`
    const newAddress = apartmentName + apartmentSuffix + houseId

    setAddress(newAddress)

    const newProvince: Province = Random.pick(provinces)
    const newCity: City = Random.pick(newProvince.cities)
    const newCounty: County = Random.pick(newCity.counties)

    setProvince(newProvince)
    setCity(newCity)
    setCounty(newCounty)

    setValidateStart(dayjs().format('YYYY-MM-DD'))

    setAvatar(Random.pick(defaultAvatars))

    setOrderNo(String(Math.round((Math.random() * 1000 + 1)) % 1000))
  }, [refreshKey])

  const fullAddress = useMemo(() => {
    const realCityname = ['市辖区', '县'].includes(city.name) || (county.name === city.name) ? '' : city.name
    return province.name + realCityname + county.name + address
  }, [province, city, county, address])

  const validateEnd = useMemo(() => {
    if (!birthday || !validateStart) {
      return '--'
    }
    const startObj = dayjs(validateStart)
    const birthObj = dayjs(birthday)

    if (startObj < birthObj) {
      return '--'
    }

     /**
     * 身份证有效期计算规则：
     * 1）、未满十六周岁，有效期五年；
     * 2）、十六周岁至二十五周岁的，有效期十年；
     * 3）、二十六周岁至四十五周岁的，有效期二十年；
     * 4）、四十六周岁以上的，长期
     */

     if (startObj < dayjs(birthObj).add(16, 'years')) {
      return dayjs(startObj).add(5, 'years').format('YYYY-MM-DD')
     }
     if (startObj < dayjs(birthObj).add(26, 'years')) {
      return dayjs(startObj).add(10, 'years').format('YYYY-MM-DD')
     }
     if (startObj < dayjs(birthObj).add(46, 'years')) {
      return dayjs(startObj).add(20, 'years').format('YYYY-MM-DD')
     }
     return '长期'
  }, [birthday, validateStart])

  const pre14 = useMemo(() => {
    const areaCode = String(county.id).padEnd(6, '0')
    const birthdayCode = birthday.replace(/-/g, '')
    return `${areaCode}${birthdayCode}`
  }, [county, birthday])

  const pre17 = `${pre14}${String(orderNo).padStart(3, '0')}`

  const idNo = useMemo(() => {
    const ratio = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];	// 系数
    const matchMap: Record<number, string> = {
      0: "1",
      1: "0",
      2: "X",
      3: "9",
      4: "8",
      5: "7",
      6: "6",
      7: "5",
      8: "4",
      9: "3",
      10: "2"
    };	// 求身份证最后一位
    const checkBitValue = pre17.split('').map(Number).reduce((res, item, index) => {
      return res + item * ratio[index]
    }, 0)

    const checkBit = matchMap[checkBitValue % 11]
    return `${pre17}${checkBit}`
  }, [
    name,
    gender,
    ethnic,
    validateStart,
    validateEnd,
    pre17,
    avatar
  ])

  const handleDownloadFront = async () => {
    // 下载图片
    await exportDom(document.querySelector('#preview-front') as HTMLDivElement, '身份证正面.png')
  }

  const handleDownloadBack = async () => {
    // 下载图片
    await exportDom(document.querySelector('#preview-back') as HTMLDivElement, '身份证背面.png')
  }

  useEffect(() => {
    setCity(Random.pick(province.cities))
  }, [province])

  useEffect(() => {
    setCounty(Random.pick(city.counties))
  }, [city])

  const disableDownload = !(
    name &&
    gender &&
    birthday &&
    ethnic &&
    county &&
    address &&
    avatar &&
    validateStart &&
    validateEnd
  )

  const [year, month, day] = birthday.split('-')

  return (
    <Layout title='身份证生成器'>
      <div className='id-generator h-full w-full flex flex-col pb-4'>
        <div className='warn text-red-600 mb-8'>
          本工具仅用于测试目的，请勿用于其它用途。本人不承担因此带来的任何责任。
        </div>
        <div className='content flex flex-1 flex-col-reverse md:flex-row'>
          <div className='form flex flex-1 flex-col w-full md:w-1/2 dark:bg-slate-900'>
            {/* 姓名 */}
            <div className='flex mb-2 justify-between flex-col md:flex-row md:justify-between flex-wrap'>
              <div className='flex justify-start'>
                <label htmlFor='name' className='w-20'>
                  姓名：
                </label>
                <input
                  type='text'
                  name='name'
                  className='border-2 border-blue-500 ml-4 px-1 dark:bg-slate-900 rounded'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              {/* 性别 */}
              <div className='flex justify-start w-1/2 mt-2 md:mt-0'>
                <label htmlFor='gender' className='md:ml-4 w-20'>
                  性别：
                </label>
                <select
                  name='gender'
                  className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 flex-1 rounded'
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value='男'>男</option>
                  <option value='女'>女</option>
                </select>
              </div>
            </div>
            {/* 出生日期 */}
            <div className='flex mb-2 flex-col md:flex-row justify-between flex-wrap'>
              <div>
                <label htmlFor='birthday' className='w-20'>
                  出生日期：
                </label>
                <input
                  type='date'
                  name='birthday'
                  className='border-2 border-blue-500 ml-4 px-1 dark:bg-slate-900 rounded'
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                />
              </div>
              {/* 民族 */}
              <div className='flex justify-start w-1/2 mt-2 md:mt-0'>
                <label htmlFor='birthday' className='md:ml-4 w-20'>
                  民族：
                </label>
                <select
                  name='ethnic'
                  className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 flex-1 rounded'
                  value={ethnic}
                  onChange={e => setEthnic(e.target.value)}
                >
                  {defaultEthnics.map(item => {
                    return (
                      <option value={item} key={item}>{item}</option>
                    )
                  })}
                </select>
              </div>
            </div>
            {/* 地址 */}
            <div className='flex mb-2 items-center flex-wrap'>
              <label htmlFor='county' className='w-20 whitespace-nowrap'>
                地区：
              </label>
              <select
                placeholder='省'
                className='border-2 border-blue-500 ml-4 px-1 dark:bg-slate-900 w-32 rounded'
                onChange={e => setProvince(provinces.find(item => String(item.id) === e.target.value) ?? provinces[0])}
                value={String(province.id)}
                title={province.name}
              >
                {provinces.map(item => {
                  return (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                  )
                })}
              </select>
              <select
                placeholder='市'
                className='border-2 border-blue-500 ml-4 px-1 dark:bg-slate-900 w-32 rounded'
                onChange={e => setCity(province.cities.find(item => String(item.id) === e.target.value) ?? province.cities[0])}
                value={String(city.id)}
                title={city.name}
              >
                {province.cities.map(item => {
                  return (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                  )
                })}
              </select>
              <select
                className='border-2 border-blue-500 ml-4 px-1 dark:bg-slate-900 flex-1 rounded'
                placeholder='区县'
                onChange={e => setCounty(city.counties.find(item => String(item.id) === e.target.value) ?? city.counties[0])}
                value={String(county.id)}
                title={county.name}
              >
                {city.counties.map(item => {
                  return (
                    <option key={item.id} value={String(item.id)}>{item.name}</option>
                  )
                })}
              </select>
            </div>
            {/* 地址 */}
            <div className='flex mb-2 items-center'>
              <label htmlFor='address' className='w-20'>
                地址：
              </label>
              <input
                type='text'
                name='address'
                className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 flex-1 rounded'
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            {/* 有效期 */}
            <div className='flex mb-2 items-center'>
              <label htmlFor='validate' className='w-20'>
                有效期：
              </label>
              <input
                type='date'
                name='validateStart'
                className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 rounded'
                value={validateStart}
                onChange={e => setValidateStart(e.target.value)}
              />
              <span className='ml-4'>-</span>
              <span
                className='border border-blue-500 ml-4 px-2 dark:bg-slate-900 rounded'
              >
                {validateEnd}
              </span>
            </div>
            {/* 头像 */}
            <div className='flex mb-2 items-center'>
              {defaultAvatars.map(item => {
                return (
                  <div key={item}>
                    <img
                      src={item}
                      alt='avatar icon item'
                      width={100}
                      height={100}
                      onClick={() => setAvatar(item)}
                      className='my-1'
                    />
                  </div>
                )
              })}
            </div>
            <div className='flex mb-2 items-center'>
              <label htmlFor='avatar' className='w-20'>
                头像：
              </label>
              <input
                type='text'
                name='avatar'
                className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 flex-1 rounded'
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
            </div>
            <div className='flex mb-2 items-center'>
              <label htmlFor='avatar' className='w-20' title='身份证倒数第4位到倒数第2位'>
                序号：
              </label>
              <input
                type='text'
                title='身份证倒数第4位到倒数第2位'
                name='orderNo'
                className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 w-24 rounded'
                value={orderNo}
                maxLength={3}
                onChange={e => setOrderNo(e.target.value.replace(/[^0-9]/g, '').substring(0, 3))}
              />
            </div>
            <div className='buttons flex mt-4'>
              <button
                className='px-2 py-1 mr-4 rounded border bg-red-500 text-slate-900 border-red-500'
                onClick={() => setRefreshKey(Math.random())}
              >
                随机生成
              </button>
              <button
                className='px-2 py-1 mr-4 rounded border bg-blue-500 text-slate-900 border-blue-500 disabled:text-gray-500'
                disabled={disableDownload}
                onClick={handleDownloadFront}
              >
                下载正面
              </button>
              <button
                className='px-2 py-1 mr-4 rounded border bg-blue-500 text-slate-900 border-blue-500 disabled:text-gray-500'
                disabled={disableDownload}
                onClick={handleDownloadBack}
              >
                下载背面
              </button>
            </div>
          </div>
          <div className='preview flex flex-col items-end w-[320px] font-id text-xs font-semibold md:flex-col my-8 sm:my-0'>
            <div id='preview-front' className='preview-front flex justify-center items-center mb-4 text-[#307381]'>
              <div className='bg-[url("https://banyudu.github.io/images/id_front.jpg")] w-[280px] h-[175px] bg-cover flex flex-col px-4 py-5'>
                <div className='content flex-1 flex'>
                  <div className='info flex-1 flex flex-col'>
                    <div className='flex items-center h-5'>
                      <label className='mr-1 w-8'>姓名</label>
                      <span className='text-sm text-stone-800'>
                        {(name ?? '--').split('').join(' ')}
                      </span>
                    </div>
                    <div className='flex items-center h-5'>
                      <div className='mr-4'>
                        <label className='mr-3 w-8'>性别</label>
                        <span className='text-stone-800'>
                          {(gender ?? '--').split('').join(' ')}
                        </span>
                      </div>
                      <div>
                        <label className='mr-3 w-8'>民族</label>
                        <span className='text-stone-800'>
                          {(ethnic ?? '--').split('').join(' ')}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center h-5'>
                      <div className='mr-1'>
                        <label className='w-8'>出生</label>
                        <span className='text-stone-800 mx-1.5'>
                          {year ?? '--'}
                        </span>
                        <label>年</label>
                        <span className='text-stone-800 mx-1'>
                          {month ?? '--'}
                        </span>
                        <label>月</label>
                        <span className='text-stone-800 mx-1'>
                          {day ?? '--'}
                        </span>
                        <label>日</label>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <label className='mr-3 w-8 block whitespace-nowrap'>
                        住址
                      </label>
                      <span className='text-stone-800'>
                        {fullAddress ?? '--'}
                      </span>
                    </div>
                  </div>
                  <div className='avatar w-24'>
                    {avatar && (
                      <img
                        src={avatar}
                        alt='avatar'
                        width={96}
                        className='m-0 pointer-events-none'
                      />
                    )}
                  </div>
                </div>
                <div className='footer h-4 flex items-center'>
                  <label className='mr-3'>公民身份号码</label>
                  <span className='text-sm text-stone-800'>{idNo}</span>
                </div>
              </div>
            </div>
            <div id='preview-back' className='preview-back flex justify-center items-center text-stone-900'>
              <div className='bg-[url("https://banyudu.github.io/images/id_back.jpg")] w-[280px] h-[175px] bg-cover px-5 py-4 flex flex-col justify-between'>
                <div className='title flex h-14'>
                  <div className='badge w-12'>
                    <img
                      src='https://banyudu.github.io/images/id_badge.png'
                      alt='id badge'
                      className='m-0 pointer-events-none'
                      width={48}
                    />
                  </div>
                  <div className='flex flex-col flex-1 ml-4 font-simsum font-bold'>
                    <div className='text-lg'>中 华 人 民 共 和 国</div>
                    <div className='text-2xl'>居 民 身 份 证</div>
                  </div>
                </div>
                <div className='info flex flex-col h-10 justify-center'>
                  <div className='ml-6'>
                    <label className='mr-4'>签发机关</label>
                    <span className='text-sm font-normal'>虚拟证件局</span>
                  </div>
                  <div className='ml-6'>
                    <label className='mr-4'>有效期限</label>
                    <span className='text-sm font-normal'>
                      {validateStart.replace(/\-/g, '.')}-
                      {validateEnd.replace(/\-/g, '.')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IDGenerator
