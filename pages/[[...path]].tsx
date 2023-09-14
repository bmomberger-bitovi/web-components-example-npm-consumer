import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import styles from '../styles/Home.module.css';
import Breadcrumbs, { RouteChangeEvent } from 'web-components-example/components/Breadcrumbs';
import NavLinks, { PrefetchRequestEvent, RouteRequestEvent } from 'web-components-example/components/NavLinks';

export default function Home() {

  const [lastError, setLastError] = useState<string | null>(null);
  const router = useRouter();
  const navLinksRef = useRef<HTMLElement>();

  useEffect(() => {
    const handler = (ev: RouteRequestEvent) => {
      if (!ev.detail.href.includes("invalid")) {
         router.push(ev.detail.href);
         setLastError(null);
      } else {
        setLastError(`Invalid route detected: ${ev.detail.href}`);
      }
    };
    const pfHandler = (ev: PrefetchRequestEvent) => {
      if (!ev.detail.href.includes("invalid")) {
         router.prefetch(ev.detail.href);
      }
    };

    if(navLinksRef.current) {
      const currentRef = navLinksRef.current;
      currentRef.addEventListener("routerequest", handler);
      currentRef.addEventListener("prefetchrequest", pfHandler);
      return () => {
        currentRef.removeEventListener("routerequest", handler);
        currentRef.removeEventListener("prefetchrequest", pfHandler);
      }
    }

  }, [navLinksRef.current]);

  const routeAsPath = (router.query.path as string[] | undefined)?.join("/");

  useEffect(() => {
    const ev: RouteChangeEvent = new CustomEvent("routechange", {
      detail: {
        url: "/" + (routeAsPath ?? "")
      }
    });

    document.dispatchEvent(ev);
  }, [routeAsPath ?? ""]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main ref={navLinksRef}>
        <h1>This is an internal app that pulls in the components through npm at build time</h1>

        <p>Bread Crumbs</p>
        <Breadcrumbs routeRoot="/" initialRoute={routeAsPath ?? ""} />
        <hr/>

        <div ref={navLinksRef}>
        <p>Nav Links</p>
        <NavLinks routeRoot="/" initialRoute={routeAsPath ?? ""} />
        </div>
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