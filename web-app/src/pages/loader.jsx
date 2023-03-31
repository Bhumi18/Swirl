import React, { useEffect } from 'react'
import Image from 'next/image';
import styles from "@/styles/Loader.module.scss";

export default function Loader({message="Loading..."}) {
    
    return (
        <div className={styles.loaderMain}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    <div className={styles.contentInner}>
                        <Image
                            width={100}
                            height={100}
                            className={styles.img}
                            src={"/swirl-logo2.png"}
                            alt={"logo"}
                        />
                        <div title={message}>
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
