import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";

import { API } from "../../Config/Api";
import { AppContext } from "../../Context/GlobalContext";
import TableTransaction from "../../Component/Transaction/TableTransaction";

function Transaction() {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const [transaction, setTransaction] = useState([]);
  const [msg, setMsg] = useState(null);
  const [color, setColor] = useState(null);
  const [alert, setAlert] = useState(false);
  const handleAlert = () => {
      setAlert(true)
  }
  const handleAlertc = () => {
      setAlert(false)
  }

  useEffect(() => {
    if (state.user.role !== "Admin") {
      history.push("/");
    }
    getTransaction();
  }, []);

  const getTransaction = async () => {
    try {
      const transaction = await API.get("/transaction");
      await setTransaction(transaction.data.data.transactions);
    } catch (error) {
      
    }
  }
  const action = async (id, paymentStatus) => {
    try {        
      const body = JSON.stringify({
        paymentStatus
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const transaction = await API.patch(`/transaction/${id}`, body, config);
      if (transaction) {
        getTransaction();
        setColor("text-center c-green");
        setMsg("Update payment has been successfully");
        handleAlert();
      }

    } catch (error) {
      setColor("text-center c-red");
        setMsg("Update payment has been unsuccessful");
        handleAlert();
    }
  }
  return (
    <div className="mt-5 ml-5 pl-5 pr-5 mr-5 pr-5">
      <div className="mt-1 mb-5">
        <h3 className="name-home">Incoming Transaction</h3>
      </div>
      <div className="table-reponsif">
        <table className="table table-striped mb-5">
          <thead>
            <tr className="c-red">
              <th scope="col">No</th>
              <th scope="col">Users</th>
              <th scope="col">Evidence of Transfer</th>
              <th scope="col">Product Purchased</th>
              <th scope="col">Total Payment</th>
              <th scope="col">Status Payment</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
          {transaction.map((transaction, index) =>(
              <TableTransaction key={transaction.id} transaction={transaction} action={action} index={index} />
            ))}
          </tbody>
        </table>
      </div>
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={alert} onHide={handleAlertc}>
            <Modal.Body className="width-100" id="contained-modal-title-vcenter">
                <p className={color}>{msg}</p>
            </Modal.Body>
        </Modal>
    </div>
  );
}

export default Transaction;
