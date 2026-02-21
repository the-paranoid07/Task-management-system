import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
})

let accessToken: string | null = null

export const setAccessToken = (token: string) => {
  accessToken = token
}

export const clearAccessToken = () => {
  accessToken = null
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.get(
          "http://localhost:5000/auth/refresh",
          { withCredentials: true }
        )
        accessToken = res.data.accessToken
        error.config.headers.Authorization = `Bearer ${accessToken}`
        return axios(error.config)
      } catch {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api