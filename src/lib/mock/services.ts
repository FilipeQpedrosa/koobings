export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  category: string;
  recurring: boolean;
}

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling service tailored to your preferences',
    duration: 60,
    price: 50,
    image: '/images/services/haircut.jpg',
    category: 'Hair',
    recurring: false
  },
  {
    id: '2',
    name: 'Manicure & Pedicure',
    description: 'Complete nail care treatment for hands and feet',
    duration: 90,
    price: 65,
    image: '/images/services/manicure.jpg',
    category: 'Nails',
    recurring: false
  },
  {
    id: '3',
    name: 'Facial Treatment',
    description: 'Rejuvenating facial treatment with premium skincare products',
    duration: 75,
    price: 85,
    image: '/images/services/facial.jpg',
    category: 'Skincare',
    recurring: true
  },
  {
    id: '4',
    name: 'Massage Therapy',
    description: 'Relaxing full-body massage to relieve stress and tension',
    duration: 60,
    price: 70,
    image: '/images/services/massage.jpg',
    category: 'Massage',
    recurring: false
  },
  {
    id: '5',
    name: 'Hair Coloring',
    description: 'Professional hair coloring service with quality products',
    duration: 120,
    price: 100,
    image: '/images/services/hair-color.jpg',
    category: 'Hair',
    recurring: false
  },
  {
    id: '6',
    name: 'Spa Package',
    description: 'Complete spa treatment including massage, facial, and nail care',
    duration: 180,
    price: 150,
    image: '/images/services/spa.jpg',
    category: 'Spa',
    recurring: true
  }
]; 