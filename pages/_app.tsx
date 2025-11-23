import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-0Y9RHCPZ94"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0Y9RHCPZ94');
          `,
        }}
      />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
