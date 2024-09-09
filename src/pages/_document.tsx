import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='UTF-8' />
        <meta name='description' content='mix-ai' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='format-detection' content='telephone=no' />
        <meta name='apple-mobile-web-app-title' content='mix-ai' />
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
