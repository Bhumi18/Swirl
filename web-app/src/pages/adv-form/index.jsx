import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AdvertiserForm.module.scss";
import axios from "axios";
import Swirl from "../../artifacts/contracts/Swirl.sol/Swirl.json";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as PushAPI from "@pushprotocol/restapi";

const Swirl_address = "0x8f72c1d275284eE3f98022b62558Be758E8BA8A2";

function AdvForm() {
  const toastInfo = () =>
    toast.info("Wait until your transection has been complete");
  const txError = () =>
    toast.error("oh no.. your transection was unsuccessful");

  const optInSuccess = () => {
    toast.success("PUSH Notification OptIN Success");
  };

  const route = useRouter();

  // const ethers = require("ethers");
  const PK = "0f2db27202baaa96a1e6f683cef371032e6c0f7bc44c7e1e125f086a4359a7a2";
  const Pkey = `0x${PK}`;
  const signerpk = new ethers.Wallet(Pkey);

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signerpk,
      channelAddress: "eip155:5:0x3F732382BCfE36B9e713DE33b8eD673BaCA49DFB", // channel address in CAIP
      userAddress: "eip155:5:" + address, // user address in CAIP
      onSuccess: () => {
        optInSuccess();
        console.log("opt in success");
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  };
  const [formData, setFormData] = useState({
    orgUsername: null,
    orgName: null,
    orgLogo: null,
    orgDescription: null,
    orgOrigin: null,
    orgEmpStrength: null,
    orgFounder: null,
    orgCategory: null,
  });

  const [cid, setCid] = useState("");
  const { address } = useAccount();

  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRDOGI5MDZiNUIyMjJFM2Y4MTUzRTI1OEE3OEFGNzZCQkU2NDdGYzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNjE1NzQ5NjYsIm5hbWUiOiJTd2lybCJ9.GmeMvijkrq0Pc24eHvrHNlwqCuVjCzJudWK4EAfY7Tk",
  });

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://countriesnow.space/api/v0.1/countries/").then((res) => {
      let data = res.data.data;
      let country = data.map((d) => {
        return d.country;
      });
      setCountries(country);
    });
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (formData.orgLogo) {
      UploadImage();
    }
  }, [formData.orgLogo]);

  const getContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 84531) {
          const contract = new ethers.Contract(
            Swirl_address,
            Swirl.abi,
            signer
          );
          return contract;
        } else {
          alert("Please connect to the polygon Mumbai testnet Network!");
        }
      }
      console.log(signer);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(address)

  const submitData = async () => {
    try {
      console.log(address);
      const contract = await getContract();
      const tx = await contract.createAdvertiser(
        address,
        formData.orgUsername,
        formData.orgName,
        // formData.orgLogo,
        cid,
        formData.orgDescription,
        formData.orgOrigin,
        formData.orgEmpStrength,
        formData.orgFounder,
        formData.orgCategory
      );
      await tx.wait();
      toastInfo();
      optIn();
      await sendNotification();

      console.log(tx);

      route.push("/advertiser");
    } catch (error) {
      txError();
      console.log(error);
    }
  };
  async function UploadImage() {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      const rootCid = await client.put(fileInput.files, {
        name: formData.orgLogo.name,
        maxRetries: 3,
      });

      const res = await client.get(rootCid); // Web3Response
      const files = await res.files(formData.orgLogo); // Web3File[]
      for (const file of files) {
        setCid(file.cid);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const sendNotification = async () => {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`,
      },
      payload: {
        title: `Swirl-Welcome advertiser`,
        body: `Welcome to the Swirl`,
        cta: "",
        img: "",
      },
      recipients: "eip155:5:" + address, // recipient address
      channel: "eip155:5:0x3F732382BCfE36B9e713DE33b8eD673BaCA49DFB", // your channel address
      env: "staging",
    });
  };

  // const createPub = async () => {
  //   try {
  //     const contract = await getContract();
  //     const tx = await contract.createPublisher(address);
  //     await tx.wait();
  //     console.log(tx);
  //   } catch (error) {
  //     Route.push("/pub-form");
  //   }
  // };

  return (
    <div className={styles.AdvFormMain}>
      <div className={styles.advFormInner}>
        <h1 className={styles.advFormHeader}>Complete the registration</h1>
        <div className={styles.advFormInnerMain}>
          <div id={styles.firstDiv} className={styles.firDivs}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) => {
                setFormData({ ...formData, orgUsername: e.target.value });
              }}
            />
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="logo">Logo</label>
            <input
              className="formlogo"
              type="file"
              id="logo"
              accept="image/*"
              onChange={(e) => {
                setFormData({ ...formData, orgLogo: e.target.files[0] });
              }}
            />
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgname">Name</label>
            <input
              type="text"
              id="orgname"
              onChange={(e) => {
                setFormData({ ...formData, orgName: e.target.value });
              }}
            />
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgdescription">Description</label>
            <textarea
              id="orgdescription"
              onChange={(e) => {
                setFormData({ ...formData, orgDescription: e.target.value });
              }}
            ></textarea>
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgorigin">Country of Origin</label>
            <select
              id="orgorigin"
              onChange={(e) => {
                e.preventDefault();
                setFormData({ ...formData, orgOrigin: e.target.value });
              }}
              defaultValue="N/A"
            >
              <option value="">----- Select a Country -----</option>
              {countries.length > 0
                ? countries.map((i, index) => {
                    return (
                      <option value={i} key={index}>
                        {i}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgstrength">Employee Strength</label>
            <input
              type="number"
              id="orgstrength"
              onChange={(e) => {
                setFormData({ ...formData, orgEmpStrength: e.target.value });
              }}
            />
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgfounder">Founder Name</label>
            <input
              type="text"
              id="orgfounder"
              onChange={(e) => {
                setFormData({ ...formData, orgFounder: e.target.value });
              }}
            />
          </div>
          <div className={styles.otherDivs}>
            <label htmlFor="orgcategory">Firm Category</label>
            <input
              type="text"
              id="orgcategory"
              onChange={(e) => {
                setFormData({ ...formData, orgCategory: e.target.value });
              }}
            />
          </div>
          <div>
            <label htmlFor="SubmitForm"></label>
            <input
              type="button"
              id="Sub</div>mitForm"
              className={styles.submitForm}
              onClick={() => submitData()}
              value="Add details"
            />
          </div>
        </div>
        <ToastContainer
          ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        ></ToastContainer>
      </div>
    </div>
  );
}

export default AdvForm;