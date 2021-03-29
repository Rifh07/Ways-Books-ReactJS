import React, { useContext, useEffect, useState } from "react";
import { API } from "../../../Config/Api";
import { AppContext } from "../../../Context/GlobalContext";
import Loading from '../../../Component/Loading';
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Book() {
  const [bookss, setBooks] = useState([]);
  const [state, dispatch] = useContext(AppContext);
  const [ownBooks, setOwnBooks] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const { id } = useParams();
 
  useEffect(() => {
    book();
    ownBook();
  }, []);

  const findBook = books.find(books => books.id == id);

  const book = async () => {
    try {
      const books = await API.get(`/books/${id}`);
      await setBooks(books.data.data.book);
    } catch (error) {
      console.log(error);
    } 
  }

  const cart = async () => {
    if (findBook){
      setColor("text-center c-red");
      await setMsg("The book is already in the cart");
      handleAlert();
    } else {
      dispatch({
        type: "ADD_CART",
        payload: bookss,
      })
      setColor("text-center c-green");
      await setMsg("The product is successfully added to the cart");
      handleAlert();
    }
  }

  const ownBook = async () =>{
    try {
      const ownBooks = await API.get(`/books/${id}/${state.user.id}`);
      const data = ownBooks.data.status;
      if (data) {
        await setOwnBooks(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mt-5 ml-5 mr-5 pl-5 pr-5 pb-5">
      {loading ? (
          <Loading />
      ) : (
        <div className="ml-5 mr-5 pl-5 pr-5">
          <div className="row pt-5 text-left">
            <div className="col-md-4">
              <img className="book width-100 rounded" src={'/Img/CoverBook/'+bookss.coverFile} alt="" />
            </div>
            <div className="col-md-7 pl-4">
              <h1 className="name-home mb-1 mt-2">{bookss.title}</h1>
              <h6 className="c-grey">{bookss.author}</h6>
              <h6 className="font-wg mt-4 mb-1">Publication date</h6>
              <p className="c-grey text-profile">{bookss.publicationDate}</p>
              <h6 className="font-wg mt-4 mb-1">Pages</h6>
              <p className="c-grey text-profile">{bookss.pages}</p>
              <h6 className="font-wg c-red mt-4 mb-1">ISBN</h6>
              <p className="c-grey text-profile">{bookss.isbn}</p>
              <h6 className="font-wg mt-5 mb-1">Price</h6>
              <p className="c-green text-profile">Rp. {bookss.price},-</p>
            </div>
          </div>
          <div className="mt-5">
            <h4 className="name-home mb-3">About This Book</h4>
            <p className="c-grey mb-5 text-justify">
                {bookss.about}
            </p>
            <div className="lp-button-group text-right">
                {/* {transactions.map((transaction) => (
                    <Buttons
                      transaction={transaction}
                      bookId={id}
                      getBook={getBook}
                      key={transaction.id}
                    />
                ))} */}
                {ownBooks === "Success" ? (
                  <a href={'/Img/Book/'+bookss.bookFile} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="dark"> Download </Button>
                  </a>
                  // <Button variant="dark" onClick={cart}> 
                  //     Download
                  // </Button>
                ) : (
                  <Button variant="dark" onClick={cart}> 
                    {findBook ? "The book is already in the cart" : "Add Cart"}   <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      )}
        {/* {listBooks ? "true" : "false"} */}

        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={alert} onHide={handleAlertc}>
          <Modal.Body className="width-100" id="contained-modal-title-vcenter">
              <p className={color}>{msg}</p>
          </Modal.Body>
        </Modal>
    </div>
  );
}

export default Book;
