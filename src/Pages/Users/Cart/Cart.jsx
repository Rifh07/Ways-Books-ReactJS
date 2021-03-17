import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

import { API } from "../../../Config/Api";
import { AppContext } from "../../../Context/GlobalContext";
import Card from "../../../Component/Cart/Card";

function Cart() {
    const history = useHistory();
    const [state, dispatch] = useContext(AppContext);
    const { books } = state;
    const [msg, setMsg] = useState(null);
    const [color, setColor] = useState(null);
    const [alert, setAlert] = useState(false);
    const handleAlert = () => {
        setAlert(true)
    }
    const handleAlertc = () => {
        setAlert(false)
    }
    const [formImage, setFormImage] = useState({
        fileName : "",
        transferProof : null,
    });
    const imageHandler = (e) => {
        setFormImage({
            transferProof : e.target.files[0],
            fileName : e.target.files[0].name
        })
    };

    
    const total = books.reduce((total, subTotal) => total + subTotal.price, 0);

    const qty = books.length;

    const { transferProof } = formImage;
    const usersId = state.user.id;

    const pay = async (e) => {
        e.preventDefault();
        try {
          const body = new FormData();
          body.append("userId", usersId);
          body.append("paymentTotal", total);
          body.append("transferProof", transferProof);
    
          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
    
          const transaction = await API.post('/transaction', body, config);

          const transactionId = transaction.data.data.transaction.id;

          const mapping = await books.map(book => {
            const { id } = book;
            const booksId = id;
            
            const body = JSON.stringify({
                booksId, transactionId, usersId
            });
        
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            API.post('/books/list', body, config);
          });
          
          if (mapping) {
            setFormImage({transferProof : "" ,fileName : ""})
            setColor("text-center c-green");
            await setMsg("Thank you for ordering in us, please wait 1 x 24 hours to verify you order");
            handleAlert();
            dispatch({
                type: "EMPTY_CART"
            });
          }
        } catch (error) {
            setColor("text-center c-red");
            await setMsg("Upload transaction error");
            handleAlert();
        } 
    }
    
    const remove = (id) => {
        dispatch({
            type: "REMOVE_CART",
            payload: { id, },
        });
    }

    return (
        <div className="mb-5 ml-5 mr-5 pb-5">
            <div className="mb-5 ml-5 mr-5 pl-5 pr-5">
                <div className="mt-4 mb-5">
                  <h3 className="name-home">My Cart</h3>
                </div>
                <h5 className="name-home">Review Your Order</h5>
                <div className="row">
                    <div className="col-md-8 text-left pr-3">
                        <div className="line-home mb-4"></div>
                        {qty === 0 ? (
                            <p className="text-center">
                                Ooops, Cart is empty!
                            </p>
                        ) : (
                            books.map((book) => (
                                <Card key={book.id} book={book} remove={remove} />
                            ))
                        )}
                        <div className="line-home mt-4"></div>
                    </div>
                    <div className="col-md-4 text-left pr-3">
                        <div className="line-home mb-4"></div>
                        <div className="row">
                            <div className="col-md-6 text-left">
                                <p className="mb-3">Sub total</p>
                                <p className="mb-3">Qty</p>
                            </div>
                            <div className="col-md-6 text-right">
                                <p className="mb-3">Rp. {total},-</p>
                                <p className="mb-3">{qty}</p>
                            </div>
                        </div>
                        <div className="line-home mb-4 mt-4"></div>
                        <div className="row c-green font-wg">
                            <div className="col-md-6 text-left">
                                <p className="mb-3">Total</p>
                            </div>
                            <div className="col-md-6 text-right">
                                <p className="mb-3">Rp. {total},-</p>
                            </div>
                        </div>
                        <form className="ml-5 mt-5" onSubmit={(e) => pay(e)}>
                            <div className="form-group mb-5 pb-5">
                                <input
                                    type="file"
                                    className="form-control"
                                    name="transferProof"
                                    onChange={(e) => imageHandler(e)}
                                    id="actual-btn"
                                    hidden
                                />
                                <label for="actual-btn" className="form-control bg-transparant">
                                    <img src="/Img/Content/AttachTransaction.png" alt=""/>
                                    {formImage.fileName ? formImage.fileName : "No file chosen"}
                                </label>
                            </div>
                            <div className="form-group mt-5 pt-5">
                                <Button variant="dark" className="form-control" type="submit"> Pay </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter" centered show={alert} onHide={handleAlertc}>
                <Modal.Body className="width-100" id="contained-modal-title-vcenter">
                    <p className={color}>{msg}</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Cart
