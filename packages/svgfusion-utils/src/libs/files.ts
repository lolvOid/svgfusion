import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { existsSync } from 'fs';

/**
 * Read SVG file content
 * @param filePath - Path to the SVG file
 * @returns SVG content as string
 */
export async function readSvgFile(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read SVG file: ${filePath}. ${error}`);
  }
}

/**
 * Write SVG file content
 * @param filePath - Path to write the SVG file
 * @param content - SVG content
 */
export async function writeSvgFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write SVG file: ${filePath}. ${error}`);
  }
}

/**
 * Write component file content
 * @param filePath - Path to write the component file
 * @param content - Component content
 */
export async function writeComponentFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    await writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write component file: ${filePath}. ${error}`);
  }
}

/**
 * Read all SVG files from a directory
 * @param dirPath - Directory path
 * @param recursive - Whether to read recursively
 * @returns Array of SVG file paths
 */
export async function readSvgDirectory(
  dirPath: string,
  recursive = false
): Promise<string[]> {
  try {
    const files = await readdir(dirPath);
    const svgFiles: string[] = [];

    for (const file of files) {
      const filePath = join(dirPath, file);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory() && recursive) {
        const nestedFiles = await readSvgDirectory(filePath, recursive);
        svgFiles.push(...nestedFiles);
      } else if (fileStat.isFile() && extname(file).toLowerCase() === '.svg') {
        svgFiles.push(filePath);
      }
    }

    return svgFiles;
  } catch (error) {
    throw new Error(`Failed to read directory: ${dirPath}. ${error}`);
  }
}

/**
 * Ensure directory exists, create if not
 * @param dirPath - Directory path
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Alias for ensureDirectoryExists for consistency
 */
export const ensureDir = ensureDirectoryExists;

/**
 * Get file extension for framework
 * @param framework - Target framework
 * @param typescript - Whether to use TypeScript
 * @returns File extension
 */
export function getFileExtension(
  framework: 'react' | 'vue',
  typescript = true
): string {
  if (framework === 'react') {
    return typescript ? '.tsx' : '.jsx';
  } else {
    return typescript ? '.vue' : '.vue';
  }
}

/**
 * Get component filename from SVG filename
 * @param svgFilename - SVG filename
 * @param componentName - Component name
 * @param extension - File extension
 * @returns Component filename
 */
export function getComponentFilename(
  _svgFilename: string,
  componentName: string,
  extension: string
): string {
  return `${componentName}${extension}`;
}
