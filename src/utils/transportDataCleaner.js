// 数据清洗工具类
export class TransportDataCleaner {
  /**
   * 清洗并解析运输数据
   * @param {string} text - 要清洗的文本数据
   * @returns {Array|null} 解析后的数据数组，如果解析失败则返回null
   */
  static cleanAndParseData(text) {
    if (!text) {
      console.log('输入为空，返回null');
      return null;
    }

    // 如果输入是纯运输码（20位数字），则返回null
    if (/^\d{20}$/.test(text.trim())) {
      console.log('输入为纯运输码，返回null');
      return null;
    }

    // 解析运输数据
    return this.parseTransportData(text);
  }

  /**
   * 解析运输数据
   * @param {string} text - 要解析的文本数据
   * @returns {Array|null} 解析后的数据数组，如果解析失败则返回null
   */
  static parseTransportData(text) {
    // 移除标题行
    text = text.replace(/运输码.*\n?/, '');

    // 首先按空格分割，查找所有可能的运输码
    const allParts = text.split(/[\t\s]+/);
    const transportCodes = allParts.filter(part => /^\d{20}$/.test(part));

    if (!transportCodes.length) {
      console.log('未找到任何有效运输码');
      return null;
    }

    const results = [];

    // 对每个运输码进行处理
    for (const code of transportCodes) {
      // 找到运输码在原文中的位置
      const codeIndex = text.indexOf(code);
      if (codeIndex === -1) continue;

      // 获取这个运输码后面的文本，直到下一个运输码或文本结束
      let endIndex = text.length;
      const nextCodeIndex = text.slice(codeIndex + code.length).search(/\d{20}/);
      if (nextCodeIndex !== -1) {
        endIndex = codeIndex + code.length + nextCodeIndex;
      }

      // 提取当前运输码对应的数据段
      const segment = text.slice(codeIndex, endIndex);
      const parts = segment.split(/[\t\s]+/).filter(part => part.trim());

      // 提取路线（包含->和站Z/站W的部分）
      const route = parts.find(part => {
        return part.includes('->') && 
          (part.includes('站Z') || part.includes('站W')) && 
          (part.endsWith('操作场') || part.endsWith('站Z'));
      });
      if (!route) {
        console.log(`未找到运输码 ${code} 的有效路线，跳过`);
        continue;
      }

      // 检查路线是否包含雪堰站
      if (!route.includes('雪堰站')) {
        console.log(`运输码 ${code} 的路线不包含雪堰站，跳过`);
        continue;
      }

      // 提取车牌号
      const plate = parts.find(part => {
        // 提取省份缩写
        const province = part.charAt(0);
        if (!'京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领'.includes(province)) {
          return false;
        }
        
        // 提取剩余部分
        const remaining = part.substring(1);
        
        // 验证剩余部分格式
        return /^[A-Z][A-Z0-9]{4,5}$/.test(remaining) || // 普通车牌
               /^[A-Z][A-Z][A-Z]\d{3,4}$/.test(remaining) || // 特殊车牌 EAB2761, EDP1152
               /^[A-Z]\d{2}[A-Z]\d{2}$/.test(remaining) || // 新能源车牌
               /^[0-9][A-Z]\d{2}[A-Z]$/.test(remaining) || // 特殊新能源车牌
               /^\d[A-Z]\d{2}[A-Z]$/.test(remaining); // 特殊新能源车牌
      });
      if (!plate) {
        console.log(`未找到运输码 ${code} 的有效车牌号，跳过`);
        continue;
      }

      // 添加解析结果
      results.push({
        code,
        route,
        plate
      });
    }

    return results.length > 0 ? results : null;
  }
} 