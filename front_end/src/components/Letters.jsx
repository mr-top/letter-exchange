import { useState } from "react";

import checkTime from "../utils/checkTime";

function Letters({ letters }) {
  const [currentLetter, setCurrentLetter] = useState({});

  function openLetter(letter) {
    setCurrentLetter(letter);
    document.getElementById('letter-modal').showModal();
  }

  return (
    <>
      {letters.map(letter => {
        const letterDisabled = checkTime(letter.arrival_date);
        letter.posted_date = new Date(letter.posted_date).toLocaleString();
        return (
          <button key={letter.id} className="btn w-32 h-20 bg-red-400" onClick={() => openLetter(letter)} disabled={letterDisabled}>
            <p>Basic Letter</p>
            <p>{letter.posted_date}</p>
          </button>
        )
      })}
      <dialog id="letter-modal" className="modal">
        <div className="modal-box">
          <h2 className="text-md">To: RECIPIENT_NAME</h2>
          <h2 className="text-md">From: SENDER_NAME</h2>
          <h2 className="text-md">Posted date: {currentLetter.posted_date}</h2>
          <p>{currentLetter.content}</p>
          <div className="modal-action">
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