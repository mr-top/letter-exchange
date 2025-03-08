import checkTime from "../utils/checkTime";

function Letters ({letters}) {
  return (
    <>
      {letters.map(letter => 
      
      <button key={letter.id} className="btn w-40 h-20 bg-red-400" disabled={checkTime(letter.arrival_date)}>
        <p>{letter.content}</p>
      </button>)}
    </>
  )
}

export default Letters;