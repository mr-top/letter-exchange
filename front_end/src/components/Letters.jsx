function Letters ({letters}) {
  return (
    <>
      {letters.map(letter => <div key={letter.id} className="w-40 h-20 bg-red-400">
        <p>{letter.content}</p>
      </div>)}
    </>
  )
}

export default Letters;