#!/usr/bin/env node

/**
 * SVGFusion Demo Runner
 * Generates components and runs demo applications
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class DemoRunner {
  constructor() {
    this.demoDir = path.join(process.cwd(), 'demo');
    this.reactDemoDir = path.join(this.demoDir, 'react-demo');
    this.vueDemoDir = path.join(this.demoDir, 'vue-demo');
  }

  showBanner() {
    console.log(createBanner(ansiColors, 'SVGFusion Demo'));
  }

  /**
   * Run command and return promise
   */
  runCommand(command, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
      console.log(`🔧 Running: ${command} (in ${cwd})`);

      exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error: ${error.message}`);
          reject(error);
          return;
        }

        if (stderr) {
          console.log(`📝 ${stderr}`);
        }

        if (stdout) {
          console.log(stdout);
        }

        resolve({ stdout, stderr });
      });
    });
  }

  /**
   * Start dev server in background
   */
  startDevServer(command, cwd, name) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting ${name} dev server...`);

      const child = spawn('npm', ['run', 'dev'], {
        cwd,
        stdio: 'pipe',
        shell: true,
      });

      let resolved = false;

      child.stdout.on('data', data => {
        const output = data.toString();
        console.log(`[${name}] ${output.trim()}`);

        // Check if server is ready
        if (output.includes('Local:') && !resolved) {
          resolved = true;
          const urlMatch = output.match(/Local:\s+(http:\/\/[^\s]+)/);
          const url = urlMatch ? urlMatch[1] : 'http://localhost:3000';
          resolve({ url, process: child });
        }
      });

      child.stderr.on('data', data => {
        const output = data.toString();
        console.log(`[${name} Error] ${output.trim()}`);
      });

      child.on('error', error => {
        if (!resolved) {
          resolved = true;
          reject(error);
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error(`${name} server failed to start within 30 seconds`));
        }
      }, 30000);
    });
  }

  /**
   * Check if directory exists
   */
  directoryExists(dir) {
    return fs.existsSync(dir);
  }

  /**
   * Generate React and Vue components
   */
  async generateComponents() {
    console.log('📦 Building SVGFusion...');
    await this.runCommand('npm run build');

    console.log('\n🎨 Generating React components...');
    await this.runCommand('node generate-react-icons.js', this.demoDir);

    console.log('\n🎨 Generating Vue components...');
    await this.runCommand('node generate-vue-icons.js', this.demoDir);

    console.log('\n✅ Component generation completed!');
  }

  /**
   * Install dependencies for demo projects
   */
  async installDependencies() {
    if (this.directoryExists(this.reactDemoDir)) {
      console.log('\n📦 Installing React demo dependencies...');
      await this.runCommand('npm install', this.reactDemoDir);
    }

    if (this.directoryExists(this.vueDemoDir)) {
      console.log('\n📦 Installing Vue demo dependencies...');
      await this.runCommand('npm install', this.vueDemoDir);
    }
  }

  /**
   * Run both demo applications
   */
  async runDemos() {
    const servers = [];

    try {
      // Start React demo if it exists
      if (this.directoryExists(this.reactDemoDir)) {
        console.log('\n⚛️  Starting React demo...');
        const reactServer = await this.startDevServer(
          'npm run dev',
          this.reactDemoDir,
          'React'
        );
        servers.push(reactServer);
        console.log(`✅ React demo running at: ${reactServer.url}`);
      }

      // Start Vue demo if it exists
      if (this.directoryExists(this.vueDemoDir)) {
        console.log('\n🟢 Starting Vue demo...');
        const vueServer = await this.startDevServer(
          'npm run dev',
          this.vueDemoDir,
          'Vue'
        );
        servers.push(vueServer);
        console.log(`✅ Vue demo running at: ${vueServer.url}`);
      }

      if (servers.length === 0) {
        console.log('❌ No demo directories found!');
        return;
      }

      console.log('\n🎉 Demo servers are running!');
      console.log('\n📱 Demo URLs:');
      servers.forEach((server, index) => {
        const framework =
          index === 0
            ? this.directoryExists(this.reactDemoDir)
              ? 'React'
              : 'Vue'
            : 'Vue';
        console.log(`   ${framework}: ${server.url}`);
      });

      console.log('\n⌨️  Press Ctrl+C to stop all servers');

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping demo servers...');
        servers.forEach(server => {
          server.process.kill();
        });
        process.exit(0);
      });

      // Keep process alive
      await new Promise(() => {});
    } catch (error) {
      console.error('❌ Failed to start demo servers:', error.message);
      // Clean up any started servers
      servers.forEach(server => {
        if (server.process) {
          server.process.kill();
        }
      });
    }
  }

  /**
   * Show help message
   */
  showHelp() {
    console.log(`
🎨 SVGFusion Demo Runner

Usage:
  node scripts/run_demo.js [command]

Commands:
  generate     Generate React and Vue components from SVGs
  install      Install dependencies for demo projects  
  run          Start demo development servers
  all          Generate, install, and run (default)
  help         Show this help message

Examples:
  node scripts/run_demo.js generate    # Just generate components
  node scripts/run_demo.js run         # Just run existing demos
  node scripts/run_demo.js all         # Full demo setup and run
  node scripts/run_demo.js             # Same as 'all'
    `);
  }

  /**
   * Main execution method
   */
  async execute(command = 'all') {
    try {
      switch (command) {
        case 'generate':
          await this.generateComponents();
          break;

        case 'install':
          await this.installDependencies();
          break;

        case 'run':
          await this.runDemos();
          break;

        case 'all':
          await this.generateComponents();
          await this.installDependencies();
          await this.runDemos();
          break;

        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;

        default:
          console.log(`❌ Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Demo runner failed:', error.message);
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'all';
  const runner = new DemoRunner();
  runner.execute(command);
}

module.exports = { DemoRunner };
