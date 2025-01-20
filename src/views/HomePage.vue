<template>
  <div class="container">
    <div class="header">
      <img src="/favicon.svg" alt="皮卡丘图标" class="logo">
      <h1>条码生成器</h1>
    </div>
    <BarcodeGenerator />
    <BatchBarcodeGenerator />
    <div class="section">
      <router-link to="/transport" class="transport-button">
        运输码打印
      </router-link>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import BarcodeGenerator from '../components/BarcodeGenerator.vue'
import BatchBarcodeGenerator from '../components/BatchBarcodeGenerator.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'HomePage',
  components: {
    BarcodeGenerator,
    BatchBarcodeGenerator,
    AppFooter
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.section {
  margin-top: 30px;
  text-align: center;
}

.transport-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
  width: fit-content;
}

.transport-button:hover {
  background-color: #45a049;
}

@media screen and (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .transport-button {
    width: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
    text-align: center;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
}

.logo {
  width: 48px;
  height: 48px;
  animation: bounce 2s ease-in-out infinite;
}

h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style> 