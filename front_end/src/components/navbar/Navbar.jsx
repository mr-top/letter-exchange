import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../utils/UserContext";

function Navbar () {
  const {loggedDetails, attemptLogout} = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function logout () {
    setLoading(true);
    const result = await attemptLogout();
    if (result.success) navigate('home');
    setLoading(false);
  }

  return (
    <div className="flex flex-row justify-between h-16 min-h-16 p-2 bg-primary">
      <div className="flex-initial flex flex-col items-center justify-center h-full w-60">
        <p className="text-lg sm:text-xl rounded-lg p-2">Letter Exchange</p>
      </div>
      <input type="checkbox" value="dark" className="toggle theme-controller" />
      <div className="flex-initial h-full w-46">
        {loggedDetails.logged ? 
        <div className="flex justify-between items-center h-full w-full">
          <button className="btn" onClick={() => navigate(`/profile/${loggedDetails.id}`)}>Profile</button>
          <button className="btn" onClick={() => logout()}>Sign out</button>
        </div> :
        <div className="flex justify-between items-center h-full w-full">
          <button className="btn" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn" onClick={() => navigate('/register')}>Register</button>
        </div>}
      </div>
    </div>
  )
}

export default Navbar;