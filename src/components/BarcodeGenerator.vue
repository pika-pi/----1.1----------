<template>
  <div class="section">
    <h2>单个条形码生成</h2>
    <div class="input-group">
      <label for="text">输入要生成条形码的文本：</label>
      <input 
        type="text" 
        id="text" 
        v-model="text" 
        placeholder="请输入文本"
        @input="handleInput"
        @keyup.enter="generateBarcode"
      >
    </div>
    <div class="button-group">
      <button @click="generateBarcode">生成条形码</button>
      <button class="clear-button" @click="clearBarcode">清空</button>
    </div>
    <div class="barcode-wrapper" v-show="showBarcode">
      <div class="barcode-item">
        <svg ref="barcodeElement"></svg>
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import { ElMessage } from 'element-plus'

export default {
  name: 'BarcodeGenerator',
  data() {
    return {
      text: '',
      showBarcode: false
    }
  },
  methods: {
    generateBarcode() {
      if (!this.text) {
        ElMessage({
          message: '请输入文本',
          type: 'warning',
          duration: 2000
        })
        return
      }

      if (/[\u4e00-\u9fa5]/.test(this.text)) {
        this.text = this.text.replace(/[\u4e00-\u9fa5]/g, '')
        this.showBarcode = false
        ElMessage({
          message: '条形码不支持中文字符，请使用英文字母、数字或符号',
          type: 'warning',
          duration: 3000
        })
        return
      }

      try {
        this.showBarcode = true
        this.$nextTick(() => {
          JsBarcode(this.$refs.barcodeElement, this.text, {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 20,
            margin: 10,
            background: "#ffffff"
          })
        })
      } catch (error) {
        ElMessage({
          message: '生成条形码失败：' + error.message,
          type: 'error',
          duration: 3000
        })
        this.showBarcode = false
      }
    },
    clearBarcode() {
      this.text = ''
      this.showBarcode = false
    },
    handleInput() {
      if (!this.text) {
        this.showBarcode = false
      }
    }
  }
}
</script>

<style scoped>
.section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;
}

.section:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px 0 rgba(31, 38, 135, 0.2);
}

.input-group {
  margin-bottom: 15px;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-size: 16px;
  color: #333;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.input-group input::placeholder {
  color: #999;
}

.input-group input:hover {
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.15);
}

.input-group input:focus {
  outline: none;
  border-color: rgba(76, 175, 80, 0.8);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

button:hover {
  transform: translateY(-1px);
  background: rgba(76, 175, 80, 1);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.clear-button {
  background: rgba(158, 158, 158, 0.9);
}

.clear-button:hover {
  background: rgba(158, 158, 158, 1);
  box-shadow: 0 5px 15px rgba(158, 158, 158, 0.3);
}

.barcode-wrapper {
  opacity: 0;
  transform: translateY(20px);
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.barcode-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.barcode-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
  width: 100%;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(76, 175, 80, 0.8);
  border-radius: 2px;
}
</style> 