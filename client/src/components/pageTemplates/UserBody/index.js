import React, { useEffect, useState } from "react";
import styles from "./UserBody.module.scss";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setAlert } from "../../../redux/actions/alert";
import Ticket from "../Ticket";

const UserBody = ({ currentUser, userData }) => {
  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src="/assets/banner.png" alt="banner" />
      </div>
      <div className={styles.header}>
        <div className={styles.infoContainer}>
          <div className={styles.avatar}>
            <img src="/assets/avatar.png" alt="avatar" />
          </div>
          <div className={styles.info}>
            <p>{userData && userData.name}</p>
            <i>@{userData && userData.username}</i>
          </div>
        </div>
      </div>
      {currentUser ? (
        <div className={styles.ticket}>
          <div>My Bookings</div>
          <Ticket />
        </div>
      ) : (
        <div>Book Movie</div>
      )}
    </div>
  );
};

export default UserBody;
