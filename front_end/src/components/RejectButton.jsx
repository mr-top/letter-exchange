import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function RejectButton ({setFriendsRefresh, lookup, loggedDetails}) {

  async function rejectUser () {
    if (lookup.newFriend) {
      const sourceId = loggedDetails.id;
      const targetId = lookup.id;
      
      const result = await axiosFetch(axios.post, '/reject', {sourceId, targetId});

      if (result.success) {
        setFriendsRefresh(prev => !prev);
      }
    }
  }

  return (
    <button className="btn flex-initial w-35 btn-warning" onClick={rejectUser}>Reject</button>
  )
}

export default RejectButton;