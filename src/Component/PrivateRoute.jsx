import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../Context/GlobalContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(AppContext);
  const isLogin = state.isLogin;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;