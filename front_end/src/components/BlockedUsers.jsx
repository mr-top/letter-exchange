import { useState, useEffect } from "react";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function BlockedUsers({ id, setChangeStatus, usersToRemove, setUsersToRemove}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const result = await axiosFetch(axios.post, '/blockedlist', { id });

      if (result.success) {
        setUsers(result.list);
      }
    }

    fetchUsers();
  }, []);

  function removeUser (id) {
    if (usersToRemove.includes(id)) {
      setUsersToRemove(prev => {
        return prev.slice(prev.indexOf(id) - 1, prev.indexOf(id));
      });
    } else {
      setUsersToRemove(prev => {return [...prev, id]});
    }

    setChangeStatus(prev => {return {...prev, blockedListChanged: true}});
  }

  return (
    users.map(user => <div className='w-full flex p-2' key={user.id}>
      <button className="btn basis-3/4">{user.username}</button>
      <button className={`btn basis-1/4 ${usersToRemove.includes(user.id) ? 'btn-success' : 'btn-warning'}`} onClick={() => removeUser(user.id)}>X</button>
    </div>)
  )
}

export default BlockedUsers;