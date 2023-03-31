import React from "react";
import styles from "../../styles/DepositePopup.module.scss";

const DepositePopup = (props) => {
  return (
    <div className={styles.popupBox}>
      <div className={styles.box}>
        <div className={styles.boxInner}>
          <div className={styles.popupHeader}>Withdraw</div>
          <div className={styles.closeIcon} onClick={props.handleClose}>
            &#215;
          </div>
        </div>
        {props.content}
      </div>
    </div>
  );
};

export default DepositePopup;