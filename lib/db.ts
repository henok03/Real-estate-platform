import { cache } from 'react';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

import type {
  AdminUser,
  Agent,
  Property,
  PropertyImage,
  PropertyInquiry,
  ContactMessage,
  Testimonial,
  PropertyFilterParams,
} from '@/types';

// Detect whether we have a valid Neon PostgreSQL connection string
function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const trimmed = url.trim();
  if (
    trimmed === '' ||
    trimmed === 'YOUR_NEON_DATABASE_URL' ||
    trimmed.includes('YOUR_NEON') ||
    trimmed.startsWith('postgres://username:password')
  ) {
    return null;
  }
  return trimmed;
}

// In-memory fallback if DATABASE_URL is not provided
interface MemoryStore {
  admin_users: AdminUser[];
  agents: Agent[];
  properties: Property[];
  property_images: PropertyImage[];
  property_inquiries: PropertyInquiry[];
  contact_messages: ContactMessage[];
  testimonials: Testimonial[];
}

const DEFAULT_ADMIN_HASH = bcrypt.hashSync('AdminPassword123!', 10);

declare global {
  var __realEstateMemoryStore: MemoryStore | undefined;
}

function getMemoryStore(): MemoryStore {
  if (!global.__realEstateMemoryStore) {
    global.__realEstateMemoryStore = {
      admin_users: [
        {
          id: 'b07fa74a-f9b2-4917-88f5-26e605db768f',
          email: 'admin@auraestates.com',
          password_hash: DEFAULT_ADMIN_HASH,
          full_name: 'Lead Administrator',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      agents: [],
      properties: [],
      property_images: [],
      property_inquiries: [],
      contact_messages: [],
      testimonials: [],
    };
  }
  return global.__realEstateMemoryStore;
}

function getSql() {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return null;
  return neon(dbUrl);
}

export function isUsingNeon(): boolean {
  return getDatabaseUrl() !== null;
}

// Helper to format a DB property row into typed Property
function mapPropertyRow(row: Record<string, any>): Property {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    description: row.description ? String(row.description) : null,
    price: Number(row.price || 0),
    property_type: row.property_type,
    status: row.status,
    bedrooms: row.bedrooms !== null && row.bedrooms !== undefined ? Number(row.bedrooms) : null,
    bathrooms: row.bathrooms !== null && row.bathrooms !== undefined ? Number(row.bathrooms) : null,
    square_feet: row.square_feet !== null && row.square_feet !== undefined ? Number(row.square_feet) : null,
    address: row.address ? String(row.address) : null,
    city: row.city ? String(row.city) : null,
  
    country: row.country ? String(row.country) : null,
  
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
    longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    agent_id: row.agent_id ? String(row.agent_id) : null,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
    primary_image: row.primary_image ? String(row.primary_image) : undefined,
  };
}

type ImageInput = { image_url: string; is_primary?: boolean; alt_text?: string; sort_order?: number };

// Insert all images in ONE query (instead of one query per image)
async function insertImagesBatch(
  sql: NonNullable<ReturnType<typeof getSql>>,
  propertyId: string,
  images: ImageInput[]
): Promise<void> {
  if (!images || images.length === 0) return;
  await sql.query(
    `INSERT INTO property_images (property_id, image_url, alt_text, sort_order, is_primary)
     SELECT $1, u.image_url, u.alt_text, u.sort_order, u.is_primary
     FROM unnest($2::text[], $3::text[], $4::int[], $5::bool[])
       AS u(image_url, alt_text, sort_order, is_primary);`,
    [
      propertyId,
      images.map((img) => img.image_url),
      images.map((img) => img.alt_text || null),
      images.map((img, i) => img.sort_order ?? i),
      images.map((img) => Boolean(img.is_primary)),
    ]
  );
}

// ----------------------------------------------------
// PROPERTIES REPOSITORY
// ----------------------------------------------------

export async function getProperties(filters: PropertyFilterParams = {}): Promise<Property[]> {
  const sql = getSql();

  if (sql) {
    try {
      let query = `
        SELECT 
          p.*,
          (
            SELECT image_url 
            FROM property_images 
            WHERE property_id = p.id 
            ORDER BY is_primary DESC, sort_order ASC, created_at ASC 
            LIMIT 1
          ) as primary_image
        FROM properties p
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIdx = 1;

      if (filters.status) {
        query += ` AND p.status = $${paramIdx++}`;
        params.push(filters.status);
      }

      if (filters.property_type && filters.property_type !== 'all') {
        query += ` AND p.property_type = $${paramIdx++}`;
        params.push(filters.property_type);
      }

      if (filters.location && filters.location.trim()) {
        const search = `%${filters.location.trim().toLowerCase()}%`;
        query += ` AND (
          LOWER(p.city) LIKE $${paramIdx} OR 
         
          LOWER(p.country) LIKE $${paramIdx} OR 
          LOWER(p.address) LIKE $${paramIdx} OR 
          LOWER(p.title) LIKE $${paramIdx}
        )`;
        params.push(search);
        paramIdx++;
      }

      if (filters.min_price !== undefined && !isNaN(filters.min_price)) {
        query += ` AND p.price >= $${paramIdx++}`;
        params.push(filters.min_price);
      }

      if (filters.max_price !== undefined && !isNaN(filters.max_price)) {
        query += ` AND p.price <= $${paramIdx++}`;
        params.push(filters.max_price);
      }

      if (filters.bedrooms !== undefined && !isNaN(filters.bedrooms)) {
        query += ` AND p.bedrooms >= $${paramIdx++}`;
        params.push(filters.bedrooms);
      }

      if (filters.bathrooms !== undefined && !isNaN(filters.bathrooms)) {
        query += ` AND p.bathrooms >= $${paramIdx++}`;
        params.push(filters.bathrooms);
      }

      // Ordering
      if (filters.sort === 'price_asc') {
        query += ` ORDER BY p.price ASC`;
      } else if (filters.sort === 'price_desc') {
        query += ` ORDER BY p.price DESC`;
      } else {
        query += ` ORDER BY p.created_at DESC`;
      }

      if (filters.limit) {
        query += ` LIMIT $${paramIdx++}`;
        params.push(filters.limit);
      }

      const rows = (await sql.query(query, params)) as Record<string, any>[];
      return rows.map(mapPropertyRow);
    } catch (error) {
      console.error('Error fetching properties from Neon:', error);
      return [];
    }
  }

  // Memory fallback
  const store = getMemoryStore();
  let list = [...store.properties];

  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.property_type && filters.property_type !== 'all') {
    list = list.filter((p) => p.property_type === filters.property_type);
  }
  if (filters.location && filters.location.trim()) {
    const loc = filters.location.toLowerCase();
    list = list.filter(
      (p) =>
        (p.city && p.city.toLowerCase().includes(loc)) ||
       
        (p.country && p.country.toLowerCase().includes(loc)) ||
        (p.title && p.title.toLowerCase().includes(loc))
    );
  }
  if (filters.min_price !== undefined && !isNaN(filters.min_price)) {
    list = list.filter((p) => p.price >= filters.min_price!);
  }
  if (filters.max_price !== undefined && !isNaN(filters.max_price)) {
    list = list.filter((p) => p.price <= filters.max_price!);
  }
  if (filters.bedrooms !== undefined && !isNaN(filters.bedrooms)) {
    list = list.filter((p) => (p.bedrooms ?? 0) >= filters.bedrooms!);
  }
  if (filters.bathrooms !== undefined && !isNaN(filters.bathrooms)) {
    list = list.filter((p) => (p.bathrooms ?? 0) >= filters.bathrooms!);
  }

  if (filters.sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  if (filters.limit) {
    list = list.slice(0, filters.limit);
  }

  return list.map((p) => {
    const imgs = store.property_images.filter((img) => img.property_id === p.id);
    const primary = imgs.find((img) => img.is_primary) || imgs[0];
    return {
      ...p,
      primary_image: primary?.image_url,
    };
  });
}

export const getPropertyById = cache(async (id: string): Promise<Property | null> => {
  const sql = getSql();

  if (sql) {
    try {
      const rows = (await sql.query(`SELECT * FROM properties WHERE id = $1 LIMIT 1;`, [id])) as Record<string, any>[];
      if (rows.length === 0) return null;

      const property = mapPropertyRow(rows[0]);

      // Run images + agent queries at the same time
      const [imgRows, agentRows] = await Promise.all([
        sql.query(
          `SELECT * FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC, sort_order ASC, created_at ASC;`,
          [id]
        ) as Promise<Record<string, any>[]>,
        property.agent_id
          ? (sql.query(`SELECT * FROM agents WHERE id = $1 LIMIT 1;`, [property.agent_id]) as Promise<Record<string, any>[]>)
          : Promise.resolve([] as Record<string, any>[]),
      ]);

      property.images = imgRows.map((img) => ({
        id: String(img.id),
        property_id: String(img.property_id),
        image_url: String(img.image_url),
        alt_text: img.alt_text ? String(img.alt_text) : null,
        sort_order: Number(img.sort_order || 0),
        is_primary: Boolean(img.is_primary),
        created_at: new Date(img.created_at).toISOString(),
      }));

      property.primary_image = property.images[0]?.image_url;

      if (agentRows.length > 0) {
        const a = agentRows[0];
        property.agent = {
          id: String(a.id),
          name: String(a.name),
          email: a.email ? String(a.email) : null,
          phone: a.phone ? String(a.phone) : null,
          bio: a.bio ? String(a.bio) : null,
          profile_image_url: a.profile_image_url ? String(a.profile_image_url) : null,
          image_url: a.profile_image_url ? String(a.profile_image_url) : null,
          created_at: new Date(a.created_at).toISOString(),
          updated_at: new Date(a.updated_at).toISOString(),
        };
      }

      return property;
    } catch (error) {
      console.error('Error fetching property by id from Neon:', error);
      return null;
    }
  }

  // Memory fallback
  const store = getMemoryStore();
  const property = store.properties.find((p) => p.id === id);
  if (!property) return null;

  const images = store.property_images
    .filter((img) => img.property_id === id)
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order);

  const agent = property.agent_id ? store.agents.find((a) => a.id === property.agent_id) || null : null;

  return {
    ...property,
    images,
    primary_image: images[0]?.image_url,
    agent,
  };
});

export async function createProperty(
  data: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'images' | 'primary_image' | 'agent'>,
  images: { image_url: string; is_primary?: boolean; alt_text?: string; sort_order?: number }[] = []
): Promise<Property> {
  const sql = getSql();

  const publishedAt = data.status === 'published' ? new Date().toISOString() : null;
  const agentId = data.agent_id && data.agent_id.trim() !== '' ? data.agent_id : null;

  if (sql) {
    try {
      const rows = (await sql.query(
        `INSERT INTO properties (
          title, description, price, property_type, status,
          bedrooms, bathrooms, square_feet, address, city,
           country,  latitude, longitude,
          agent_id, published_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
        
        ) RETURNING *;`,
        [
          data.title,
          data.description || null,
          data.price,
          data.property_type,
          data.status || 'published',
          data.bedrooms ?? null,
          data.bathrooms ?? null,
          data.square_feet ?? null,
          data.address || null,
          data.city || null,
        
          data.country || null,
         
          data.latitude ?? null,
          data.longitude ?? null,
          agentId,
          publishedAt,
        ]
      )) as Record<string, any>[];

      const createdProperty = mapPropertyRow(rows[0]);

      // Insert images if provided
      await insertImagesBatch(sql, createdProperty.id, images);

      return (await getPropertyById(createdProperty.id)) || createdProperty;
    } catch (error) {
      console.error('Error creating property in Neon:', error);
      throw error;
    }
  }

  // Memory fallback
  const store = getMemoryStore();
  const id = `prop-${Date.now()}`;
  const now = new Date().toISOString();

  const newProperty: Property = {
    ...data,
    id,
    agent_id: agentId,
    created_at: now,
    updated_at: now,
    published_at: publishedAt,
  };

  store.properties.push(newProperty);

  if (images && images.length > 0) {
    images.forEach((img, idx) => {
      store.property_images.push({
        id: `img-${Date.now()}-${idx}`,
        property_id: id,
        image_url: img.image_url,
        alt_text: img.alt_text || null,
        is_primary: Boolean(img.is_primary),
        sort_order: img.sort_order ?? idx,
        created_at: now,
      });
    });
  }

  return (await getPropertyById(id)) || newProperty;
}

export async function updateProperty(
  id: string,
  data: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at' | 'images' | 'primary_image' | 'agent'>>,
  images?: { image_url: string; is_primary?: boolean; alt_text?: string; sort_order?: number }[]
): Promise<Property | null> {
  const sql = getSql();
  const agentId = data.agent_id && data.agent_id.trim() !== '' ? data.agent_id : null;

  if (sql) {
    try {
      await sql.query(
        `UPDATE properties SET
          title = COALESCE($1, title),
          description = $2,
          price = COALESCE($3, price),
          property_type = COALESCE($4, property_type),
          status = COALESCE($5, status),
          bedrooms = $6,
          bathrooms = $7,
          square_feet = $8,
          address = $9,
          city = $10,
        
          country = $11,
          
          latitude = $12,
          longitude = $13,
          agent_id = $14,
          published_at = CASE 
            WHEN COALESCE($5, status) = 'published' AND published_at IS NULL THEN NOW()
            ELSE published_at 
          END
        WHERE id = $15;`,
        [
          data.title,
          data.description,
          data.price,
          data.property_type,
          data.status,
          data.bedrooms ?? null,
          data.bathrooms ?? null,
          data.square_feet ?? null,
          data.address ?? null,
          data.city ?? null,
         
          data.country ?? null,
       
          data.latitude ?? null,
          data.longitude ?? null,
          agentId,
          id,
        ]
      );

      // If images were updated
      if (images) {
        await sql.query(`DELETE FROM property_images WHERE property_id = $1;`, [id]);
        await insertImagesBatch(sql, id, images);
      }

      return await getPropertyById(id);
    } catch (error) {
      console.error('Error updating property in Neon:', error);
      throw error;
    }
  }

  // Memory fallback
  const store = getMemoryStore();
  const idx = store.properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  store.properties[idx] = {
    ...store.properties[idx],
    ...data,
    agent_id: agentId,
    updated_at: new Date().toISOString(),
  };

  if (images) {
    store.property_images = store.property_images.filter((img) => img.property_id !== id);
    images.forEach((img, i) => {
      store.property_images.push({
        id: `img-${Date.now()}-${i}`,
        property_id: id,
        image_url: img.image_url,
        alt_text: img.alt_text || null,
        is_primary: Boolean(img.is_primary),
        sort_order: img.sort_order ?? i,
        created_at: new Date().toISOString(),
      });
    });
  }

  return await getPropertyById(id);
}

export async function archiveProperty(id: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`UPDATE properties SET status = 'archived' WHERE id = $1;`, [id]);
      return true;
    } catch (error) {
      console.error('Error archiving property in Neon:', error);
      return false;
    }
  }

  const store = getMemoryStore();
  const prop = store.properties.find((p) => p.id === id);
  if (!prop) return false;
  prop.status = 'archived';
  prop.updated_at = new Date().toISOString();
  return true;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      // ON DELETE CASCADE removes property_images and inquiries automatically
      await sql.query(`DELETE FROM properties WHERE id = $1;`, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting property in Neon:', error);
      return false;
    }
  }

  const store = getMemoryStore();
  store.properties = store.properties.filter((p) => p.id !== id);
  store.property_images = store.property_images.filter((img) => img.property_id !== id);
  store.property_inquiries = store.property_inquiries.filter((inq) => inq.property_id !== id);
  return true;
}

// ----------------------------------------------------
// AGENTS REPOSITORY
// ----------------------------------------------------

export async function getAgents(): Promise<Agent[]> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(`SELECT * FROM agents ORDER BY name ASC;`)) as Record<string, any>[];
      
      return rows.map((a) => ({
        id: String(a.id),
        name: String(a.name),
        email: a.email ? String(a.email) : null,
        phone: a.phone ? String(a.phone) : null,
        bio: a.bio ? String(a.bio) : null,
        profile_image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        created_at: new Date(a.created_at).toISOString(),
        updated_at: new Date(a.updated_at).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching agents from Neon:', error);
      return [];
    }
  }

  return getMemoryStore().agents;
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(`SELECT * FROM agents WHERE id = $1 LIMIT 1;`, [id])) as Record<string, any>[];
      if (rows.length === 0) return null;
      const a = rows[0];
      return {
        id: String(a.id),
        name: String(a.name),
        email: a.email ? String(a.email) : null,
        phone: a.phone ? String(a.phone) : null,
        bio: a.bio ? String(a.bio) : null,
        profile_image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        created_at: new Date(a.created_at).toISOString(),
        updated_at: new Date(a.updated_at).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching agent by id from Neon:', error);
      return null;
    }
  }

  return getMemoryStore().agents.find((a) => a.id === id) || null;
}

export async function createAgent(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  profile_image_url?: string | null;
  image_url?: string | null;
}): Promise<Agent> {
  const sql = getSql();
  const imageUrl = data.profile_image_url || data.image_url || null;

  if (sql) {
    try {
      const rows = (await sql.query(
        `INSERT INTO agents (name, email, phone, bio, profile_image_url)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.name, data.email || null, data.phone || null, data.bio || null, imageUrl]
      )) as Record<string, any>[];

      const a = rows[0];
      return {
        id: String(a.id),
        name: String(a.name),
        email: a.email ? String(a.email) : null,
        phone: a.phone ? String(a.phone) : null,
        bio: a.bio ? String(a.bio) : null,
        profile_image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        image_url: a.profile_image_url ? String(a.profile_image_url) : null,
        created_at: new Date(a.created_at).toISOString(),
        updated_at: new Date(a.updated_at).toISOString(),
      };
    } catch (error) {
      console.error('Error creating agent in Neon:', error);
      throw error;
    }
  }

  const store = getMemoryStore();
  const id = `agent-${Date.now()}`;
  const now = new Date().toISOString();
  const newAgent: Agent = {
    id,
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    bio: data.bio || null,
    profile_image_url: imageUrl,
    image_url: imageUrl,
    created_at: now,
    updated_at: now,
  };
  store.agents.push(newAgent);
  return newAgent;
}

// ----------------------------------------------------
// ADMIN USERS REPOSITORY
// ----------------------------------------------------

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(
        `SELECT * FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
        [email.trim()]
      )) as Record<string, any>[];

      if (rows.length === 0) return null;
      const u = rows[0];
      return {
        id: String(u.id),
        email: String(u.email),
        password_hash: String(u.password_hash),
        full_name: u.full_name ? String(u.full_name) : null,
        is_active: Boolean(u.is_active),
        created_at: new Date(u.created_at).toISOString(),
        updated_at: new Date(u.updated_at).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching admin by email from Neon:', error);
      return null;
    }
  }

  return getMemoryStore().admin_users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(`SELECT * FROM admin_users WHERE id = $1 LIMIT 1;`, [id])) as Record<string, any>[];
      if (rows.length === 0) return null;
      const u = rows[0];
      return {
        id: String(u.id),
        email: String(u.email),
        password_hash: String(u.password_hash),
        full_name: u.full_name ? String(u.full_name) : null,
        is_active: Boolean(u.is_active),
        created_at: new Date(u.created_at).toISOString(),
        updated_at: new Date(u.updated_at).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching admin by id from Neon:', error);
      return null;
    }
  }

  return getMemoryStore().admin_users.find((u) => u.id === id) || null;
}

export async function updateAdminPassword(id: string, newHash: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`UPDATE admin_users SET password_hash = $1 WHERE id = $2;`, [newHash, id]);
      return true;
    } catch (error) {
      console.error('Error updating admin password in Neon:', error);
      return false;
    }
  }

  const store = getMemoryStore();
  const u = store.admin_users.find((admin) => admin.id === id);
  if (!u) return false;
  u.password_hash = newHash;
  u.updated_at = new Date().toISOString();
  return true;
}

export async function updateAdminEmail(
  id: string,
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  const email = newEmail.trim().toLowerCase();

  const sql = getSql();

  if (sql) {
    try {
      const existing = (await sql.query(
        `SELECT id FROM admin_users
         WHERE LOWER(email) = LOWER($1) AND id <> $2
         LIMIT 1;`,
        [email, id]
      )) as Record<string, any>[];

      if (existing.length > 0) {
        return {
          success: false,
          error: 'This email address is already in use.',
        };
      }

      const rows = (await sql.query(
        `UPDATE admin_users
         SET email = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id;`,
        [email, id]
      )) as Record<string, any>[];

      if (rows.length === 0) {
        return { success: false, error: 'Admin account not found.' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating admin email:', error);
      return {
        success: false,
        error: 'Could not update the email. Check whether it is already in use.',
      };
    }
  }

  const store = getMemoryStore();
  const admin = store.admin_users.find((u) => u.id === id);

  if (!admin) {
    return { success: false, error: 'Admin account not found.' };
  }

  const duplicate = store.admin_users.some(
    (u) => u.id !== id && u.email.toLowerCase() === email
  );

  if (duplicate) {
    return { success: false, error: 'This email address is already in use.' };
  }

  admin.email = email;
  admin.updated_at = new Date().toISOString();

  return { success: true };
}

// ----------------------------------------------------
// INQUIRIES & CONTACT MESSAGES REPOSITORY
// ----------------------------------------------------

export async function createPropertyInquiry(data: {
  property_id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}): Promise<PropertyInquiry> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(
        `INSERT INTO property_inquiries (property_id, name, email, phone, message)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.property_id, data.name, data.email, data.phone || null, data.message]
      )) as Record<string, any>[];

      const r = rows[0];
      return {
        id: String(r.id),
        property_id: String(r.property_id),
        name: String(r.name),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : null,
        message: String(r.message),
        status: r.status,
        created_at: new Date(r.created_at).toISOString(),
      };
    } catch (error) {
      console.error('Error creating inquiry in Neon:', error);
      throw error;
    }
  }

  const store = getMemoryStore();
  const id = `inq-${Date.now()}`;
  const now = new Date().toISOString();
  const newInq: PropertyInquiry = {
    id,
    property_id: data.property_id,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    status: 'new',
    created_at: now,
  };
  store.property_inquiries.push(newInq);
  return newInq;
}


export async function getPropertyInquiries(): Promise<PropertyInquiry[]> {
  const sql = getSql();

  if (sql) {
    try {
      const rows = (await sql.query(`
        SELECT pi.*, p.title AS property_title
        FROM property_inquiries pi
        LEFT JOIN properties p ON pi.property_id = p.id
        ORDER BY pi.created_at DESC;
      `)) as Record<string, any>[];

      return rows.map((r) => ({
        id: String(r.id),
        property_id: String(r.property_id),
        name: String(r.name),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : null,
        message: String(r.message),
        status: r.status,
        is_read: Boolean(r.is_read),
        created_at: new Date(r.created_at).toISOString(),
        property_title: r.property_title
          ? String(r.property_title)
          : undefined,
      }));
    } catch (error) {
      console.error('Error fetching inquiries from Neon:', error);
      throw error;
    }
  }

  return getMemoryStore().property_inquiries.map((inq) => {
    const prop = getMemoryStore().properties.find(
      (p) => p.id === inq.property_id
    );

    return {
      ...inq,
      is_read: Boolean(inq.is_read),
      property_title: prop?.title,
    };
  });
}


export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}): Promise<ContactMessage> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(
        `INSERT INTO contact_messages (name, email, phone, subject, message)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [data.name, data.email, data.phone || null, data.subject || null, data.message]
      )) as Record<string, any>[];

      const r = rows[0];
      return {
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : null,
        subject: r.subject ? String(r.subject) : null,
        message: String(r.message),
        status: r.status,
        created_at: new Date(r.created_at).toISOString(),
      };
    } catch (error) {
      console.error('Error creating contact message in Neon:', error);
      throw error;
    }
  }

  const store = getMemoryStore();
  const id = `msg-${Date.now()}`;
  const now = new Date().toISOString();
  const newMsg: ContactMessage = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject || null,
    message: data.message,
    status: 'new',
    created_at: now,
  };
  store.contact_messages.push(newMsg);
  return newMsg;
}


export async function getContactMessages(): Promise<ContactMessage[]> {
  const sql = getSql();

  if (sql) {
    try {
      const rows = (await sql.query(
        `SELECT * FROM contact_messages ORDER BY created_at DESC;`
      )) as Record<string, any>[];

      return rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : null,
        subject: r.subject ? String(r.subject) : null,
        message: String(r.message),
        status: r.status,
        is_read: Boolean(r.is_read),
        created_at: new Date(r.created_at).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching contact messages from Neon:', error);
      throw error;
    }
  }

  return getMemoryStore().contact_messages;
}


// ----------------------------------------------------
// TESTIMONIALS REPOSITORY
// ----------------------------------------------------

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(
        `SELECT * FROM testimonials WHERE is_published = TRUE ORDER BY sort_order ASC, created_at DESC;`
      )) as Record<string, any>[];

      return rows.map((t) => ({
        id: String(t.id),
        customer_name: String(t.customer_name),
        client_name: String(t.customer_name),
        customer_image_url: t.customer_image_url ? String(t.customer_image_url) : null,
        client_title: null,
        content: String(t.content),
        rating: t.rating !== null ? Number(t.rating) : 5,
        is_published: Boolean(t.is_published),
        sort_order: Number(t.sort_order || 0),
        created_at: new Date(t.created_at).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching testimonials from Neon:', error);
      return [];
    }
  }

  return getMemoryStore().testimonials.filter((t) => t.is_published);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql.query(`SELECT * FROM testimonials ORDER BY created_at DESC;`)) as Record<string, any>[];
      return rows.map((t) => ({
        id: String(t.id),
        customer_name: String(t.customer_name),
        client_name: String(t.customer_name),
        customer_image_url: t.customer_image_url ? String(t.customer_image_url) : null,
        client_title: null,
        content: String(t.content),
        rating: t.rating !== null ? Number(t.rating) : 5,
        is_published: Boolean(t.is_published),
        sort_order: Number(t.sort_order || 0),
        created_at: new Date(t.created_at).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching all testimonials from Neon:', error);
      return [];
    }
  }

  return getMemoryStore().testimonials;
}

export async function getDashboardStats(): Promise<{
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  archivedProperties: number;
  totalPortfolioValue: number;
  newInquiriesCount: number;
  newContactMessagesCount: number;
  totalTestimonials: number;
}> {
  const sql = getSql();
  if (sql) {
    try {
      const [propRows, inqRows, msgRows, testiRows] = (await Promise.all([
        sql.query(`
          SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'published') as published,
            COUNT(*) FILTER (WHERE status = 'draft') as draft,
            COUNT(*) FILTER (WHERE status = 'archived') as archived,
            COALESCE(SUM(price) FILTER (WHERE status = 'published'), 0) as total_val
          FROM properties;
        `),
        sql.query(`SELECT COUNT(*) as count FROM property_inquiries;`),
        sql.query(`SELECT COUNT(*) as count FROM contact_messages;`),
        sql.query(`SELECT COUNT(*) as count FROM testimonials;`),
      ])) as any[][];
      const propCounts = propRows[0] || {};

      return {
        totalProperties: Number(propCounts.total || 0),
        publishedProperties: Number(propCounts.published || 0),
        draftProperties: Number(propCounts.draft || 0),
        archivedProperties: Number(propCounts.archived || 0),
        totalPortfolioValue: Number(propCounts.total_val || 0),
        newInquiriesCount: Number(inqRows[0]?.count || 0),
        newContactMessagesCount: Number(msgRows[0]?.count || 0),
        totalTestimonials: Number(testiRows[0]?.count || 0),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats from Neon:', error);
    }
  }

  const store = getMemoryStore();
  const total = store.properties.length;
  const published = store.properties.filter((p) => p.status === 'published').length;
  const draft = store.properties.filter((p) => p.status === 'draft').length;
  const archived = store.properties.filter((p) => p.status === 'archived').length;
  const totalVal = store.properties
    .filter((p) => p.status === 'published')
    .reduce((acc, p) => acc + p.price, 0);

  return {
    totalProperties: total,
    publishedProperties: published,
    draftProperties: draft,
    archivedProperties: archived,
    totalPortfolioValue: totalVal,
    newInquiriesCount: store.property_inquiries.length,
    newContactMessagesCount: store.contact_messages.length,
    totalTestimonials: store.testimonials.length,
  };
}

export async function createTestimonial(data: {
  customer_name?: string;
  client_name?: string;
  customer_image_url?: string | null;
  content: string;
  rating?: number | null;
  is_published?: boolean;
}): Promise<Testimonial> {
  const sql = getSql();
  const name = data.customer_name || data.client_name || 'Anonymous Client';
  const rating = data.rating ?? 5;
  const isPublished = data.is_published ?? true;

  if (sql) {
    try {
      const rows = (await sql.query(
        `INSERT INTO testimonials (customer_name, customer_image_url, content, rating, is_published)
         VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [name, data.customer_image_url || null, data.content, rating, isPublished]
      )) as Record<string, any>[];

      const t = rows[0];
      return {
        id: String(t.id),
        customer_name: String(t.customer_name),
        client_name: String(t.customer_name),
        customer_image_url: t.customer_image_url ? String(t.customer_image_url) : null,
        client_title: null,
        content: String(t.content),
        rating: t.rating !== null ? Number(t.rating) : 5,
        is_published: Boolean(t.is_published),
        sort_order: Number(t.sort_order || 0),
        created_at: new Date(t.created_at).toISOString(),
      };
    } catch (error) {
      console.error('Error creating testimonial in Neon:', error);
      throw error;
    }
  }

  const store = getMemoryStore();
  const id = `testi-${Date.now()}`;
  const now = new Date().toISOString();
  const newT: Testimonial = {
    id,
    customer_name: name,
    client_name: name,
    customer_image_url: data.customer_image_url || null,
    client_title: null,
    content: data.content,
    rating,
    is_published: isPublished,
    sort_order: 0,
    created_at: now,
  };
  store.testimonials.push(newT);
  return newT;
}

export async function toggleTestimonialPublished(id: string, isPublished: boolean): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`UPDATE testimonials SET is_published = $1 WHERE id = $2;`, [isPublished, id]);
      return true;
    } catch (error) {
      console.error('Error toggling testimonial in Neon:', error);
      return false;
    }
  }

  const store = getMemoryStore();
  const t = store.testimonials.find((testi) => testi.id === id);
  if (!t) return false;
  t.is_published = isPublished;
  return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const sql = getSql();
  if (sql) {
    try {
      await sql.query(`DELETE FROM testimonials WHERE id = $1;`, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting testimonial in Neon:', error);
      return false;
    }
  }

  const store = getMemoryStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  return true;
}
// Paste it at the very bottom of lib/db.ts

export async function deleteAgent(id: number | string) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const sql = neon(url);
  
  await sql`DELETE FROM agents WHERE id = ${id}`;
}
// Toggles or marks property inquiry read status
export async function togglePropertyInquiryRead(id: string | number, isRead: boolean) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const sql = neon(url);

  await sql`UPDATE property_inquiries SET is_read = ${isRead} WHERE id = ${id}`;
}

export async function toggleContactMessageRead(id: string | number, isRead: boolean) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const sql = neon(url);

  await sql`UPDATE contact_messages SET is_read = ${isRead} WHERE id = ${id}`;
}

export async function deletePropertyInquiry(id: string | number) {
  const url = process.env.DATABASE_URL;

  if (!url) {
    const store = getMemoryStore();
    store.property_inquiries = store.property_inquiries.filter(
      (inquiry) => String(inquiry.id) !== String(id)
    );
    return;
  }

  const sql = neon(url);
  await sql`DELETE FROM property_inquiries WHERE id = ${id}`;
}

export async function deleteContactMessage(id: string | number) {
  const url = process.env.DATABASE_URL;

  if (!url) {
    const store = getMemoryStore();
    store.contact_messages = store.contact_messages.filter(
      (message) => String(message.id) !== String(id)
    );
    return;
  }

  const sql = neon(url);
  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
}
