export type PropertyType =
  | 'single_family'
  | 'apartment'
  | 'condo'
  | 'townhouse'
  | 'villa'
  | 'land'
  | 'commercial'
  | 'office'
  | 'other';

export type PropertyStatus = 'draft' | 'published' | 'archived';

export interface AdminUser {
  id: string; // UUID
  email: string;
  password_hash?: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string; // UUID
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  profile_image_url?: string | null;
  image_url?: string | null; // Alias
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string; // UUID
  property_id: string; // UUID
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Property {
  id: string; // UUID
  title: string;
  description: string | null;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  address: string | null;
  city: string | null;

  country: string | null;
 
  latitude: number | null;
  longitude: number | null;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  // Joined fields for display
  images?: PropertyImage[];
  primary_image?: string;
  agent?: Agent | null;
}

export interface PropertyInquiry {
  id: string; // UUID
  property_id: string; // UUID
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  updated_at?: string;
  is_read?: boolean;
  property_title?: string;
}

export interface ContactMessage {
  id: string; // UUID
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status?: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string; // UUID
  customer_name?: string;
  customer_image_url?: string | null;
  client_name: string; // Display alias
  client_title: string | null;
  content: string;
  rating: number | null;
  is_published: boolean;
  sort_order?: number;
  created_at: string;
  updated_at?: string;
}

export interface PropertyFilterParams {
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  sort?: string;
  limit?: number;
}
