import { createContext, useContext, useState, useEffect } from "react";

const LetterHistoryContext = createContext();

import { UserContext } from "./UserContext";
import axios from "axios";
import axiosFetch from "../../utils/axiosFetch";

function LetterHistoryProvider (props) {
  const {loggedDetails} = useContext(UserContext);
  const [lookup, setLookup] = useState({method: 'open', id: loggedDetails.id});
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const localLookup = lookup;
    async function fetchLetters () {
      if (localLookup.method === 'open') localLookup.id = loggedDetails.id;
      const result = await axiosFetch(axios.post, '/letters', localLookup);
      if (result.success) {
        setLetters(result.letters);
      }
    }
    fetchLetters();
  }, [lookup]);

  return (
    <LetterHistoryContext.Provider value={{setLookup, letters}}>
      {props.children}
    </LetterHistoryContext.Provider>
  )
}

export {LetterHistoryContext, LetterHistoryProvider}