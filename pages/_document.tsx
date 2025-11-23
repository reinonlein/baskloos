import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="nl">
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/bas_icon_192.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="BasKloos" />
          <meta
            name="description"
            content="Bekijk de foto's van creatieve projecten en knutselwerken."
          />
          <meta property="og:site_name" content="Baskloos" />
          <meta
            property="og:description"
            content="Bekijk de foto's van creatieve projecten en knutselwerken."
          />
          <meta property="og:title" content="Baskloos - Foto Gallery" />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
