import React, { useState, useContext } from "react";
import { Button, Modal, NavDropdown, Dropdown, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { faUser, faBook, faSignOutAlt, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { API, setAuthToken } from "../../Config/Api";
import { AppContext } from "../../Context/GlobalContext";

function Navbar() {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [FormData, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
  });

  const onChange = (e) => {
    setForm({ ...FormData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setSignIn(false)
    setSignUp(false)
  }
  const handleSignIn = () => {
    setSignUp(false)
    setSignIn(true)
  }
  const handleSignUp = () => {
    setSignIn(false)
    setSignUp(true)
  }

  const books = state.books;
  const qty = books.length;
  const { fullName, email, password, phone, address, gender } = FormData;

  const Register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = JSON.stringify({
        fullName, email, password, phone, address, gender
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const user = await API.post("/register", body, config);
      await dispatch({
        type: "LOGIN_SUCCESS",
        payload: user.data.data.user,
        payloadToken: user.data.data.token,
      });
      setAuthToken(user.data.data.token);
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      setShowRegister((
        <Alert variant="danger" onClose={() => setShowRegister(false)} dismissible>
          <p>Email already exists</p>
        </Alert>
      ))
    }
  };
  const Login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = JSON.stringify({
        email,
        password
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const user = await API.post("/login", body, config);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user.data.data.user,
        payloadToken: user.data.data.token,
      });

      setAuthToken(user.data.data.token);
      setLoading(false);
      handleClose();
      if (user) {
        history.push("/transactions");
      }
    } catch (error) {
      setLoading(false);
      setShowLogin((
        <Alert variant="danger" onClose={() => setShowLogin(false)} dismissible>
          <p>Username or password incorrect</p>
        </Alert>
      ))
    }
  };

  function logout() {
    dispatch({
      type: "LOGOUT",
    })
  }

  return (
    <div className="ml-5 mr-4">
      {state.isLogin ? state.user.role == "Admin" ? (
        <>
          <Link to="/transactions" as={Link} className="none-decoration inline">
            <img className="mb-5" src="/Img/Content/logo.png" alt="" />
          </Link>
        </>
      ) : (
        <>
          <Link to="/" as={Link} className="none-decoration inline">
            <img className="mb-5" src="/Img/Content/logo.png" alt="" />
          </Link>
        </>
      ) : (
        <>
          <Link to="/" as={Link} className="none-decoration inline">
            <img className="mb-5" src="/Img/Content/logo.png" alt="" />
          </Link>
        </>
      )}

      
      <div className="float-right inline lp-button-group">
      {state.isLogin ? (
        <>
           {state.user.role == "Admin" ? (
            <>
              <NavDropdown className="float-right inline" title={ <img className="admin-profile" src="/Img/Profile/FotoProfile.png" alt="" /> } >
                <Dropdown.Item to="/add-book" as={Link}>
                  <FontAwesomeIcon icon={faBook} className="mr-4 c-grey" />
                  Add Book
                </Dropdown.Item>
                <Dropdown.Item onClick={()=>logout()}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-4 c-red" />
                  Logout
                </Dropdown.Item>
              </NavDropdown>
            </>
           ) : (
            <>
              <Link to="/Cart" as={Link}>
                <img src="/Img/Content/cart.png" className="mt-3" alt=""/><sup className="numberCircle mr-3">{qty}</sup>
                {/* <FontAwesomeIcon icon={faShoppingCart} className="c-black fa-2x" style={{height: "76px"}}/> */}
              </Link>
              <NavDropdown className="float-right inline" title={ <img className="admin-profile" src="/Img/Profile/FotoProfile.png" alt="" /> } >
                <Dropdown.Item to="/profile" as={Link}>
                  <FontAwesomeIcon icon={faUser} className="mr-4 c-grey" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={()=>logout()}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-4 c-red" />
                  Logout
                </Dropdown.Item>
              </NavDropdown>
            </>
           )}
        </>
      ) : (
        <>
          <button className="btn btn-light" onClick={handleSignIn} style={{width: "120px"}}> Login </button>
          <button className="btn ml-3 btn-dark" onClick={handleSignUp} style={{width: "120px"}}> Register </button>
        </>
      )}
      </div>
      {/* Modal Sign In */}
      <Modal aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-sign" show={signIn} onHide={handleClose}>
        <Modal.Body id="contained-modal-title-vcenter">
          <div className="mt-4">
            <h2 className="mb-4"> Login</h2>
            <form onSubmit={(e) => Login(e)}>
              <div className="form-group">
                {showLogin}
              </div>
              <div className="form-group">
                <input type="email" className="form-control form-grey" name="email" onChange={(e) => onChange(e)} placeholder="Email" />
              </div>
              <div className="form-group">
                <input type="password" className="form-control form-grey" name="password" onChange={(e) => onChange(e)} placeholder="Password" />
              </div>
              <div className="form-group">
                {loading ? (
                  <Button variant="dark" className="form-control"> Loading ...</Button>
                ) : (
                  <Button variant="dark" className="form-control" type="submit"> Login</Button>
                )}
              </div>
              <div className="form-group">
                <h6>Don't have an account? Klik <b className="cursor inline font-wg" onClick={handleSignUp}>Here</b></h6>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal Sign Up */}
      <Modal aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-sign" show={signUp} onHide={handleClose}>
        <Modal.Body className="width-80" id="contained-modal-title-vcenter">
          <div className="mt-4">

            <h2 className="mb-4"> Register</h2>
            <form onSubmit={(e) => Register(e)}>
              <div className="form-group">
                {showRegister}
              </div>
              <div className="form-group">
                <input type="text"  className="form-control form-grey" name="fullName"  onChange={(e) => onChange(e)} placeholder="Full Name" />
              </div>
              <div className="form-group">
                <input type="email"  className="form-control form-grey" name="email"  onChange={(e) => onChange(e)} placeholder="Email" />
              </div>
              <div className="form-group">
                <input type="password" className="form-control  form-grey" name="password" onChange={(e) => onChange(e)} placeholder="Password" />
              </div>
              <div className="form-group">
                <select name="gender" className="form-control  form-grey" onChange={(e) => onChange(e)} >
                  <option disabled selected>== Gender ==</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <input type="number" className="form-control  form-grey" name="phone" onChange={(e) => onChange(e)} placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <input type="text" className="form-control  form-grey" name="address" onChange={(e) => onChange(e)} placeholder="Address" />
              </div>
              <div className="form-group">
                {loading ? (
                  <Button variant="dark" className="form-control"> Loading ...</Button>
                ) : (
                  <Button variant="dark" className="form-control" type="submit"> Register</Button>
                )}
              </div>
              <div className="form-group">
                <h6>Already have an account? Klik <b className="cursor inline font-wg" onClick={handleSignIn}>Here</b></h6>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Navbar;
