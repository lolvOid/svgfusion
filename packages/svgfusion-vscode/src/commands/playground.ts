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
    panel.webview.html = this.getWebviewContent(panel.webview);

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
              const { SVGFusionBrowser } = await import('svgfusion-dom');
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

  private getWebviewContent(webview: vscode.Webview): string {
    // Get properly formatted URI for the icon
    const iconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'icon.png')
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SVGFusion Playground</title>
        <style>
            * { box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                min-height: 100vh;
                overflow-y: auto;
            }
            .playground-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                min-height: calc(100vh - 140px);
                margin-bottom: 20px;
            }
            .playground-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px 0;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin-bottom: 8px;
            }
            .logo svg {
                width: 32px;
                height: 32px;
            }
            .logo-icon {
                width: 32px;
                height: 32px;
                border-radius: 4px;
            }
            .logo-text {
                font-size: 24px;
                font-weight: 600;
                background: linear-gradient(45deg, #007acc, #00d4ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;

            }
            .playground-subtitle {
                font-size: 14px;
                color: var(--vscode-descriptionForeground);
                margin-top: 4px;
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
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 15px;
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
                display: flex;
                align-items: center;
                gap: 8px;
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
                padding: 20px 15px;
                margin-top: 30px;
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                display: flex;
                justify-content: center;
                gap: 18px;
                border-top: 1px solid var(--vscode-panel-border);
            }
            .footer a {
                color: var(--vscode-textLink-foreground);
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            .lucide {
                width: 1.1em;
                height: 1.1em;
                vertical-align: middle;
                stroke: currentColor;
                fill: none;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
        </style>
    </head>
    <body>
        <div class="playground-header">
            <div class="logo">
                <img src="${iconUri}" alt="SVGFusion Logo" class="logo-icon">
                <span class="logo-text">SVGFusion</span>
            </div>
            <div class="playground-subtitle">Convert SVG files to React/Vue components</div>
        </div>
        <div class="playground-container">
            <div class="input-panel">
                <div class="panel-header">
                    <svg class="lucide" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                    Input SVG
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
                        <button id="convertBtn">
                            <svg class="lucide" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                            Convert
                        </button>
                    </div>
                </div>
            </div>
            <div class="output-panel">
                <div class="panel-header">
                    <svg class="lucide" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                    Generated Component
                </div>
                <div class="panel-content">
                    <div id="output" class="output-code">Click "Convert" to generate your component...</div>
                    <div id="error" class="error" style="display: none;"></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <a href="#" id="docsLink"><svg class="lucide" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V6.5A2.5 2.5 0 0 0 17.5 4h-11A2.5 2.5 0 0 0 4 6.5z"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M2 10h20"/></svg> Documentation</a>
            <a href="#" id="githubLink"><svg class="lucide" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.646.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.945 0-1.092.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.594 1.028 2.686 0 3.842-2.337 4.688-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg> GitHub</a>
            <a href="#" id="websiteLink"><svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg> Website</a>
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
                convertBtn.innerHTML = '<svg class="lucide" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Converting...';
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
                        convertBtn.innerHTML = '<svg class="lucide" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Convert';
                        hideError();
                        break;
                        
                    case 'conversionError':
                        showError(message.error);
                        convertBtn.disabled = false;
                        convertBtn.innerHTML = '<svg class="lucide" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Convert';
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
