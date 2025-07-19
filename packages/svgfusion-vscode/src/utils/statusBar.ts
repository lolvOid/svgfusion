import * as vscode from 'vscode';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.name = 'SVGFusion';
  }

  updateForEditor(editor: vscode.TextEditor | undefined): void {
    if (!editor) {
      this.statusBarItem.hide();
      return;
    }

    const document = editor.document;

    if (!document.fileName.endsWith('.svg')) {
      this.statusBarItem.hide();
      return;
    }

    // Show SVGFusion status for SVG files
    this.statusBarItem.text = '$(file-media) SVGFusion';
    this.statusBarItem.tooltip = 'SVGFusion: Convert SVG to component';
    this.statusBarItem.command = 'svgfusion.convertSvg';
    this.statusBarItem.show();
  }

  updateWithProgress(message: string): void {
    this.statusBarItem.text = `$(loading~spin) ${message}`;
    this.statusBarItem.tooltip = message;
    this.statusBarItem.command = undefined;
    this.statusBarItem.show();
  }

  updateWithSuccess(message: string): void {
    this.statusBarItem.text = `$(check) ${message}`;
    this.statusBarItem.tooltip = message;
    this.statusBarItem.command = 'svgfusion.convertSvg';
    this.statusBarItem.show();

    // Reset to normal state after a delay
    setTimeout(() => {
      this.updateForEditor(vscode.window.activeTextEditor);
    }, 3000);
  }

  updateWithError(message: string): void {
    this.statusBarItem.text = `$(error) ${message}`;
    this.statusBarItem.tooltip = message;
    this.statusBarItem.command = 'svgfusion.convertSvg';
    this.statusBarItem.show();

    // Reset to normal state after a delay
    setTimeout(() => {
      this.updateForEditor(vscode.window.activeTextEditor);
    }, 5000);
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
