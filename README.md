# 条码生成器

一个基于 Vue 3 开发的现代化条码生成工具，支持普通条码和运输码的生成与打印。

## 功能特性

### 1. 条码生成
- 支持单个条码生成
- 支持批量条码生成
- 实时预览生成的条码
![alt text](image-1.png)
![alt text](image-2.png)
### 2. 菜鸟快递运输码功能
- 支持运输码的生成和打印
- 支持 A4 纸和快递单两种打印格式
- 自动识别和解析运输数据
- 支持车牌号和日期信息的添加
- 支持午波次/晚波次和单发/拼车模式
![alt text](image.png)
### 3. 用户界面
- 现代化的 UI 设计
- 响应式布局，支持移动端和桌面端
- 实时预览打印效果
- 直观的操作界面
- 支持移动端使用

## 技术栈

- Vue 3
- Vite
- Element Plus
- JsBarcode
- Vue Router

## 安装说明

1. 克隆项目
```bash
git clone [repository-url]
cd [project-name]
```

2. 安装依赖
```bash
npm install
```

3. 开发环境运行
```bash
npm run dev
```

4. 生产环境构建
```bash
npm run build
```

## 项目结构

```
project/
├── src/
│   ├── components/          # 组件目录
│   │   ├── BarcodeGenerator.vue        # 条码生成器组件
│   │   ├── BatchBarcodeGenerator.vue   # 批量条码生成器组件
│   │   ├── TransportCodeGenerator.vue  # 运输码生成器组件
│   │   └── AppFooter.vue               # 页脚组件
│   ├── views/              # 页面视图
│   │   ├── HomePage.vue    # 首页
│   │   └── TransportPage.vue # 运输码页面
│   ├── utils/             # 工具函数
│   │   ├── printHelper.js  # 打印助手
│   │   └── transportDataCleaner.js # 数据清洗工具
│   ├── styles/            # 样式文件
│   │   └── main.css       # 主样式文件
│   ├── router/            # 路由配置
│   └── App.vue            # 根组件
├── public/                # 静态资源
└── vite.config.js         # Vite 配置文件
```

## 使用说明

### 条码生成
1. 在首页可以生成单个条码或批量条码
2. 输入条码内容，点击生成按钮
3. 可以直接打印生成的条码

### 运输码生成
1. 点击"运输码打印"进入运输码页面
2. 选择纸张类型（A4或快递单）
3. 选择目的地和运输方式
4. 输入运输码、车牌号和日期
5. 点击生成按钮预览
6. 点击打印按钮进行打印

## 注意事项

1. 打印前请确保已正确选择打印机和纸张大小
2. 运输码支持自动识别日期格式
3. 移动端打印需要系统支持

## 版本历史

- v1.1.0 - 添加运输码自动清洗功能
- v1.0.0 - 初始发布

## 作者

作者：pika
邮箱：imagine_0@163.com

## 备案信息

豫ICP备2025106497号-1 