import * as vscode from 'vscode';
import { ConvertSvgCommand } from './commands/convertSvg';
import { BatchConvertCommand } from './commands/batchConvert';
import { PlaygroundCommand } from './commands/playground';
import { PreviewCommand } from './commands/preview';
import { SvgHoverProvider } from './providers/hoverProvider';
import { SvgTreeDataProvider } from './providers/svgTreeDataProvider';
import { StatusBarManager } from './utils/statusBar';
import { WorkspaceDetector } from './utils/workspaceDetector';

export function activate(context: vscode.ExtensionContext) {
  console.log('SVGFusion extension is now active!');

  // Initialize utilities
  const workspaceDetector = new WorkspaceDetector();
  const statusBar = new StatusBarManager();

  // Initialize commands
  const convertCommand = new ConvertSvgCommand(workspaceDetector);
  const batchCommand = new BatchConvertCommand(workspaceDetector);
  const playgroundCommand = new PlaygroundCommand(context);
  const previewCommand = new PreviewCommand(context);

  // Register commands
  const disposables = [
    vscode.commands.registerCommand(
      'svgfusion.convertSvg',
      (uri?: vscode.Uri) => convertCommand.execute(uri)
    ),
    vscode.commands.registerCommand('svgfusion.batchConvert', () =>
      batchCommand.execute()
    ),
    vscode.commands.registerCommand('svgfusion.openPlayground', () =>
      playgroundCommand.execute()
    ),
    vscode.commands.registerCommand(
      'svgfusion.showPreview',
      (uri?: vscode.Uri) => previewCommand.execute(uri)
    ),

    // Register providers
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'xml' },
      new SvgHoverProvider()
    ),

    // Register tree data provider
    vscode.window.registerTreeDataProvider(
      'svgfusion.svgExplorer',
      new SvgTreeDataProvider()
    ),

    // Status bar
    statusBar,

    // Listen to active editor changes for status bar updates
    vscode.window.onDidChangeActiveTextEditor(editor => {
      statusBar.updateForEditor(editor);
    }),

    // Listen to file system changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      workspaceDetector.refresh();
    }),
  ];

  context.subscriptions.push(...disposables);

  // Initial status bar update
  statusBar.updateForEditor(vscode.window.activeTextEditor);
}

export function deactivate() {
  console.log('SVGFusion extension is now deactivated');
}
