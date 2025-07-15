import figlet from 'figlet';
import { Colors } from './colors';

// Create ASCII art banner
export function createBanner(colors: Colors, text: 'SVGfusion'): string {
  const title = figlet.textSync(text, {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  });

  // Split title into lines for gradient effect
  const lines = title.split('\n');
  const totalLines = lines.length;
  const gradientTitle = lines
    .map((line, lineIndex) => {
      // Process each character for 45-degree gradient
      const chars = line.split('');
      const processedLine = chars
        .map((char, charIndex) => {
          // Calculate 45-degree diagonal position from bottom-left
          // Normalize coordinates: lineIndex (0 to totalLines-1), charIndex (0 to line.length-1)
          const y = (totalLines - 1 - lineIndex) / (totalLines - 1); // 0 = top, 1 = bottom (reversed)
          const x = charIndex / (line.length - 1 || 1); // 0 = left, 1 = right

          // For 45-degree gradient from bottom-left to top-right
          // The diagonal progress is (x + y) / 2, where bottom-left is 0 and top-right is 1
          const diagonalProgress = (x + y) / 2;

          if (char.trim() === '') {
            return char; // Keep whitespace as-is
          }

          // Create sophisticated gradient with soft accent transitions (blue-dominant progression)
          if (diagonalProgress <= 0.1) {
            // 0-10% - Dark blue (bottom-left)
            return `${colors.darkBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.2) {
            // 10-20% - Light blue accent
            return `${colors.lightBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.32) {
            // 20-32% - Medium blue
            return `${colors.mediumBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.42) {
            // 32-42% - Blue-cyan blend
            return `${colors.blueCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.52) {
            // 42-52% - Medium cyan accent
            return `${colors.mediumCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.62) {
            // 52-62% - Dark cyan (center transition)
            return `${colors.darkCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.72) {
            // 62-72% - Soft teal accent
            return `${colors.softTeal}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.82) {
            // 72-82% - Teal green
            return `${colors.tealGreen}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.92) {
            // 82-92% - Soft green accent
            return `${colors.softGreen}${char}${colors.reset}`;
          } else {
            // 92-100% - Medium green (top-right)
            return `${colors.mediumGreen}${char}${colors.reset}`;
          }
        })
        .join('');

      return processedLine;
    })
    .join('\n');

  return `
${gradientTitle}

  ${colors.gray}Transform SVG files into production-ready components${colors.reset}
            ${colors.blue}React${colors.reset} ${colors.gray}•${colors.reset} ${colors.green}Vue 3${colors.reset} ${colors.gray}•${colors.reset} ${colors.blue}TypeScript${colors.reset}
  
${colors.gray}─────────────────────────────────────────────────────────${colors.reset}
`;
}
