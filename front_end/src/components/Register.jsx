import { useState } from "react";

import axios from "axios";
import getGeo from "../utils/getGeo";
import axiosFetch from "../utils/axiosFetch";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState('');

  async function register (e) {
    e.preventDefault();
    setLoading(true);
    const geo = await getGeo();
    const result = await axiosFetch(axios.post, '/register', {username, email, password, geo});
    setLoading(false);
  }

  return (
    <form className="flex flex-col justify-center py-2 px-10 w-70 h-100 bg-pink-400" onSubmit={register}>
      <div className="flex-initial">
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex-initial">
        <label>Email:</label>
        <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex-initial">
        <label>Password:</label>
        <input type="text" value={password} onChange={e => setPassword(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex-initial">
        <label>Confirm password:</label>
        <input type="text" value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex justify-between p-2">
        <button className="flex-initial btn w-22" type="submit" disabled={loading}>Sign Up</button>
        <div className="flex-initial w-20">
          <p className="text-xs">Already have an account</p>
          <p className="text-sm">Log in instead</p>
        </div>
      </div>
    </form>
  )
}

export default Register;