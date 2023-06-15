import "../styles/ContactPage.css";
import Navbar from "../components/Navbar";
import { FloatingLabel, Form, Alert } from "react-bootstrap";
import { FiSend } from "react-icons/fi"
import emailjs from '@emailjs/browser';
import { useRef, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

/**
 * @description Contact us page that allows users to contact us through the company email
 * @path /contact
 */
function ContactPage() {

  const form = useRef();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loadingEmailState, setLoadingEmailState] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  /**
   * @description Send contact form to net diary company email 
   * @param {*} event 
   */
  function sendEmail(event) {
    event.preventDefault();
    setLoadingEmailState(true)
    emailjs.sendForm('service_m4gfd0i', 'template_z3c2388', form.current, 's17CG3AO-Qrx9D-mZ')
      .then((result) => {
        alert("Form submitted!")
        setFullName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setLoadingEmailState(false)
        setShowSuccessAlert(true)
      }, (error) => {
        setLoadingEmailState(false)
        alert("Error submitting form")
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
          <Form autoComplete="off" className="flex flex-col" onSubmit={sendEmail} ref={form}>
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Email" className="dense mb-3">
                <Form.Control
                  name="email_id"
                  type="email"
                  placeholder="yourName@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FloatingLabel>
            </div>
            <FloatingLabel label="Subject" className="dense has-icon mb-3">
              <Form.Control
                name="subject"
                type="subject"
                placeholder="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel label="Message" className="dense mb-3">
              <Form.Control
                as="textarea"
                name="message"
                placeholder="Message"
                style={{ height: 100 }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FloatingLabel>

          </Form>
          <div className="w-full flex items-center justify-center mt-6 flex-col">
            <button
              className="px-4 py-2 flex items-center gap-2 rounded-3xl text-blue-400 hover:text-white  border-2 border-blue-500 hover:bg-blue-600" onClick={sendEmail}
            >
              <FiSend />
              Send
              {loadingEmailState ? (
                <Spinner as="span" animation="border" size="sm" role="status" className="ml-3" />
              ) : ("")}
            </button>
            <Alert show={showSuccessAlert} variant="info" className="mt-2">
              Contact Form Sent!
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
