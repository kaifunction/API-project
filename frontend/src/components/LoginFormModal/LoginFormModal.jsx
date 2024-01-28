import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          // setErrors(data.message){
            if(data.message === "Invalid credentials"){
              setErrors({credential: "The provided credentials were invalid"})
            }
        }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    const demoCredentials = {
      username: setCredential('demo1234'),
      password: setPassword('passworddemo'),
    };
    dispatch(sessionActions.login({demoCredentials}))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      // console.log("data====>", data)
      if (data && data.message) {
        // setErrors(data.message){
          if(data.message === "Invalid credentials"){
            setErrors({credential: "The provided credentials were invalid"})
          }
      }
    });
  }

  return (
    <div className='logInContainer'>
      <h1 className='h1'>Log In</h1>
      <form onSubmit={handleSubmit} className='logInForm'>
        <label className='usernameOrEmail'>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='passWord'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={password.length < 6 || credential.length < 4} className='loginButton'>Log In</button>
      </form>
      <button onClick={handleDemoLogin} className='loginDemo'>Log in as Demo User</button>

    </div>
  );
}

export default LoginFormModal;
