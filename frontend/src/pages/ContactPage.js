import "../styles/ContactPage.css";
import Navbar from "../components/Navbar";
import { FloatingLabel, Form } from "react-bootstrap";
import {FiSend} from "react-icons/fi"
import emailjs from '@emailjs/browser';
import { useRef } from "react";
 
function ContactPage() {

  const form = useRef();
  //Send data to net diary company email
  function sendEmail(event){
      event.preventDefault();

      emailjs.sendForm('service_m4gfd0i', 'template_z3c2388', form.current, 's17CG3AO-Qrx9D-mZ')
          .then((result) => {
              alert("Feedback submitted!")
          }, (error) => {
              alert("Error submitting feedback")
          });
  };

  return (
    <div className=" min-h-screen " style={{ background: "#0c0c18" }}>
      <Navbar />
      <div className="contact-container min-h-screen flex items-center justify-center flex-col">
        <div
          className="px-4  rounded-2xl w-4/12 py-10 "
          style={{ background: "#18182f" }}
        >
          <Form autoComplete="off" className="flex flex-col" onSubmit={sendEmail}  ref={form}>
            <div className="text-center  mb-4">
              <h3 className="mt-3 text-white">CONTACT US</h3>
              <p className="text-sm text-white">
                Do you need more information or support? Please contact us to
                resolve any issues or to find out more about our products and
                services.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
              <FloatingLabel label="Full Name" className="dense mb-3">
                <Form.Control
                  name="from_name"
                  type="text"
                  placeholder="FullName"
                  autoComplete="off"
                />
              </FloatingLabel>
              <FloatingLabel label="Email" className="dense mb-3">
                <Form.Control
                  name="email_id"
                  type="email"
                  placeholder="yourName@gmail.com"
                />
              </FloatingLabel>
            </div>
            <FloatingLabel label="Subject" className="dense has-icon mb-3">
              <Form.Control
                name="subject"
                type="subject"
                placeholder="subject"
              />
            </FloatingLabel>
            <FloatingLabel label="Message" className="dense mb-3">
              <Form.Control
                as="textarea"
                name="message"
                placeholder="Message"
                style={{ height: 100 }}
              />
            </FloatingLabel>
            
          </Form>
          <div className="w-full flex items-center justify-center mt-6">
            <button
             className="px-4 py-2 flex items-center gap-2 rounded-3xl text-blue-400 hover:text-white  border-2 border-blue-500 hover:bg-blue-600" onClick={sendEmail}
            >
                <FiSend/>
             Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
