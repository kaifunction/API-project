import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='logoProfileButtonContainer'>
      {/* <li> */}
      <NavLink to="/"><img src='https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' alt='Home' style={{width: "110px"}}/></NavLink>
      <NavLink to='/spots/new' className='create-new-spot-button'>Create a New Spot</NavLink>
      {/* </li> */}
      {isLoaded && (<ProfileButton user={sessionUser} />)}
    </div>
  );
}

export default Navigation;
