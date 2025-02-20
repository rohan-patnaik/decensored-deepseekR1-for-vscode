import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
  console.log('Deepseek extension activated');

  // Register a command that opens the chat panel
  let disposable = vscode.commands.registerCommand('uncensored-deepseekr1-for-vscode.chico', async () => {
    // Create and show a new webview panel when the command is executed
    const panel = vscode.window.createWebviewPanel(
      'deepChat',            // Identifies the type of the webview.
      'Uncensored Deepseek R1-1776',       // Title of the panel displayed to the user.
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      { enableScripts: true } // Enable scripts in the webview.
    );

    // Set the webview's HTML content
    panel.webview.html = getWebviewContent();

    // Listen for messages from the webview
    panel.webview.onDidReceiveMessage(async (message: any) => {
      if (message.command === 'chat') {
        const userPrompt = message.text;
        let responseText = '';

        try {
          // Call Ollama with streaming enabled to chat with Deepseek R1.
          const streamResponse = await ollama.chat({
            model: 'deepseek-coder:6.7b',
            messages: [{ role: 'user', content: userPrompt }],
            stream: true
          });

          // Accumulate chunks from the stream and send updates to the webview.
          for await (const part of streamResponse) {
            responseText += part.message.content;
            panel.webview.postMessage({
              command: 'chatResponse',
              text: responseText
            });
          }
        } catch (err) {
          console.error('Error while streaming chat response:', err);
        }
      }
    });
  });

  context.subscriptions.push(disposable);
}

/**
 * Returns the HTML content displayed in the webview panel.
 */
function getWebviewContent(): string {
  return /*html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Uncensored Deepseek R1</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          background: #1e1e1e;
          color: #d4d4d4;
          margin: 0;
          padding: 0; /* Remove default padding to let content stretch */
        }
        .container {
          width: 97.8%;
          min-height: 95vh;
          margin: 0;
          background: #252526;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
          text-align: center;
        }
        .input-group {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        input[type="text"] {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          border: none;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007acc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005a9e;
        }
        #response {
          background: #1e1e1e;
          padding: 10px;
          border-radius: 4px;
          min-height: 100px;
          white-space: pre-wrap;
          overflow-y: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Uncensored Deepseek</h1>
        <div class="input-group">
          <input type="text" id="prompt" placeholder="What's on your mind today?" />
          <button id="askBtn">Ask</button>
        </div>
        <div id="response"></div>
      </div>

      <script>
        // Acquire the VS Code API object.
        const vscode = acquireVsCodeApi();

        // A helper function to send the prompt to the extension.
        function sendPrompt() {
          const text = document.getElementById('prompt').value;
          vscode.postMessage({ command: 'chat', text });
        }

        // Send prompt on button click.
        document.getElementById('askBtn').addEventListener('click', () => {
          sendPrompt();
        });

        // Also send prompt when Enter is pressed in the input.
        document.getElementById('prompt').addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            sendPrompt();
          }
        });

        // Listen for messages from the extension to update the response area.
        window.addEventListener('message', event => {
          const { command, text } = event.data;
          if (command === 'chatResponse') {
            document.getElementById('response').innerText = text;
          }
        });
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
