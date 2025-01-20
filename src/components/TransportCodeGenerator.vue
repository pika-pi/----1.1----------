<template>
  <div class="container">
    <div class="header">
      <router-link to="/" class="back-button">
        <span class="back-arrow">←</span> 返回主页
      </router-link>
      <img src="/favicon.svg" alt="皮卡丘图标" class="logo">
    </div>

    <div class="options-group">
      <div class="input-group">
        <label>纸张：</label>
        <div class="radio-group">
          <label class="radio-label" v-for="type in paperTypes" :key="type.value">
            <input 
              type="radio" 
              v-model="paperType" 
              :value="type.value"
            >
            <span>{{ type.label }}</span>
          </label>
        </div>
      </div>

      <div class="input-group">
        <label>目的地：</label>
        <div class="radio-group">
          <label class="radio-label" v-for="dest in destinations" :key="dest.value">
            <input 
              type="radio" 
              v-model="destination" 
              :value="dest.value"
            >
            <span>{{ dest.label }}</span>
          </label>
        </div>
      </div>

      <div class="input-group">
        <label>运输方式：</label>
        <div class="radio-group">
          <label class="radio-label" v-for="type in transportTypes" :key="type.value">
            <input 
              type="radio" 
              v-model="transportType" 
              :value="type.value"
            >
            <span>{{ type.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>运输码：</label>
        <div class="text-input-wrapper">
          <input 
            type="text" 
            v-model="codeNumber" 
            placeholder="请输入运输码"
            @input="handleCodeInput"
            class="text-input"
          >
        </div>
      </div>
    </div>

    <div class="input-group">
      <label>车牌号：</label>
      <div class="radio-group">
        <div class="text-input-wrapper">
          <input 
            type="text" 
            id="plateNumber" 
            v-model="plateNumber" 
            placeholder="请输入车牌号"
          >
        </div>
      </div>
    </div>

    <div class="input-group">
      <label>日期：</label>
      <div class="radio-group">
        <div class="text-input-wrapper" @click="openDatePicker">
          <input 
            type="date" 
            id="date" 
            v-model="date"
            ref="dateInput"
            :max="maxDate"
          >
        </div>
      </div>
    </div>

    <div class="button-group">
      <button @click="generateCode">生成运输码</button>
      <button @click="printCode">打印</button>
    </div>

    <div v-for="(preview, index) in previewCodes" :key="index" class="preview-container">
      <div class="preview-wrapper" :class="paperType" :ref="el => { if (el) previewRefs[index] = el }">
        <div class="transport-code" :ref="el => { if (el) transportCodeRefs[index] = el }">
          <div class="destination">{{ preview.displayDestination }}</div>
          <div class="barcode-container">
            <svg :ref="el => { if (el) barcodeRefs[index] = el }"></svg>
          </div>
          <div class="code-number">{{ preview.code }}</div>
          <div class="info-row" :class="{ 'one-column': !preview.plateNumber }">
            <div class="info-column">
              <div class="plate-number" v-if="preview.plateNumber">{{ preview.plateNumber }}</div>
              <div class="date">{{ preview.formattedDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>

</template>

<script>
/**
 * 运输码生成器组件
 * 功能：
 * 1. 生成运输码条形码
 * 2. 支持纯运输码和复杂数据格式的输入
 * 3. 支持A4和快递单两种打印格式
 * 4. 支持移动端和PC端打印
 */
import JsBarcode from 'jsbarcode'
import { ElMessage } from 'element-plus'
import { TransportDataCleaner } from '../utils/transportDataCleaner'
import { PrintHelper } from '../utils/printHelper'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'TransportCodeGenerator',
  
  components: {
    AppFooter
  },
  
  /**
   * 组件挂载时添加键盘事件监听
   */
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress)
  },

  /**
   * 组件卸载时移除键盘事件监听，防止内存泄漏
   */
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },

  /**
   * 组件数据定义
   * @returns {Object} 组件的响应式数据
   */
  data() {
    return {
      paperType: 'A4',              // 纸张类型：A4或快递单
      destination: '午波次',         // 目的地：午波次或晚波次
      transportType: '单发',         // 运输方式：单发或拼车
      codeNumber: '',               // 输入的运输码
      previewCodes: [],             // 预览数据数组
      plateNumber: '',              // 车牌号
      date: new Date().toISOString().split('T')[0],  // 当前日期
      maxDate: new Date().toISOString().split('T')[0], // 最大可选日期（当天）
      paperTypes: [
        { label: 'A4纸', value: 'A4' },
        { label: '快递一联单', value: 'express' }
      ],
      destinations: [
        { label: '午波次', value: '午波次' },
        { label: '晚波次', value: '晚波次' }
      ],
      transportTypes: [
        { label: '单发', value: '单发' },
        { label: '拼车', value: '拼车' }
      ],
      previewRefs: [],             // 预览DOM引用数组
      transportCodeRefs: [],        // 运输码DOM引用数组
      barcodeRefs: [],             // 条形码DOM引用数组
    }
  },

  computed: {
    /**
     * 格式化日期显示
     * @returns {string} 格式化后的日期字符串（例：1月1日）
     */
    formattedDate() {
      const date = new Date(this.date)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  },

  watch: {
    /**
     * 监听目的地变化，更新预览
     */
    destination() {
      this.updatePreviewCodes()
    },
    /**
     * 监听运输方式变化，更新预览
     */
    transportType() {
      this.updatePreviewCodes()
    }
  },

  methods: {
    /**
     * 处理键盘按键事件
     * 当按下回车键且运输码不为空时生成运输码
     * @param {KeyboardEvent} event - 键盘事件对象
     */
    handleKeyPress(event) {
      if (event.key === 'Enter' && !event.ctrlKey && this.codeNumber) {
        this.generateCode()
      }
    },

    /**
     * 处理运输码输入，自动提取日期
     * 如果输入的前8位是有效日期，则自动设置日期
     */
    handleCodeInput() {
      if (/^\d*$/.test(this.codeNumber)) {
        if (this.codeNumber.length >= 8) {
          const dateStr = this.codeNumber.substring(0, 8)
          const year = dateStr.substring(0, 4)
          const month = dateStr.substring(4, 6)
          const day = dateStr.substring(6, 8)
          
          const date = new Date(year, month - 1, day)
          if (date instanceof Date && !isNaN(date)) {
            const formattedDate = `${year}-${month}-${day}`
            if (formattedDate <= this.maxDate) {
              this.date = formattedDate
            }
          }
        }
      }
    },

    /**
     * 生成运输码
     * 1. 验证输入
     * 2. 处理纯运输码或复杂数据
     * 3. 生成预览
     */
    generateCode() {
      if (!this.codeNumber) {
        ElMessage({
          message: '请输入运输码',
          type: 'warning',
          duration: 2000
        });
        return;
      }

      // 1. 清洗输入数据
      const cleanedInput = this.codeNumber.trim();

      // 2. 处理纯20位数字运输码
      if (/^\d{20}$/.test(cleanedInput)) {
        const today = new Date().toISOString().split('T')[0];
        if (this.date !== today) {
          ElMessage({
            message: '运输码日期非当天，请注意',
            type: 'warning',
            duration: 2000
          });
        }

        this.previewCodes = [];
        this.clearRefs();

        const preview = {
          code: cleanedInput,
          plateNumber: this.plateNumber,
          date: this.date,
          formattedDate: this.formatDate(this.date),
          displayDestination: `${this.destination} - ${this.transportType}`
        };

        this.previewCodes = [preview];
        this.generateBarcodes();
        this.codeNumber = '';
        return;
      }

      /**
       * 3. 处理复杂数据格式
       */
      const parsedData = TransportDataCleaner.cleanAndParseData(cleanedInput);
      
      if (!parsedData || parsedData.length === 0) {
        ElMessage({
          message: '未找到雪堰站的运输码数据',
          type: 'warning',
          duration: 2000
        });
        this.previewCodes = [];
        this.clearRefs();
        this.codeNumber = '';
        return;
      }

      // 生成预览数据
      this.previewCodes = [];
      this.clearRefs();

      this.previewCodes = parsedData.map(item => {
        // 根据路线中的站点数量判断是单发还是拼车
        const stationCount = (item.route.match(/站[ZW]/g) || []).length;
        const transportType = stationCount > 1 ? '拼车' : '单发';
        // 根据运输方式自动设置波次
        const destination = transportType === '拼车' ? '午波次' : '晚波次';

        return {
          code: item.code,
          plateNumber: item.plate,
          date: this.date,
          formattedDate: this.formatDate(this.date),
          displayDestination: `${destination} - ${transportType}`
        };
      });

      // 生成条形码
      this.generateBarcodes();
      this.codeNumber = '';
    },

    /**
     * 打印运输码
     * 支持移动端和PC端不同的打印方式
     */
    async printCode() {
      // 1. 检查是否有可打印内容
      if (this.previewCodes.length === 0) {
        ElMessage({
          message: '请先生成运输码',
          type: 'warning',
          duration: 2000
        })
        return
      }

      try {
        // 2. 检测设备类型
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // 3. 调用打印工具类
        await PrintHelper.executePrint({
          previewCodes: this.previewCodes,  // 4. 传递预览数据  
          barcodeRefs: this.barcodeRefs,      // 5. 传递条形码引用
          paperType: this.paperType,        // 6. 传递纸张类型
          isMobile                      // 7. 传递设备类型
        });
      } catch (error) {
        // 8. 处理打印错误
        console.error('打印失败:', error);
        ElMessage({
          message: error.message || '打印失败，请重试',
          type: 'error',
          duration: 3000
        });
      }
    },

    /**
     * 打开日期选择器
     */
    openDatePicker() {
      this.$refs.dateInput.showPicker();
    },

    /**
     * 清理DOM引用
     */
    clearRefs() {
      this.previewRefs = []
      this.transportCodeRefs = []
      this.barcodeRefs = []
    },

    /**
     * 格式化日期
     * @param {string} dateStr - 日期字符串
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },

    /**
     * 生成条形码
     * 为每个预览生成对应的条形码
     */
    async generateBarcodes() {
      if (this.previewCodes.length === 0) {
        ElMessage({
          message: '没有可生成的运输码',
          type: 'warning',
          duration: 2000
        })
        return
      }

      this.$nextTick(() => {
        this.previewCodes.forEach((preview, index) => {
          try {
            JsBarcode(this.barcodeRefs[index], preview.code, {
              format: "CODE128",
              width: 2,
              height: 100,
              displayValue: false,
              margin: 10
            })
          } catch (error) {
            ElMessage({
              message: '生成条形码失败：' + error.message,
              type: 'error',
              duration: 3000
            })
          }
        })

        // 滚动到第一个预览
        if (this.previewRefs[0]) {
          this.previewRefs[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },

    /**
     * 更新预览数据
     * 当波次或运输方式改变时更新显示
     */
    updatePreviewCodes() {
      if (this.previewCodes.length > 0) {
        this.previewCodes = this.previewCodes.map(preview => ({
          ...preview,
          displayDestination: `${this.destination} - ${this.transportType}`
        }))
      }
    }
  }
}

</script>

<style scoped>
@import '../styles/TransportCodeGenerator1.css';

.preview-container:first-child::before {
  display: none;
}

@media screen and (max-width: 768px) {
  .preview-container {
    margin: 15px 0;
  }
  
  .preview-container + .preview-container {
    margin-top: 30px;
  }
}
</style> 
