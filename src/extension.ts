import * as vscode from "vscode";
const path = require("path");
const fs = require("fs");

export function activate(context: vscode.ExtensionContext) {
  console.log("'Git ignore autocomplete' is now active!");
  console.log(vscode.workspace.getConfiguration("ignore-autocomplete", vscode.window.activeTextEditor?.document.uri).ignored);

  let disposable = vscode.languages.registerCompletionItemProvider("ignore", {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      let snippets: vscode.CompletionItem[] = [];
      if (!document.isUntitled) {
        const parentPath = path.dirname(document.fileName);
        const getFolderContent = (filePath: string) => {
          fs.readdirSync(filePath).forEach((file: string) => {
            const fullPath = path.join(filePath, file);
            if (fs.statSync(fullPath).isDirectory() && file !== ".git" && file !== "node_modules") {
              getFolderContent(fullPath);
            }
            file = fullPath.replace(parentPath, "");
            let lines = document.getText().split("\n");
            if (!lines.includes(file)) {
              const snippet = new vscode.CompletionItem(file);
              snippet.insertText = new vscode.SnippetString(file);
              snippets.push(snippet);
            }
          });
        };
        getFolderContent(parentPath);
      }
      return snippets;
    },
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log("'Git ignore autocomplete' is deactivated");
}
