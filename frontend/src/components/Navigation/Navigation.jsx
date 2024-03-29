import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    ) : (
      <div className='openModalButtonContainer'>
        {/* <li> */}
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          {/* <NavLink to="/login">Log In</NavLink> */}
        {/* </li> */}
        {/* <li> */}
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
          {/* <NavLink to="/signup">Sign Up</NavLink> */}
        {/* </li> */}
      </div>
    );

  return (
    <ul>
      {/* <li> */}
        <NavLink to="/"><img src='https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' alt='Home'/></NavLink>
      {/* </li> */}
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
