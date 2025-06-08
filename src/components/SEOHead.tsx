
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "Nepalese Rhinos FC - Football Club in Shepparton",
  description = "Official website of Nepalese Rhinos FC - A passionate football community bringing together Nepalese heritage and Australian spirit in Shepparton.",
  image = "/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png",
  url = window.location.href,
  type = "website"
}: SEOHeadProps) => {
  const fullTitle = title.includes("Nepalese Rhinos FC") ? title : `${title} | Nepalese Rhinos FC`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Nepalese Rhinos FC, football club, Shepparton, Nepal, soccer, community, sports" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Nepalese Rhinos FC" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Nepalese Rhinos FC" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead;
