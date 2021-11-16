import * as path from "path";
import { saveContent, renewHTML } from "./utils";

const base = process.cwd();
// 文件路径
const filePath = path.join(
  base,
  "resources",
  "app",
  "out",
  "vs",
  "code",
  "electron-browser",
  "workbench",
  "workbench.html"
);
const extName = "vscode-cats";

//执行清理
main();

//清理内容
function main() {
  try {
    let content = renewHTML();
    saveContent(filePath, content);
    return true;
  } catch (ex) {
    return false;
  }
}
