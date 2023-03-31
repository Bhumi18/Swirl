import styles from "@/styles/Home.module.css";
import Image from "next/image";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
// import {sample} from "swirl-sdk-sample";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import ConnectButtonCustom from "../Components/ConnectButtonCustom";
import { polygonMumbai, goerli, optimismGoerli } from "wagmi/chains";
import { Chat } from "@pushprotocol/uiweb";
import { ITheme } from "@pushprotocol/uiweb";
// import { useAccount } from "wagmi";

const chains = [polygonMumbai, goerli, optimismGoerli];

export default function Home() {
  const { isConnected } = useAccount();
  const { address } = useAccount();
  

  return (
    <RainbowKitProvider chains={chains}>
      <div className={styles.landing}>
        <div className={styles.bgContent}></div>
        <div className={styles.gradient2}></div>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <Image
              className={styles.main}
              width={150}
              height={130}
              alt={"icon"}
              src="/swirl-logo1.png"
              priority
            />
          </div>
          <div className={styles.btn}>
            {/* <button className={styles.cntBtn}>
              CONNECT WALLET
            </button> */}
            <ConnectButtonCustom />
          </div>
        </nav>
        <section className={styles.hero}>
          <div className={styles.heading}>
            <span>S</span>
            <span>W</span>
            <span>I</span>
            <span>R</span>
            <span>L</span>
          </div>
          <div className={styles.tagline}>
            The future of de-centralised advertisement
          </div>
          <div className={styles.btnHolder}>
            {/* <button className={styles.cntBtn}>CONNECT WALLET</button> */}
            <ConnectButtonCustom />
          </div>
        </section>
        <section className={styles.advSection}>
          <div className={styles.advMain}>
            <div className={styles.advLeft}>
              <div className={styles.illustrator}>
                <Image
                  width={400}
                  height={500}
                  className={styles.img}
                  alt={"Illustration"}
                  src="/static/illustration.png"
                />
                <Image
                  width={800}
                  height={700}
                  className={styles.bg}
                  alt={"Illustration-bg"}
                  src="/static/illustration-bg.png"
                />
              </div>
            </div>
            <div className={styles.advRight}>
              <div className={styles.title}>
                How SWIRL is going to benefit Advertisers?
              </div>
              <div className={styles.description}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam
                ipsa eligendi aut architecto, quos quidem reiciendis
                perspiciatis nisi optio possimus excepturi, itaque obcaecati
                voluptatem nihil assumenda quam doloremque ratione praesentium.
              </div>
              <div className={styles.kBtn}>
                <button className={styles.knowMore}>KNOW MORE</button>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.pubSection}>
          <div className={styles.pubMain}>
            <div className={styles.pubRight}>
              <div className={styles.title}>
                How SWIRL is going to benefit Publishers?
              </div>
              <div className={styles.description}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam
                ipsa eligendi aut architecto, quos quidem reiciendis
                perspiciatis nisi optio possimus excepturi, itaque obcaecati
                voluptatem nihil assumenda quam doloremque ratione praesentium.
              </div>
              <div className={styles.kBtn}>
                <button className={styles.knowMore}>KNOW MORE</button>
              </div>
            </div>
            <div className={styles.pubLeft}>
              <div className={styles.illustrator}>
                <Image
                  width={400}
                  height={500}
                  className={styles.img}
                  alt={"Illustration"}
                  src="/static/illustration.png"
                />
                <Image
                  width={800}
                  height={700}
                  className={styles.bg}
                  alt={"Illustration-bg"}
                  src="/static/illustration-bg.png"
                />
              </div>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>
          <div className={styles.copyRight}>
            &#169; 2023 swirl.com All Rights Reserved.
          </div>
          <div className={styles.handles}>
            <Image
              width={30}
              height={30}
              className={styles.icon}
              alt={"facebook"}
              src="/static/facebook.png"
            />
            <Image
              width={30}
              height={30}
              className={styles.icon}
              alt={"linkedIn"}
              src="/static/linkedin.png"
            />
            <Image
              width={30}
              height={30}
              className={styles.icon}
              alt={"instagram"}
              src="/static/instagram.png"
            />
          </div>
          <Chat
            account={address} //user address
            supportAddress="0x3F732382BCfE36B9e713DE33b8eD673BaCA49DFB" //support address
            env="staging"
          />
        </footer>
      </div>
    </RainbowKitProvider>
  );
}
