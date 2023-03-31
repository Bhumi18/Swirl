import Navbar from "../../src/pages/advertiser/navbar"
import styles from "@/styles/Advertiser.module.scss"
import Loader from "../pages/loader";
export default function AdvLayout({ children }) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
        </>
    )
}