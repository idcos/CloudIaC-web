import React from "react";
import { Button, Modal } from "antd";
import styles from "./styles.less";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";


/**
 * 审核弹窗
 * @param {Object} props
 * @param {boolean} props.visible - 弹窗显隐state
 * @param {React.SetStateAction} props.setVisible - 弹窗显隐setState方法
 * @param {function} props.passOrReject - 驳回或通过
 * @returns {JSX.Element}
 * @constructor
 */
function AuditModal(props) {
  const { visible, setVisible, passOrReject } = props;

  return (
    <div className={styles.auditModal}>
      {/*审核弹窗*/}
      <Modal
        onCancel={() => setVisible(false)}
        visible={visible}
        width={560}
        title={<div className={styles.modalTitle}>审核</div>}
        footer={[
          <Button onClick={() => passOrReject('rejected')}>驳回</Button>,
          <Button onClick={() => passOrReject('approved')} type={"primary"}>
            通过
          </Button>
        ]}
      >

        <div className={styles.changedTip}>本次操作将发生如下资源变更:</div>

        <div className={styles.detailTable}>
          <div className={styles.header}>
            <div>新增资源</div>
            <div>修改资源</div>
            <div>删除资源</div>
          </div>
          <div className={styles.row}>
            <div>8</div>
            <div>0</div>
            <div>2</div>
          </div>
        </div>

        {/*<div className={styles.cost}>*/}
        {/*  <CheckCircleFilled style={{ color: "#00A870" }} />{" "}*/}
        {/*  新增资源预估月费用：￥200*/}
        {/*</div>*/}
        {/*<div className={styles.cost}>*/}
        {/*  <ExclamationCircleFilled style={{ color: "#E34D59" }} />{" "}*/}
        {/*  删除资源预估月费用：￥-200*/}
        {/*</div>*/}
        {/*<div className={styles.tip}>*/}
        {/*  注：资源的月费用为预估值，仅供参考，最终费用以云平台结算为准*/}
        {/*</div>*/}
      </Modal>
    </div>
  );
}

export default AuditModal;
