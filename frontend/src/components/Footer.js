import '../styles/Footer.css'
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit'; //Using MDB



function Footer(){
    return(
        <section className='footer-container resize-outer'>
            <div className='inner-container '>
                <MDBFooter bgColor='light' className='text-center text-lg-start text-muted w-full'>
                    <section className='d-flex justify-content-center   p-4 border-bottom'>
                        <div className='me-5 d-none d-lg-block'>
                            <span>Coming soon to: </span>
                        </div>
                        <div >
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon color='secondary' fab icon='facebook-f' />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon color='secondary' fab icon='twitter' />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon color='secondary' fab icon='tiktok' />
                            </a>
                            <a href='' className='me-4 text-reset'>
                                <MDBIcon color='secondary' fab icon='instagram' />
                            </a>
                        </div>
                    </section>

                <section className=''>
                    <MDBContainer className='text-center text-md-start mt-5'>
                        <MDBRow className='mt-3'>
                        <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
                        <h6 className='text-uppercase fw-bold mb-4'>
                            <MDBIcon color='secondary' icon='gem' className='me-3' />
                            NetDiary
                        </h6>
                        </MDBCol>

                        {/* <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
                        <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
                        <p>
                            <a href='#!' className='text-reset'>
                            Angular
                            </a>
                        </p>
                        <p>
                            <a href='#!' className='text-reset'>
                            React
                            </a>
                        </p>
                        <p>
                            <a href='#!' className='text-reset'>
                            Vue
                            </a>
                        </p>
                        <p>
                            <a href='#!' className='text-reset'>
                            Laravel
                            </a>
                        </p>
                        </MDBCol> */}

                        <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
                        <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
                        <p>
                            <a href='#!' className='text-reset'>
                            Pricing
                            </a>
                        </p>
                        <p>
                            <a href='/register' className='text-reset'>
                            Sign Up
                            </a>
                        </p>
                        <p>
                            <a href='/feedback' className='text-reset'>
                            Feedback
                            </a>
                        </p>
                        <p>
                            <a href='/contact' className='text-reset'>
                            Help
                            </a>
                        </p>
                        </MDBCol>

                        <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                        <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                        <p>
                            <MDBIcon color='secondary' icon='home' className='me-2' />
                            Melbourne Australia
                        </p>
                        <p>
                            <MDBIcon color='secondary' icon='envelope' className='me-3' />
                            netdiary0@gmail.com
                        </p>
                         
                        </MDBCol>
                    </MDBRow>
                    </MDBContainer>
                </section>

                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
                    © 2023 Copyright:
                    <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
                    NetDiary.com
                    </a>
                </div>
                </MDBFooter>
            </div>
        </section>
        
    )
}

export default Footer;