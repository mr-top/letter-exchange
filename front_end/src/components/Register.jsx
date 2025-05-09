import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import getGeo from "../utils/getGeo";
import axiosFetch from "../utils/axiosFetch";
import inputVerify from "../utils/inputVerify";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState('');
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState({});
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpStarted, setOtpStarted] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);

  async function register(e) {
    e.preventDefault();
    setLoading(true);
    if (inputVerify.signup(username, email, password, confirmPassword)) {
      const geo = await getGeo();
      const result = await axiosFetch(axios.post, '/register', { username, email, password, geo, otp });

      setStatus(result);

      if (result.success) {
        navigate('/login');
      }
    } else {

    }
    setTried(true);
    setLoading(false);
  }

  async function sendOtp() {
    setOtpLoading(true);

    if (inputVerify.checkEmail(email)) {
      const result = await axiosFetch(axios.post, '/otp', { email });

      if (result.success) {
        setOtpMessage('OTP sent. Please check your email');

        // potential to limit otp requests. pass number into startCountdown
        startCountdown();
      } else {
        setOtpMessage('Error sending OTP')
      }
    } else {
      setOtpMessage('Email not in right format')
    }

    setOtpLoading(false);
  }

  async function startCountdown() {
    setOtpStarted(true);
    for (let count = 1; otpCountdown >= count; count++) {
      setTimeout(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000 * count)
    }
  }

  useEffect(() => {
    if (otpCountdown === 0) {
      setOtpCountdown(60);
      setOtpStarted(false);
    }
  }, [otpCountdown]);

  return (
    <form className="flex flex-col justify-center py-2 px-10 w-70 min-h-100 max-h-120 border-1 border-base-content" onSubmit={register}>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Username: {status.usernameExists && 'Field already exists'}</label>
        <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} className={`w-full h-8 px-2 ${tried && username && !inputVerify.checkUsername(username) && 'border-red-400'}`} />
        <p className="text-xs">{tried && username && !inputVerify.checkUsername(username) && 'Username must be made of 6-16 letters'}</p>
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Email: {status.emailExists && 'Field already exists'}</label>
        <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} className={`w-full h-8 px-2 ${tried && email && !inputVerify.checkEmail(email) && 'border-red-400'}`} />
        <p className="text-xs">{tried && email && !inputVerify.checkEmail(email) && 'Must be valid email'}</p>
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">OTP code: {status.otpWrong && 'OTP Invalid'}</label>
        <div className="flex space-x-2">
          <input type="text" value={otp} onChange={e => setOtp(e.currentTarget.value)} className={`w-full h-8 px-2`} />
          <button onClick={sendOtp} className="btn btn-sm min-w-16" disabled={otpLoading || otpStarted}>{otpStarted ? otpCountdown : 'Send code'}</button>
        </div>
        <p className="text-xs">{otpMessage}</p>
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} className={`w-full h-8 px-2 ${tried && password && !inputVerify.checkPassword(password) && 'border-red-400'}`} />
        <p className="text-xs">{tried && password && !inputVerify.checkPassword(password) && 'Password must have minimum of 8 characters and once uppercase letter'}</p>
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Confirm password:</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} className={`w-full h-8 px-2 ${confirmPassword && !inputVerify.checkDuplicate(password, confirmPassword) && 'border-red-400'}`} />
        <p className="text-xs">{confirmPassword && !inputVerify.checkDuplicate(password, confirmPassword) && 'Passwords must match'}</p>
      </div>
      <div className="flex justify-between p-2">
        <button className="flex-initial btn btn-accent w-22" type="submit" disabled={loading}>Sign Up</button>
        <div className="flex-initial w-21">
          <p className="opacity-75 text-xs">Already have an account?</p>
          <Link to='/login'><p className="text-xs font-medium">Log in instead</p></Link>
        </div>
      </div>
      {status && status.msg}
    </form>
  )
}

export default Register;