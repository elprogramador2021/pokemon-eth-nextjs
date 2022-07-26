import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Header from "../components/Header";
import Body from "../components/Body";
import { AiFillGithub } from "react-icons/ai";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Pokemon</title>
                <meta name="description" content="Pokemon Factory" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                {/*<h1 className={styles.title}>Pokemon Factory</h1>*/}
                <Header />
                <Body />
            </main>

            <footer className={styles.footer}>
                <a href="https://github.com/elprogramador2021" target="_blank" rel="noreferrer">
                    <AiFillGithub size={30} /> Visit my Github{" "}
                </a>
            </footer>
        </div>
    );
}
