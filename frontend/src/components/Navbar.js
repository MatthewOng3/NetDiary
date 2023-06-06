import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { VscThreeBars } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { Colors } from '../constants/Colors'

function Navbar() {
  const [isclose, setIsclose] = useState(false);

  return (
    <div
      style={{ background: Colors.navbar }}
      className="w-full flex items-center justify-center"
    >
      <div className="w-full pr-4 pl-4">
        <div className={!isclose ? "flex items-center justify-between  w-full" : "flex flex-col items-center  w-full"}>
          <a className="navbar-brand" href="/">
            <img src="images/Logo1.png" alt="" className="w-20 lg:w-32 " style={{height: '50px'}}/>
          </a>
          <div className={ !isclose ?" hidden lg:flex items-center gap-3" : " flex items-center flex-col gap-3 mt-3"}>
            <Link
              className="text-gray-50 text-sm hover:text-blue-500"
              aria-current="page"
              to="/"
            >
              Home
            </Link>
            <Link
              className=" text-gray-50 text-sm hover:text-blue-500"
              to="/feedback"
            >
              Feedback
            </Link>
            <Link
              className=" text-gray-50 text-sm hover:text-blue-500"
              to="/contact"
            >
              Contact Us
            </Link>
            <Link className="text-gray-50 text-sm  hover:text-blue-500" to="/login">
              Log In
            </Link>
            <Link
              className="text-white px-3 py-2 rounded-md flex items-center justify-center text-sm"
              to="/register"
              style={{backgroundColor: Colors.light_purple100}}
            >
              Register
            </Link>
          </div>
          <div className="block lg:hidden pb-2 mt-3">
            {isclose === false ? (
              <VscThreeBars onClick={()=>setIsclose(true)} className="w-5 h-5 cursor-pointer text-white" />
            ) : (
              <MdClose onClick={()=>setIsclose(false)} className="w-5 h-5 cursor-pointer text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
