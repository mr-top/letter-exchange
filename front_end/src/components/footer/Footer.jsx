import { Link } from "react-router-dom";

function Footer (){
  return (
    <div className="flex flex-col space-y-4 p-2 sm:flex-row sm:justify-around w-full min-h-40 bg-primary text-primary-content border-t-1 border-base-content">
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Navigation</h2>
        <Link to='/intro'><p>Introduction</p></Link>
        <Link to='/home'><p>Home</p></Link>
        <Link to='/login'><p>Login</p></Link>
        <Link to='/register'><p>Register</p></Link>
      </ul>
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Usage Policy</h2>
        <Link to='/general'><p>General policies</p></Link>
        <Link to='/privacy'><p>Privacy policies</p></Link>
      </ul>
      <ul className="flex-initial">
        <h2 className="font-bold opacity-75">Support</h2>
        <Link to='/contact'><p>Contact us</p></Link>
        <Link to='/feedback'><p>Offer feedback</p></Link>
      </ul>
    </div>
  )
}

export default Footer;