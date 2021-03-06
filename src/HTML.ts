import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import FileType from "./FileType";
import vsHelp from "./vsHelp";
import getNewHtml from "./getHTML";
import { saveContent, getContent, renewHTML } from "./utils";

export class HTML {
  //当前用户配置
  private config: any;
  //配置名称
  private configName: string;
  //要修改的文件路径
  private filePath: string;
  //插件版本号
  private version: string;
  //插件名称
  private extName: string;

  //初始化参数
  public constructor(
    configName: string,
    filePath: string,
    version: string,
    extName: string
  ) {
    this.configName = configName;
    this.filePath = filePath;
    this.version = version;
    this.extName = extName;

    this.config = vscode.workspace.getConfiguration(this.configName);
    let firstload = this.checkFirstload(); // 是否初次加载插件
    let fileType = this.getFileType(); // 文件目前状态

    // 如果是第一次加载插件，或者旧版本
    if (
      firstload ||
      fileType === FileType.isOld ||
      fileType === FileType.empty
    ) {
      this.install(true);
    }
  }

  /**
   * 安装插件，hack
   *
   * @private
   * @param {boolean} [refresh] 需要更新
   * @returns {void}
   */
  public install(refresh?: boolean): void {
    let lastConfig = this.config; // 之前的配置
    let config = vscode.workspace.getConfiguration(this.configName); // 当前用户配置

    // 1.如果配置文件改变到时候，当前插件配置没有改变，则返回
    if (!refresh && JSON.stringify(lastConfig) === JSON.stringify(config)) {
      return;
    }

    // 之后操作有两种：1.初次加载  2.配置文件改变

    // 2.两次配置均为，未启动插件
    if (!lastConfig.enabled && !config.enabled) {
      return;
    }

    // 3.保存当前配置
    this.config = config; // 更新配置

    // 4.如果关闭插件
    if (!config.enabled) {
      this.uninstall();
      vsHelp.showInfoRestart(this.extName + "已关闭插件，请重新启动！");
      return;
    }

    // 5.hack 样式

    // 自定义的样式内容
    let content = getNewHtml(config, this.extName, this.version).replace(
      /\s*$/,
      ""
    );
    // 将插件的HTML写入 workbench.html 文件
    saveContent(this.filePath, content);
    vsHelp.showInfoRestart(this.extName + " 已更新配置，请重新启动！");
  }

  /**
   * 卸载
   *
   * @private
   */
  private uninstall(): boolean {
    try {
      let content = renewHTML();
      saveContent(this.filePath, content);
      return true;
    } catch (ex) {
      return false;
    }
  }

  /**
   * 检测是否初次加载，并在初次加载的时候提示用户
   *
   * @private
   * @returns {boolean} 是否初次加载
   */
  private checkFirstload(): boolean {
    const configPath = path.join(__dirname, "../assets/config.json");
    let info: { firstload: boolean } = JSON.parse(
      fs.readFileSync(configPath, "utf-8")
    );

    if (info.firstload) {
      // 提示
      vsHelp.showInfo("插件： " + this.extName + "已启动! ");
      // 标识插件已启动过
      info.firstload = false;
      fs.writeFileSync(configPath, JSON.stringify(info, null, "    "), "utf-8");

      return true;
    }

    return false;
  }

  /**
   * 获取文件状态
   *
   * @private
   * @returns {FileType}
   */
  private getFileType(): FileType {
    let jsContent = getContent(this.filePath);

    // 未 hack 过
    let ifUnInstall: boolean = !~jsContent.indexOf(`ext.${this.extName}.ver`);

    if (ifUnInstall) {
      return FileType.empty;
    }

    // hack 过的旧版本
    let ifVerOld: boolean = !~jsContent.indexOf(
      `/*ext.${this.extName}.ver.${this.version}*/`
    );

    if (ifVerOld) {
      return FileType.isOld;
    }

    // hack 过的新版本
    return FileType.isNew;
  }
}
