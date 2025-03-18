import { useState } from "react";

import checkTime from "../utils/checkTime";

function Letters({ setLookup, lookup, letters, loggedDetails }) {
  const [currentLetter, setCurrentLetter] = useState({});

  function openLetter(letter) {
    setCurrentLetter(letter);
    document.getElementById('letter-modal').showModal();
  }

  function replyLetter(userId) {
    const previousLookup = lookup;
    setLookup({ method: 'friend', id: userId });
    document.getElementById('compose_modal').showModal();

    function closeEvent() {
      setLookup(previousLookup);
      document.getElementById('compose_modal').removeEventListener('close', closeEvent);
    }

    document.getElementById('compose_modal').addEventListener('close', closeEvent)
}

return (
  <>
    {letters.map(letter => {
      const letterDisabled = checkTime(letter.arrival_date);
      letter.posted_date = new Date(letter.posted_date).toLocaleString();
      return (
        <button key={letter.id} className="btn w-32 h-20 btn-neutral" onClick={() => openLetter(letter)} disabled={letterDisabled}>
          <p>Basic Letter</p>
          <p>{letter.posted_date}</p>
        </button>
      )
    })}
    <dialog id="letter-modal" className="modal">
      <div className="modal-box">
        <h2 className="text-md">To: {currentLetter.recipient_username || 'Everyone'}</h2>
        <h2 className="text-md">From: {currentLetter.sender_username}</h2>
        <h2 className="text-md">Posted date: {currentLetter.posted_date}</h2>
        <p>{currentLetter.content}</p>
        <div className="modal-action">
          {currentLetter.sender_id === loggedDetails.id || <button className="btn btn-accent" onClick={() => replyLetter(currentLetter.sender_id)}>Reply</button>}
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </>
)
}

export default Letters;