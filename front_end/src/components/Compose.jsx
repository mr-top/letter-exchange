import { useContext, useState, useEffect } from "react";
import ConfirmCompose from "./ConfirmCompose";

import { UserContext } from "./utils/UserContext";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Compose({setLookup, lookup}) {
  const { loggedDetails } = useContext(UserContext);
  const [letterContent, setLetterContent] = useState('');
  const [targetId, setTargetId] = useState(lookup.id);
  const [estimate, setEstimate] = useState('X');

  useEffect(() => {
    setTargetId(lookup.id);
  }, [lookup.id]);

  useEffect(() => {
    setLetterContent('');
    async function getEstimate () {
      const result = await axiosFetch(axios.post, '/estimate', {sourceId: loggedDetails.id, targetId});
      if (result.success) {
        setEstimate(result.hours);
      }
    }

    getEstimate();
  }, [targetId])

  return (
    <dialog id="compose_modal" className="modal">
      <div className="modal-box">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Letter: Required (must follow guidelines) ({`${letterContent.length} / 3000`})</legend>
          <textarea className="textarea w-full h-24" placeholder="..." value={letterContent} onChange={e => setLetterContent(e.currentTarget.value)}></textarea>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Length: optional</legend>
          <select defaultValue="Pick a length" className="select w-35">
            <option disabled={true}>Pick a length</option>
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
        </fieldset>
        <p>This letter will be delivered in {estimate} hours</p>
        <p>{lookup.blocked && 'You are blocked by this person'}</p>
        <div className="modal-action">
          <button disabled={lookup.blocked} className="btn btn-primary" onClick={() => document.getElementById('send_modal').showModal()}>Send letter</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      <ConfirmCompose setLookup={setLookup} manifest={{sourceId: loggedDetails.id, targetId, letterContent}}/>
    </dialog>
  )
}

export default Compose;