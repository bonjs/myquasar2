<template>
  选择打印机
  <!-- <el-select style="max-width:200px" v-model="selectedPrinter" placeholder="请选择打印机">
    <el-option v-for="printer in printers" :key="printer.name" :label="printer.name" :value="printer.name"></el-option>
  </el-select> -->
  <q-btn label="选择打印机" color="primary" @click="selectPrinter" />
  <q-btn type="primary" @click="printDocument">打印</q-btn>
  <div>{{ printContent }}</div>

</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

const isMobile = $q.platform.is.mobile;

const selectedPrinter = ref("");
const printContent = ref("内容");

function selectPrinter() {
  if (window.cordova && window.cordova.plugins.printer) {
    window.cordova.plugins.printer.pick((printer) => {
      if (printer) {
        this.selectedPrinter = printer; // 存储选定的打印机
        console.log("已选择打印机:", printer);
      } else {
        console.log("未选择打印机");
      }
    }, (error) => {
      console.error("选择打印机失败", error);
    });
  } else {
    console.error("打印插件未正确加载");
  }
}

// 获取打印机列表
async function loadPrinters() {
  if (isMobile) {

    window.cordova.plugins.printer.pick(function (printer) {
      if (printer) {
        console.log("选择的打印机:", printer);
      } else {
        console.log("用户未选择打印机");
      }
    }, function (error) {
      console.error("打印机选择失败", error);
    });
  } else {
    console.log('');
  }
}

// 发送打印请求
async function printDocument() {
    if (!selectedPrinter.value || !printContent.value) {
        // ElMessage.warning("请选择打印机并输入内容");
        $q.notify({
          message: '请选择打印机并输入内容',
          type: 'warning'
        })
        return;
    }

    if (isMobile) {
      // const { Printer } = await import('cordova-plugin-printer');
      // Printer.print(printContent.value, 'Print Test Document');
    } else {
      window.electronAPI.printDocument({
        printerName: selectedPrinter.value,
        content: printContent.value
      });
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
