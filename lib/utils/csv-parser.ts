import fs from 'fs';
import path from 'path';

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  brand?: string;
  description?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function loadProductsFromCSV(): ProductData[] {
  const filePath = path.join(process.cwd(), 'products.csv');
  
  if (!fs.existsSync(filePath)) {
    console.warn('products.csv not found');
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const products: ProductData[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    try {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const price = parseFloat(row.regular_price) || 0;
      let stock = parseInt(row.stock || '0') || 0;
      // Default to 100 if stock is 0 or not provided
      if (stock === 0) {
        stock = 100;
      }

      if (!row.post_title || price <= 0) continue;

      // Parse images
      const images: string[] = [];
      if (row.images) {
        const imageParts = row.images.split('|');
        for (const part of imageParts) {
          const match = part.match(/https?:\/\/[^\s!]+/);
          if (match) {
            images.push(match[0].trim());
          }
        }
      }

      products.push({
        id: row.ID || `product-${i}`,
        name: row.post_title,
        slug: row.post_name,
        price,
        stock,
        images,
        category: row['tax:product_cat']?.split('|')[0]?.trim() || 'Uncategorized',
        brand: row['tax:product_brand'] || undefined,
        description: row.post_excerpt || row.post_content || undefined,
      });
    } catch (error) {
      console.error(`Error parsing product row ${i}:`, error);
    }
  }

  return products;
}

export function loadCategoriesFromCSV(): CategoryData[] {
  const filePath = path.join(process.cwd(), 'categories.csv');
  
  if (!fs.existsSync(filePath)) {
    console.warn('categories.csv not found');
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const categories: CategoryData[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    try {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      if (row.name === 'Uncategorized') continue;

      categories.push({
        id: row.term_id,
        name: row.name,
        slug: row.slug,
        description: row.description || undefined,
      });
    } catch (error) {
      console.error(`Error parsing category row ${i}:`, error);
    }
  }

  return categories;
}

