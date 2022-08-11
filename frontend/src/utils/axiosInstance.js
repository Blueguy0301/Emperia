import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'https://api.emperia.online',
  withCredentials: true,
  credentials: 'include',
  secure: true,
  maxAge: 1000 * 60 * 60 * 2,
  headers: {
    'Access-Control-Allow-Origin': [
      'https://emperia.online',
      'https://beta.emperia.online',
      'https://www.emperia.online',
    ],
  },
})
export default axiosInstance
