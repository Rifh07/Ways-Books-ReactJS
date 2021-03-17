import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { API } from "../../../Config/Api";
import Card from '../../../Component/Home/Card';
import CardPromo from '../../../Component/Home/CardPromo';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Home() {
  const [books, setBooks] = useState([]);
  const [booksPromo, setBooksPromo] = useState([]);
  const settings = {
      autoplay: true,
      infinite: true,
      arrows: false,
      slidesToShow: 3,
      slidesToScroll: 1
    };

  useEffect(() => {
    book();
    bookPromo();
  }, []);
  
  const book = async () => {
      try {
        const books = await API.get("/books");
        await setBooks(books.data.data.books);
      } catch (error) {
        console.log(error);
      } 
  }
  const bookPromo = async () => {
    try {
      const books = await API.get("/books/promo");
      await setBooksPromo(books.data.data.books);
    } catch (error) {
      console.log(error);
    } 
  }
  return (
    <div className="mb-5">
      <div className="box-home width-100">
        <h2 className="text-center text-banner">
            With us, you can shop online & help <br/>
            save your high street at the same time
        </h2>
      </div>
      <div className="r-book">
        <Slider {...settings} className="row">
          {booksPromo.map((book) => (
              <CardPromo
                book={book}
                key={book.id}
              />
          ))}
        </Slider>
      </div>

      <div className="mt-5 ml-5 mr-5">
        <h3 className="name-home mb-3">List Book</h3>
      </div>
      <div className="row mt-3 ml-5 mr-5 align-item-center">
        {books.map((book) => (
          <div className="col-md-3 pl-1" key={book.id}>
            <Card
              book={book}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home