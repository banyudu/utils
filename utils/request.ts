import axios, { AxiosRequestConfig } from 'axios'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (response.data.code !== 0) {
    console.error('接口异常')
  }
  return response
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export const postBuilder = (url: string) => {
  return async (data: any, config?: AxiosRequestConfig) => {
    const res = await request.post(url, data, config)
    return res.data
  }
}

export const putBuilder = (url: string) => {
  return async (data: any, config?: AxiosRequestConfig) => {
    const res = await request.put(url, data, config)
    return res.data
  }
}

export const getBuilder = (url: string) => {
  return async (config?: AxiosRequestConfig) => {
    const res = await request.get(url, config)
    return res.data
  }
}

export const deleteBuilder = (url: string) => {
  return async (config?: AxiosRequestConfig) => {
    const res = await request.delete(url, config)
    return res.data
  }
}
