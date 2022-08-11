import Cookies from 'js-cookie'

const useCookies = () => {
  const userData = Cookies.get('ud')
  const user = userData ? JSON.parse(userData) : null
  // console.log(user)
  return {
    userName: user?.userName ?? 'Guest',
    Level: user?.Level ?? 'Guest',
    isFaculty: user?.isFaculty ?? false,
    isAuth: user?.isAuth ?? false,
  }
}

export default useCookies
