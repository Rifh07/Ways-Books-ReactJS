import React from "react";
import { Link } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({ book, remove }) => {
    const { id, title, author, coverFile, price } = book;

    return(
        <div className="row text-left mb-3">
            <div className="col-md-4">
                <img src={"/Img/CoverBook/"+coverFile} className="home-img-book rounded" alt="" />
            </div>
            <div className="col-md-7">
                <h6 className="font-wg">{title}</h6>
                <p className="c-grey font-italic"> {author} </p>
                <p className="c-green font-wg mt-5">Rp. {price},-</p>
            </div>
            <div className="col-md-1">
                <Link onClick={() => remove(id)}>
                    <FontAwesomeIcon icon={faTrash} className="c-black" />
                </Link>
            </div>
        </div>
    )
}
export default Card;