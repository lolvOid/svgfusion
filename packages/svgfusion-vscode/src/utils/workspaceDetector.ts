import * as vscode from 'vscode';
import * as path from 'path';

export class WorkspaceDetector {
  private frameworkCache: Map<string, 'react' | 'vue' | 'unknown'> = new Map();

  constructor() {
    // Clear cache when workspace folders change
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      this.frameworkCache.clear();
    });
  }

  async detectFramework(): Promise<'react' | 'vue' | 'unknown'> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return 'unknown';
    }

    // For multiple workspace folders, check the first one or the active one
    const activeEditor = vscode.window.activeTextEditor;
    let targetFolder = workspaceFolders[0];

    if (activeEditor) {
      const activeFolder = vscode.workspace.getWorkspaceFolder(
        activeEditor.document.uri
      );
      if (activeFolder) {
        targetFolder = activeFolder;
      }
    }

    const cacheKey = targetFolder.uri.fsPath;
    if (this.frameworkCache.has(cacheKey)) {
      return this.frameworkCache.get(cacheKey)!;
    }

    const detected = await this.detectFrameworkInFolder(targetFolder);
    this.frameworkCache.set(cacheKey, detected);

    return detected;
  }

  private async detectFrameworkInFolder(
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<'react' | 'vue' | 'unknown'> {
    try {
      // Check package.json first
      const packageJsonPath = path.join(
        workspaceFolder.uri.fsPath,
        'package.json'
      );
      const packageJsonUri = vscode.Uri.file(packageJsonPath);

      try {
        const packageJsonContent =
          await vscode.workspace.fs.readFile(packageJsonUri);
        const packageJson = JSON.parse(
          Buffer.from(packageJsonContent).toString('utf8')
        );

        const allDependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        };

        // Check for React
        if (allDependencies.react || allDependencies['@types/react']) {
          return 'react';
        }

        // Check for Vue
        if (
          allDependencies.vue ||
          allDependencies['@vue/cli-service'] ||
          allDependencies.nuxt
        ) {
          return 'vue';
        }
      } catch {
        // package.json not found or invalid, continue with file-based detection
      }

      // Check for framework-specific files
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '**/*.{vue,jsx,tsx}'),
        new vscode.RelativePattern(workspaceFolder, '**/node_modules/**'),
        10 // Limit to first 10 files for performance
      );

      let reactFiles = 0;
      let vueFiles = 0;

      for (const file of files) {
        const ext = path.extname(file.fsPath);
        if (ext === '.jsx' || ext === '.tsx') {
          reactFiles++;
        } else if (ext === '.vue') {
          vueFiles++;
        }
      }

      if (reactFiles > vueFiles) {
        return 'react';
      } else if (vueFiles > reactFiles) {
        return 'vue';
      }

      // Check for configuration files
      const configFiles = await Promise.all([
        this.fileExists(workspaceFolder, 'vite.config.js'),
        this.fileExists(workspaceFolder, 'vite.config.ts'),
        this.fileExists(workspaceFolder, 'next.config.js'),
        this.fileExists(workspaceFolder, 'next.config.mjs'),
        this.fileExists(workspaceFolder, 'vue.config.js'),
        this.fileExists(workspaceFolder, 'nuxt.config.js'),
        this.fileExists(workspaceFolder, 'nuxt.config.ts'),
      ]);

      const [viteJs, viteTs, nextJs, nextMjs, vueConfig, nuxtJs, nuxtTs] =
        configFiles;

      if (nextJs || nextMjs) {
        return 'react';
      }

      if (vueConfig || nuxtJs || nuxtTs) {
        return 'vue';
      }

      // Check content of Vite config for framework hints
      if (viteJs || viteTs) {
        const configPath = viteJs || viteTs;
        if (configPath) {
          const framework =
            await this.detectFrameworkFromViteConfig(configPath);
          if (framework !== 'unknown') {
            return framework;
          }
        }
      }
    } catch (error) {
      console.error('Error detecting framework:', error);
    }

    return 'unknown';
  }

  private async fileExists(
    workspaceFolder: vscode.WorkspaceFolder,
    fileName: string
  ): Promise<string | null> {
    try {
      const filePath = path.join(workspaceFolder.uri.fsPath, fileName);
      const uri = vscode.Uri.file(filePath);
      await vscode.workspace.fs.stat(uri);
      return filePath;
    } catch {
      return null;
    }
  }

  private async detectFrameworkFromViteConfig(
    configPath: string
  ): Promise<'react' | 'vue' | 'unknown'> {
    try {
      const uri = vscode.Uri.file(configPath);
      const content = await vscode.workspace.fs.readFile(uri);
      const configText = Buffer.from(content).toString('utf8');

      if (
        configText.includes('@vitejs/plugin-react') ||
        configText.includes('plugin-react')
      ) {
        return 'react';
      }

      if (
        configText.includes('@vitejs/plugin-vue') ||
        configText.includes('plugin-vue')
      ) {
        return 'vue';
      }
    } catch {
      // Error reading config file
    }

    return 'unknown';
  }

  refresh(): void {
    this.frameworkCache.clear();
  }

  // Get project info for display
  async getProjectInfo(): Promise<{
    framework: 'react' | 'vue' | 'unknown';
    hasTypeScript: boolean;
    packageManager: 'npm' | 'yarn' | 'pnpm' | 'unknown';
  }> {
    const framework = await this.detectFramework();
    const hasTypeScript = await this.hasTypeScript();
    const packageManager = await this.detectPackageManager();

    return {
      framework,
      hasTypeScript,
      packageManager,
    };
  }

  private async hasTypeScript(): Promise<boolean> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return false;

    try {
      const tsconfigFiles = await vscode.workspace.findFiles(
        '**/tsconfig.json',
        '**/node_modules/**',
        1
      );

      return tsconfigFiles.length > 0;
    } catch {
      return false;
    }
  }

  private async detectPackageManager(): Promise<
    'npm' | 'yarn' | 'pnpm' | 'unknown'
  > {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return 'unknown';

    const workspaceFolder = workspaceFolders[0];

    // Check for lock files
    const lockFiles = [
      { file: 'pnpm-lock.yaml', manager: 'pnpm' as const },
      { file: 'yarn.lock', manager: 'yarn' as const },
      { file: 'package-lock.json', manager: 'npm' as const },
    ];

    for (const { file, manager } of lockFiles) {
      if (await this.fileExists(workspaceFolder, file)) {
        return manager;
      }
    }

    return 'unknown';
  }
}
