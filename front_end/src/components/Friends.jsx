import { useContext, useState, useEffect } from "react";

import { UserContext } from './utils/UserContext';

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Friends (props) {
  const {setLookup, friendsRefresh} = props;
  const {loggedDetails} = useContext(UserContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends () {
      const result = await axiosFetch(axios.post, '/friends', {id: loggedDetails.id});
      if (result.success) {
        const friends = result.friends;
        const sortedFriends = friends.sort((a, b) => {
          if (a.confirmed) {
            return 1;
          } else if (b.confirmed) {
            return -1;
          } else {
            return 0;
          }
        });
        setFriends(sortedFriends);
      }
    }
    
    fetchFriends();
  }, [friendsRefresh]);

  return (
    <>
      {friends.map((friend, idx) => <li key={friend.friend_id} onClick={() => setLookup({method: 'friend', id: friend.friend_id, newFriend: !friend.confirmed, blocked: friend.blocked})}>
        <button className={`btn w-full ${idx % 2 === 0 ? 'btn-secondary' : 'btn-accent'} ${friend.confirmed || 'opacity-75'}`}>
          {friend.username}
        </button>
      </li>)}
    </>
  )
}

export default Friends;