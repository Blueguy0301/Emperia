import { Redirect, Route } from 'react-router-dom'
import useCookies from './components/logic/useCookies'

const PrivateRouting = ({ children, ...rest }) => {
  const { isAuth } = useCookies()
  return (
    <Route
      {...rest}
      render={() => {
        return isAuth ? <>{children}</> : <Redirect to="/" />
      }}
    />
  )
}

export default PrivateRouting
