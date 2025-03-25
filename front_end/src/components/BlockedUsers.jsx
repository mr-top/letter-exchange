import { useState, useEffect } from "react";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function BlockedUsers ({id}) {
  const [users, setUsers] = useState([]);
  const [usersToRemove, setUsersToRemove] = useState([]);

  useEffect(() => {
    async function fetchUsers () {
      const result = await axiosFetch(axios.post, '/blockedlist', {id});

      if (result.success) {
        setUsers(result.list);
      }
    }

    fetchUsers();
  }, []);

  return (
    users.map(user => <p onClick={() => setUsersToRemove(prev => {return [...prev, users.id]})}>{user.username}</p>)
  )
}

export default BlockedUsers;