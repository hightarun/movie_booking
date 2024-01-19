import React from "react";
import styles from "./Home.module.scss";

import Layout from "../../components/Layout";

import Movies from "../../components/pageTemplates/Movies";

const Home = () => {
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
