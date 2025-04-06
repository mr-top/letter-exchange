import { useState } from "react";

import checkTime from "../utils/checkTime";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Letters({ setLookup, lookup, letters, loggedDetails }) {
  const [currentLetter, setCurrentLetter] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  async function deleteLetter(letterId) {
    setDeleteLoading(true);

    const result = await axiosFetch(axios.post, '/deleteletter', {letterId});

    if (result.success) {
      document.getElementById('delete_modal').close()
      document.getElementById('letter-modal').close()

      setLookup(prev => {return {...prev}})
    }

    setDeleteLoading(false);
  }

  return (
    <>
      {letters.map(letter => {
        const letterDisabled = checkTime(letter.arrival_date);
        letter.posted_date = new Date(letter.posted_date).toLocaleString();
        return (
          <button key={letter.id} className="btn w-40 h-24 flex flex-col px-2 py-1 bg-yellow-50" onClick={() => openLetter(letter)} disabled={letterDisabled}>
            <div className="flex-5/12 flex justify-between items-center w-full text-primary-content">
              <div className="flex-initial border-1 border-black rounded-2xl w-12 h-8">
                <p className="text-[9px]">{letter.sender_country}</p>
                <p className="text-[7px]">Post office</p>
              </div>
              <div className="flex-initial border-1 border-black bg-yellow-200 w-6 h-8">

              </div>
            </div>
            <div className="flex-7/12 flex justify-end items-center w-full text-primary-content">
              <div className="w-20 h-10">
                <p className="text-[10px]">{letter.recipient_username} {letter.recipient_id}</p>
              </div>
            </div>
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
            {currentLetter.sender_id === loggedDetails.id ? <button className="btn btn-error" onClick={() => document.getElementById('delete_modal').showModal()}>Delete letter</button> : <button className="btn btn-accent" onClick={() => replyLetter(currentLetter.sender_id)}>Reply</button>}
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <dialog id="delete_modal" className='modal'>
          <div className="modal-box">
            <h2 className="text-md">Deleting a letter</h2>
            <p className="text-sm">Are you sure you want to delete this letter?</p>
            <div className="modal-action">
              <button onClick={() => deleteLetter(currentLetter.id)} className="btn btn-error" disabled={deleteLoading}>Confirm</button>
              <button onClick={() => document.getElementById('delete_modal').close()} className="btn">Close</button>
            </div>
          </div>
        </dialog>
      </dialog>
    </>
  )
}

export default Letters;