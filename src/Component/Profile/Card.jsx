import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from "react-bootstrap";

function Card({transaction}) {
    const history = useHistory();
    const [listBooks, setListBooks] = useState([]);

    useEffect(() => {
      getListBooks();
    }, []);

    const getListBooks = async () => {
      try {
        setListBooks(transaction.listBooks);
      } catch (error) {
        console.log(error);
      }
    }


    const detailBook = (e) => {
      history.push(`/book/${e}/detail`)
    }

    return (
      <>
          {listBooks.map((listBooks) => (
            <div className="col-md-3 mb-5">
              <div className="col-md-12 cursor" onClick={() => detailBook(listBooks.books.id)}>
                <img className="mb-3 home-img-book rounded" src={'/Img/CoverBook/'+listBooks.books.coverFile} alt="" />
                <div className="text-left mb-3">
                  <div className="home-title-book">
                    <h5 className="name-home">{listBooks.books.title}</h5>
                  </div>
                  <h6 className="penulis-home">{listBooks.books.author}</h6>
                </div>
              </div>
              <div className="col-md-12 mt-1">
                <a href={'/Img/Book/'+listBooks.books.bookFile} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="dark" className="form-control"> Download </Button>
                </a>
              </div>
            </div>
          ))}

        
      </>
    )
}

export default Card
