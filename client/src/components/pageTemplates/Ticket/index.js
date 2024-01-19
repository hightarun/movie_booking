import React, { useState, useEffect } from "react";
import styles from "./Ticket.module.scss";
import axios from "axios";
import { setAlert } from "../../../redux/actions/alert";

import Loader from "../../Loader";

import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const Ticket = () => {
  const dispatch = useDispatch();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const getTickets = async () => {
      let tickets = await axios.get(
        `${process.env.REACT_APP_BACKEND}/ticket/all`
      );
      try {
        if (tickets) {
          setTickets(tickets.data);
        }
      } catch (err) {
        dispatch(setAlert("Message", err.message, "danger"));
      }
    };
    getTickets();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        {tickets ? (
          <div className={styles.ticketContainer}>
            {tickets.map((ticket, idx) => {
              let showStartTime = moment(ticket.showID.showStartTime).format(
                "HH:mm"
              );
              let showDate = moment(ticket.showID.showStartTime).format(
                "DD-MM-YYYY"
              );
              return (
                <div className={styles.ticket} key={idx}>
                  <div>
                    <p>Theatre: {ticket.showID.theatreID.theatreNo}</p>
                  </div>
                  <div>
                    <p>Movie: {ticket.showID.movieID.movieFullName}</p>
                    <p>{ticket.showID.movieID.movieLength} hours</p>
                  </div>
                  <div>
                    <p>Date: {showDate}</p>
                    <p>Time: {showStartTime}</p>
                  </div>
                  <div>
                    <p>Ticket: {ticket.noOfTickets}</p>
                    <p>Price: {ticket.totalTicketPrice}Rs.</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;
