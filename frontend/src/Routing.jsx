// added new cookies
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom'
import {
  Home,
  Create_Event,
  Event,
  Profile,
  Admin,
  Section,
  LiveVideo,
  Notifications,
  Error,
  About,
  Faq,
  Settings,
  Search,
  Login,
} from './routes/Index'
import useCookies from './components/logic/useCookies'
import PrivateRouting from './PrivateRouting'
import Header from './components/Header'
import Assets from './routes/Assets'
const Routing = () => {
  const { isAuth, isFaculty, Level } = useCookies()
  const isAdmin = Level?.toLowerCase() === 'admin'
  let links = (
    <Router>
      {isAuth && <Header />}
      <Switch>
        <Route exact path="/">
          {isAuth ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route exact path="/about-us">
          <About />
        </Route>
        <Route exact path="/faq">
          <Faq />
        </Route>

        {/* private Routes */}
        <PrivateRouting exact path="/event/:code">
          <Event interval={true} />
        </PrivateRouting>
        <PrivateRouting exact path="/home">
          <Home />
        </PrivateRouting>

        <PrivateRouting exact path="/search">
          <Search />
        </PrivateRouting>
        <PrivateRouting exact path="/notifications">
          <Notifications />
        </PrivateRouting>
        <PrivateRouting exact path="/profile">
          <Profile />
        </PrivateRouting>
        <PrivateRouting exact path="/profile/:id">
          <Profile />
        </PrivateRouting>
        <PrivateRouting exact path="/live/:code">
          {<LiveVideo />}
        </PrivateRouting>
        <PrivateRouting exact path="/admin">
          {isAdmin ? <Admin /> : <Redirect to="/home" />}
        </PrivateRouting>
        <PrivateRouting exact path="/section">
          {isAdmin ? <Section /> : <Redirect to="/home" />}
        </PrivateRouting>
        <PrivateRouting exact path="/createevent">
          {isFaculty || isAdmin ? <Create_Event /> : <Redirect to="/home" />}
        </PrivateRouting>
        <PrivateRouting exact path="/settings/:code">
          {isFaculty || isAdmin ? (
            <Settings />
          ) : (
            <Redirect to="/home?errorCode=401" />
          )}
        </PrivateRouting>
        <PrivateRouting exact path="/assets/:fileName">
          <Assets />
        </PrivateRouting>
        {/* !IMPORTANT : DAPAT HULI TO ! */}
        <Route exact path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  )
  return links
}
export default Routing
