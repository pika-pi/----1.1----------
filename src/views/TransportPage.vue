<template>
  <div class="container">
    <TransportCodeGenerator />
    <AppFooter />
  </div>
</template>

<script>
import TransportCodeGenerator from '../components/TransportCodeGenerator.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'TransportPage',
  components: {
    TransportCodeGenerator,
    AppFooter
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

@media screen and (max-width: 768px) {
  .container {
    padding: 10px;
    margin: 0;
  }
}
</style> 