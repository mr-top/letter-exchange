import { useContext, useState, useEffect } from "react";

import { UserContext } from './utils/UserContext';

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Friends (props) {
  const {setLookup} = props;
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
      {friends.map((friend, idx) => <li key={friend.friend_id} onClick={() => setLookup({method: 'friend', id: friend.friend_id})}>
        <button className={`btn w-full ${idx % 2 === 0 ? 'bg-secondary' : 'bg-accent'}`}>
          {friend.username}
        </button>
      </li>)}
    </>
  )
}

export default Friends;