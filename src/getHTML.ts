export default function (
  config: any,
  extName: string,
  version: string
): string {
  let model: string = config.model;
  let modelWidth: number = config.modelWidth;
  let modelHeight: number = config.modelHeight;
  let moveX: number = config.moveX;
  let moveY: number = config.moveY;
  let opacity: number = config.opacity;
  let position: string = config.position;

  return ` <!-- /*ext-${extName}-start*/ -->
  <!-- /*ext.${extName}.ver.${version}*/ -->
  <!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src 'self' https: data: blob: vscode-remote-resource:; media-src 'none'; frame-src 'self' vscode-webview: https://*.vscode-webview-test.com; object-src 'self'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' https: vscode-remote-resource:;"
      />
    </head>
    <style type="text/css">
      #live2dcanvas {
        border: 0 !important;
      }
    </style>
    <body aria-label="">
      <div id="live2d-widget">
        <canvas
          id="live2dcanvas"
          width="${modelWidth}"
          height="${modelHeight}"
          style="
            position: fixed;
            width: ${modelWidth}px;
            height: ${modelHeight}px;
            opacity: ${opacity};
            transition: opacity 300ms ease-in-out;
            ${position}: ${moveX + 20}px;
            bottom: ${moveY + 20}px;
            z-index: 99999;
            pointer-events: none;
            border: 0;
          "
        ></canvas>
      </div>
    </body>
  
    <!-- Init Bootstrap Helpers -->
    <script src="../../../../bootstrap.js"></script>
    <script src="../../../../vs/loader.js"></script>
    <script src="../../../../bootstrap-window.js"></script>
  
    <!-- Startup via workbench.js -->
    <script src="workbench.js"></script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/live2d-widget@3.0.4/lib/L2Dwidget.min.js?_=1557308476616"
    ></script>
    <script type="text/javascript">
      L2Dwidget.init({
        model: {
          jsonPath:
            "https://unpkg.com/live2d-widget-model-${model}/assets/${model}.model.json",
        },
        display: {
          superSample: 2,
          width: ${modelHeight},
          height: ${modelHeight},
          position: "${position}",
          hOffset:  ${moveX + 20},
          vOffset:  ${moveY + 20},
        },
        react: {
          opacityDefault: ${opacity}
        }
      });
    </script>
  </html>
  
  `;
}
