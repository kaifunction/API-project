import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      dispatch(
        sessionActions.signup({
          username,
          firstName,
          lastName,
          email,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          // console.log("Signupdata====>", data)
          //要有相同的密码才行
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='signup-container'>
      <h1 className='h1 signupH1'>Sign Up</h1>
      {errors.email && <p style={{color:"red", position:"relative", top: "-15px", left: "20px"}}>{errors.email}</p>}
      {errors.username && <p style={{color:"red", position:"relative", top: "-15px", left: "20px"}}>{errors.username}</p>}
      <form onSubmit={handleSubmit} className='signup-form'>
        <label className='signup-email'>
          Email
          <br/>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>

        <label className='signup-username'>
          Username
          <br/>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>

        <label className='signup-firstname'>
          First Name
          <br/>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>
        {errors.firstName && <p style={{color:"red"}}>{errors.firstName}</p>}
        <label className='signup-lastname'>
          Last Name
          <br/>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder=' Last Name'
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>
        {errors.lastName && <p style={{color:"red"}}>{errors.lastName}</p>}
        <label className='signup-password'>
          Password
          <br/>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>
        {errors.password && <p style={{color:"red"}}>{errors.password}</p>}
        <label className='signup-confrimP'>
          Confirm Password
          <br/>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
            style={{width: "250px", margin: "5px 0", padding: "5px"}}
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" disabled={!email.length || username.length < 4 || !lastName.length || !firstName.length || password.length < 6 || confirmPassword.length < 6} className='signup-button'  style={{cursor: "pointer"}}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
