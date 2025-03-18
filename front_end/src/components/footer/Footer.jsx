function Footer (){
  return (
    <div className="flex flex-col space-y-4 p-2 sm:flex-row sm:justify-around sm:items-center w-full min-h-40 bg-primary font-primary">
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Navigation</h2>
        <p>Introduction</p>
        <p>Home</p>
        <p>Login</p>
        <p>Register</p>
      </ul>
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Usage Policy</h2>
        <p>General policies</p>
        <p>Privacy policies</p>
        <p>Fair treatment</p>
      </ul>
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Support</h2>
        <p>Contact us</p>
        <p>Offer feedback</p>
      </ul>
    </div>
  )
}

export default Footer;