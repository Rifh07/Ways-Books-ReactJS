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
import Transactions from "./Pages/Admin/Transactions";
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
        setLoading(false);
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      
      dispatch({
        type: "USER_LOADED",
        payload: response.data.data.user,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return dispatch({
        type: "AUTH_ERROR",
      });
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
            <PrivateRoute path="/transactions" exact component={Transactions} />
            <PrivateRoute path="/add-book" exact component={AddBook} />
            <PrivateRoute path="/book/:id/detail" exact component={Book} />
            <PrivateRoute path="/profile" exact component={Profile} />
            <PrivateRoute path="/cart" exact component={Cart} />
          </div>
        )}
      </Switch>
    </Router>
  );
}

export default App;
