import { auth, app } from './firebase.js'
import React, { useState } from 'react';
import "./login.css"
import { createUserWithEmailAndPassword } from 'firebase/auth';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth,email,password)
        .then(userCredential => {
            console.log(userCredential)
        }).catch(error => {
            console.log(error);
        })
    }

    return (
<main className="form-signin w-100 m-auto">
  <form onSubmit={signUp}>
    <h1 className="h3 mb-3 fw-normal">Sign up</h1>

    <div className="form-floating">
      <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={(e)=> setEmail(e.target.value)}/>
      <label>Email address</label>
    </div>
    <div className="form-floating">
      <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
      value={password} onChange={(p) => setPassword(p.target.value)}/>
      <label >Password</label>
    </div>
    <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
  </form>
</main>
    )
};

export default SignUp;