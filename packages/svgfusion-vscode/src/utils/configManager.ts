import * as vscode from 'vscode';

export class ConfigManager {
  private config: vscode.WorkspaceConfiguration;

  constructor() {
    this.config = vscode.workspace.getConfiguration('svgfusion');

    // Listen to configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('svgfusion')) {
        this.config = vscode.workspace.getConfiguration('svgfusion');
      }
    });
  }

  getFramework(): 'react' | 'vue' | 'auto' {
    return this.config.get<'react' | 'vue' | 'auto'>('framework', 'auto');
  }

  useTypeScript(): boolean {
    return this.config.get<boolean>('typescript', true);
  }

  getOutputDirectory(): string {
    return this.config.get<string>('outputDirectory', './src/components/icons');
  }

  // React specific options
  getReactMemo(): boolean {
    return this.config.get<boolean>('react.memo', false);
  }

  getReactForwardRef(): boolean {
    return this.config.get<boolean>('react.forwardRef', false);
  }

  // Vue specific options
  getVueSfc(): boolean {
    return this.config.get<boolean>('vue.sfc', true);
  }

  getVueScriptSetup(): boolean {
    return this.config.get<boolean>('vue.scriptSetup', true);
  }

  // Transformation options
  getSplitColors(): boolean {
    return this.config.get<boolean>('transformation.splitColors', true);
  }

  getSplitStrokeWidths(): boolean {
    return this.config.get<boolean>('transformation.splitStrokeWidths', false);
  }

  getFixedStrokeWidth(): boolean {
    return this.config.get<boolean>('transformation.fixedStrokeWidth', false);
  }

  getOptimize(): boolean {
    return this.config.get<boolean>('transformation.optimize', true);
  }

  getTransformationOptions() {
    return {
      splitColors: this.getSplitColors(),
      splitStrokeWidths: this.getSplitStrokeWidths(),
      fixedStrokeWidth: this.getFixedStrokeWidth(),
      optimize: this.getOptimize(),
    };
  }

  // Helper method to update configuration
  async updateConfig(
    key: string,
    value: any,
    configurationTarget?: vscode.ConfigurationTarget
  ): Promise<void> {
    await this.config.update(key, value, configurationTarget);
  }
}
