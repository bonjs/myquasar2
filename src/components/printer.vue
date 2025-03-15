<template>
  <!-- <el-select style="max-width:200px" v-model="selectedPrinter" placeholder="请选择打印机">
    <el-option v-for="printer in printers" :key="printer.name" :label="printer.name" :value="printer.name"></el-option>
  </el-select> -->
  <q-btn type="primary" @click="printDocument">打印</q-btn>

</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const isMobile = $q.platform.is.mobile;

const selectedPrinter = ref("");
const printContent = ref("内容");

// 获取打印机列表
async function loadPrinters() {
  if (isMobile) {
    console.log('')
    

  } else {
    console.log('');
  }
}

// 发送打印请求
async function printDocument() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.printer) {
      const content = "<h1>打印测试</h1><p>测试内容</p>";
      window.cordova.plugins.printer.print(content, {}, () => {
        console.log("打印成功");
      }, (error) => {
        console.error("打印失败:", error);
      });
    } else {
      alert("打印插件不可用");
    }

    // ElMessage.success("已发送打印请求");
    $q.notify({
      message: '已发送打印请求',
      type: 'info'
    })
}

onMounted(loadPrinters); // 页面加载时自动获取打印机列表
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
