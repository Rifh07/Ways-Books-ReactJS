import React, { useContext, useEffect, useState } from "react"
import { Button, Modal, Alert } from "react-bootstrap"
import { faEnvelope, faTransgender, faPhoneAlt, faSearchLocation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { API } from "../../../Config/Api";
import { AppContext } from "../../../Context/GlobalContext"
import Card from '../../../Component/Profile/Card';
import Loading from '../../../Component/Loading';

function Profile() {
  const [state, dispatch] = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertFormEditProfile, setAlertFormEditProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [FormData, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });
  const handleAlert = () => {
    setAlert(true)
  }
  const handleAlertc = () => {
    setAlert(false)
  }
  const editProfile = () => {
    setAlertFormEditProfile(true)
  }
  const editProfilec = () => {
    setAlertFormEditProfile(false)
  }
  const onChange = (e) => {
    setForm({ ...FormData, [e.target.name]: e.target.value });
  };
  const valueEdit = (e) => {
    setForm({ 
      ...FormData,
      fullName: state.user.fullName,
      email: state.user.email,
      phone: state.user.phone,
      address: state.user.address,
      gender: state.user.gender,
    });
  };
  const usersId = state.user.id;
 
  useEffect(() => {
    transaction();
    valueEdit();
  }, []);

  const { fullName, email, phone, address, gender } = FormData;
  const qty = transactions.lenght;
  const editUser = async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify({
        fullName, phone, address, gender
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const user = await API.put(`/users/${state.user.id}`, body, config);
      await dispatch({
        type: "LOGIN_SUCCESS",
        payload: user.data.data.user,
      });

      setShowEditProfile((
        <Alert variant="success" onClose={() => setShowEditProfile(false)} dismissible>
          <p>Your profile has been succcessfully updated</p>
        </Alert>
      ))

    } catch (error) {
      setShowEditProfile((
        <Alert variant="danger" onClose={() => setShowEditProfile(false)} dismissible>
          <p>Your profile has been unsucccessful updated</p>
        </Alert>
      ))
    }
  };

  const transaction = async () =>{
    try {
      const transaction = await API.get(`/transaction/user/${usersId}`);
      await setTransactions(transaction.data.data.transactions);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mb-5 ml-5 mr-5 pl-5 pr-5">
      <div className="mb-5 ml-5 mr-5 pl-5 pr-5">
        <div className="mt-5">
          <h3 className="name-home">Profile</h3>
        </div>
        <div className="mt-4 mb-3 pl-5 pb-5 pt-4 profile-container bg-pink border-radius">
          <div className="pb-5 float-left">
            <div className="mb-3">
              <h2 className="inline align-middle c-grey">
                <FontAwesomeIcon icon={faEnvelope} className="mr-4" />
              </h2>
              <div className="inline-block align-top">
                <p className="m-1 text-profile">{ state.user.email }</p>
                <p className="m-1 text-profile c-grey">Email</p>
              </div>
            </div>
            <div className="mb-3">
              <h2 className="inline align-middle c-grey">
                <FontAwesomeIcon icon={faTransgender} className="mr-4" />
              </h2>
              <div className="inline-block align-top">
                <p className="m-1 text-profile">{ state.user.gender } </p>
                <p className="m-1 text-profile c-grey">Gender</p>
              </div>
            </div>
            <div className="mb-3">
              <h2 className="inline align-middle c-grey">
                <FontAwesomeIcon icon={faPhoneAlt} className="mr-4" />
              </h2>
              <div className="inline-block align-top">
                <p className="m-1 text-profile">{ state.user.phone }</p>
                <p className="m-1 text-profile c-grey">Mobile Phone</p>
              </div>
            </div>
            <div className="mb-3">
              <h2 className="inline align-middle c-grey">
                <FontAwesomeIcon icon={faSearchLocation} className="mr-4" />
              </h2>
              <div className="inline-block align-top">
                <p className="m-1 text-profile">
                  { state.user.address }
                </p>
                <p className="m-1 text-profile c-grey">Address</p>
              </div>
            </div>
          </div>
          <div className="float-right mr-4">
            <div className="form-group">
              <img className="border-radius" src="Img/Profile/EditProfile.png" alt="" />
            </div>
            <div className="form-group">
              <Button
                variant="danger"
                className="form-control bg-red"
                type="submit"
                onClick={() => editProfile() }
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="name-home">My Book</h3>
        </div>
        <div className="row flex-left mt-1 ">
          {loading ? (
            <Loading />
          ) : (
            transactions.map((transaction) => (
              <Card
                transaction={transaction}
                key={transaction.id}
              />
            ))
          )}
        </div>
      </div>
      <Modal aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-sign" show={alertFormEditProfile} onHide={editProfilec}>
        <Modal.Body className="width-80" id="contained-modal-title-vcenter">
          <div className="mt-4">

            <h2 className="mb-4"> Edit Profile</h2>
            <form onSubmit={(e) => editUser(e)} >
              <div className="form-group">
                {showEditProfile}
              </div>
              <div className="form-group">
                <input type="text"  className="form-control form-grey" name="fullName" value={fullName}  onChange={(e) => onChange(e)} placeholder="Full Name" />
              </div>
              <div className="form-group">
                <input type="email"  className="form-control form-grey" value={email}  placeholder="Email" readOnly />
              </div>
              <div className="form-group">
                <select name="gender" className="form-control  form-grey" value={gender} onChange={(e) => onChange(e)} >
                  <option disabled selected>== Gender ==</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <input type="number" className="form-control  form-grey" name="phone" value={phone} onChange={(e) => onChange(e)} placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <input type="text" className="form-control  form-grey" name="address" value={address} onChange={(e) => onChange(e)} placeholder="Address" />
              </div>
              <div className="form-group">
                <Button variant="danger" className="form-control bg-red" type="submit"> Save </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Profile
