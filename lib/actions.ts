'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  authenticateAdmin, clearSession, getSessionAdmin, changeAdminPassword,changeAdminEmail
} from './auth';
import {
  createProperty, updateProperty, archiveProperty, deleteProperty,
  deleteAgent, createAgent, createPropertyInquiry, createContactMessage,
  createTestimonial, toggleTestimonialPublished, deleteTestimonial,
  togglePropertyInquiryRead, toggleContactMessageRead,
  deletePropertyInquiry, deleteContactMessage
} from './db';
import type { PropertyType, PropertyStatus } from '@/types';

// Admin Login
export async function loginAction(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const result = await authenticateAdmin(email, password);
  if (!result.success) return { error: result.error || 'Authentication failed' };
  redirect('/admin');
}

// Admin Logout
export async function logoutAction() {
  await clearSession();
  redirect('/admin/login');
}

// Admin Change Password
export async function changePasswordAction(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const admin = await getSessionAdmin();
  if (!admin) return { error: 'Unauthorized. Please log in again.' };

  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!currentPassword || !newPassword) return { error: 'All fields are required.' };
  if (newPassword !== confirmPassword) return { error: 'New password and confirmation do not match.' };
  if (newPassword.length < 8) return { error: 'New password must be at least 8 characters long.' };

  const result = await changeAdminPassword(admin.id, currentPassword, newPassword);
  if (!result.success) return { error: result.error || 'Password update failed.' };
  return { success: true };
}

export async function changeAdminEmailAction(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const admin = await getSessionAdmin();

  if (!admin) {
    return { error: 'Unauthorized. Please log in again.' };
  }

  const currentPassword = String(
    formData.get('currentPassword') ?? ''
  );
  const newEmail = String(formData.get('newEmail') ?? '');
  const confirmEmail = String(
    formData.get('confirmEmail') ?? ''
  );

  if (!currentPassword || !newEmail.trim() || !confirmEmail.trim()) {
    return { error: 'All fields are required.' };
  }

  if (
    newEmail.trim().toLowerCase() !==
    confirmEmail.trim().toLowerCase()
  ) {
    return { error: 'Email addresses do not match.' };
  }

  const result = await changeAdminEmail(
    admin.id,
    currentPassword,
    newEmail
  );

  if (!result.success) {
    return { error: result.error || 'Email update failed.' };
  }

  return { success: true };
}

// Create or Update Property
export async function savePropertyAction(data: {
  id?: string;
  title: string;
  description: string;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  address: string;
  city: string;

  country: string;
 
  latitude: number | null;
  longitude: number | null;
  agent_id: string | null;
  images: { image_url: string; is_primary: boolean; sort_order: number; alt_text?: string }[];
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  if (!data.title?.trim() || !data.price || !data.property_type) {
    throw new Error('Title, price, and property type are required.');
  }


const propertyData = {
  title: data.title,
  description: data.description,
  price: data.price,
  property_type: data.property_type,
  status: data.status,
  bedrooms: data.bedrooms,
  bathrooms: data.bathrooms,
  square_feet: data.square_feet,
  address: data.address,
  city: data.city,
  country: data.country,
  latitude: data.latitude,
  longitude: data.longitude,
  agent_id: data.agent_id,
};


  if (data.id) {
    await updateProperty(data.id, propertyData, data.images);
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath(`/properties/${data.id}`);
    revalidatePath('/admin');
    revalidatePath('/admin/properties');
    return { success: true, id: data.id };
  }

  const created = await createProperty(propertyData, data.images);
  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  return { success: true, id: created.id };
}

// Archive Property
export async function archivePropertyAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await archiveProperty(id);
  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath(`/properties/${id}`);
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  return { success: true };
}

// Delete Property
export async function deletePropertyAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await deleteProperty(id);
  revalidatePath('/');
  revalidatePath('/properties');
  revalidatePath('/admin');
  revalidatePath('/admin/properties');
  return { success: true };
}

// Create Agent
export async function createAgentAction(data: {
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  profile_image_url?: string;
  image_url?: string;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  if (!data.name?.trim()) throw new Error('Agent name is required');

  const agent = await createAgent({
    name: data.name.trim(),
    email: data.email || null,
    phone: data.phone || null,
    bio: data.bio || null,
    profile_image_url: data.profile_image_url || data.image_url || null,
  });
  revalidatePath('/admin/properties/new');
  revalidatePath('/admin/agents');
  return { success: true, agent };
}

// Delete Agent
export async function deleteAgentAction(id: number | string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await deleteAgent(id);
  revalidatePath('/admin/agents');
  revalidatePath('/admin/properties');
  return { success: true };
}

// Public: Submit Property Inquiry
export async function submitPropertyInquiryAction(
  prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const propertyId = String(formData.get('propertyId') ?? '');
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const phone = String(formData.get('phone') ?? '');
  const message = String(formData.get('message') ?? '');

  if (!propertyId || !name.trim() || !email.trim() || !message.trim()) {
    return { success: false, error: 'Please fill in all required fields (Name, Email, Message).' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    await createPropertyInquiry({
      property_id: propertyId, name: name.trim(), email: email.trim(),
      phone: phone.trim() || null, message: message.trim(),
    });
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return { success: false, error: 'Failed to send inquiry. Please try again later.' };
  }
}

// Public: Submit Contact Message
export async function submitContactMessageAction(
  prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const phone = String(formData.get('phone') ?? '');
  const subject = String(formData.get('subject') ?? '');
  const message = String(formData.get('message') ?? '');

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { success: false, error: 'Please fill in Name, Email, and Message.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  try {
    await createContactMessage({
      name: name.trim(), email: email.trim(), phone: phone.trim() || null,
      subject: subject.trim() || null, message: message.trim(),
    });
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}

// Admin: Toggle Property Inquiry Read Status
export async function togglePropertyInquiryReadAction(
  id: string | number,
  isRead: boolean
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await togglePropertyInquiryRead(id, isRead);
  revalidatePath('/admin/inquiries');
  return { success: true };
}

// Admin: Toggle Contact Message Read Status
export async function toggleContactMessageReadAction(
  id: string | number,
  isRead: boolean
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await toggleContactMessageRead(id, isRead);
  revalidatePath('/admin/inquiries');
  return { success: true };
}

// Admin: Create Testimonial
export async function createTestimonialAction(data: {
  customer_name?: string;
  client_name?: string;
  client_title?: string;
  customer_image_url?: string;
  content: string;
  rating?: number;
  is_published?: boolean;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');

  const name = data.customer_name || data.client_name;
  if (!name?.trim() || !data.content?.trim()) {
    throw new Error('Client name and review content are required.');
  }

  const testimonial = await createTestimonial({
    customer_name: name.trim(),
    customer_image_url: data.customer_image_url || null,
    content: data.content.trim(),
    rating: data.rating || 5,
    is_published: data.is_published !== undefined ? data.is_published : true,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/testimonials');
  return { success: true, testimonial };
}

// Admin: Toggle Testimonial Published Status
export async function toggleTestimonialPublishedAction(
  id: string,
  is_published: boolean
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await toggleTestimonialPublished(id, is_published);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/testimonials');
  return { success: true };
}

// Admin: Delete Testimonial
export async function deleteTestimonialAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error('Unauthorized');
  await deleteTestimonial(id);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/testimonials');
  return { success: true };
}


export async function deletePropertyInquiryAction(id: string) {
  const admin = await getSessionAdmin();

  if (!admin) {
    throw new Error('Unauthorized');
  }

  await deletePropertyInquiry(id);
  revalidatePath('/admin/inquiries');

  return { success: true };
}

export async function deleteContactMessageAction(id: string) {
  const admin = await getSessionAdmin();

  if (!admin) {
    throw new Error('Unauthorized');
  }

  await deleteContactMessage(id);
  revalidatePath('/admin/inquiries');

  return { success: true };
}
