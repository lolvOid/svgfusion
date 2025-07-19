import * as vscode from 'vscode';
import * as path from 'path';

export class SvgTreeDataProvider implements vscode.TreeDataProvider<SvgItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    SvgItem | undefined | null | void
  > = new vscode.EventEmitter<SvgItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SvgItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor() {
    // Watch for file system changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      this.refresh();
    });

    // Watch for SVG file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.svg');
    watcher.onDidCreate(() => this.refresh());
    watcher.onDidDelete(() => this.refresh());
    watcher.onDidChange(() => this.refresh());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SvgItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SvgItem): Promise<SvgItem[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    if (!element) {
      // Root level - show workspace folders if multiple, or SVG files if single
      if (vscode.workspace.workspaceFolders.length === 1) {
        return this.getSvgFiles(vscode.workspace.workspaceFolders[0]);
      } else {
        return vscode.workspace.workspaceFolders.map(
          folder =>
            new SvgItem(
              folder.name,
              vscode.TreeItemCollapsibleState.Expanded,
              folder.uri,
              'workspaceFolder'
            )
        );
      }
    } else if (element.type === 'workspaceFolder') {
      return this.getSvgFiles(
        vscode.workspace.getWorkspaceFolder(element.resourceUri!)!
      );
    }

    return [];
  }

  private async getSvgFiles(
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<SvgItem[]> {
    try {
      const pattern = new vscode.RelativePattern(workspaceFolder, '**/*.svg');
      const excludePattern = new vscode.RelativePattern(
        workspaceFolder,
        '**/node_modules/**'
      );

      const svgFiles = await vscode.workspace.findFiles(
        pattern,
        excludePattern
      );

      return svgFiles
        .map(uri => {
          const relativePath = path.relative(
            workspaceFolder.uri.fsPath,
            uri.fsPath
          );
          const fileName = path.basename(uri.fsPath);
          const directory = path.dirname(relativePath);

          return new SvgItem(
            fileName,
            vscode.TreeItemCollapsibleState.None,
            uri,
            'svgFile',
            directory === '.' ? undefined : directory
          );
        })
        .sort((a, b) => a.label!.localeCompare(b.label as string));
    } catch (error) {
      console.error('Error loading SVG files:', error);
      return [];
    }
  }
}

export class SvgItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly resourceUri: vscode.Uri,
    public readonly type: 'workspaceFolder' | 'svgFile',
    public readonly description?: string
  ) {
    super(label, collapsibleState);

    if (type === 'svgFile') {
      this.tooltip = `${this.label} - ${description || 'SVG File'}`;
      this.description = description;
      this.iconPath = new vscode.ThemeIcon('file-media');
      this.contextValue = 'svgFile';

      // Make SVG files clickable to open preview
      this.command = {
        command: 'svgfusion.showPreview',
        title: 'Preview SVG',
        arguments: [resourceUri],
      };
    } else {
      this.tooltip = `${this.label} - Workspace Folder`;
      this.iconPath = new vscode.ThemeIcon('folder');
      this.contextValue = 'workspaceFolder';
    }
  }
}
