# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in SVGFusion, please report it responsibly.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to the maintainer with the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

After submitting a vulnerability report, you can expect:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its severity within 5 business days
3. **Updates**: We will keep you informed of our progress throughout the resolution process
4. **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Responsible Disclosure

We request that you:

- Give us reasonable time to investigate and fix the issue before making any information public
- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Do not exploit a security issue for any reason (this includes demonstrating additional risk)

### Security Best Practices

When using SVGFusion:

- Always validate and sanitize SVG input files
- Use the latest version of SVGFusion
- Follow secure coding practices when integrating generated components
- Be cautious when processing SVG files from untrusted sources
- Consider implementing Content Security Policy (CSP) when using generated components in web applications

## Security Features

SVGFusion includes several built-in security measures:

- SVG sanitization to remove potentially harmful elements
- Input validation for file formats and content
- Safe component generation without executing arbitrary code
- No network requests during processing (offline operation)

For questions about this security policy, please contact the maintainers.
