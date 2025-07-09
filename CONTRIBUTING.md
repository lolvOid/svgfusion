# Contributing to SVGFusion

Thank you for your interest in contributing to SVGFusion! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/svgfusion.git
   cd svgfusion
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development:
   ```bash
   npm run dev
   ```

## Development

### Building

```bash
npm run build        # Build for production
npm run dev          # Watch mode
```

### Testing

```bash
npm test             # Run tests
npm run test:coverage # Run with coverage
```

### Code Quality

```bash
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

## Making Changes

1. Create a feature branch:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes
3. Add tests for new functionality
4. Run tests and ensure they pass
5. Commit your changes:

   ```bash
   git commit -m "feat: describe your changes"
   ```

6. Push and create a pull request

## Code Style

- Use TypeScript for all code
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Write tests for new features
- Keep commits focused and descriptive

## Reporting Issues

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- SVG input that causes the issue
- Environment details

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update changelog if needed
5. Submit pull request with clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
