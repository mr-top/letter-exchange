import { createContext, useContext, useState, useEffect } from "react";

const LetterHistoryContext = createContext();

import { UserContext } from "./UserContext";
import axios from "axios";
import axiosFetch from "../../utils/axiosFetch";

function LetterHistoryProvider(props) {
  const { loggedDetails } = useContext(UserContext);
  const [lookup, setLookup] = useState({ method: 'open', id: loggedDetails.id });
  const [sort, setSort] = useState({ method: 'all' });
  const [letters, setLetters] = useState([]);
  const [allLetters, setAllLetters] = useState(letters);

  useEffect(() => {
    const localLookup = lookup;
    async function fetchLetters() {
      if (localLookup.method === 'open') localLookup.id = loggedDetails.id;
      const result = await axiosFetch(axios.post, '/letters', localLookup);
      if (result.success) {
        setAllLetters(result.letters);
      }
    }
    fetchLetters();
  }, [lookup, loggedDetails]);

  useEffect(() => {
    setLetters(allLetters);
  }, [allLetters])

  useEffect(() => {
    let sortedLetters = allLetters;
    sortedLetters = sortedLetters.filter(letter => {
      if (sort.method === 'own') {
        return letter.sender_id === loggedDetails.id;
      } else if (sort.method === 'friend') {
        if (lookup.method === 'open') {
          return letter.sender_id !== lookup.id && letter.recipient_id === null;
        } else {
          return letter.sender_id === lookup.id;
        }
      } else {
        return true;
      }
    });

    setLetters(sortedLetters);
  }, [sort]);

  return (
    <LetterHistoryContext.Provider value={{ setLookup, setSort, letters, lookup }}>
      {props.children}
    </LetterHistoryContext.Provider>
  )
}

export { LetterHistoryContext, LetterHistoryProvider }