import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function RejectButton({ setFriendsRefresh, setLookup, lookup, loggedDetails }) {

  async function rejectUser() {
    if (lookup.newFriend) {
      const sourceId = loggedDetails.id;
      const targetId = lookup.id;

      const result = await axiosFetch(axios.post, '/reject', { sourceId, targetId });

      if (result.success) {
        setFriendsRefresh(prev => !prev);
        setLookup({ method: 'open', id: loggedDetails.id });
      }
    }
  }

  return (
    <>
      <button className="btn flex-initial w-35 btn-warning" onClick={() => document.getElementById('delete_modal').showModal()}>Reject</button>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <p className="py-4">Are you sure you want to delete this user?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={rejectUser}>Yes</button>
              <button className="btn">No</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default RejectButton;