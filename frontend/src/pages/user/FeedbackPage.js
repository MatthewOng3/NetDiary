import { Col, FloatingLabel, Form } from "react-bootstrap";
import '../../styles/FeedbackPage.css'
import EmailIcon from '@mui/icons-material/Email';
import DiaryNavbar from "../../components/DiaryNavbar";
import { Colors } from "../../constants/Colors";
import {FiSend} from "react-icons/fi"
import emailjs from '@emailjs/browser';
import { useRef } from "react";

function FeedbackPage() {

    const form = useRef();
    //Send feedback as email to net diary company email using email js
    function sendFeedback(event){
        event.preventDefault();

        emailjs.sendForm('service_m4gfd0i', 'template_81jnrd8', form.current, 's17CG3AO-Qrx9D-mZ')
            .then((result) => {
                alert("Feedback submitted!")
            }, (error) => {
                alert("Error submitting feedback")
            });

    };
    
    return (
        <body>
            <DiaryNavbar diaryPage={false}/>
            <div className="feedback-container" style={{backgroundColor: Colors.dark__blue200}}>
                <div className="p-4  bg-slate-200  rounded-lg w-4/12 fill">
                    <Form autoComplete="off" onSubmit={sendFeedback}  ref={form}>
                        <div className="flex justify-center align-middle">
                            <EmailIcon fontSize="large" sx={{scale: '2'}}/>
                        </div>
                        <div className="text-black text-center mb-4">
                            <h3 className="mt-3">FEEDBACK FORM</h3>
                            <p className="text-primary-text">
                            Thanks for trying us out! We're still in beta as a new company, and we are working hard to constantly make our service better. 
                            We value your feedback ony any issues or suggestions and appreciate your patience as we grow.
                            </p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}> 
                            <Col md ={6}>
                                <FloatingLabel label="Full Name" className="dense mb-3">
                                    <Form.Control
                                    name="from_name"
                                    type="text"
                                    placeholder="FullName"
                                    autoComplete="off"
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
                        <div className="flex justify-center">
                            <button
                            className="px-4 py-2 flex items-center gap-2 rounded-2xl text-blue-400 hover:text-white  border-2 border-blue-500 hover:bg-blue-600 "
                            >
                            Send
                            <FiSend/>
                        </button>
                    </div>
                    </Form>
                    
                </div>
            </div>
        </body>
        
    );
}

export default FeedbackPage;