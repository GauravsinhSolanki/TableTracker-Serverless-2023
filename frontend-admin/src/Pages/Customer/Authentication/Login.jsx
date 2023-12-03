import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { theme } from "../../../theme.jsx";
import { Flex } from "@chakra-ui/react";
import { showToastError, showToastSuccess } from "../../../Components/Toast.js";
import { doc, getDoc } from "firebase/firestore";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const signupType = "admin";

  const signIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToastError("Please enter email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        handleSignInSuccess(result);
      })
      .catch((error) => {
        showToastError("Invalid credentials");
        return;
      });
  };

  const handleSignInSuccess = async (result) => {
    let userData = {
      uid: result.user.uid,
      email: result.user.email,
      userType: signupType,
    };

    const docRef = doc(db, "userDetails", result.user.uid);
    const docSnap = await getDoc(docRef);
    const userDetails = docSnap.data();

    const isValid = checkUserType(userDetails);
    if (isValid) {
      postSignIn(userData);
    }
  };

  const checkUserType = (userDetails) => {
    if (userDetails?.userType === "user") {
      showToastError(
        "Invalid user. Please login as a customer. Redirecting..."
      );
      window.open(
        "https://sdp3-app-sprint2-ego5ocsnya-uc.a.run.app/admin/restaurant-most-orders"
      );
      return false;
    } else if (userDetails?.userType === "partner") {
      showToastError("Invalid user. Please login as a partner. Redirecting...");
      navigate("/admin/login");
      window.open(
        "https://sdp3-app-sprint2-ego5ocsnya-uc.a.run.app/admin/restaurant-most-orders"
      );
      return false;
    }

    return true;
  };

  const postSignIn = (userData) => {
    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({
        ...userData,
      })
    );
    sessionStorage.setItem("uId", userData?.uid ?? "");
    showToastSuccess("Login Successful");
    navigate("/admin/restaurant-most-orders");
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
        <form onSubmit={signIn}>
          <h1
            className="h3 mb-3 fw-normal"
            style={{ color: theme.secondaryBackground }}
          >
            Admin Please sign in
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
            Sign in
          </button>
        </form>
      </main>
    </Flex>
  );
};

export default Login;
