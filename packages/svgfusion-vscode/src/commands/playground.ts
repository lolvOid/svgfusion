import * as vscode from 'vscode';

export class PlaygroundCommand {
  private static currentPanel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  async execute(): Promise<void> {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (PlaygroundCommand.currentPanel) {
      PlaygroundCommand.currentPanel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'svgfusionPlayground',
      'SVGFusion Playground',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.context.extensionUri, 'media'),
          vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        ],
      }
    );

    PlaygroundCommand.currentPanel = panel;
    panel.webview.html = this.getWebviewContent();

    panel.onDidDispose(
      () => {
        PlaygroundCommand.currentPanel = undefined;
      },
      null,
      this.context.subscriptions
    );

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'convert':
            try {
              // Import SVGFusionBrowser dynamically to avoid issues
              const { SVGFusionBrowser } = await import('svgfusion-browser');
              const fusion = new SVGFusionBrowser();

              const result = await fusion.convert(message.svg, {
                framework: message.framework,
                typescript: message.typescript,
                componentName: message.componentName || 'MyComponent',
                splitColors: message.splitColors,
                splitStrokeWidths: message.splitStrokeWidths,
                memo: message.memo,
                forwardRef: message.forwardRef,
                sfc: message.sfc,
                scriptSetup: message.scriptSetup,
              });

              panel.webview.postMessage({
                command: 'conversionResult',
                result: {
                  code: result.code,
                  filename: result.filename,
                  framework: result.framework,
                  typescript: result.typescript,
                },
              });
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Conversion failed';
              panel.webview.postMessage({
                command: 'conversionError',
                error: errorMessage,
              });
            }
            break;

          case 'openExternal':
            vscode.env.openExternal(vscode.Uri.parse(message.url));
            break;
        }
      },
      undefined,
      this.context.subscriptions
    );
  }

  private getWebviewContent(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SVGFusion Playground</title>
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
                height: 100vh;
                overflow: hidden;
            }
            
            .playground-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                height: 100%;
            }
            
            .input-panel, .output-panel {
                display: flex;
                flex-direction: column;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .panel-header {
                background: var(--vscode-panel-background);
                padding: 10px 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
                font-weight: 600;
            }
            
            .panel-content {
                flex: 1;
                padding: 15px;
                overflow: auto;
            }
            
            textarea {
                width: 100%;
                height: 300px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                padding: 10px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 13px;
                resize: vertical;
            }
            
            .controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }
            
            .control-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            label {
                font-size: 13px;
                font-weight: 500;
            }
            
            select, input[type="text"] {
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                padding: 6px 8px;
                font-size: 13px;
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            button {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
            }
            
            button:hover {
                background: var(--vscode-button-hoverBackground);
            }
            
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .output-code {
                background: var(--vscode-textCodeBlock-background);
                color: var(--vscode-editor-foreground);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                padding: 15px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 13px;
                white-space: pre-wrap;
                overflow: auto;
                max-height: 400px;
                min-height: 100px;
            }
            
            .error {
                color: var(--vscode-errorForeground);
                background: var(--vscode-inputValidation-errorBackground);
                border: 1px solid var(--vscode-inputValidation-errorBorder);
                border-radius: 4px;
                padding: 10px;
                margin-top: 10px;
            }
            
            .actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            
            .footer {
                text-align: center;
                padding: 15px;
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
            }
            
            .footer a {
                color: var(--vscode-textLink-foreground);
                text-decoration: none;
            }
            
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="playground-container">
            <div class="input-panel">
                <div class="panel-header">
                    📝 Input SVG
                </div>
                <div class="panel-content">
                    <textarea id="svgInput" placeholder="Paste your SVG code here...">&lt;svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"&gt;
  &lt;path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;
  &lt;path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;
  &lt;path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;
&lt;/svg&gt;</textarea>
                    
                    <div class="controls">
                        <div class="control-group">
                            <label for="framework">Framework</label>
                            <select id="framework">
                                <option value="react">React</option>
                                <option value="vue">Vue</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label for="language">Language</label>
                            <select id="language">
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label for="componentName">Component Name</label>
                            <input type="text" id="componentName" value="MyIcon" placeholder="e.g., MyIcon">
                        </div>
                    </div>
                    
                    <div class="controls">
                        <div class="checkbox-group">
                            <input type="checkbox" id="splitColors" checked>
                            <label for="splitColors">Split Colors</label>
                        </div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="splitStrokeWidths">
                            <label for="splitStrokeWidths">Split Stroke Widths</label>
                        </div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="memo">
                            <label for="memo">React.memo (React)</label>
                        </div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="forwardRef">
                            <label for="forwardRef">forwardRef (React)</label>
                        </div>
                    </div>
                    
                    <div class="actions">
                        <button id="convertBtn">🚀 Convert</button>
                    </div>
                </div>
            </div>
            
            <div class="output-panel">
                <div class="panel-header">
                    ⚡ Generated Component
                </div>
                <div class="panel-content">
                    <div id="output" class="output-code">Click "Convert" to generate your component...</div>
                    <div id="error" class="error" style="display: none;"></div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <a href="#" id="docsLink">📚 Documentation</a> |
            <a href="#" id="githubLink">🐙 GitHub</a> |
            <a href="#" id="websiteLink">🌐 Website</a>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            const svgInput = document.getElementById('svgInput');
            const framework = document.getElementById('framework');
            const language = document.getElementById('language');
            const componentName = document.getElementById('componentName');
            const splitColors = document.getElementById('splitColors');
            const splitStrokeWidths = document.getElementById('splitStrokeWidths');
            const memo = document.getElementById('memo');
            const forwardRef = document.getElementById('forwardRef');
            const convertBtn = document.getElementById('convertBtn');
            const output = document.getElementById('output');
            const error = document.getElementById('error');
            
            convertBtn.addEventListener('click', () => {
                const svg = svgInput.value.trim();
                if (!svg) {
                    showError('Please enter SVG code');
                    return;
                }
                
                if (!componentName.value.trim()) {
                    showError('Please enter a component name');
                    return;
                }
                
                convertBtn.disabled = true;
                convertBtn.textContent = '⏳ Converting...';
                output.textContent = 'Converting...';
                hideError();
                
                vscode.postMessage({
                    command: 'convert',
                    svg: svg,
                    framework: framework.value,
                    typescript: language.value === 'typescript',
                    componentName: componentName.value.trim(),
                    splitColors: splitColors.checked,
                    splitStrokeWidths: splitStrokeWidths.checked,
                    memo: memo.checked,
                    forwardRef: forwardRef.checked,
                    sfc: true,
                    scriptSetup: true
                });
            });
            
            // Handle framework changes
            framework.addEventListener('change', () => {
                const isReact = framework.value === 'react';
                memo.parentElement.style.display = isReact ? 'flex' : 'none';
                forwardRef.parentElement.style.display = isReact ? 'flex' : 'none';
            });
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                
                switch (message.command) {
                    case 'conversionResult':
                        output.textContent = message.result.code;
                        convertBtn.disabled = false;
                        convertBtn.textContent = '🚀 Convert';
                        hideError();
                        break;
                        
                    case 'conversionError':
                        showError(message.error);
                        convertBtn.disabled = false;
                        convertBtn.textContent = '🚀 Convert';
                        output.textContent = 'Conversion failed. Please check the error above.';
                        break;
                }
            });
            
            function showError(message) {
                error.textContent = message;
                error.style.display = 'block';
            }
            
            function hideError() {
                error.style.display = 'none';
            }
            
            // Handle external links
            document.getElementById('docsLink').addEventListener('click', (e) => {
                e.preventDefault();
                vscode.postMessage({
                    command: 'openExternal',
                    url: 'https://svgfusion.netlify.app'
                });
            });
            
            document.getElementById('githubLink').addEventListener('click', (e) => {
                e.preventDefault();
                vscode.postMessage({
                    command: 'openExternal',
                    url: 'https://github.com/lolvOid/svgfusion'
                });
            });
            
            document.getElementById('websiteLink').addEventListener('click', (e) => {
                e.preventDefault();
                vscode.postMessage({
                    command: 'openExternal',
                    url: 'https://svgfusion.netlify.app'
                });
            });
            
            // Initial setup
            framework.dispatchEvent(new Event('change'));
        </script>
    </body>
    </html>`;
  }
}
