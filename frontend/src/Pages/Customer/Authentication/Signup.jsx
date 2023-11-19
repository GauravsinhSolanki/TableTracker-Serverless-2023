import { auth, db } from "./firebase.js";
import React, { useState } from "react";
import "./login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { theme } from "../../../theme.jsx";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { showToastError, showToastSuccess } from "../../../Components/Toast.js";
import RestaurantPopup from "../../../Components/RestaurantPopup.jsx";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then(async (val) => {
        sessionStorage.setItem("uId", val.user.uid);

        if (signupType === "partner") {
          const docRef = doc(db, "userDetails", val.user.uid);
          const docSnap = await getDoc(docRef);
          const userDetails = docSnap.data();
          if (!userDetails?.restaurant_id) {
            setShowRestaurantModal(true);
          }
        } else {
          await storeUserDetails(val.user.uid, { userType: signupType });
          showToastSuccess("Sign up Successful");
          navigate(`/${signupType}/login`);
        }
      });
    } catch (error) {
      showToastError(error.code);
    }
  };

  const handleRestaurantSave = async (restaurant_id, restaurant_name) => {
    const userId = sessionStorage.getItem("uId");
    const docRef = collection(db, "userDetails");
    const partnerQuery = query(
      docRef,
      where("restaurant_id", "==", restaurant_id)
    );
    const partners = await getDocs(partnerQuery);
    if (!partners?.empty) {
      showToastError("Partner restaurant already exists!!");
    } else {
      await storeUserDetails(userId, {
        userType: signupType,
        restaurant_id,
        restaurant_name,
      });
      showToastSuccess("Sign up Successful");
      setShowRestaurantModal(false);
      navigate(`/${signupType}/login`);
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
      <RestaurantPopup
        show={showRestaurantModal}
        handleClose={() => setShowRestaurantModal(false)}
        handleSave={handleRestaurantSave}
      />
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
