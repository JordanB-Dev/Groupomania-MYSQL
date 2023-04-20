import { useContext, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { UidContext } from '../AppContext'
import Logout from '../Logout'

const Navbar = () => {
  const uid = useContext(UidContext)
  const userData = useSelector((state) => state.userReducer)

  return (
    <header>
      <div className="banner-container">
        <div className="logo">
          <NavLink to="/">
            <img src="./img/logo/logo-white.svg" alt="Logo" />
          </NavLink>
        </div>
        {uid ? (
          <Fragment>
            <ul>
              <li className="welcome">
                <NavLink to="/profil">
                  <h5>
                    Bienvenue {userData.firstName} {userData.lastName}
                  </h5>
                </NavLink>
              </li>
            </ul>
            <Logout />
          </Fragment>
        ) : (
          <></>
        )}
      </div>
    </header>
  )
}

export default Navbar
