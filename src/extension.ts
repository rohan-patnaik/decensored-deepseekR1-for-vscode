import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
  console.log('Deepseek extension activated');

  let disposable = vscode.commands.registerCommand('decensored-deepseekr1-for-vscode.chico', async () => {
    const panel = vscode.window.createWebviewPanel(
      'deepChat',
      'Decensored Deepseek R1-1776',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();

    panel.webview.onDidReceiveMessage(async (message: any) => {
      if (message.command === 'chat') {
        const userPrompt = message.text;
        let responseText = '';

        try {
          // Call Ollama with streaming enabled to chat with Deepseek R1 or other models here
          const streamResponse = await ollama.chat({
            model: 'deepseek-coder:6.7b', 
            // model: 'deepseek-r1_decensor_v1-gguf',
            // model: 'dolphin-mixtral_v1-gguf',
            messages: [{ role: 'user', content: userPrompt }],
            stream: true
          });

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

function getWebviewContent(): string {
  return /*html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Decensored Deepseek R1</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          background: #1e1e1e;
          color: #d4d4d4;
          margin: 0;
          padding: 0;
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
        <h1>Decensored Deepseek</h1>
        <div class="input-group">
          <input type="text" id="prompt" placeholder="What's on your mind today?" />
          <button id="askBtn">Ask</button>
        </div>
        <div id="response"></div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();

        function sendPrompt() {
          const text = document.getElementById('prompt').value;
          vscode.postMessage({ command: 'chat', text });
        }

        document.getElementById('askBtn').addEventListener('click', () => {
          sendPrompt();
        });

        document.getElementById('prompt').addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            sendPrompt();
          }
        });

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
