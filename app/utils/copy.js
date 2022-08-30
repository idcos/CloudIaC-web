import { notification } from "antd";
import { t } from 'utils/i18n';

const copy = (text) => {
  text = text || '';
  const copyEle = document.createElement('div');
  copyEle.innerText = text;
  document.body.appendChild(copyEle);
  const range = document.createRange(); // 创造range
  window.getSelection().removeAllRanges(); //清除页面中已有的selection
  range.selectNode(copyEle); // 选中需要复制的节点
  window.getSelection().addRange(range); // 执行选中元素
  const copyStatus = document.execCommand("Copy"); // 执行copy操作
  if (copyStatus) {
    notification.success({
      message: t('define.message.copySuccess')
    });
  } else {
    notification.error({
      message: t('define.message.copyFail')
    });
  }
  window.getSelection().removeAllRanges(); //清除页面中已有的selection
  document.body.removeChild(copyEle);
};

export default copy;