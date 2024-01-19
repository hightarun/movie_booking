import React, { useEffect } from "react";
import styles from "./Admin.module.scss";
import Layout from "../../components/Layout";

import { loadAdmin } from "../../redux/actions/auth";
import { useSelector, useDispatch } from "react-redux";

const Admin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.container}>Admin</div>
    </Layout>
  );
};

export default Admin;
