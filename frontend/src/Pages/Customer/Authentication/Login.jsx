import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { theme } from "../../../theme.jsx";
import { Flex } from "@chakra-ui/react";
import { showToastError, showToastSuccess } from "../../../Components/Toast.js";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import RestaurantPopup from "../../../Components/RestaurantPopup.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  let navigate = useNavigate();
  const signupType = location.pathname.includes("admin")
    ? "admin"
    : location.pathname.includes("user")
    ? "user"
    : "partner";

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

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await storeUserDetails(result.user.uid, {
          uid: result.user.uid,
          userType: signupType,
          email: result.user.email,
        });
        handleSignInSuccess(result);
      })
      .catch((error) => {
        showToastError("Error Logging in!");
      });
  };

  const storeUserDetails = async (uid, details) => {
    const userCollectionRef = collection(db, "userDetails");
    const userDocRef = doc(userCollectionRef, uid);

    await setDoc(userDocRef, details, { merge: true });
  };

  const handleSignInSuccess = async (result) => {
    let userData = {
      uid: result.user.uid,
      email: result.user.email,
      userType: signupType,
    };

    if (signupType === "partner") {
      const docRef = doc(db, "userDetails", result.user.uid);
      const docSnap = await getDoc(docRef);
      const userDetails = docSnap.data();

      userData = {
        ...userData,
        restaurant_id: userDetails?.restaurant_id ?? "",
        restaurant_name: userDetails?.restaurant_name ?? "",
      };
    }

    postSignIn(userData);
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
    if (signupType === "admin") {
      navigate("/admin/restaurant-reviews");
    } else if (signupType === "partner") {
      if (!userData?.restaurant_id) {
        setShowRestaurantModal(true);
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/restaurantList");
    }
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
      />
      <main className="form-signin w-100 m-auto">
        <form onSubmit={signIn}>
          <h1
            className="h3 mb-3 fw-normal"
            style={{ color: theme.secondaryBackground }}
          >
            Please sign in
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

        <button className="google-btn" onClick={signInWithGoogle}>
          <img
            className="google-icon"
            src="/google-logo.png"
            alt="google-icon"
          />
          <p className="btn-text">Sign in with Google</p>
        </button>
      </main>
    </Flex>
  );
};

export default Login;
