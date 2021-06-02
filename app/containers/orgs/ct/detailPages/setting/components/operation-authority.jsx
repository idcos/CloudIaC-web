import React from "react";
import { Button } from "antd";


export default (props) => {

  const { detailInfo, onFinish, submitLoading } = props;

  return (
    <div style={{ marginTop: 10 }}>
      {detailInfo.status == "disable" ? (
        <>
          <Button
            type='primary'
            loading={submitLoading}
            onClick={() => onFinish({ status: "enable" })}
          >
            启用云模板
          </Button>
          <p className='tipText reset-styles'>
            启用云模板后所有功能都可正常操作(发起作业、变量修改、设置修改等
          </p>
        </>
      ) : (
        <>
          <Button
            type='primary'
            loading={submitLoading}
            danger={true}
            onClick={() => onFinish({ status: "disable" })}
          >
            禁用云模板
          </Button>
          <p className='tipText reset-styles'>
            禁用云模板后所有操作(发起作业、修改变量等)都将禁用，仅能够正常访问云模板数据
          </p>
        </>
      )}
    </div>
  );
};
