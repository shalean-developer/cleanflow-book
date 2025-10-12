import { Home, Droplets, Building2, Sparkles, Calendar, Car, Wrench } from 'lucide-react';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';
import serviceMoveImage from '@/assets/service-move-inout.jpg';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';

export type ServiceGroup = 'routine' | 'turnover' | 'special';

export type Service = {
  slug: string;
  name: string;
  group: ServiceGroup;
  priceLabel: string;
  href: string;
  badge?: string;
  description: string;
  image: string;
};

export type ServiceGroupData = {
  id: ServiceGroup;
  icon: any;
  title: string;
  description: string;
  services: Service[];
};

export const serviceGroups: ServiceGroupData[] = [
  {
    id: 'routine',
    icon: Home,
    title: 'Routine Home Care',
    description: 'Keep your space consistently fresh.',
    services: [
      {
        slug: 'standard-cleaning',
        name: 'Standard Cleaning',
        group: 'routine',
        priceLabel: 'From R350',
        href: '/booking/service/standard-cleaning',
        description: 'Regular maintenance to keep your home tidy.',
        image: serviceStandardImage
      }
    ]
  },
  {
    id: 'turnover',
    icon: Droplets,
    title: 'Deep & Turnover Clean',
    description: 'Reset your space for a fresh start or guest-ready shine.',
    services: [
      {
        slug: 'deep-cleaning',
        name: 'Deep Cleaning',
        group: 'turnover',
        priceLabel: 'From R550',
        href: '/booking/service/deep-cleaning',
        description: 'Top-to-bottom clean for kitchens, bathrooms, and hard-to-reach areas.',
        image: serviceDeepImage
      },
      {
        slug: 'move-in-out-cleaning',
        name: 'Move In/Out Cleaning',
        group: 'turnover',
        priceLabel: 'From R650',
        href: '/booking/service/move-in-out-cleaning',
        description: 'Detailed clean for seamless move transitions.',
        image: serviceMoveImage
      },
      {
        slug: 'airbnb-turnover',
        name: 'Airbnb / Short-Stay Turnover',
        group: 'turnover',
        priceLabel: 'From R450',
        href: '/booking/service/airbnb-turnover',
        badge: 'Host-Ready',
        description: 'Fast, hotel-style resets between guests.',
        image: serviceStandardImage // Using standard cleaning image for now
      }
    ]
  },
  {
    id: 'special',
    icon: Sparkles,
    title: 'Specialized Treatments',
    description: 'Targeted solutions for specific needs.',
    services: [
      {
        slug: 'carpet-upholstery',
        name: 'Carpet & Upholstery',
        group: 'special',
        priceLabel: 'Custom Quote',
        href: '/booking/service/carpet-upholstery',
        description: 'Deep clean to revive fabrics and remove stains.',
        image: serviceSpecializedImage
      },
      {
        slug: 'post-construction',
        name: 'Post-Construction Clean',
        group: 'special',
        priceLabel: 'Custom Quote',
        href: '/booking/service/post-construction',
        description: 'Dust and debris removal after renovations.',
        image: serviceSpecializedImage
      },
      {
        slug: 'specialized',
        name: 'Interior Windows / Walls',
        group: 'special',
        priceLabel: 'Custom Quote',
        href: '/booking/service/specialized',
        description: 'Streak-free glass and wall wipe-downs.',
        image: serviceSpecializedImage
      }
    ]
  }
];

// Helper function to get all services as a flat array
export const getAllServices = (): Service[] => {
  return serviceGroups.flatMap(group => group.services);
};

// Helper function to get service by slug
export const getServiceBySlug = (slug: string): Service | undefined => {
  return getAllServices().find(service => service.slug === slug);
};
