import * as vscode from 'vscode';
import * as path from 'path';
import { SVGFusionBrowser, svgToComponentName } from 'svgfusion-dom';
import type { WorkspaceDetector } from '../utils/workspaceDetector';
import { ConfigManager } from '../utils/configManager';

export class BatchConvertCommand {
  private config = new ConfigManager();

  constructor(private workspaceDetector: WorkspaceDetector) {}

  async execute(): Promise<void> {
    try {
      // Find all SVG files in workspace
      const svgFiles = await vscode.workspace.findFiles(
        '**/*.svg',
        '**/node_modules/**'
      );

      if (svgFiles.length === 0) {
        vscode.window.showInformationMessage('No SVG files found in workspace');
        return;
      }

      // Show selection dialog
      const selectedFiles = await this.showFileSelection(svgFiles);
      if (!selectedFiles || selectedFiles.length === 0) {
        return;
      }

      // Get conversion options
      const detectedFramework = await this.workspaceDetector.detectFramework();
      const options = await this.showBatchConversionOptions(
        detectedFramework as 'react' | 'vue'
      );
      if (!options) {
        return;
      }

      // Convert files with progress
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Batch Converting SVGs...',
          cancellable: true,
        },
        async (progress, token) => {
          const total = selectedFiles.length;
          const fusion = new SVGFusionBrowser();
          const results: { success: number; failed: number; errors: string[] } =
            {
              success: 0,
              failed: 0,
              errors: [],
            };

          for (let i = 0; i < total; i++) {
            if (token.isCancellationRequested) {
              break;
            }

            const file = selectedFiles[i];
            const fileName = path.basename(file.uri.fsPath);

            progress.report({
              increment: 100 / total,
              message: `Converting ${fileName}... (${i + 1}/${total})`,
            });

            try {
              await this.convertSingleFile(file.uri, fusion, options);
              results.success++;
            } catch (error) {
              results.failed++;
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              console.error(`BatchConvert Error for ${fileName}:`, error);
              results.errors.push(`${fileName}: ${errorMessage}`);
            }
          }

          this.showBatchResults(results);
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(
        `❌ Batch conversion failed: ${errorMessage}`
      );
    }
  }

  private async showFileSelection(svgFiles: vscode.Uri[]) {
    const fileItems = svgFiles.map(file => {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(file);
      const relativePath = workspaceFolder
        ? path.relative(workspaceFolder.uri.fsPath, file.fsPath)
        : file.fsPath;

      return {
        label: path.basename(file.fsPath),
        description: relativePath,
        detail: `Size: ${this.getFileSize(file)}`,
        picked: true,
        uri: file,
      };
    });

    return await vscode.window.showQuickPick(fileItems, {
      canPickMany: true,
      title: `Select SVG files to convert (${svgFiles.length} found)`,
      placeHolder: 'Choose which SVG files to convert to components',
    });
  }

  private async showBatchConversionOptions(detectedFramework: 'react' | 'vue') {
    const frameworkItems = [
      {
        label: `$(react) React Components`,
        description: 'Convert all to React components',
        framework: 'react' as const,
        picked: detectedFramework === 'react',
      },
      {
        label: `$(vuejs) Vue Components`,
        description: 'Convert all to Vue components',
        framework: 'vue' as const,
        picked: detectedFramework === 'vue',
      },
    ];

    const selectedFramework = await vscode.window.showQuickPick(
      frameworkItems,
      {
        title: 'Choose Framework',
        placeHolder: 'Select target framework for all conversions',
      }
    );

    if (!selectedFramework) {
      return null;
    }

    const typeScriptItems = [
      {
        label: '$(symbol-type-parameter) TypeScript',
        description: 'Generate TypeScript components',
        typescript: true,
        picked: this.config.useTypeScript(),
      },
      {
        label: '$(symbol-string) JavaScript',
        description: 'Generate JavaScript components',
        typescript: false,
        picked: !this.config.useTypeScript(),
      },
    ];

    const selectedType = await vscode.window.showQuickPick(typeScriptItems, {
      title: 'Choose Language',
      placeHolder: 'Select TypeScript or JavaScript for all components',
    });

    if (!selectedType) {
      return null;
    }

    // Get output directory
    const outputDirectory = await vscode.window.showInputBox({
      prompt:
        'Output directory for all components (relative to workspace root)',
      value: this.config.getOutputDirectory(),
      placeHolder: 'e.g., ./src/components/icons',
      validateInput: value => {
        if (!value || !value.trim()) {
          return 'Output directory is required';
        }
        return null;
      },
    });

    if (!outputDirectory) {
      return null;
    }

    // Get prefix
    const prefix = await vscode.window.showInputBox({
      prompt: 'Component name prefix for all components (optional)',
      value: this.config.getPrefix(),
      placeHolder: 'e.g., Icon (leave empty for no prefix)',
    });

    if (prefix === undefined) {
      return null;
    }

    // Get suffix
    const suffix = await vscode.window.showInputBox({
      prompt: 'Component name suffix for all components (optional)',
      value: this.config.getSuffix(),
      placeHolder: 'e.g., Icon (leave empty for no suffix)',
    });

    if (suffix === undefined) {
      return null;
    }

    return {
      framework: selectedFramework.framework,
      typescript: selectedType.typescript,
      outputDirectory,
      prefix: prefix || '',
      suffix: suffix || '',
    };
  }

  private async convertSingleFile(
    svgUri: vscode.Uri,
    fusion: SVGFusionBrowser,
    options: {
      framework: 'react' | 'vue';
      typescript: boolean;
      outputDirectory: string;
      prefix: string;
      suffix: string;
    }
  ) {
    const svgContent = await vscode.workspace.fs.readFile(svgUri);
    const svgText = Buffer.from(svgContent).toString('utf8');

    const fileName = path.basename(svgUri.fsPath, '.svg');
    const componentName = svgToComponentName(
      fileName,
      options.prefix,
      options.suffix
    );

    if (!componentName) {
      throw new Error(
        `Unable to generate component name from file: ${fileName}`
      );
    }

    const result = await fusion.convert(svgText, {
      framework: options.framework,
      typescript: options.typescript,
      componentName,
      prefix: options.prefix,
      suffix: options.suffix,
      ...this.config.getTransformationOptions(),
      ...this.getFrameworkSpecificOptions(options.framework),
    });

    if (!result || !result.code) {
      throw new Error(`Conversion failed: No code generated for ${fileName}`);
    }

    await this.saveComponent(svgUri, result, {
      ...options,
      componentName,
    });
  }

  private getFrameworkSpecificOptions(framework: 'react' | 'vue') {
    if (framework === 'react') {
      return {
        memo: this.config.getReactMemo(),
        forwardRef: this.config.getReactForwardRef(),
      };
    } else {
      return {
        sfc: this.config.getVueSfc(),
        scriptSetup: this.config.getVueScriptSetup(),
      };
    }
  }

  private async saveComponent(svgUri: vscode.Uri, result: any, options: any) {
    const outputDir = options.outputDirectory;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(svgUri);

    if (!workspaceFolder) {
      throw new Error('No workspace folder found');
    }

    if (!outputDir) {
      throw new Error('Output directory is not configured');
    }

    if (!options.componentName) {
      throw new Error('Component name is required');
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    if (!workspacePath) {
      throw new Error('Workspace path is undefined');
    }

    const outputPath = path.join(workspacePath, outputDir);
    const extension = options.typescript
      ? options.framework === 'react'
        ? '.tsx'
        : '.vue'
      : options.framework === 'react'
        ? '.jsx'
        : '.vue';

    const fileName = `${options.componentName}${extension}`;
    const filePath = path.join(outputPath, fileName);

    // Ensure output directory exists
    try {
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(outputPath));
    } catch {
      // Directory might already exist, ignore error
    }

    // Write the component file
    const content = new TextEncoder().encode(result.code);
    await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), content);
  }

  private showBatchResults(results: {
    success: number;
    failed: number;
    errors: string[];
  }) {
    if (results.failed === 0) {
      vscode.window.showInformationMessage(
        `✅ Batch conversion completed! ${results.success} components created successfully.`
      );
    } else {
      const message = `⚠️  Batch conversion completed with issues: ${results.success} succeeded, ${results.failed} failed.`;

      vscode.window.showWarningMessage(message, 'Show Details').then(choice => {
        if (choice === 'Show Details') {
          const channel = vscode.window.createOutputChannel(
            'SVGFusion Batch Conversion'
          );
          channel.appendLine('Batch Conversion Results:');
          channel.appendLine(`✅ Successful: ${results.success}`);
          channel.appendLine(`❌ Failed: ${results.failed}`);
          channel.appendLine('');
          channel.appendLine('Errors:');
          results.errors.forEach(error => {
            channel.appendLine(`  • ${error}`);
          });
          channel.show();
        }
      });
    }
  }

  private getFileSize(_uri: vscode.Uri): string {
    // This is a simplified version - in real implementation you might want to get actual file size
    return 'Unknown';
  }
}
