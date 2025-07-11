import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const EXAMPLES_DIR = join(__dirname, '..', 'examples', 'svgs');
const NESTED_EXAMPLES_DIR = join(__dirname, '..', 'examples', 'nested');
const TEST_OUTPUT_DIR = join(__dirname, 'test-output');

describe('CLI Integration Tests', () => {
  beforeEach(() => {
    // Clean up test output directory
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(() => {
    // Clean up test output directory
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  describe('Real SVG File Tests', () => {
    it('should have example SVG files available for testing', () => {
      const svgFiles = readdirSync(EXAMPLES_DIR).filter(file =>
        file.endsWith('.svg')
      );
      expect(svgFiles.length).toBeGreaterThan(0);

      // Check that we have some complex SVG files
      const specialFiles = svgFiles.filter(
        file => file.includes(' ') || file.includes(',') || file.includes('=')
      );
      expect(specialFiles.length).toBeGreaterThan(0);
    });
  });

  describe('CLI Usage Tests', () => {
    const CLI_PATH = join(__dirname, '..', 'dist', 'cli.js');

    beforeEach(() => {
      // Build the CLI if it doesn't exist
      if (!existsSync(CLI_PATH)) {
        execSync('npm run build', { cwd: join(__dirname, '..') });
      }
    });

    it('should convert SVG files via CLI', () => {
      const output = execSync(
        `node "${CLI_PATH}" "${EXAMPLES_DIR}" -o "${TEST_OUTPUT_DIR}"`,
        { encoding: 'utf-8' }
      );

      expect(output).toContain('✅ Successfully converted');
      expect(output).toContain('SVG file(s) to react components');

      // Check that files were created
      const outputFiles = readdirSync(TEST_OUTPUT_DIR);
      expect(outputFiles.length).toBeGreaterThan(0);
    });

    it('should generate index file via CLI', () => {
      const output = execSync(
        `node "${CLI_PATH}" "${EXAMPLES_DIR}" -o "${TEST_OUTPUT_DIR}" --index`,
        { encoding: 'utf-8' }
      );

      expect(output).toContain('📄 Generated index.ts for tree-shaking');
      expect(output).toContain('✅ Successfully converted');

      // Check that index file was created
      const indexPath = join(TEST_OUTPUT_DIR, 'index.ts');
      expect(existsSync(indexPath)).toBe(true);
    });

    it('should apply prefix and suffix via CLI', () => {
      const output = execSync(
        `node "${CLI_PATH}" "${EXAMPLES_DIR}" -o "${TEST_OUTPUT_DIR}" --prefix Icon --suffix Component`,
        { encoding: 'utf-8' }
      );

      expect(output).toContain('✅ Successfully converted');

      // Check that component names have prefix and suffix
      const outputFiles = readdirSync(TEST_OUTPUT_DIR);
      const componentFiles = outputFiles.filter(
        file => file.endsWith('.tsx') || file.endsWith('.jsx')
      );
      componentFiles.forEach(file => {
        const nameWithoutExt = file.replace(/\.(tsx|jsx)$/, '');
        expect(nameWithoutExt).toMatch(/^Icon.*Component$/);
      });
    });

    it('should convert to Vue components via CLI', () => {
      const output = execSync(
        `node "${CLI_PATH}" "${EXAMPLES_DIR}" -o "${TEST_OUTPUT_DIR}" --framework vue`,
        { encoding: 'utf-8' }
      );

      expect(output).toContain('✅ Successfully converted');
      expect(output).toContain('vue components');

      // Check that Vue files were created
      const outputFiles = readdirSync(TEST_OUTPUT_DIR);
      const vueFiles = outputFiles.filter(file => file.endsWith('.vue'));
      expect(vueFiles.length).toBeGreaterThan(0);
    });

    it('should show help when no arguments provided', () => {
      const output = execSync(`node "${CLI_PATH}"`, { encoding: 'utf-8' });

      // The output should contain some help content
      expect(output.length).toBeGreaterThan(0);
      // The banner contains ASCII art, just check we have meaningful output
      expect(output).toMatch(/█/); // Check for banner ASCII art
    });

    it('should handle recursive directory scanning via CLI', () => {
      const output = execSync(
        `node "${CLI_PATH}" "${NESTED_EXAMPLES_DIR}" -o "${TEST_OUTPUT_DIR}" --recursive`,
        { encoding: 'utf-8' }
      );

      expect(output).toContain('✅ Successfully converted');
      expect(output).toContain('SVG file(s) to react components');

      // Check that files were created from nested directories
      const outputFiles = readdirSync(TEST_OUTPUT_DIR, { recursive: true });
      expect(outputFiles.length).toBeGreaterThan(0);
    });
  });
});
