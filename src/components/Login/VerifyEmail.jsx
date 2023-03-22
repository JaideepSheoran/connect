import React, {useState} from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import imgSrc from "../../assets/logo-google.png";
import connect from '../../assets/connect.png';
import { authenticate } from '../../helper/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';


const VerifyEmail = () => {
    const [email, setEmail] = useState('');


    const handleEmailPassRegister = (e) => {
        e.preventDefault();
        sendSignInLinkToEmail(authenticate, email, {
            url: 'http://localhost:3000/register/?email=' + email,
            handleCodeInApp: true,
        }).then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            window.alert(`Verification and SignIn Link Send to email ${email}`);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
    }


  return (
    <div className="login_page">
            <div className="login_box">
                <div className='login-logo'>
                    <img src={connect} alt="Logo" />
                </div>
                <div className='login-ep'>
                    <form onSubmit={handleEmailPassRegister}>
                        <input
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className='login-cred'
                            type="email"
                            value={email}
                            placeholder='Email' />

                        <button
                            className='login-btn'
                            type='submit'
                        >Send Email Link</button>
                    </form>
                </div>
                <div className='log-divider'><span>OR</span></div>
                <button><img src={imgSrc} />Sign in With Google</button>
                <div className='log-divider'><span>OR</span></div>
                <div className='login-reg'>
                    <p>Don't have an account ?</p><Link className='reg-link' to='/login'>Log in</Link>
                </div>
            </div>
        </div>
  )
}

export default VerifyEmail;