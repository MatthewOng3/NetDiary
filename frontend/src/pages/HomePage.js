
import Navbar from "../components/Navbar";
import Main from "../components/homepage/Main";
import {Helmet} from "react-helmet";
import Features from "../components/homepage/Features";
import Footer from "../components/Footer";
import HowWorks from "../components/homepage/HowWorks";
import Learn from "../components/homepage/Learn";
import Comparison from "../components/homepage/Comparison";

/**
 * @description Home page of website detailing features etc
 * @author Matt
 * @access public
 * @path /
 */
function HomePage(){
    return(
        <>
            <Helmet>
                <meta name="viewport" content="width=device-width" initial-scale="1.00" maximum-scale="1.0" />
                <title>Organize and share your favourite websites in one place with our user-friendly platform.</title>
            </Helmet>
            <Navbar/>
            <div style={{height: '100vh', overflow: 'scroll'}}>
                <Main/>
                <Features/>
                <Comparison/>
                <HowWorks/>
                <Learn/>
                <Footer/>
            </div>
        </>
    )
}

export default HomePage;