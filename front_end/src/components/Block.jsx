import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "./utils/UserContext";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Block({profile, setLookup}) {
  const navigate = useNavigate();
  const { loggedDetails } = useContext(UserContext);
  const [display, setDisplay] = useState({}); 
  const [loading, setLoading] = useState(false);

  async function block () {
    setLoading(true);

    const result = await axiosFetch(axios.post, '/block', {sourceId: loggedDetails.id, targetId: profile.id});
    if (result.success) {
      setDisplay({success: true, msg: 'Blocked successfully'});
      setLookup({method: 'open', id: loggedDetails.id});
      navigate('/home');
    } else {
      setDisplay({success: false, msg: 'Blocking failed'});
    }

    setLoading(false);
  }

  return (
    <dialog id="block_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Block {profile.username}</h3>
        <p className="py-4">Are you sure you want to block this person?</p>
        {typeof display.success === 'boolean' && <p className={`${display.success ? 'text-success' : 'text-error'}`}>{display.msg}</p>}
        <div className="modal-action">
        <button className="btn" onClick={block} disabled={loading}>Block</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Block;