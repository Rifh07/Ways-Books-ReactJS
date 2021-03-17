import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./Component/PrivateRoute";
import { AppContext } from "./Context/GlobalContext";
import { API, setAuthToken } from "./Config/Api";

import Navbar from "./Component/Navbar/Navbar";
import Home from "./Pages/Users/Home/Home";
import Profile from "./Pages/Users/Profile/Profile";
import Book from "./Pages/Users/Book/Book";
import Cart from "./Pages/Users/Cart/Cart";
import Transaction from "./Pages/Admin/Transaction";
import AddBook from "./Pages/Admin/AddBook";
import Loading from './Component/Loading';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
        setLoading(false);
      }

      
      dispatch({
        type: "USER_LOADED",
        payload: response.data.data.user,
      });
      setLoading(false);
    } catch (error) {
      return dispatch({
        type: "AUTH_ERROR",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <Router>
      <Switch>
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-4">
            <Navbar />
            <Route path="/" exact component={Home} />
            {/* Dengan Auth */}
            <PrivateRoute path="/Transaction" exact component={Transaction} />
            <PrivateRoute path="/AddBook" exact component={AddBook} />
            <PrivateRoute path="/Book/:id/Detail" exact component={Book} />
            <PrivateRoute path="/Profile" exact component={Profile} />
            <PrivateRoute path="/Cart" exact component={Cart} />
          </div>
        )}
      </Switch>
    </Router>
  );
}

export default App;
