/**
 * 打印工具类
 * 处理运输码的打印逻辑，支持移动端和PC端
 */
export class PrintHelper {
  /**
   * 生成打印内容
   * @param {Object} options - 打印选项
   * @param {Array} options.previewCodes - 预览数据数组
   * @param {Array} options.barcodeRefs - 条形码DOM引用数组
   * @param {string} options.paperType - 纸张类型（A4或express）
   * @param {boolean} options.isMobile - 是否为移动设备
   * @returns {string} 打印用的HTML内容
   */
  static generatePrintContent(options) {
    const { previewCodes, barcodeRefs, paperType, isMobile } = options;
    
    // 获取所有条形码的SVG内容
    const barcodeContents = barcodeRefs.map(ref => ref.outerHTML);
    
    // 生成预览HTML
    const previewsHTML = previewCodes.map((preview, index) => `
      <div class="print-content">
        <div class="destination">${preview.displayDestination}</div>
        <div class="barcode-container">
          ${barcodeContents[index]}
        </div>
        <div class="code-number">${preview.code}</div>
        <div class="info-row">
          <div class="info-column">
            ${preview.plateNumber ? `<div class="plate-number">${preview.plateNumber}</div>` : ''}
            <div class="date">${preview.formattedDate}</div>
          </div>
        </div>
      </div>
    `).join('\n');

    // 返回完整的HTML文档
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
          <title>打印运输码</title>
          <style>
            ${this.getPrintStyles(paperType)}
          </style>
        </head>
        <body>
          ${previewsHTML}
          <script>
            ${this.getPrintScript(isMobile)}
          <\/script>
        </body>
      </html>
    `;
  }

  /**
   * 获取打印样式
   * @param {string} paperType - 纸张类型
   * @returns {string} CSS样式
   */
  static getPrintStyles(paperType) {
    return `
      @page {
        size: ${paperType === 'A4' ? '210mm 297mm' : '76mm 136mm'};
        margin: 0;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        background: white;
      }
      body {
        background: white;
        display: block;
        font-family: Arial, sans-serif;
      }
      .print-content {
        width: ${paperType === 'A4' ? '210mm' : '76mm'};
        height: ${paperType === 'A4' ? '297mm' : '136mm'};
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: ${paperType === 'A4' ? 'flex-start' : 'space-evenly'};
        align-items: center;
        padding: ${paperType === 'A4' ? '10mm 20mm' : '3mm'};
        page-break-after: always;
      }
      .destination {
        font-size: ${paperType === 'A4' ? '48pt' : '32pt'};
        margin: ${paperType === 'A4' ? '0 0 15mm 0' : '3mm 0'};
        font-weight: bold;
        white-space: nowrap;
        text-align: center;
        color: #000;
      }
      .barcode-container {
        width: 100%;
        max-width: ${paperType === 'A4' ? '120mm' : '66mm'};
        height: ${paperType === 'A4' ? '35mm' : '20mm'};
        margin: ${paperType === 'A4' ? '0 0 1mm 0' : '3mm 0 1mm'};
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .barcode-container svg {
        width: 100%;
        height: 100%;
      }
      .code-number {
        font-size: ${paperType === 'A4' ? '24pt' : '16pt'};
        margin: ${paperType === 'A4' ? '1mm 0 15mm' : '1mm 0 3mm'};
        text-align: center;
        color: #000;
        text-decoration: none;
      }
      .info-row {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: ${paperType === 'A4' ? '0' : '3mm'};
      }
      .info-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2mm;
      }
      .plate-number,
      .date {
        font-size: ${paperType === 'A4' ? '48pt' : '32pt'};
        margin: 0;
        font-weight: bold;
        white-space: nowrap;
        text-align: center;
        color: #000;
        text-decoration: none;
      }
      @media print {
        .print-content {
          page-break-after: always;
          page-break-inside: avoid;
        }
        .destination,
        .code-number,
        .plate-number,
        .date {
          color: #000 !important;
          text-decoration: none !important;
        }
      }
    `;
  }

  /**
   * 获取打印脚本
   * @param {boolean} isMobile - 是否为移动设备
   * @returns {string} JavaScript代码
   */
  static getPrintScript(isMobile) {
    return `
      window.onload = function() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && 
                       !/chrome/i.test(navigator.userAgent) && 
                       !/CriOS/i.test(navigator.userAgent);
        
        if (${isMobile}) {
          if (isSafari) {
            // Safari移动端添加打印按钮
            const printButton = document.createElement('button');
            printButton.style.position = 'fixed';
            printButton.style.bottom = '20px';
            printButton.style.left = '50%';
            printButton.style.transform = 'translateX(-50%)';
            printButton.style.padding = '10px 20px';
            printButton.style.fontSize = '16px';
            printButton.style.backgroundColor = '#4CAF50';
            printButton.style.color = 'white';
            printButton.style.border = 'none';
            printButton.style.borderRadius = '5px';
            printButton.style.cursor = 'pointer';
            printButton.textContent = '点击打印';
            
            printButton.onclick = function() {
              window.print();
            };
            document.body.appendChild(printButton);
          } else {
            setTimeout(function() {
              window.print();
              window.addEventListener('afterprint', function() {
                window.close();
              });
            }, 500);
          }
        } else {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.frameElement && window.frameElement.remove();
            }, 100);
          }, 500);
        }
      };
    `;
  }

  /**
   * 执行打印
   * @param {Object} options - 打印选项
   * @returns {Promise<void>}
   */
  static async executePrint(options) {
    const { isMobile } = options;
    const printContent = this.generatePrintContent(options);

    if (isMobile) {
      // 移动端：新窗口打印
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('请允许打开新窗口进行打印');
      }
      
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      // PC端：iframe打印
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      
      document.body.appendChild(printFrame);
      printFrame.contentWindow.document.open();
      printFrame.contentWindow.document.write(printContent);
      printFrame.contentWindow.document.close();
    }
  }
} 