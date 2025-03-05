import { useState } from "react";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function ConfirmCompose({letterContent}) {
  const [loading, setLoading] = useState(false);

  async function sendLetter () {
    setLoading(true);
    const result = await axiosFetch(axios.post, '/compose', {letterContent});
    if (result.success) {
      document.getElementById('letter_modal').close()
    } 
    setLoading(false);
  }

  return (
    <dialog id='send_modal' className="modal">
      <div className="modal-box">
        <p>Are you sure that you want to send this letter?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-primary" onClick={sendLetter} disabled={loading}>Confirm</button>
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmCompose;