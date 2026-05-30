export interface Equipment {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  owner: {
    name: string;
    avatar: string;
    memberSince: string;
    rating: number;
    responseRate: string;
  };
  location: string;
  pricePerDay: number;
  minDays: number;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'booked' | 'coming_soon';
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  horsepower?: number;
  year: number;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  farm: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface Rental {
  id: string;
  equipment: Equipment;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

export interface Conversation {
  id: string;
  participant: string;
  participantAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

export const categories = ['All', 'Tractors', 'Harvesters', 'Irrigation', 'Tillage', 'Planting', 'Hay & Forage'];

export const equipmentData: Equipment[] = [
  {
    id: '1',
    name: 'John Deere 8R 370',
    category: 'Tractors',
    subcategory: 'Row Crop',
    owner: {
      name: 'Mike Peterson',
      avatar: '/images/avatar-farmer-1.jpg',
      memberSince: '2023',
      rating: 4.8,
      responseRate: '98%',
    },
    location: 'Iowa, USA',
    pricePerDay: 450,
    minDays: 3,
    rating: 4.7,
    reviewCount: 12,
    availability: 'available',
    image: '/images/equip-tractor-1.jpg',
    gallery: ['/images/detail-gallery-1.jpg', '/images/detail-gallery-2.jpg', '/images/detail-gallery-3.jpg', '/images/detail-gallery-4.jpg'],
    description: 'The John Deere 8R 370 is a high-horsepower row crop tractor built for maximum productivity. Featuring the e23 PowerShift transmission, CommandView III cab, and advanced precision ag technology. Perfect for spring tillage, planting, and heavy field work. Well-maintained with regular service records.',
    specs: {
      'Horsepower': '370 HP',
      'Year': '2022',
      'Hours': '1,240',
      'Fuel': 'Diesel',
      'Transmission': 'e23 PowerShift',
      'Weight': '14,200 kg',
    },
    horsepower: 370,
    year: 2022,
    features: ['GPS Ready', 'Air Conditioning', 'Front Loader Compatible', 'PTO'],
  },
  {
    id: '2',
    name: 'CLAAS LEXION 780',
    category: 'Harvesters',
    subcategory: 'Combine',
    owner: {
      name: 'Sarah Mitchell',
      avatar: '/images/avatar-farmer-2.jpg',
      memberSince: '2023',
      rating: 4.9,
      responseRate: '95%',
    },
    location: 'Kansas, USA',
    pricePerDay: 850,
    minDays: 5,
    rating: 4.9,
    reviewCount: 8,
    availability: 'available',
    image: '/images/equip-harvester-1.jpg',
    gallery: ['/images/equip-harvester-1.jpg', '/images/detail-gallery-2.jpg'],
    description: 'The CLAAS LEXION 780 is a flagship combine harvester with APS SYNFLOW HYBRID technology. Delivers exceptional throughput and grain quality. Ideal for large-scale wheat, corn, and soybean harvest operations.',
    specs: {
      'Engine Power': '790 HP',
      'Year': '2023',
      'Hours': '890',
      'Grain Tank': '18,000 L',
      'Header Width': '12.3 m',
      'Unloading Rate': '210 L/s',
    },
    year: 2023,
    features: ['Auto Steering', 'Loss Monitoring', 'Moisture Sensor', 'Night Lights'],
  },
  {
    id: '3',
    name: 'Valley 8000 Series Pivot',
    category: 'Irrigation',
    subcategory: 'Center Pivot',
    owner: {
      name: 'Jim Henderson',
      avatar: '/images/avatar-farmer-3.jpg',
      memberSince: '2022',
      rating: 4.6,
      responseRate: '92%',
    },
    location: 'Nebraska, USA',
    pricePerDay: 120,
    minDays: 7,
    rating: 4.5,
    reviewCount: 15,
    availability: 'available',
    image: '/images/equip-irrigation-1.jpg',
    gallery: ['/images/equip-irrigation-1.jpg'],
    description: 'Valley 8000 Series center pivot irrigation system. 40-acre coverage with precision sprinkler packages. Energy-efficient drive system with remote monitoring capabilities.',
    specs: {
      'Coverage': '40 acres',
      'Year': '2021',
      'Span Length': '402 m',
      'Drive Type': 'Electric',
      'Flow Rate': '1,200 GPM',
      'Pressure': '50 PSI',
    },
    year: 2021,
    features: ['Remote Control', 'Variable Rate', 'GPS Guidance', 'Weather Integration'],
  },
  {
    id: '4',
    name: 'Kuhn Discover XL',
    category: 'Tillage',
    subcategory: 'Disc Harrow',
    owner: {
      name: 'Mike Peterson',
      avatar: '/images/avatar-farmer-1.jpg',
      memberSince: '2023',
      rating: 4.8,
      responseRate: '98%',
    },
    location: 'Iowa, USA',
    pricePerDay: 85,
    minDays: 2,
    rating: 4.6,
    reviewCount: 6,
    availability: 'available',
    image: '/images/equip-tillage-1.jpg',
    gallery: ['/images/equip-tillage-1.jpg'],
    description: 'Kuhn Discover XL disc harrow with independent disc suspension. 6-meter working width for efficient primary and secondary tillage. Aggressive blade angle for excellent residue mixing.',
    specs: {
      'Working Width': '6.0 m',
      'Year': '2022',
      'Disc Diameter': '660 mm',
      'Weight': '8,500 kg',
      'Disc Count': '48',
      'Hitch': 'Cat III/IV',
    },
    year: 2022,
    features: ['Hydraulic Depth', 'Roller Option', 'Quick Fold', 'Disc Protection'],
  },
  {
    id: '5',
    name: 'John Deere DB90 Planter',
    category: 'Planting',
    subcategory: 'Row Planter',
    owner: {
      name: 'Sarah Mitchell',
      avatar: '/images/avatar-farmer-2.jpg',
      memberSince: '2023',
      rating: 4.9,
      responseRate: '95%',
    },
    location: 'Kansas, USA',
    pricePerDay: 200,
    minDays: 3,
    rating: 4.8,
    reviewCount: 10,
    availability: 'coming_soon',
    image: '/images/equip-planter-1.jpg',
    gallery: ['/images/equip-planter-1.jpg'],
    description: 'John Deere DB90 36-row planter with ExactEmerge high-speed delivery system. Plant at speeds up to 15 mph without sacrificing accuracy. Active pneumatic downforce and seed monitoring.',
    specs: {
      'Rows': '36',
      'Year': '2023',
      'Row Spacing': '20"',
      'Working Width': '18.3 m',
      'Seed Capacity': '3,200 L',
      'Population': 'Up to 50,000 seeds/ac',
    },
    year: 2023,
    features: ['ExactEmerge', 'Section Control', 'Population Monitor', 'Liquid Fertilizer'],
  },
  {
    id: '6',
    name: 'Vermeer 504 R Classic',
    category: 'Hay & Forage',
    subcategory: 'Round Baler',
    owner: {
      name: 'Jim Henderson',
      avatar: '/images/avatar-farmer-3.jpg',
      memberSince: '2022',
      rating: 4.6,
      responseRate: '92%',
    },
    location: 'Nebraska, USA',
    pricePerDay: 150,
    minDays: 2,
    rating: 4.4,
    reviewCount: 9,
    availability: 'booked',
    image: '/images/equip-hay-1.jpg',
    gallery: ['/images/equip-hay-1.jpg'],
    description: 'Vermeer 504 R Classic round baler produces 4x5 foot bales. Camless pickup design for cleaner feeding and less maintenance. Ideal for grass hay, alfalfa, and straw baling operations.',
    specs: {
      'Bale Size': '4 x 5 ft',
      'Year': '2022',
      'Pickup Width': '2.0 m',
      'Weight': '3,200 kg',
      'Bale Weight': 'Up to 1,200 lbs',
      'Wrapping': 'Net / Twine',
    },
    year: 2022,
    features: ['Camless Pickup', 'Auto Wrap', 'Bale Counter', 'Moisture Monitor'],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Robert Carter',
    role: 'Farm Owner',
    farm: 'Carter Family Farms',
    avatar: '/images/avatar-farmer-1.jpg',
    rating: 5,
    quote: "AgriRent saved our harvest season. When our combine broke down, we had a replacement booked within hours. The equipment was in perfect condition and the owner was incredibly helpful.",
  },
  {
    id: '2',
    name: 'Amanda Foster',
    role: 'Operations Manager',
    farm: 'Green Valley Organics',
    avatar: '/images/avatar-farmer-2.jpg',
    rating: 5,
    quote: "We've been listing our idle equipment on AgriRent for a year now. The extra income has been fantastic, and knowing we're helping neighboring farms makes it even better.",
  },
  {
    id: '3',
    name: 'Walter Brooks',
    role: 'Independent Farmer',
    farm: 'Brooks Grain Co.',
    avatar: '/images/avatar-farmer-3.jpg',
    rating: 4,
    quote: "As a small operation, buying a new tractor was out of reach. Through AgriRent, I can access professional-grade equipment when I need it. The booking process is straightforward and transparent.",
  },
];

export const stats = [
  { value: '2,400+', label: 'Equipment Listed' },
  { value: '18,000+', label: 'Rentals Completed' },
  { value: '$4.2M', label: 'Farmer Earnings' },
  { value: '4.8', label: 'Average Rating' },
];

export const howItWorksSteps = [
  {
    number: '1',
    title: 'Search',
    description: 'Browse our catalog of tractors, harvesters, and specialized equipment near you.',
    icon: 'Search',
  },
  {
    number: '2',
    title: 'Book',
    description: 'Select your dates, submit a rental request, and get approved within hours.',
    icon: 'Calendar',
  },
  {
    number: '3',
    title: 'Confirm',
    description: 'Owner reviews your request. Coordinate pickup or delivery details.',
    icon: 'Handshake',
  },
  {
    number: '4',
    title: 'Farm',
    description: "Use the equipment for your season. Return it when done — simple as that.",
    icon: 'Tractor',
  },
];
