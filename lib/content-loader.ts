import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ContentItem {
  slug: string;
  content: string;
  [key: string]: any;
}

/**
 * Reads and parses a content file (markdown or HTML) with frontmatter.
 * Returns the parsed data object with content and metadata.
 */
export function readContentFile(filePath: string): { data: Record<string, any>; content: string } {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return matter(fileContents);
}

/**
 * Reads all files from a directory with the specified extensions.
 * Returns an array of file names that match the extensions.
 */
export function readDirectory(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath);
}

/**
 * Checks if a file exists with any of the given extensions.
 * Returns the full path to the file if found, null otherwise.
 */
export function findFileWithExtensions(dirPath: string, baseName: string, extensions: string[]): string | null {
  for (const ext of extensions) {
    const fullPath = path.join(dirPath, `${baseName}${ext}`);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Creates a content item object with proper field precedence.
 * This ensures that explicitly set fields take precedence over spread data.
 */
export function createContentItem(
  slug: string,
  data: Record<string, any>,
  content: string,
  overrides: Record<string, any> = {}
): ContentItem {
  return {
    slug,
    content,
    ...data,
    // Apply overrides to ensure they take precedence
    ...overrides,
  };
}
