import { Redirect, Route } from 'react-router-dom'
// import { signIn } from '../auth/msal'
import auth from '../auth'
const Auth = () => {
  auth.Login()
  if (auth.isAuthenticated()) {
    return (
      <Redirect
        to={{
          pathname: '/home',
        }}
      />
    )
  } else return <Redirect to="/" />
}

export default Auth
