import { createContext, useState, useEffect } from "react";

import axios from "axios";
import axiosFetch from "../../utils/axiosFetch";

const UserContext = createContext();

function UserProvider (props) {
  const [loggedDetails, setLoggedDetails] = useState( JSON.parse(localStorage.getItem('loggedDetails')) || {logged: false});

  async function attemptLogin (username, password) {
    const result = await axiosFetch(axios.post, '/login', {username, password});

    if (result.success) {
      setLoggedDetails({logged: true, ...result.details});
    } 

    return result;
  }

  async function attemptLogout () {
    if (loggedDetails.logged) {
      const {id} = loggedDetails;
      const result = await axiosFetch(axios.post, '/signout', {id});
      if (result.success) {
        setLoggedDetails({logged: false});
        return {success: true, msg: 'Logged out successfully'}
      } else {
        return {success: false, msg: 'Could not log out'}
      }
    } else {
      return {success: false, msg: 'Not Logged in initially'}
    }
  }

  useEffect(() => {
    localStorage.setItem('loggedDetails', JSON.stringify(loggedDetails));
  }, [loggedDetails]);
  return (
    <UserContext.Provider value={{loggedDetails, attemptLogin, attemptLogout}}>
      {props.children}
    </UserContext.Provider>
  )
}

export {UserContext, UserProvider}