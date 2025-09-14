// rpxToPx rpx值 -> PX值
export const rpxToPx = (value: number) => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidthPx = systemInfo.screenWidth; // 设备屏幕宽度（px）
  const rpxRate = 750 / screenWidthPx; // px转rpx的系数
  return value / rpxRate;
};

// 提取 % 或 px 为后缀的前面的数字

export const extractNumber = (str: string) => {
  // 正则表达式匹配规则：
  // \d+\.?\d* 匹配数字（整数或小数）
  // (%|px)$ 匹配结尾的%或px，$确保是字符串结尾
  const reg = /^(\d+\.?\d*)(%|px)$/;

  const match = str.match(reg);
  if (match) {
    // 提取第一个捕获组（数字部分）并转换为数值
    return parseFloat(match[1]);
  }

  // 如果不符合两种格式，返回null或根据需求处理
  return null;
};
