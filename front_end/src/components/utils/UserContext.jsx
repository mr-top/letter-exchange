import { createContext, useState, useEffect } from "react";

import axios from "axios";
import axiosFetch from "../../utils/axiosFetch";

const UserContext = createContext();

function UserProvider (props) {
  const [loggedDetails, setLoggedDetails] = useState( JSON.parse(localStorage.getItem('loggedDetails')) || {logged: false});

  async function attemptLogin (username, password) {
    const result = await axiosFetch(axios.post, 'http://localhost:5555/login', {username, password});

    if (result.success) {
      const {username, id, avatar} = result;
      setLoggedDetails({logged: true, username, id, avatar});
      return {success: true, msg: 'Logged in successfully'}
    } else {
      return {success: false, msg: 'Not logged in'}
    }
  }

  useEffect(() => {
    localStorage.setItem('loggedDetails', JSON.stringify(loggedDetails));
  }, [loggedDetails]);
  return (
    <UserContext.Provider value={{loggedDetails, attemptLogin}}>
      {props.children}
    </UserContext.Provider>
  )
}

export {UserContext, UserProvider}