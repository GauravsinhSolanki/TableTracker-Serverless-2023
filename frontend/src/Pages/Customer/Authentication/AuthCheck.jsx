import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToastError } from "../../../Components/Toast";

export const AuthCheck = (
  WrappedComponent,
  reRouteUser = false,
  reRoutePartner = false
) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem("userDetails"));
      if (!user) {
        showToastError("Please login!");
        navigate("/");
      } else if (reRouteUser && user?.userType === "user") {
        navigate("/restaurantList");
      } else if (reRoutePartner && user.userType === "partner") {
        navigate("/dashboard");
      }
    }, [navigate, props.path]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
