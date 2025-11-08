import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CategoryRow {
  term_id: string;
  name: string;
  slug: string;
  description: string;
  display_type: string;
  parent: string;
  thumbnail: string;
}

interface ProductRow {
  post_title: string;
  post_name: string;
  ID: string;
  regular_price: string;
  stock: string;
  images: string;
  'tax:product_cat': string;
  'tax:product_brand': string;
  post_content: string;
  post_excerpt: string;
}

async function importCategories() {
  console.log('📁 Importing categories...');
  
  const filePath = path.join(process.cwd(), 'categories.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CategoryRow[];

  const categoryMap = new Map<string, string>();

  for (const record of records) {
    if (record.name === 'Uncategorized') continue;

    try {
      const category = await prisma.category.upsert({
        where: { slug: record.slug },
        update: {
          name: record.name,
          description: record.description || null,
        },
        create: {
          name: record.name,
          slug: record.slug,
          description: record.description || null,
        },
      });

      categoryMap.set(record.term_id, category.id);
      console.log(`✓ Category: ${record.name}`);
    } catch (error) {
      console.error(`✗ Error importing category ${record.name}:`, error);
    }
  }

  return categoryMap;
}

async function importProducts(categoryMap: Map<string, string>) {
  console.log('📦 Importing products...');
  
  const filePath = path.join(process.cwd(), 'products.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ProductRow[];

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    try {
      const price = parseFloat(record.regular_price) || 0;
      const stock = parseInt(record.stock) || 0;

      if (!record.post_title || price <= 0) {
        skipped++;
        continue;
      }

      // Parse images
      const images: string[] = [];
      if (record.images) {
        const imageUrls = record.images.split('|').map((img) => {
          const match = img.match(/https?:\/\/[^\s]+/);
          return match ? match[0].trim() : '';
        });
        images.push(...imageUrls.filter((img) => img.length > 0));
      }

      // Get category
      const categories = record['tax:product_cat']?.split('|') || [];
      let categoryId = null;

      for (const cat of categories) {
        const trimmedCat = cat.trim();
        if (categoryMap.has(trimmedCat)) {
          categoryId = categoryMap.get(trimmedCat);
          break;
        }
      }

      // If no category found, create a default one
      if (!categoryId) {
        const defaultCat = await prisma.category.findFirst({
          where: { slug: 'uncategorized' },
        });
        if (defaultCat) {
          categoryId = defaultCat.id;
        } else {
          const newCat = await prisma.category.create({
            data: {
              name: 'Uncategorized',
              slug: 'uncategorized',
            },
          });
          categoryId = newCat.id;
        }
      }

      const product = await prisma.product.upsert({
        where: { slug: record.post_name },
        update: {
          name: record.post_title,
          price,
          stock,
          images,
          brand: record['tax:product_brand'] || null,
          description: record.post_excerpt || record.post_content || null,
        },
        create: {
          name: record.post_title,
          slug: record.post_name,
          price,
          stock,
          images,
          categoryId,
          brand: record['tax:product_brand'] || null,
          description: record.post_excerpt || record.post_content || null,
        },
      });

      imported++;
      if (imported % 100 === 0) {
        console.log(`✓ Imported ${imported} products...`);
      }
    } catch (error) {
      console.error(`✗ Error importing product ${record.post_title}:`, error);
      skipped++;
    }
  }

  console.log(`✓ Products imported: ${imported}, Skipped: ${skipped}`);
}

async function main() {
  try {
    console.log('🚀 Starting data import...\n');
    
    const categoryMap = await importCategories();
    console.log(`✓ Categories imported: ${categoryMap.size}\n`);
    
    await importProducts(categoryMap);
    
    console.log('\n✅ Data import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

