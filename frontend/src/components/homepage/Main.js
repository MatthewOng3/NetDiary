import "./Main.css";
 
import { Link } from "react-router-dom";
import { Colors } from "../../constants/Colors";

/**
 * @description Top part of the hompage 
 * @author Matt
 * @access public
 * @path /
 */
function Main() {
  //Scroll to features section when clicking learn more
  function scrollToFeatures() {
    const element = document.getElementById("howWorks");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section style={{background: 'white', overflow: 'hidden'}} className="w-full lg:min-h-screen flex py-20 lg:py-0 items-center justify-center">
      <div className=" container">
      <div className=" grid grid-cols-1 lg:grid-cols-5 items-center gap-6 ">
      <div className="lg:col-span-2">
          <h1
           className="text-2xl lg:text-5xl text-zinc-900 w-full" 
          >
            Organize and share your favourite <br /> websites in  one place with <br /> our free
            user-friendly <br /> platform.
          </h1>
          <h5
            className="pt-2 text-sm lg:text-base text-white" style={{fontSize: '18px'}}
          >
            Categorize your webpages by topic or purpose, making it even <br /> quicker
            to find what you need, when you need it.
          </h5>
          <div className="mt-8 flex items-center gap-3">
      
            <Link to="/register"
               className="px-9 hover:bg-transparent text-gray-50 hover:text-blue-400 py-2 rounded-3xl  border-2 border-blue-500 bg-blue-500 hover:bg-blue-600"
              >
                Sign Up
              </Link>
            <button
             className="px-8 py-2 rounded-3xl text-orange-400 hover:text-white  border-2 border-orange-500 hover:bg-orange-600" onClick={scrollToFeatures}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className=" w-full flex items-center lg:col-span-3 justify-center">
          <img  src="images/test.jpg" class=" w-full rounded-3xl" />
        </div>
      </div>
      </div>
    </section>
  );
}

export default Main;
