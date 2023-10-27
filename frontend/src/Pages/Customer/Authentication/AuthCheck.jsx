import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../../Components/Toast";

export const AuthCheck = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const user = sessionStorage.getItem("userDetails");
      if (!user) {
        showToastError("Please login!"); 
        navigate("/user/login");
      }
    }, [navigate, props.path]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
