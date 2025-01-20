<template>
  <div class="section">
    <h2>批量生成条形码</h2>
    <div class="input-group">
      <label for="batchText">输入要生成的文本（每行一个）：</label>
      <div class="input-wrapper">
        <textarea 
          id="batchText" 
          v-model="batchText"
          placeholder="示例：
123456
789012"
          @input="handleInput"
          @keyup.ctrl.enter="generateBarcodes"
        ></textarea>
        <div class="shortcut-tip">按 Ctrl + Enter 快速生成</div>
      </div>
    </div>
    <div class="button-group">
      <button @click="generateBarcodes">批量生成条形码</button>
      <button class="clear-button" @click="clearBarcodes">清空</button>
    </div>
    <div class="barcode-wrapper" v-if="currentBarcode" ref="barcodeWrapper">
      <div class="barcode-item">
        <svg ref="currentBarcodeElement"></svg>
      </div>
    </div>
    <div class="navigation" v-if="barcodeData.length">
      <button 
        class="nav-button" 
        @click="prevBarcode" 
        :disabled="currentPage === 0"
      >上一个</button>
      <span class="page-info">{{ currentPage + 1 }} / {{ barcodeData.length }}</span>
      <button 
        class="nav-button" 
        @click="nextBarcode" 
        :disabled="currentPage === barcodeData.length - 1"
      >下一个</button>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import { ElMessage } from 'element-plus'

export default {
  name: 'BatchBarcodeGenerator',
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  data() {
    return {
      batchText: '',
      barcodeData: [],
      currentPage: 0
    }
  },
  computed: {
    currentBarcode() {
      return this.barcodeData[this.currentPage]
    }
  },
  watch: {
    currentPage: {
      handler(newVal) {
        this.$nextTick(() => {
          this.renderCurrentBarcode()
        })
      },
      immediate: true
    }
  },
  methods: {
    generateBarcodes() {
      const lines = this.batchText.split('\n').filter(line => line.trim())
      
      if (lines.length === 0) {
        ElMessage({
          message: '请输入要生成的文本',
          type: 'warning',
          duration: 2000
        })
        return
      }

      // 检查是否包含中文字符
      const hasChineseInCodes = lines.some(text => /[\u4e00-\u9fa5]/.test(text))

      if (hasChineseInCodes) {
        // 清除所有行中的中文字符
        this.batchText = lines.map(text => text.replace(/[\u4e00-\u9fa5]/g, '')).join('\n')
        this.barcodeData = []
        this.currentPage = 0
        ElMessage({
          message: '条形码不支持中文字符，请使用英文字母、数字或符号',
          type: 'warning',
          duration: 3000
        })
        return
      }

      this.barcodeData = lines.map(text => text.trim()).filter(text => text)

      if (this.barcodeData.length === 0) {
        ElMessage({
          message: '没有有效的文本输入',
          type: 'warning',
          duration: 2000
        })
        return
      }

      this.currentPage = 0
      this.$nextTick(() => {
        this.renderCurrentBarcode()
        const barcodeWrapper = this.$refs.barcodeWrapper
        if (barcodeWrapper) {
          barcodeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    renderCurrentBarcode() {
      if (!this.currentBarcode) return
      
      try {
        const barcodeElement = this.$refs.currentBarcodeElement
        if (barcodeElement) {
          // 清除之前的内容
          barcodeElement.innerHTML = ''
          JsBarcode(barcodeElement, this.currentBarcode, {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 20,
            margin: 10,
            background: "#ffffff"
          })
        }
      } catch (error) {
        ElMessage({
          message: '生成条形码失败：' + error.message,
          type: 'error',
          duration: 3000
        })
      }
    },
    clearBarcodes() {
      this.batchText = ''
      this.barcodeData = []
      this.currentPage = 0
    },
    prevBarcode() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    nextBarcode() {
      if (this.currentPage < this.barcodeData.length - 1) {
        this.currentPage++
      }
    },
    handleInput() {
      if (!this.batchText) {
        this.barcodeData = []
        this.currentPage = 0
      }
    },
    handleKeyPress(event) {
      if (!this.barcodeData.length) return
      
      if (event.key === 'ArrowLeft' && this.currentPage > 0) {
        event.preventDefault()
        this.prevBarcode()
      } else if (event.key === 'ArrowRight' && this.currentPage < this.barcodeData.length - 1) {
        event.preventDefault()
        this.nextBarcode()
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

.input-wrapper {
  position: relative;
  width: 100%;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 15px;
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  color: #333;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

textarea::placeholder {
  color: #999;
}

textarea:hover {
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.15);
}

textarea:focus {
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
  position: relative;
  padding-bottom: 25px;
}

.nav-button {
  min-width: 100px;
  background: rgba(76, 175, 80, 0.9);
}

.page-info {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 8px;
  color: #333;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.navigation::after {
  content: '(使用← →键切换)';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.shortcut-tip {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
  text-align: right;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: inline-block;
  margin-left: auto;
}

@media screen and (max-width: 768px) {
  button {
    padding: 12px 15px;
    font-size: 15px;
    width: auto;
    white-space: nowrap;
    flex: 1;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
  }

  .shortcut-tip {
    float: none;
    display: block;
    text-align: center;
    margin: 8px auto 0;
    width: fit-content;
  }
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