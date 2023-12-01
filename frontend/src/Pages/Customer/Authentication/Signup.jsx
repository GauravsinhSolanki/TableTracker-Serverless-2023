import { auth, db } from "./firebase.js";
import React, { useState } from "react";
import "./login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { theme } from "../../../theme.jsx";
import { collection, doc, setDoc } from "firebase/firestore";
import { showToastError, showToastSuccess } from "../../../Components/Toast.js";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  const location = useLocation();
  const signupType = location.pathname.includes("user") ? "user" : "partner";

  const signUp = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToastError("Password should be at least 6 characters long");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (val) => {
          sessionStorage.setItem("uId", val.user.uid);

          await storeUserDetails(val.user.uid, {
            userType: signupType,
            uid: val.user.uid,
            email: val.user.email,
          });
          showToastSuccess("Sign up Successful");
          navigate(`/${signupType}/login`);
        }
      );
    } catch (error) {
      showToastError(error.code);
    }
  };

  const storeUserDetails = async (uid, details) => {
    const userCollectionRef = collection(db, "userDetails");
    const userDocRef = doc(userCollectionRef, uid);

    await setDoc(userDocRef, details, { merge: true });
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
