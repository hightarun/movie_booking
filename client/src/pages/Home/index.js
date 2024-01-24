import React, { useEffect } from "react";
import styles from "./Home.module.scss";

import Layout from "../../components/Layout";

import Movies from "../../components/pageTemplates/Movies";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/auth";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.rootReducer.auth.user);
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
      <div className={styles.container}>
        <div>
          <Movies />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
