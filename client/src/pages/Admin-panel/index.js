import React, { useEffect } from "react";
import styles from "./Admin.module.scss";
import Layout from "../../components/Layout";

import { loadAdmin } from "../../redux/actions/auth";
import { useSelector, useDispatch } from "react-redux";
import AdminMovie from "../../components/pageTemplates/AdminMovie";
import AdminShow from "../../components/pageTemplates/AdminShow";

const Admin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.movie}>
          <AdminMovie />
        </div>
        <div className={styles.show}>
          <AdminShow />
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
