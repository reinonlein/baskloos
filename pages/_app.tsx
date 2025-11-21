import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
