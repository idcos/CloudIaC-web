import React from "react";
import { Button } from "antd";


export default (props) => {

  const { detailInfo, onFinish } = props;

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        type='primary'
        danger={true}
      >
        销毁资源
      </Button>
      <p className='tipText reset-styles'>
        销毁资源将删除模板所有资源，包含作业、状态、变量、设置等等，请谨慎操作！
      </p>
    </div>
  );
};
