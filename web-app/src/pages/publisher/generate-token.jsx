import React from "react";
import styles from "@/styles/PublishGenerateTokens.module.scss";
import PubLayout from "./pub-layout";
import { Polybase } from "@polybase/client";
import { axios } from "axios";
import { useAccount } from "wagmi";

function GenerateToken() {
  // const db = new Polybase({
  //   defaultNamespace:
  //     "pk/0x3dd0a82b180d872bf79edd4659c433f1a0165028da146e710a74d542f8217eaf31e842c710e1607da901443668a3821a84aaefe62200f250b4bed12b16e871ca/Token",
  // });
  const { address } = useAccount();

  const axios = require("axios");

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:3000/api/token?address=${address}`,
    headers: {},
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <PubLayout>
      <div className={styles.genMain}>
        <div className={styles.genOuter}>
          <div className={styles.genHeader}>Generate Tokens</div>
          <div className={styles.genContent}>
            If you are looking to monetize your content, Project Swirl offers an innovative advertisement platform that can help increase your ad revenue. With our unique token system, you can easily integrate our advertisement package into your application, and gain access to powerful targeting and optimization tools. Sign up for our services today and start monetizing your content efficiently.
          </div>
          <button className={styles.genBtn}>Generate</button>
        </div>
      </div>
    </PubLayout>
  );
}

export default GenerateToken;