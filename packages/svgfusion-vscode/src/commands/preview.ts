import * as vscode from 'vscode';

export class PreviewCommand {
  private static currentPanel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  async execute(uri?: vscode.Uri): Promise<void> {
    try {
      const svgUri = uri || (await this.selectSvgFile());
      if (!svgUri) {
        return;
      }

      const column = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (PreviewCommand.currentPanel) {
        PreviewCommand.currentPanel.reveal(column);
        await this.updatePreview(svgUri);
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        'svgfusionPreview',
        `SVG Preview - ${this.getFileName(svgUri)}`,
        column || vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      PreviewCommand.currentPanel = panel;

      panel.onDidDispose(
        () => {
          PreviewCommand.currentPanel = undefined;
        },
        null,
        this.context.subscriptions
      );

      await this.updatePreview(svgUri);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      vscode.window.showErrorMessage(`❌ Preview failed: ${errorMessage}`);
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
      title: 'Select SVG file to preview',
    });

    return files?.[0];
  }

  private async updatePreview(svgUri: vscode.Uri) {
    if (!PreviewCommand.currentPanel) {
      return;
    }

    try {
      const svgContent = await vscode.workspace.fs.readFile(svgUri);
      const svgText = Buffer.from(svgContent).toString('utf8');
      const fileName = this.getFileName(svgUri);

      PreviewCommand.currentPanel.title = `SVG Preview - ${fileName}`;
      PreviewCommand.currentPanel.webview.html = this.getPreviewHtml(
        svgText,
        fileName
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load SVG';
      PreviewCommand.currentPanel.webview.html =
        this.getErrorHtml(errorMessage);
    }
  }

  private getFileName(uri: vscode.Uri): string {
    const parts = uri.fsPath.split('/');
    return parts[parts.length - 1];
  }

  private getPreviewHtml(svgContent: string, fileName: string): string {
    // Escape the SVG content for safe insertion into HTML
    const escapedSvg = svgContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SVG Preview - ${fileName}</title>
        <style>
            * {
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                min-height: 100vh;
            }
            
            .header {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            
            .filename {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .tabs {
                display: flex;
                margin: 20px 0 0 0;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            
            .tab {
                background: none;
                border: none;
                padding: 10px 16px;
                cursor: pointer;
                color: var(--vscode-tab-inactiveForeground);
                background: var(--vscode-tab-inactiveBackground);
                border-bottom: 2px solid transparent;
                font-size: 13px;
            }
            
            .tab:hover {
                color: var(--vscode-tab-activeForeground);
                background: var(--vscode-tab-hoverBackground);
            }
            
            .tab.active {
                color: var(--vscode-tab-activeForeground);
                background: var(--vscode-tab-activeBackground);
                border-bottom-color: var(--vscode-tab-activeBorder);
            }
            
            .tab-content {
                display: none;
                padding: 20px 0;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .preview-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .svg-preview {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 40px;
                position: relative;
                overflow: auto;
            }
            
            .svg-preview svg {
                max-width: 100%;
                max-height: 400px;
                display: block;
            }
            
            .size-controls {
                display: flex;
                gap: 10px;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .size-btn {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .size-btn:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            
            .size-btn.active {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
            }
            
            .code-container {
                background: var(--vscode-textCodeBlock-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .code-header {
                display: flex;
                justify-content: between;
                align-items: center;
                padding: 8px 12px;
                background: var(--vscode-panel-background);
                border-bottom: 1px solid var(--vscode-panel-border);
                font-size: 12px;
                font-weight: 500;
            }
            
            .copy-btn {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                border-radius: 3px;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 11px;
                margin-left: auto;
            }
            
            .copy-btn:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            
            .code-content {
                padding: 15px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 13px;
                line-height: 1.4;
                white-space: pre-wrap;
                overflow: auto;
                max-height: 400px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .info-card {
                background: var(--vscode-panel-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 15px;
            }
            
            .info-title {
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                color: var(--vscode-descriptionForeground);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value {
                font-size: 14px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            
            .actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--vscode-panel-border);
            }
            
            .action-btn {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .action-btn:hover {
                background: var(--vscode-button-hoverBackground);
            }
            
            .background-options {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-left: auto;
            }
            
            .bg-option {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                border: 2px solid transparent;
            }
            
            .bg-option.active {
                border-color: var(--vscode-button-background);
            }
            
            .bg-white { background: white; }
            .bg-dark { background: #1e1e1e; }
            .bg-transparent { 
                background: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                           linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, #ccc 75%), 
                           linear-gradient(-45deg, transparent 75%, #ccc 75%);
                background-size: 8px 8px;
                background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1 class="filename">📄 ${fileName}</h1>
        </div>
        
        <div class="tabs">
            <button class="tab active" data-tab="preview">🎨 Preview</button>
            <button class="tab" data-tab="code">📝 Source Code</button>
            <button class="tab" data-tab="info">ℹ️ Info</button>
        </div>
        
        <div id="preview" class="tab-content active">
            <div class="size-controls">
                <span style="font-size: 13px; font-weight: 500;">Size:</span>
                <button class="size-btn" data-size="24">24px</button>
                <button class="size-btn" data-size="32">32px</button>
                <button class="size-btn active" data-size="48">48px</button>
                <button class="size-btn" data-size="64">64px</button>
                <button class="size-btn" data-size="96">96px</button>
                <button class="size-btn" data-size="128">128px</button>
                <button class="size-btn" data-size="original">Original</button>
                
                <div class="background-options">
                    <span style="font-size: 13px; font-weight: 500; margin-right: 8px;">Background:</span>
                    <div class="bg-option bg-transparent active" data-bg="transparent" title="Transparent"></div>
                    <div class="bg-option bg-white" data-bg="white" title="White"></div>
                    <div class="bg-option bg-dark" data-bg="dark" title="Dark"></div>
                </div>
            </div>
            
            <div class="svg-preview" id="svgContainer">
                ${svgContent}
            </div>
        </div>
        
        <div id="code" class="tab-content">
            <div class="code-container">
                <div class="code-header">
                    SVG Source Code
                    <button class="copy-btn" onclick="copyCode()">📋 Copy</button>
                </div>
                <div class="code-content" id="sourceCode">${escapedSvg}</div>
            </div>
        </div>
        
        <div id="info" class="tab-content">
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-title">File Name</div>
                    <div class="info-value">${fileName}</div>
                </div>
                <div class="info-card">
                    <div class="info-title">File Size</div>
                    <div class="info-value" id="fileSize">-</div>
                </div>
                <div class="info-card">
                    <div class="info-title">Dimensions</div>
                    <div class="info-value" id="dimensions">-</div>
                </div>
                <div class="info-card">
                    <div class="info-title">ViewBox</div>
                    <div class="info-value" id="viewBox">-</div>
                </div>
            </div>
            
            <div class="actions">
                <button class="action-btn" onclick="convertToComponent()">
                    ⚡ Convert to Component
                </button>
                <button class="action-btn" onclick="openPlayground()">
                    🎮 Open in Playground
                </button>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            // Tab functionality
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    document.getElementById(tab.dataset.tab).classList.add('active');
                });
            });
            
            // Size controls
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const svg = document.querySelector('#svgContainer svg');
                    if (svg) {
                        const size = btn.dataset.size;
                        if (size === 'original') {
                            svg.style.width = '';
                            svg.style.height = '';
                        } else {
                            svg.style.width = size + 'px';
                            svg.style.height = size + 'px';
                        }
                    }
                });
            });
            
            // Background controls
            document.querySelectorAll('.bg-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.bg-option').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    
                    const container = document.getElementById('svgContainer');
                    const bg = option.dataset.bg;
                    
                    container.className = 'svg-preview';
                    if (bg === 'white') {
                        container.style.background = 'white';
                    } else if (bg === 'dark') {
                        container.style.background = '#1e1e1e';
                    } else {
                        container.style.background = 'var(--vscode-editor-background)';
                    }
                });
            });
            
            // Initialize info
            function updateInfo() {
                const svg = document.querySelector('#svgContainer svg');
                if (svg) {
                    const width = svg.getAttribute('width') || svg.viewBox?.baseVal?.width || 'Auto';
                    const height = svg.getAttribute('height') || svg.viewBox?.baseVal?.height || 'Auto';
                    const viewBox = svg.getAttribute('viewBox') || 'None';
                    
                    document.getElementById('dimensions').textContent = width + ' × ' + height;
                    document.getElementById('viewBox').textContent = viewBox;
                }
                
                const sourceCode = document.getElementById('sourceCode').textContent;
                const sizeInBytes = new Blob([sourceCode]).size;
                const sizeStr = sizeInBytes < 1024 
                    ? sizeInBytes + ' B'
                    : (sizeInBytes / 1024).toFixed(1) + ' KB';
                    
                document.getElementById('fileSize').textContent = sizeStr;
            }
            
            function copyCode() {
                const code = document.getElementById('sourceCode').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const btn = document.querySelector('.copy-btn');
                    const original = btn.textContent;
                    btn.textContent = '✅ Copied!';
                    setTimeout(() => {
                        btn.textContent = original;
                    }, 2000);
                });
            }
            
            function convertToComponent() {
                // This would trigger the convert command
                // For now, just show a message
                vscode.postMessage({
                    command: 'convertSvg'
                });
            }
            
            function openPlayground() {
                vscode.postMessage({
                    command: 'openPlayground'
                });
            }
            
            // Initialize
            updateInfo();
            
            // Set initial size
            document.querySelector('[data-size="48"]').click();
        </script>
    </body>
    </html>`;
  }

  private getErrorHtml(errorMessage: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SVG Preview Error</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 40px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                text-align: center;
            }
            
            .error-container {
                max-width: 400px;
            }
            
            .error-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            
            .error-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 10px;
                color: var(--vscode-errorForeground);
            }
            
            .error-message {
                font-size: 14px;
                color: var(--vscode-descriptionForeground);
                line-height: 1.4;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">❌</div>
            <div class="error-title">Preview Error</div>
            <div class="error-message">${errorMessage}</div>
        </div>
    </body>
    </html>`;
  }
}
