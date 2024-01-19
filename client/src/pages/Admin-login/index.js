import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";

import { loginAdmin } from "../../redux/actions/auth";

import { setAlert } from "../../redux/actions/alert";

import Modal from "../../components/Modal";

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.rootReducer.auth.isAuthenticated
  );

  const [formdata, setFormData] = useState({
    emailOrUname: "",
    password: "",
  });

  // On change of input fields
  const onChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  // login user by calling loginUser action -> stores token in localStorage
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(formdata.emailOrUname, formdata.password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin-panel");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.wel_text}>
            <p>Tweets</p>
          </div>
          <form className={styles.form} onSubmit={(e) => onSubmit(e)}>
            <div>
              <input
                className={styles.input}
                type="text"
                placeholder="Username"
                name="emailOrUname"
                value={formdata.emailOrUname}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div>
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                name="password"
                value={formdata.password}
                onChange={(e) => onChange(e)}
              />
            </div>
            <button className={styles.button} value="login" type="submit">
              <span>Login</span>
            </button>
            <button
              className={styles.button}
              onClick={() => navigate("/register")}
            >
              <span>Register</span>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
