<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          my Quasar App
        </q-toolbar-title>
        <div>v1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-list bordered class="rounded-borders" style="margin-top:50px">
      <q-expansion-item label="远程接口调用" icon="folder">
        <q-card>
          <q-card-section>
            <q-btn type="primary" @click="apiCall">远程接口调用2</q-btn>
            http://142.171.57.94/testApi
            <div  style="height: 200px; overflow: scroll;">返回：{{ apiOut }}</div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item label="使用前端数据库 " icon="folder">
        <q-card>
          <q-card-section>
            <indexeddb></indexeddb>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item label="打印" icon="folder">
        <q-card>
          <q-card-section>
            <printer></printer>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item label="热更新" icon="folder">
        <q-card>
          <q-card-section>
            <q-btn type="primary" @click="checkForUpdate">热更新</q-btn> 当前版本: v1.0.0
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import indexeddb from 'components/indexeddb.vue'
import printer from 'components/printer.vue'
import axios from 'axios'

import { useQuasar } from 'quasar'
const $q = useQuasar()
const isMobile = $q.platform.is.mobile;

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

const leftDrawerOpen = ref(false)

let apiOut = ref('')

async function apiCall() {
  console.log('apiCall')
  // window.electronAPI.sendMessage('do-something', 'Hello from Vue!');

  let url = 'https://www.bonjs.com/testApi';
  url = 'http://142.171.57.94/testApi'

  // axios.defaults.baseURL = 'http://142.171.57.94';  // 设置基础 URL
  // axios.defaults.headers.post['Content-Type'] = 'application/json';  // 设置请求头


  // url = 'http://t.weather.sojson.com/api/weather/city/101030100';
  
  // alert(isMobile + ', ' + url)
  if (isMobile) {
    // const response = await Http.request({
    //   method: 'GET',
    //   url,
    // }).catch((e) => {
    //   alert(e.message)
    // });

    axios.get(url)
    .then(response => {
      console.log("aaaa", response.data);
      apiOut.value = (JSON.stringify(response.data))
    }).catch(error => {
        console.error('aaaa', 'Error:', error)
    });
  }
}


// 检查更新并下载更新包
const checkForUpdate = async () => {
  if (window.FileTransfer && window.Zip) {
    try {
      console.log("检测到Cordova环境，执行更新");

      // 更新包的 URL 和版本信息
      const updateJsonUrl = 'http://142.171.57.94';
      const response = await fetch(updateJsonUrl);
      const updateInfo = await response.json();
      const localVersion = localStorage.getItem("app_version") || "1.0.0";  // 本地版本

      // 如果有新版本，下载并应用更新
      if (updateInfo.version !== localVersion) {
        console.log(`发现新版本: ${updateInfo.version}`);

        // 创建 FileTransfer 实例并下载更新包
        const fileTransfer = new window.FileTransfer();
        const targetPath = window.cordova.file.dataDirectory + "update.zip";

        fileTransfer.download(
          updateInfo.updateUrl,
          targetPath,
          function (entry) {
            console.log("下载完成: " + entry.toURL());

            // 解压下载的文件
            window.Zip.unzip(entry.toURL(), window.cordova.file.dataDirectory, function (status) {
              if (status === 0) {
                console.log("解压成功！");
                localStorage.setItem("app_version", updateInfo.version);  // 更新本地版本号
                location.reload(); // 重启应用，加载新版本
              } else {
                console.error("解压失败，错误码: " + status);
              }
            });
          },
          function (error) {
            console.error("下载失败: " + error.code);
          }
        );
      } else {
        console.log("已是最新版本");
      }
    } catch (error) {
      console.error("检查更新失败:", error);
    }
  } else {
    console.log("Cordova 环境未就绪");
  }
};

document.addEventListener("deviceready", function() {
  checkForUpdate();  // 启动时检查更新
});


async function testUpdate() {
  let result = await window.electronAPI.testUpdate();
  console.log('hostUpdate', result);
}

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
