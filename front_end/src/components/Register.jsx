import { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import getGeo from "../utils/getGeo";
import axiosFetch from "../utils/axiosFetch";
import inputVerify from "../utils/inputVerify";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState('');
  const [tried, setTried] = useState(false);

  async function register (e) {
    e.preventDefault();
    setLoading(true);
    if (inputVerify.signup(username, email, password, confirmPassword)) {
      const geo = await getGeo();
      const result = await axiosFetch(axios.post, '/register', {username, email, password, geo});
    } else {
      
    }
    setTried(true);
    setLoading(false);
  }

  return (
    <form className="flex flex-col justify-center py-2 px-10 w-70 min-h-100 max-h-120 border-1 border-base-content" onSubmit={register}>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} className={`w-full h-8 px-2 ${tried && username && !inputVerify.checkUsername(username) && 'border-red-400'}`} />
        <p className="text-xs">{tried && username && !inputVerify.checkUsername(username) && 'Username must be made of 6-16 letters'}</p>
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Email:</label>
        <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} className={`w-full h-8 px-2 ${tried && email && !inputVerify.checkEmail(email) && 'border-red-400'}`} />
        <p className="text-xs">{tried && email && !inputVerify.checkEmail(email) && 'Must be valid email'}</p>
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
    </form>
  )
}

export default Register;