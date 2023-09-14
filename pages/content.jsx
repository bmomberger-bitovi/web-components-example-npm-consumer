import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.css';
import Breadcrumbs from 'web-components-example/components/Breadcrumbs';
import NavLinks from 'web-components-example/components/NavLinks';

const DynamicPageContent = dynamic(
  () => import("web-components-example/components/PageContent")
);

export default function Content() {

  const [lastError, setLastError] = useState(null);
  const router = useRouter();
  const navLinksRef = useRef();

  useEffect(() => {
    const handler = (ev) => {
      if (!ev.detail.href.includes("invalid")) {
         router.push(ev.detail.href);
         setLastError(null);
      } else {
        setLastError(`Invalid route detected: ${ev.detail.href}`);
      }
    };

    if(navLinksRef.current) {
      const currentRef = navLinksRef.current;
      currentRef.addEventListener("routerequest", handler);
      return () => {
        currentRef.removeEventListener("routerequest", handler);
      }
    }
  }, [navLinksRef.current]);

  useEffect(() => {
      const ev = new CustomEvent("routechange", {
        detail: {
          url: "/content"
        }
      });

      document.dispatchEvent(ev);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main ref={navLinksRef}>
        <h1>This is an internal app that pulls in the components through npm at build time</h1>

        <p>Bread Crumbs</p>
        <Breadcrumbs routeRoot="/" initialRoute="/content" />
        <hr/>

        <p>Nav Links</p>
        <NavLinks routeRoot="/" initialRoute="/content" />

        <p>Page Content</p>
        <DynamicPageContent />
      </main>

      <footer>
        <p>Last error:</p>
        {lastError && <p>{lastError}</p>}
      </footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}