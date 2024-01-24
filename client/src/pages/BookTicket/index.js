import React, { Suspense, useEffect, useState } from "react";
import styles from "./Book.module.scss";
import axios from "axios";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../redux/actions/alert";
import moment from "moment";
import { loadUser } from "../../redux/actions/auth";

import Modal from "../../components/Modal";

const BookTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [shows, setShows] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [show, setShow] = useState({});
  const [ticket, setTicket] = useState({
    showId: "",
    noOfTickets: "",
  });

  const authUser = useSelector((state) => state.rootReducer.auth.user);

  const isAuthenticated = useSelector(
    (state) => state.rootReducer.auth.isAuthenticated
  );

  const getShowByMovie = async () => {
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/show/movie/${state.movie._id}`
      );
      setShows(res.data);
    } catch (err) {
      const errors = err.response.data.errorMap; // errors array from backend
      if (errors) {
        Object.keys(errors).map((key) => {
          return dispatch(setAlert(key, errors[key], "danger"));
        });
      }
    }
  };

  const handleButton = (show) => {
    setTicket((prev) => ({
      ...prev,
      showId: show._id,
    }));
    setShow(show);
    setToggleModal(true);
  };

  const handleToggleModal = () => {
    setToggleModal(false);
    setTicket({
      showId: "",
      noOfTickets: "",
    });
  };

  const updateTicket = (e) => {
    e.preventDefault();
    setTicket((prev) => ({
      ...prev,
      noOfTickets: e.target.value,
    }));
  };

  const onSubmitTicket = async (e) => {
    e.preventDefault();
    if (ticket.noOfTickets > show.theatreID.totalSeats) {
      dispatch(setAlert("Message", "Seats not available", "danger"));
      return;
    }
    const body = JSON.stringify(ticket);
    try {
      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND}/ticket/add`,
        headers: { "Content-Type": "application/json" },
        data: body,
      });

      dispatch(setAlert("Message", "Ticket Booked", "success"));
    } catch (err) {
      const errors = err.response.data.errorMap; // errors array from backend
      if (errors) {
        Object.keys(errors).map((key, index) => {
          return dispatch(setAlert(key, errors[key], "danger"));
        });
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  // fetch movies
  useEffect(() => {
    if (state.movie && isAuthenticated) {
      getShowByMovie();
    }
  }, [state, isAuthenticated]);

  // authenticate token
  useEffect(() => {
    if (authUser) {
      if (authUser.role === "ADMIN") {
        navigate("/admin-panel");
        return;
      }
    }
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Layout>
      <div
        className={styles.container}
        style={{ backgroundImage: `url("/assets/bg3.jpg")` }}
      >
        <h2>SHOWS</h2>
        <Suspense fallback={<Loader />}>
          {state && isAuthenticated ? (
            <div className={styles.wrap}>
              {shows.map((show, idx) => {
                let showTime = moment(show.showStartTime).format("HH:mm");
                let showDate = moment(show.showStartTime).format("DD-MM-YYYY");
                return (
                  <div key={idx} className={styles.show}>
                    <div>
                      <p
                        style={{
                          fontSize: "1.4rem",
                          textAlign: "center",
                          color: "royalblue",
                          letterSpacing: "0.1rem",
                          fontWeight: "bold",
                        }}
                      >
                        {show.movieID.movieFullName}
                      </p>
                    </div>
                    <div>
                      <p>Theatre: {show.theatreID.theatreNo}</p>
                      <p>Seats Left: {show.theatreID.totalSeats}</p>
                    </div>
                    <div>
                      <p>Date: {showDate}</p>
                      <p>Time : {showTime}</p>
                    </div>
                    <div>
                      <p>Ticket Price: {show.showPrice}</p>
                    </div>
                    <button onClick={() => handleButton(show)}>
                      Select Tickets
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </Suspense>
      </div>
      <Modal open={toggleModal} onClose={() => handleToggleModal()}>
        <div className={styles.modal}>
          <div className={styles.formContainer}>
            <form onSubmit={onSubmitTicket}>
              <input
                type="number"
                placeholder="How many tickets?"
                min={1}
                value={ticket.noOfTickets}
                onChange={updateTicket}
                pattern="^[1-9][0-9]*$"
                required
              ></input>
              <button type="submit">Book Ticket</button>
            </form>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default BookTicket;
