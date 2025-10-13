import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  noindex?: boolean;
}

const defaultSEO = {
  title: 'Shalean Cleaning Services | Trusted Home Cleaning in Cape Town',
  description: 'Book trusted professional cleaners in Cape Town. Standard, deep, move-in/out, and Airbnb cleaning services. Easy online booking with flexible scheduling.',
  keywords: 'cleaning services Cape Town, professional cleaners, home cleaning, deep cleaning, move out cleaning, Airbnb cleaning, maid services, office cleaning, Claremont cleaners, affordable cleaning service',
  canonical: 'https://shalean.co.za',
  ogType: 'website',
  ogImage: 'https://shalean.co.za/images/og-image.jpg',
  twitterCard: 'summary_large_image'
};

export const SEO = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  canonical,
  ogType = defaultSEO.ogType,
  ogImage = defaultSEO.ogImage,
  ogUrl,
  twitterCard = defaultSEO.twitterCard,
  noindex = false
}: SEOProps) => {
  const fullTitle = title.includes('Shalean') ? title : `${title} | Shalean Cleaning Services`;
  const fullCanonical = canonical || `https://shalean.co.za${window.location.pathname}`;
  const fullOgUrl = ogUrl || fullCanonical;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Shalean Cleaning Services" />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:site_name" content="Shalean Cleaning Services" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

