import styles from "@/styles/Advertiser.module.scss";
import AdvLayout from "../../Components/adv-layout";
// import advertiserData from "@/dummy/advertiserData.json";
// import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Swirl from "../../artifacts/contracts/Swirl.sol/Swirl.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";
import DepositePopup from "./depositepopup";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Swirl_address = "0x8f72c1d275284eE3f98022b62558Be758E8BA8A2";

export default function Advertiser() {
  const { address } = useAccount();
  const [depositeFund, setDepositeFund] = useState({
    fund: null,
  });

  const [matic, setMatic] = useState();
  const [selectedCampaign, setSelectedCampaign] = useState("Meta Tech");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const campaignsData = [
    { name: "Meta Tech", Impressions: 12000, Clicks: 800, Conversions: 120 },
    {
      name: "Illuminate Pvt Ltd",
      Impressions: 8000,
      Clicks: 500,
      Conversions: 80,
    },
    {
      name: "Titan Tech Labs",
      Impressions: 6000,
      Clicks: 400,
      Conversions: 60,
    },
    {
      name: "Nephilim Pvt Ltd",
      Impressions: 4000,
      Clicks: 200,
      Conversions: 40,
    },
  ];

  const data = campaignsData.map((campaign) => {
    return {
      name: campaign.name,
      Impressions: campaign.Impressions,
      Clicks: campaign.Clicks,
      Conversions: campaign.Conversions,
    };
  });

  const txSuccess = () => toast.success("hurray.. deposite success");

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

  useEffect(() => {
    console.log(depositeFund);
  }, [depositeFund]);

  // console.log(address);
  useEffect(() => {
    GetAdvBal();
  });
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);
  const exceptThisSymbols = ["e", "E", "+", "-"];

  // console.log(advertiserData);
  const depositeBtn = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.deposit(address, {
        value: ethers.utils.parseEther(depositeFund.fund.toString()),
      });
      await tx.wait();
      txSuccess();
      GetAdvBal();

      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const GetAdvBal = async () => {
    const contract = await getContract();
    console.log(contract);
    const getAdv = await contract.getAdvertiserBalance(address);

    console.log(getAdv);
    // console.log(ethers.utils.parseEther(getAdv.toString()));
    console.log(parseInt(getAdv));
    // console.log(
    //   parseInt(ethers.utils.parseUnits(parseInt(getAdv).toString(), "ether"))
    // );
    setMatic(ethers.utils.formatUnits(getAdv));
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  if (!mounted) return null;
  return (
    <AdvLayout>
      <div className={styles.dashboardMain}>
        <div className={styles.topBox}>
          <label className={styles.Header}>INSIGHTS</label>
          <div className={styles.inner}>
            <div className={styles.card}>
              <div className={styles.title}>Total Locked</div>
              <div className={styles.value}>{matic} Matic</div>
              <div>
                <input
                  className={styles.depoBtn}
                  type="button"
                  value="Deposite"
                  onClick={togglePopup}
                />
                {isOpen && (
                  <DepositePopup
                    content={
                      <>
                        <div className={styles.popupMain}>
                          <lable className={styles.popupLabel} for="deposite">
                            Enter Deposite Amount
                          </lable>
                          <input
                            className={styles.popupInput}
                            id="name"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            onKeyDown={(e) =>
                              exceptThisSymbols.includes(e.key) &&
                              e.preventDefault()
                            }
                            onChange={(e) => {
                              setDepositeFund({
                                ...depositeFund,
                                fund: e.target.value,
                              });
                            }}
                          />
                          <button
                            className={styles.popupBtn}
                            onClick={() => depositeBtn()}
                          >
                            Deposite
                          </button>
                        </div>
                      </>
                    }
                    handleClose={togglePopup}
                  />
                )}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.title}>Total Ads. Published</div>
              <div className={styles.value}>400</div>
            </div>
            <div className={styles.card}>
              <div className={styles.title}>Total Spent</div>
              <div className={styles.value}>80 Matic</div>
            </div>
          </div>
        </div>
        <div className={styles.graphBox}>
          {/* <motion.div
            className={styles.campaignGraphContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex' }}
          > */}
          <div className={styles.campaignsList}>
            {campaignsData.map((campaign) => (
              <motion.div
                key={campaign.name}
                className={styles.campaignSingle}
                onClick={() => setSelectedCampaign(campaign.name)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.campaignName}>{campaign.name}</div>
                <div className={styles.campaignMainData}>
                  <div className={styles.campaignDataOuter}>
                    <div className={styles.campaignDataLabel}>Impression</div>
                    <div className={styles.campaignDataValue}>
                      {campaign.Impressions}
                    </div>
                  </div>
                  <div className={styles.campaignDataOuter}>
                    <div className={styles.campaignDataLabel}>Clicks</div>
                    <div className={styles.campaignDataValue}>
                      {campaign.Clicks}
                    </div>
                  </div>
                  <div className={styles.campaignDataOuter}>
                    <div className={styles.campaignDataLabel}>Conversions</div>
                    <div className={styles.campaignDataValue}>
                      {campaign.Conversions}
                    </div>
                  </div>
                  <div className={styles.campaignDataOuter}>
                    <button className={styles.campaignDataBtn}>More</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className={styles.graphContainer}>
            <BarChart
              width={600}
              height={300}
              data={[data.find((d) => d.name === selectedCampaign)]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Impressions"
                fill="#4C7CFF"
                animationBegin={0}
                animationDuration={1500}
              />
              <Bar
                dataKey="Clicks"
                fill="#2E9AFE"
                animationBegin={0}
                animationDuration={1500}
              />
              <Bar
                dataKey="Conversions"
                fill="#0000FF"
                animationBegin={0}
                animationDuration={1500}
              />
            </BarChart>
          </div>
          {/* </motion.div> */}
        </div>

        <ToastContainer
          ToastContainer
          position="bottom-right"
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
    </AdvLayout>
  );
}
