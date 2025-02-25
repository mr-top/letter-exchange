import { useContext } from "react";

import { UserContext } from "../utils/UserContext";

function Navbar () {
  const {loggedDetails} = useContext(UserContext);

  return (
    <div className="flex flex-row justify-between h-16 min-h-16 p-2 bg-red-700">
      <div className="flex-initial flex flex-col items-center justify-center h-full w-60 bg-green-400">
        <p className="text-lg sm:text-xl">Letter Exchange</p>
      </div>
      <div className="flex-initial h-full w-46 bg-blue-600">
        {loggedDetails.logged ? 
        <div className="h-full w-full bg-pink-400">
          <button className="btn">Profile</button>
          <button className="btn">Sign out</button>
        </div> :
        <div className="flex flex-row justify-between items-center h-full w-full bg-slate-400">
          <button className="btn">Log in</button>
          <button className="btn">Register</button>
        </div>}
      </div>
    </div>
  )
}

export default Navbar;