import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthCheck = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const user = sessionStorage.getItem("userDetails");
      if (!user) {
        navigate("/user/login");
      }
    }, [navigate, props.path]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
