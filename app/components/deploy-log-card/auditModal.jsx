import React from "react";
import { Button, Modal } from "antd";
import { t } from 'utils/i18n';
import styles from "./styles.less";

/**
 * 审核弹窗
 * @param {Object} props
 * @param {boolean} props.visible - 弹窗显隐state
 * @param {React.SetStateAction} props.setVisible - 弹窗显隐setState方法
 * @param {function} props.passOrReject - 驳回或通过
 * @param {Object} props.data - 数据
 * @param {{approvedLoading, rejectedLoading}} props.loading - 按钮loading
 * @param props.PROJECT_APPROVER - 父组件里用到的disabled
 * @returns {JSX.Element}
 * @constructor
 */
function AuditModal(props) {
  const { visible, setVisible, passOrReject, data, loading, PROJECT_APPROVER } =
    props;

  const renderNumber = (key) => {
    if (data && data["planResult"]) {
      return Object.keys(data["planResult"]).includes(key)
        ? data["planResult"][key]
        : "";
    } else {
      return "";
    }
  };

  return (
    <div className={styles.auditModal}>
      {/*审核弹窗*/}
      <Modal
        onCancel={() => setVisible(false)}
        visible={visible}
        width={560}
        title='审核'
        getContainer={false}
        footer={[
          <Button
            disabled={!PROJECT_APPROVER || loading.approvedLoading}
            onClick={() => passOrReject("rejected")}
            loading={loading.rejectedLoading}
          >
            驳回
          </Button>,
          <Button
            onClick={() => passOrReject("approved")}
            type={"primary"}
            loading={loading.approvedLoading}
            disabled={!PROJECT_APPROVER || loading.rejectedLoading}
          >
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
            <div>{renderNumber("resAdded")}</div>
            <div>{renderNumber("resChanged")}</div>
            <div>{renderNumber("resDestroyed")}</div>
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
