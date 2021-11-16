import * as vscode from "vscode";
import { Home } from "./Home";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(Home.watch());
}

export function deactivate() {}
