export default () => {
  // 返回上一页
  const goBack = () => {
    uni.navigateBack();
  };
  return {
    goBack,
  };
};
