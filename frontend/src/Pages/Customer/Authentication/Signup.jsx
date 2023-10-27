import { auth } from "./firebase.js";
import React, { useState } from "react";
import "./login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { theme } from "../../../theme.jsx";
import { showToastError, showToastSuccess } from '../../../Components/Toast.js'; 

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToastError("Password should be at least 6 characters long"); 
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        sessionStorage.setItem("userDetails", email);
        showToastSuccess("Login Successful")
        navigate("/user/login");
      })
      .catch((error) => {
        showToastError(error.code); 
      });
  };

  return (
    <Flex
      w="100%"
      minHeight="90vh"
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      <main className="form-signin w-100 m-auto">
        <form onSubmit={signUp}>
          <h1
            className="h3 mb-3 fw-normal"
            style={{ color: theme.secondaryBackground }}
          >
            Sign up
          </h1>
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

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
          <button
            className="btn w-100 py-2"
            style={{ backgroundColor: theme.primaryBackground }}
            type="submit"
          >
            Sign up
          </button>
        </form>
      </main>
    </Flex>
  );
};

export default SignUp;
