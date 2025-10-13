import { Helmet } from 'react-helmet-async';

interface LocalBusinessProps {
  type?: 'LocalBusiness' | 'Service';
  name?: string;
  description?: string;
  serviceType?: string;
  areaServed?: string[];
}

export const LocalBusinessStructuredData = ({
  type = 'LocalBusiness',
  name = 'Shalean Cleaning Services',
  description = 'Professional cleaning services in Cape Town offering standard, deep, move-in/out, and specialized cleaning solutions.',
  serviceType,
  areaServed
}: LocalBusinessProps = {}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    image: 'https://shalean.co.za/images/logo.png',
    url: 'https://shalean.co.za',
    telephone: '+27 87 153 5250',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '39 Harvery Road, Claremont 7708',
      addressLocality: 'Cape Town',
      addressRegion: 'Western Cape',
      postalCode: '7708',
      addressCountry: 'ZA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-33.9825',
      longitude: '18.4654'
    },
    priceRange: 'R350-R5000',
    openingHours: 'Mo-Sa 08:00-18:00',
    sameAs: [
      'https://www.facebook.com/shaleancleaning',
      'https://www.instagram.com/shalean_cleaning_services'
    ],
    ...(serviceType && {
      '@type': 'Service',
      serviceType,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Shalean Cleaning Services'
      }
    }),
    ...(areaServed && {
      areaServed: areaServed.map(area => ({
        '@type': 'City',
        name: area
      }))
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbStructuredData = ({ items }: { items: BreadcrumbItem[] }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const ServiceStructuredData = ({ 
  name, 
  description, 
  price,
  url 
}: { 
  name: string; 
  description: string; 
  price?: string;
  url?: string;
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Shalean Cleaning Services',
      telephone: '+27 87 153 5250',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '39 Harvery Road, Claremont 7708',
        addressLocality: 'Cape Town',
        addressCountry: 'ZA'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Cape Town'
    },
    ...(price && { offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'ZAR'
    }}),
    ...(url && { url })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

