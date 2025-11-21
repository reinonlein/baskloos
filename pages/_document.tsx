import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="nl">
        <Head>
          <link rel="icon" type="image/jpeg" href="/bas_icon_48.jpg" />
          <link rel="apple-touch-icon" href="/bas_icon_192.jpg" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
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
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Baskloos - Foto Gallery" />
          <meta
            name="twitter:description"
            content="Bekijk de foto's van creatieve projecten en knutselwerken."
          />
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
