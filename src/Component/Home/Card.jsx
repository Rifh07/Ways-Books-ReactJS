import React, { useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Modal, Button, Alert } from "react-bootstrap";

import { AppContext } from "../../Context/GlobalContext";
import { API, setAuthToken } from "../../Config/Api";

function Card({book}) {
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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
    const { id, title, author, price, coverFile } = book

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
    } catch (error) {
      setLoading(false);
      setShowLogin((
        <Alert variant="danger" onClose={() => setShowLogin(false)} dismissible>
          <p>Username or password incorrect</p>
        </Alert>
      ))
    }
  };

  const detailBook = () => {
    history.push(`/Book/${id}/Detail`)
  }
    return (
      <div>
        {state.isLogin ? (
          <div className="col-md-12 cursor" onClick={detailBook}>
            <img className="mb-3 home-img-book rounded" src={'/Img/CoverBook/'+coverFile} alt="" />
            <div className="text-left">
              
              <div className="home-title-book">
                <h5 className="name-home">{title}</h5>
              </div>
              <div className="home-title-book">
                <h6 className="penulis-home">{author}</h6>
              </div>
              <h6 className="c-green font-wg">Rp.{price},-</h6>
            </div>
          </div>
        ) : (
          <div className="col-md-12 cursor" onClick={handleSignIn}>
            <img className="mb-3 home-img-book rounded" src={'/Img/CoverBook/'+coverFile} alt="" />
            <div className="text-left">
              
              <div className="home-title-book">
                <h5 className="name-home">{title}</h5>
              </div>
              <div className="home-title-book">
                <h6 className="penulis-home">{author}</h6>
              </div>
              <h6 className="c-green font-wg">Rp.{price},-</h6>
            </div>
          </div>
        )}

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
    )
}

export default Card
