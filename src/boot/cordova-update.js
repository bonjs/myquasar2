// src/boot/cordova-update.js
import { boot } from 'quasar/wrappers';

// 只在 Cordova 环境下运行此代码
export default boot(({ app }) => {
  if (window.cordova) {
    document.addEventListener('deviceready', () => {
      // 设备准备好后才加载 Cordova 插件
      console.log('Cordova 环境已就绪');

      // 确保插件在 deviceready 后加载
      const FileTransfer = window.FileTransfer;//window.cordova.plugins && window.cordova.plugins.fileTransfer;
      const Zip = window.zip;//window.cordova.plugins && window.cordova.plugins.zip;

      if (FileTransfer && Zip) {
        console.log('Cordova 插件加载成功');
        window.FileTransfer = FileTransfer;
        window.Zip = Zip;

        // 你可以在这里调用 FileTransfer 和 Zip 插件进行操作
      } else {
        console.error('无法加载 Cordova 插件');
      }
    });
  } else {
    console.log('Cordova 环境未就绪');
  }
});
