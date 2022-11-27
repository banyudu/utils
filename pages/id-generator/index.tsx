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
  'https://banyudu.github.io/images/20221127051057.png' // 阿尼亚
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
  const [validateEnd, setValidateEnd] = useState('')
  const [province, setProvince] = useState(provinces[0])
  const [city, setCity] = useState(province.cities[0])
  const [county, setCounty] = useState(city.counties[0])

  const [refreshKey, setRefreshKey] = useState(Math.random())

  useEffect(() => {
    // random values
    setName(Random.cname())
    setGender(Math.random() >= 0.5 ? '男' : '女')
    setBirthday(Random.date())
    setEthnic(Math.random() > 0.9 ? Random.pick(defaultEthnics) : '汉')
    setAddress('无名小镇')

    const newProvince: Province = Random.pick(provinces)
    const newCity: City = Random.pick(newProvince.cities)
    const newCounty: County = Random.pick(newCity.counties)

    setProvince(newProvince)
    setCity(newCity)
    setCounty(newCounty)

    setValidateStart(dayjs().format('YYYY-MM-DD'))
    setValidateEnd(dayjs().add(10, 'years').format('YYYY-MM-DD'))
    setAvatar(Random.pick(defaultAvatars))
  }, [refreshKey])

  const fullAddress = useMemo(() => {
    const realCityname = ['市辖区', '县'].includes(city.name) || (county.name === city.name) ? '' : city.name
    return province.name + realCityname + county.name + address
  }, [province, city, county, address])

  const idNo = useMemo(() => {
    const areaCode = String(county.id).padEnd(6, '0')
    const birthdayCode = birthday.replace(/-/g, '')
    const orderCode = Math.round((Math.random() * 1000 + 1)) % 1000
    const pre17 = areaCode + birthdayCode + orderCode

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
    return pre17 + checkBit
  }, [
    name,
    gender,
    birthday,
    ethnic,
    address,
    validateStart,
    validateEnd,
    avatar
  ])

  const handleDownload = async () => {
    // 下载图片
    await Promise.all([
      exportDom(document.querySelector('#preview-front') as HTMLDivElement, '身份证正面.png'),
      exportDom(document.querySelector('#preview-back') as HTMLDivElement, '身份证背面.png')
    ])
  }

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
            <div className='flex mb-2 justify-between flex-col md:flex-row md:justify-between'>
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
            <div className='flex mb-2 flex-col md:flex-row justify-between'>
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
                <input
                  type='text'
                  name='ethnic'
                  className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 flex-1 rounded'
                  value={ethnic}
                  onChange={e => setEthnic(e.target.value)}
                />
              </div>
            </div>
            {/* 地址 */}
            <div className='flex mb-2 items-center'>
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
              <input
                type='date'
                name='validateEnd'
                className='border-2 border-blue-500 ml-4 px-2 dark:bg-slate-900 rounded'
                value={validateEnd}
                onChange={e => setValidateEnd(e.target.value)}
              />
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
                    <div className='flex items-center h-6'>
                      <label className='mr-1 w-8'>姓名</label>
                      <span className='text-sm text-stone-800'>
                        {(name ?? '--').split('').join(' ')}
                      </span>
                    </div>
                    <div className='flex items-center h-6'>
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
                    <div className='flex items-center h-6'>
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
                        className='m-0'
                      />
                    )}
                  </div>
                </div>
                <div className='footer h-6 flex items-center'>
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
                      className='m-0'
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
