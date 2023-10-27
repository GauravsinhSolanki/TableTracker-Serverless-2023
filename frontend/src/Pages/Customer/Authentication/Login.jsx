import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './firebase.js';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { theme } from '../../../theme.jsx'
import { Flex} from '@chakra-ui/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    let navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                sessionStorage.setItem("userDetails",email);
                navigate('/restaurantList'); 
            })
            .catch((error) => {
                setError("Invalid credentials");
            });
    };

    const signInWithGoogle = () => {
      signInWithPopup(auth, provider).then((result) => {
        sessionStorage.setItem("userDetails",true)
        navigate('/restaurantList'); 
      }).catch(error => {
      })
    };

    return (
      <Flex w="100%" minHeight="90vh"  flexDir="column" alignItems="center" justifyContent="start">
        <main className="form-signin w-100 m-auto" >
            <form onSubmit={signIn}>
                <h1 className="h3 mb-3 fw-normal" style={{color: theme.secondaryBackground}}>Please sign in</h1>

                {error && <p style={{color:"red"}}>{error}</p>}

                <div className="form-floating">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email address</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(p) => setPassword(p.target.value)}
                    />
                    <label>Password</label>
                </div>
                <button className="btn w-100 py-2" style={{backgroundColor:theme.primaryBackground}} type="submit">
                    Sign in
                </button>
            </form>

            <button className='google-btn' onClick={signInWithGoogle}>
              <span>
                <img
                    className="google-icon"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    alt="google-icon"/>
                <p className="btn-text">Sign in with Google</p>
              </span>
            </button>
        </main>
        </Flex>
    );
};

export default Login;
