import React from "react";
import styles from "./Loader.module.scss";
import { InfinitySpin } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className={styles.container}>
      <InfinitySpin
        visible={true}
        width="200"
        color="#0a1931"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loader;
