<template>
  <footer class="footer">
    <div class="contact-info">
      <span>作者：pika</span>
      <span class="divider">|</span>
      <a href="mailto:imagine_0@163.com" class="email">imagine_0@163.com</a>
    </div>
    <div class="beian">
      <a href="https://beian.miit.gov.cn/" target="_blank" class="beian-link">
        豫ICP备2025106497号-1
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

.contact-info {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.divider {
  color: #999;
}

.email {
  color: #4CAF50;
  text-decoration: none;
  transition: all 0.3s ease;
}

.email:hover {
  color: #45a049;
  text-decoration: underline;
}

.beian {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.beian-link {
  color: #999;
  text-decoration: none;
  transition: all 0.3s ease;
}

.beian-link:hover {
  color: #666;
  text-decoration: underline;
}

@media screen and (max-width: 768px) {
  .contact-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .divider {
    display: none;
  }
}
</style> 