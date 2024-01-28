import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const manageSpots = (e) => {
    e.preventDefault();
    navigate("/spots/current");
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="buttonLoginSignupContainer">
      <button onClick={toggleMenu}>
        <i
          className="fas fa-user-circle"
          style={{ cursor: "pointer", color: "#11212D" }}
        />
      </button>
      <ul className={`${ulClassName} dropdownLogout`} ref={ulRef}>
        {user ? (
          <>
            <span>{user.username}</span>
            <br/>
            <span>
              Hello, {user.firstName} {user.lastName}
            </span>
            <br/>
            <span>{user.email}</span>
            <br/>
            <span>
              <button onClick={manageSpots} className="manage-button">Manage Spots</button>
            </span>
            <br/>
            <span>
              <button onClick={logout} className="logout-button">Log Out</button>
            </span>
          </>
        ) : (
          <div className="loginSignupContainer">
            <div className="loginbutton">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div className="signupbutton">
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
