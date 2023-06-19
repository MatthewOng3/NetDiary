import { Col, FloatingLabel, Form, Alert } from "react-bootstrap";
import '../styles/FeedbackPage.css'
import EmailIcon from '@mui/icons-material/Email';
import DiaryNavbar from "../components/DiaryNavbar";
import { Colors } from "../constants/Colors";
import { FiSend } from "react-icons/fi"
import emailjs from '@emailjs/browser';
import { useRef, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

/**
 * @description Feedback page
 * @path /feedback
 * @returns 
 */
function FeedbackPage() {

    const form = useRef();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loadingFeedbackState, setLoadingFeedbackState] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)

    //Send feedback as email to net diary company email using email js
    function sendFeedback(event) {
        event.preventDefault();
        setLoadingFeedbackState(true)
        emailjs.sendForm('service_m4gfd0i', 'template_81jnrd8', form.current, 's17CG3AO-Qrx9D-mZ')
            .then((result) => {
                setFullName('');
                setEmail('');
                setMessage('');
                setLoadingFeedbackState(false)
                setShowSuccessAlert(true)
            }, (error) => {
                setLoadingFeedbackState(false)
                alert("Error submitting feedback")
            });
    };

    return (
        <>
            <DiaryNavbar diaryPage={false} />
            <div className="root" style={{ backgroundColor: Colors.dark_grey200 }}>
                <div className="feedback-container" >
                    <div className="p-4  bg-slate-200  rounded-lg w-4/12 fill">
                        <Form autoComplete="off" onSubmit={sendFeedback} ref={form}>
                            <div className="flex justify-center align-middle">
                                <EmailIcon fontSize="large" sx={{ scale: '2' }} />
                            </div>
                            <div className="text-black text-center mb-4">
                                <h3 className="mt-3">FEEDBACK FORM</h3>
                                <p className="text-primary-text">
                                    Thanks for trying my product out! The service is still in beta, but I am working hard to constantly make my service better!
                                    I truly value your feedback on any issues or suggestions and appreciate your patience as this grows and more features are added.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Col md={6}>
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
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel label="Type" className="dense mb-3">
                                        <Form.Select name="type" placeholder="Type">
                                            <option value="Suggestion">Suggestion</option>
                                            <option value="Bug Report">Bug Report</option>
                                            <option value="Others">Others</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </div>
                            <FloatingLabel label="Email address" className="dense has-icon mb-3">
                                <Form.Control
                                    name="email_id"
                                    type="email"
                                    placeholder="yourName@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <div className="flex justify-center flex-col">
                                <button
                                    className="px-4 py-2 flex items-center gap-2 rounded-2xl text-blue-400 hover:text-white  border-2 border-blue-500 hover:bg-blue-600 "
                                >
                                    {loadingFeedbackState ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" className="ml-3" />
                                    ) : ("")}
                                    Send
                                    <FiSend />
                                </button>
                                <Alert show={showSuccessAlert} variant="info" className="mt-2">
                                    Feedback Form Sent!
                                </Alert>
                            </div>
                        </Form>

                    </div>
                </div>
            </div>

        </>

    );
}

export default FeedbackPage;