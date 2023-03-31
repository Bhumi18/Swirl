import React from "react";
import AdvLayout from "../../Components/adv-layout";
import styles from "@/styles/add-campaign.module.scss";
import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import Swirl from "../../artifacts/contracts/Swirl.sol/Swirl.json";
import { Web3Storage } from "web3.storage";
// safe
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import SafeServiceClient from "@safe-global/safe-service-client";

const Swirl_address = "0x8f72c1d275284eE3f98022b62558Be758E8BA8A2";

function AddCampaign() {
  const [campaignData, setCampaginData] = useState({
    campaignName: null,
    campaignBudget: null,
    campaignPpckick: null,
    contentCid: null,
  });
  const db = new Polybase({
    defaultNamespace:
      "pk/0x3dd0a82b180d872bf79edd4659c433f1a0165028da146e710a74d542f8217eaf31e842c710e1607da901443668a3821a84aaefe62200f250b4bed12b16e871ca/Advertise",
  });
  const collectionReference = db.collection("Advertise");
  const updateData = async () => {
    const uniqueId = Math.random().toString(36).substring(2);
    const recordData = await collectionReference.create([
      uniqueId,
      address,
      cid,
    ]);
    console.log(recordData);
  };

  const getData = async () => {
    const { data } = await collectionReference.record("tt14gns8zl").get();
    console.log(data);
  };
  const { address } = useAccount();
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRDOGI5MDZiNUIyMjJFM2Y4MTUzRTI1OEE3OEFGNzZCQkU2NDdGYzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzkxNjE1NzQ5NjYsIm5hbWUiOiJTd2lybCJ9.GmeMvijkrq0Pc24eHvrHNlwqCuVjCzJudWK4EAfY7Tk",
  });

  const [cid, setCid] = useState("");

  const exceptThisSymbols = ["e", "E", "+", "-"];
  useEffect(() => {
    console.log(campaignData);
  }, [campaignData]);

  useEffect(() => {
    if (campaignData.contentCid) {
      UploadImage();
    }
  }, [campaignData.contentCid]);

  async function UploadImage() {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      const rootCid = await client.put(fileInput.files, {
        name: campaignData.contentCid.name,
        maxRetries: 3,
      });

      const res = await client.get(rootCid); // Web3Response
      const files = await res.files(campaignData.contentCid); // Web3File[]
      for (const file of files) {
        setCid(file.cid);
      }
    } catch (e) {
      console.log(e);
    }
  }
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
  const uploadCampaign = async () => {
    try {
      console.log(address);
      const contract = await getContract();
      const tx = await contract.createCampaign(
        address,
        ethers.utils.parseEther(campaignData.campaignBudget.toString()),

        campaignData.campaignName,
        0,

        campaignData.campaignPpckick,
        cid
      );
      await tx.wait();
      updateData();

      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const addCampaignWithSafe = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // ethAdapter instance
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });
      console.log(EthersAdapter);
      // console.log(signer);

      // check safe is already created or not
      const safeService = new SafeServiceClient({
        txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
        ethAdapter,
      });
      console.log(safeService);

      const safes = await safeService.getSafesByOwner(address);
      console.log(safes);

      let safeAddress;
      for (let i = 0; i < safes.safes.length; i++) {
        const safeInfo = await safeService.getSafeInfo(safes.safes[i]);
        // console.log(safeInfo)
        if (safeInfo["owners"].length == 2) {
          if (
            safeInfo["owners"][1] ==
            "0xB4e6ee231C86bBcCB35935244CBE9cE333D30Bdf"
          ) {
            safeAddress = safes.safes[i];
            break;
          }
        }
      }
      // console.log(safeAddress)
      if (safeAddress) {
        const safeSdk = await Safe.create({
          ethAdapter: ethAdapter,
          safeAddress,
        });
        const newSafeAddress = safeSdk.getAddress();

        // encode
        const contract = new ethers.Contract(Swirl_address, Swirl.abi, signer);
        console.log(contract);
        const encoded_data = contract.interface.encodeFunctionData(
          "createCampaign",
          [
            address,
            ethers.utils.parseEther(campaignData.campaignBudget.toString()),
            campaignData.campaignName,
            0,
            campaignData.campaignPpckick,
            cid,
          ]
        );
        console.log(encoded_data);

        // create transaction
        const safeTransactionData = {
          to: Swirl_address,
          data: encoded_data,
          value: 0,
        };
        const safeTransaction = await safeSdk.createTransaction({
          safeTransactionData,
        });
        console.log("Transaction created!");

        // approve transaction
        const ethAdapterOwner2 = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });
        const safeSdk2 = await safeSdk.connect({
          ethAdapter: ethAdapterOwner2,
          newSafeAddress,
        });
        const txHash = await safeSdk2.getTransactionHash(safeTransaction);
        const approveTxResponse = await safeSdk2.approveTransactionHash(txHash);
        await approveTxResponse.transactionResponse?.wait();
        console.log("Approved");
      } else {
        // deploy a new safe
        const safeFactory = await SafeFactory.create({ ethAdapter });
        const owners = [address, "0xB4e6ee231C86bBcCB35935244CBE9cE333D30Bdf"];
        const threshold = 2;
        const safeAccountConfig = {
          owners: owners,
          threshold: threshold,
        };
        const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
        // console.log(safeSdk);
        console.log("Safe created!");
        const newSafeAddress = safeSdk.getAddress();

        // encode
        const contract = new ethers.Contract(Swirl_address, Swirl.abi, signer);
        console.log(contract);
        const encoded_data = contract.interface.encodeFunctionData(
          "createCampaign",
          [
            address,
            ethers.utils.parseEther(campaignData.campaignBudget.toString()),
            campaignData.campaignName,
            0,
            campaignData.campaignPpckick,
            cid,
          ]
        );
        console.log(encoded_data);

        // create transaction
        const safeTransactionData = {
          to: Swirl_address,
          data: encoded_data,
          value: 0,
        };
        const safeTransaction = await safeSdk.createTransaction({
          safeTransactionData,
        });
        console.log("Transaction created!");

        // approve transaction
        const ethAdapterOwner2 = new EthersAdapter({
          ethers,
          signerOrProvider: signer,
        });
        const safeSdk2 = await safeSdk.connect({
          ethAdapter: ethAdapterOwner2,
          newSafeAddress,
        });
        const txHash = await safeSdk2.getTransactionHash(safeTransaction);
        const approveTxResponse = await safeSdk2.approveTransactionHash(txHash);
        await approveTxResponse.transactionResponse?.wait();
        console.log("Approved");
      }
    }
  };

  return (
    <AdvLayout>
      <div className={styles.cpMain}>
        <h1 className={styles.cpHeading}>Add campaign</h1>
        <div className={styles.form}>
          <div>
            <label>Name </label>
            <input
              id="name"
              type="text"
              placeholder="eg.Crypto Advertisement"
              name="name"
              required
              onChange={(e) => {
                setCampaginData({
                  ...campaignData,
                  campaignName: e.target.value,
                });
              }}
            />
          </div>

          <div>
            <label>Ad-Budget</label>
            <input
              id="name"
              type="number"
              step="0.1"
              min="0"
              max="20"
              onKeyDown={(e) =>
                exceptThisSymbols.includes(e.key) && e.preventDefault()
              }
              onChange={(e) => {
                setCampaginData({
                  ...campaignData,
                  campaignBudget: e.target.value,
                });
              }}
              placeholder="eg.1, 0.1"
              name="name"
              required
            />
          </div>
          <div>
            <label>Pay-per-click</label>
            <input
              id="name"
              type="number"
              step="0.1"
              min="0"
              max="20"
              onKeyDown={(e) =>
                exceptThisSymbols.includes(e.key) && e.preventDefault()
              }
              onChange={(e) => {
                setCampaginData({
                  ...campaignData,
                  campaignPpckick: e.target.value,
                });
              }}
              placeholder="eg.1, 0.1"
              name="name"
              required
            />
          </div>
          <div>
            <label>upload Content</label>
            <input
              id="name"
              type="file"
              placeholder="Crypto Advertisement"
              name="name"
              required
              onChange={(e) => {
                setCampaginData({
                  ...campaignData,
                  contentCid: e.target.value,
                });
              }}
            />
          </div>
          <button onClick={() => addCampaignWithSafe()} className={styles.btn}>
            upload Campaign
          </button>
        </div>
      </div>
    </AdvLayout>
  );
}

export default AddCampaign;
