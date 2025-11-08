import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface CategoryRow {
  term_id: string;
  name: string;
  slug: string;
  description: string;
  display_type: string;
  parent: string;
  thumbnail: string;
}

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'categories.csv');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Categories file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as CategoryRow[];

    // Filter out uncategorized and format categories
    const categories = records
      .filter((record) => record.name !== 'Uncategorized')
      .map((record) => ({
        id: record.term_id,
        name: record.name,
        slug: record.slug,
        description: record.description || '',
      }));

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

