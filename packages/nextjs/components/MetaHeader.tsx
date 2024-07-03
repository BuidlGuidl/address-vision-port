import React from "react";
import Head from "next/head";

type MetaHeaderProps = {
  address?: string;
  title?: string;
  description?: string;
  image?: string;
  twitterCard?: string;
  children?: React.ReactNode;
};

const baseUrl = "https://address.vision";

export const MetaHeader = ({
  address,
  title = "address.vision",
  description = "Peek into any address or ENS",
  image = "thumbnail.png",
  twitterCard = "summary_large_image",
  children,
}: MetaHeaderProps) => {
  const imageUrl = address ? `${baseUrl}/api/og/?addyOrEns=${address}` : `${baseUrl}/thumbnail.png`;

  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <link rel="icon" href="/eyes-emoji.svg" />
      <script defer data-domain="address.vision" src="https://plausible.io/js/script.js"></script> {children}
    </Head>
  );
};
