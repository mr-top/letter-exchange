function Intro() {
  return (
    <div className="flex justify-center min-h-120 w-full p-4">
      <div className="max-w-100 space-y-2">
        <h2 className="text-xl">Hello!</h2>
        <div>
          <p className="text-lg">Introduction</p>
          <p>This is a personal project web app made by me and works similarly to Slowly. I had lots of development ideas but unfortunatly had to halt the entire thing as it was getting quite messy. But it's been a great learning opportunity for me and i'll use what i've learned here to develop better applications later in my career.</p>
        </div>
        <div>
          <p className="text-lg">What is it?</p>
          <p>Basically, it's a letter exchange app where you can send & receive letters from your penpals. There is a travel time when a letter is sent depending on senders and recipients location for authentic pen palling experience.</p>
        </div>
        <div>
          <p className="text-lg">Basic rules and guidelines</p>
          <p>Although i will just put this site up and leave to do other projects. Please remember to be human.</p>
          <p>Have common sense and don't write things that you don't want other people to see.</p>
        </div>
        <div>
          <p className="text-lg">Your data</p>
          <p>Cookie is used with your browser for the server to identify you. Along with this, everything you put up on our site is held in our database. Including but not limited to your registration details and personal letters to people.</p>
          <p>Every effort has been made to secure your data but as I am not a professional developer, please be vigilant with the data you put up on this site.</p>
        </div>
        <div>
          <p className="text-lg">Contact me / offer feedback</p>
          <p>Please email me at <p className="font-semibold">tserenlkhagvaganbold@gmail.com</p> for any concern / questions and feedback.</p>
        </div>
        <p className="text-lg">Thank you</p>
      </div>
    </div>
  )
}

export default Intro;