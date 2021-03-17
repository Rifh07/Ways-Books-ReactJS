import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavDropdown, Dropdown } from "react-bootstrap";

import { API } from "../../Config/Api";

const TableTransaction = ({transaction, action, index}) => {
  const [listBooks, setListBooks] = useState([]);

  useEffect(() => {
    getListBooks();
  }, []);

  const getListBooks = async () => {
    try {
      const list = await API.get(`/books/list/${transaction.id}`);
      await setListBooks(list.data.data.listBooks);
    } catch (error) {
      
    }
  }

  const listbook = listBooks.map((book) => <>{book.books.title}, </>);

  return (
    <tr className="align-middle">
      <td>{index + 1}</td>
      <td>{transaction.users.fullName}</td>
      <td width="10%"><Link to={"/Img/Transaction/"+transaction.transferProof} target="_blank">{transaction.transferProof}</Link></td>
      <td>{listbook}</td>
      <td className={
        transaction.paymentStatus === "Approve" ? "c-green" :
        transaction.paymentStatus === "Pending" ? "c-yellow" : "c-red"}> 
        Rp. {transaction.paymentTotal},-
      </td>
      <td className={
        transaction.paymentStatus === "Approve" ? "c-green" :
        transaction.paymentStatus === "Pending" ? "c-yellow" : "c-red"}> 
        {transaction.paymentStatus}
      </td>
      <td>
        <NavDropdown className="inline admin-profile">
          <Dropdown.Item onClick={() => action(transaction.id, "Approve")} className="font-dropdown-size c-green">
            Approved
          </Dropdown.Item>
          <Dropdown.Item onClick={() => action(transaction.id, "Cancel")} className="font-dropdown-size c-red">
            Cancel
          </Dropdown.Item>
        </NavDropdown>
      </td>
    </tr>
  );
};

export default TableTransaction;
