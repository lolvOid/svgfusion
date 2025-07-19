import * as vscode from 'vscode';
import * as path from 'path';
import { SVGFusionBrowser, svgToComponentName } from 'svgfusion-browser';
import type { WorkspaceDetector } from '../utils/workspaceDetector';
import { ConfigManager } from '../utils/configManager';

export class ConvertSvgCommand {
  private config = new ConfigManager();

  constructor(private workspaceDetector: WorkspaceDetector) {}

  async execute(uri?: vscode.Uri): Promise<void> {
    try {
      const svgUri = uri || (await this.selectSvgFile());
      if (!svgUri) {
        return;
      }

      const svgContent = await vscode.workspace.fs.readFile(svgUri);
      const svgText = Buffer.from(svgContent).toString('utf8');

      // Auto-detect framework or use configuration
      const detectedFramework = await this.workspaceDetector.detectFramework();
      const configFramework = this.config.getFramework();
      const framework =
        configFramework === 'auto' ? detectedFramework : configFramework;

      const options = await this.showConversionOptions(
        framework as 'react' | 'vue',
        svgUri
      );
      if (!options) {
        return;
      }

      // Show progress
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Converting SVG...',
          cancellable: false,
        },
        async progress => {
          progress.report({
            increment: 0,
            message: 'Initializing conversion...',
          });

          // Use your existing browser package for conversion
          const fusion = new SVGFusionBrowser();

          progress.report({
            increment: 50,
            message: 'Converting SVG to component...',
          });

          const result = await fusion.convert(svgText, {
            framework: options.framework,
            typescript: options.typescript,
            componentName: options.componentName,
            prefix: this.config.getPrefix(),
            suffix: this.config.getSuffix(),
            ...this.config.getTransformationOptions(),
            ...this.getFrameworkSpecificOptions(options.framework),
          });

          progress.report({ increment: 80, message: 'Saving component...' });

          await this.saveComponent(svgUri, result, options);

          progress.report({ increment: 100, message: 'Done!' });
        }
      );

      vscode.window.showInformationMessage(
        `✅ ${options.componentName} component created successfully!`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`❌ Conversion failed: ${errorMessage}`);
      console.error('SVGFusion conversion error:', error);
    }
  }

  private async selectSvgFile(): Promise<vscode.Uri | undefined> {
    const files = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        'SVG Files': ['svg'],
      },
      title: 'Select SVG file to convert',
    });

    return files?.[0];
  }

  private async showConversionOptions(
    detectedFramework: 'react' | 'vue',
    svgUri: vscode.Uri
  ) {
    // Get component name from file
    const fileName = path.basename(svgUri.fsPath, '.svg');
    const defaultComponentName = svgToComponentName(
      fileName,
      this.config.getPrefix(),
      this.config.getSuffix()
    );

    const frameworkItems = [
      {
        label: `$(react) React Component`,
        description: 'Convert to React component',
        framework: 'react' as const,
        picked: detectedFramework === 'react',
      },
      {
        label: `$(vuejs) Vue Component`,
        description: 'Convert to Vue component',
        framework: 'vue' as const,
        picked: detectedFramework === 'vue',
      },
    ];

    const selectedFramework = await vscode.window.showQuickPick(
      frameworkItems,
      {
        title: 'Choose Framework',
        placeHolder: 'Select the target framework for conversion',
      }
    );

    if (!selectedFramework) {
      return null;
    }

    const typeScriptItems = [
      {
        label: '$(symbol-type-parameter) TypeScript',
        description: 'Generate TypeScript component',
        typescript: true,
        picked: this.config.useTypeScript(),
      },
      {
        label: '$(symbol-string) JavaScript',
        description: 'Generate JavaScript component',
        typescript: false,
        picked: !this.config.useTypeScript(),
      },
    ];

    const selectedType = await vscode.window.showQuickPick(typeScriptItems, {
      title: 'Choose Language',
      placeHolder: 'Select TypeScript or JavaScript',
    });

    if (!selectedType) {
      return null;
    }

    const componentName = await vscode.window.showInputBox({
      prompt: 'Component name',
      value: defaultComponentName,
      placeHolder: 'e.g., MyIcon',
      validateInput: value => {
        if (!value || !/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
          return 'Component name must be PascalCase (e.g., MyIcon)';
        }
        return null;
      },
    });

    if (!componentName) {
      return null;
    }

    return {
      framework: selectedFramework.framework,
      typescript: selectedType.typescript,
      componentName,
    };
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
    const outputDir = this.config.getOutputDirectory();
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(svgUri);

    if (!workspaceFolder) {
      throw new Error('No workspace folder found');
    }

    const outputPath = path.join(workspaceFolder.uri.fsPath, outputDir);
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

    // Open the created file
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }
}
