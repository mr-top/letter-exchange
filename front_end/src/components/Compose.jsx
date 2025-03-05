import { useState } from "react";
import ConfirmCompose from "./ConfirmCompose";

function Compose() {
  const [letterContent, setLetterContent] = useState('');

  return (
    <dialog id="letter_modal" className="modal">
      <div className="modal-box">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Letter: Required (must follow guidelines)</legend>
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
        <div className="modal-action">
          <button className="btn btn-primary" onClick={() => document.getElementById('send_modal').showModal()}>Send letter</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      <ConfirmCompose letterContent={letterContent}/>
    </dialog>
  )
}

export default Compose;