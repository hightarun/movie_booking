import React, { useState, useEffect } from "react";
import styles from "./Movies.module.scss";
import axios from "axios";
import { setAlert } from "../../../redux/actions/alert";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

import moment from "moment";
import { useDispatch } from "react-redux";

const Movies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  const getAllMovies = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND}/movie/all`);
      setMovies(res.data);
    } catch (err) {
      const errors = err.response.data.errorMap; // errors array from backend
      if (errors) {
        Object.keys(errors).map((key) => {
          return dispatch(setAlert(key, errors[key], "danger"));
        });
      }
    }
  };

  const onButtonClick = (movie) => {
    navigate("/book-ticket", { state: { movie } });
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url("/assets/bg2.jpg")` }}
    >
      <h2>Movies</h2>
      <div className={styles.wrap}>
        {movies ? (
          <div className={styles.movieContainer}>
            {movies.map((movie, idx) => {
              let releaseDate = moment(movie.releaseDate).format("DD-MM-YYYY");
              return (
                <div className={styles.movie} key={idx}>
                  <div>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        color: "royalblue",
                        letterSpacing: "0.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      "{movie.movieFullName}"
                    </p>
                  </div>
                  <div>
                    <p>Length: {movie.movieLength}</p>
                  </div>
                  <div>
                    <p>
                      Booking:{" "}
                      {movie.bookingStatus ? (
                        <span>Open</span>
                      ) : (
                        <span>Closed</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p>Release Date: {releaseDate}</p>
                  </div>
                  {movie.bookingStatus ? (
                    <button onClick={() => onButtonClick(movie)}>
                      BOOK ASAP
                    </button>
                  ) : (
                    <button style={{ backgroundColor: "grey" }} disabled>
                      SOLD OUT
                    </button>
                  )}
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

export default Movies;
