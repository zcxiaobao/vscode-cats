import * as vscode from "vscode";
import * as path from "path";
import version from "./version";
import { HTML } from "./HTML";

export class Home {
  public static watch(): vscode.Disposable {
    const base = path.dirname(require.main.filename);
    const filePath = path.join(
      base,
      "vs",
      "code",
      "electron-browser",
      "workbench",
      "workbench.html"
    );
    const extName = "vscode-cats";
    let HTMLApi = new HTML(extName, filePath, version, extName);
    return vscode.workspace.onDidChangeConfiguration(() => HTMLApi.install());
  }
}
