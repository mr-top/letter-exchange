import { useContext, useState, useEffect } from "react";

import { UserContext } from './utils/UserContext';

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Friends () {
  const {loggedDetails} = useContext(UserContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends () {
      const result = await axiosFetch(axios.post, '/friends', {id: loggedDetails.id});
      if (result.success) {
        setFriends(result.friends);
      }
    }
    fetchFriends();
  }, []);

  return (
    <>
      {friends.map(friend => <li key={friend.id}>
        {friend.username}
      </li>)}
    </>
  )
}

export default Friends;