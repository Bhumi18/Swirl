import { useState, useEffect } from "react";
import PubLayout from "./pub-layout";
import styles from "@/styles/Publisher.module.scss";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import PublishPopup from "./publishpopup";

const campaignsData = [
  { name: "Meta Tech", Impressions: 12000, Clicks: 800, Conversions: 120 },
];

export default function Publisher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PubLayout>
      <div className={styles.pubDashboardMain}>
        <div className={styles.pubTopBox}>
          <label className={styles.pubHeader}>META TECH</label>
          <div className={styles.pubInner}>
            <div className={styles.pubCard}>
              <div className={styles.pubTitle}>Total Earned</div>
              <div className={styles.pubValue}>1.234 Matic</div>
              <div>
                <input
                  className={styles.pubDepoBtn}
                  type="button"
                  value="Withdraw"
                  onClick={togglePopup}
                />
                {isOpen && (
                  <PublishPopup
                    content={
                      <>
                        <div className={styles.pubPopupMain}>
                          <lable
                            className={styles.pubPopupLabel}
                            for="withdraw"
                          >
                            Enter Withdraw Amount
                          </lable>
                          <input
                            className={styles.pubPopupInput}
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
                            className={styles.pubPopupBtn}
                            onClick={() => depositeBtn()}
                          >
                            Withdraw
                          </button>
                        </div>
                      </>
                    }
                    handleClose={togglePopup}
                  />
                )}
              </div>
            </div>
            <div className={styles.pubCard}>
              <div className={styles.pubTitle}>Total Impressions</div>
              <div className={styles.pubValue}>1200</div>
            </div>
            <div className={styles.pubCard}>
              <div className={styles.pubTitle}>Total Clicks</div>
              <div className={styles.pubValue}>800</div>
            </div>
          </div>
        </div>

        <div className={styles.pubGraphBox}>
          {/* <motion.div
            className={styles.campaignGraphContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex' }}
          > */}
          <div className={styles.pubCampaignsList}>
            <div>
              <motion.div
                className={styles.pubCampaignSingle}
                onClick={() => setSelectedCampaign(campaign.name)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.pubCampaignName}>Meta Tech</div>
                <div className={styles.pubCampaignMainData}>
                  <div className={styles.pubCampaignDataOuter}>
                    <div className={styles.pubCampaignDataLabel}>
                      Impression
                    </div>
                    <div className={styles.pubCampaignDataValue}>1200</div>
                  </div>
                  <div className={styles.pubCampaignDataOuter}>
                    <div className={styles.pubCampaignDataLabel}>Clicks</div>
                    <div className={styles.pubCampaignDataValue}>800</div>
                  </div>
                  <div className={styles.pubCampaignDataOuter}>
                    <div className={styles.pubCampaignDataLabel}>
                      Conversions
                    </div>
                    <div className={styles.pubCampaignDataValue}>120</div>
                  </div>
                  {/* <div className={styles.pubCampaignDataOuter}>
                    <button className={styles.pubCampaignDataBtn}>More</button>
                  </div> */}
                </div>
              </motion.div>
            </div>
          </div>
          <div className={styles.pubGraphContainer}>
            <BarChart
              width={600}
              height={300}
              data={campaignsData}
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
    </PubLayout>
  );
}