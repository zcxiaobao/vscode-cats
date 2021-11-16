import * as fs from "fs";
import originHtml from "./originHTML";

/**
 * 设置文件内容
 *
 * @param {string} filePath 文件路径
 * @param {string} content
 */
export const saveContent = function (filePath, content: string): void {
  fs.writeFileSync(filePath, content, "utf-8");
};

/**
 * 获取文件内容
 *  @param {string} filePath 文件路径
 */
export const getContent = function (filePath): string {
  return fs.readFileSync(filePath, "utf-8");
};

/**
 * 获取workbench为原始代码
 *
 * @private
 * @returns {string}
 */
export const renewHTML = function (): string {
  let nowContent = originHtml();
  return nowContent;
};
