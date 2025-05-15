export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  availability: {
    [key: string]: { // day of week (0-6)
      start: string; // HH:mm
      end: string; // HH:mm
      breaks?: Array<{
        start: string; // HH:mm
        end: string; // HH:mm
      }>;
    };
  };
}

export const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Stylist',
    image: '/images/staff/sarah.jpg',
    specialties: ['Haircut', 'Hair Coloring', 'Styling'],
    availability: {
      '1': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '2': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '3': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '4': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '5': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] }
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Massage Therapist',
    image: '/images/staff/michael.jpg',
    specialties: ['Massage Therapy', 'Spa Treatments'],
    availability: {
      '1': { start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      '2': { start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      '3': { start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      '4': { start: '10:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
      '6': { start: '10:00', end: '16:00', breaks: [{ start: '13:00', end: '14:00' }] }
    }
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'Nail Specialist',
    image: '/images/staff/emma.jpg',
    specialties: ['Manicure', 'Pedicure', 'Nail Art'],
    availability: {
      '1': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '2': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '4': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '5': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '6': { start: '10:00', end: '15:00', breaks: [{ start: '12:00', end: '13:00' }] }
    }
  },
  {
    id: '4',
    name: 'Sofia Rodriguez',
    role: 'Esthetician',
    image: '/images/staff/sofia.jpg',
    specialties: ['Facial Treatment', 'Skincare', 'Spa Treatments'],
    availability: {
      '2': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '3': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '4': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '5': { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
      '6': { start: '10:00', end: '15:00', breaks: [{ start: '12:00', end: '13:00' }] }
    }
  }
]; 