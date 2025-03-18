import { useContext, useState } from "react";
import { Link } from 'react-router-dom';

import { UserContext } from "./utils/UserContext";

function Login() {
  const { attemptLogin } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();

  async function login (e) {
    e.preventDefault();
    setLoading(true);
    const result = await attemptLogin(username, password);
    setStatus(result);
    setLoading(false);
  }

  return (
    <form className="flex flex-col justify-center py-2 px-10 w-70 h-80 border-1 border-base-content" onSubmit={login}>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex-initial">
        <label className="opacity-75 text-sm">Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} className="w-full h-8 px-2" />
      </div>
      <div className="flex justify-between p-2">
        <button className="flex-initial btn btn-accent w-20" type="submit" disabled={loading}>Log in</button>
        <div className="flex-initial w-20">
          <p className="opacity-75 text-xs">Don't have an account?</p>
          <Link to='/register'><p className="text-sm font-medium">Create one</p></Link>
        </div>
      </div>
      {status && (status.success ? 'It worked' : 'It did not work')}
    </form>
  )
}

export default Login;