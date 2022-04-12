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
        title={t('task.audit.name')}
        getContainer={false}
        footer={[
          <Button
            disabled={!PROJECT_APPROVER || loading.approvedLoading}
            onClick={() => passOrReject("rejected")}
            loading={loading.rejectedLoading}
          >
            {t('task.audit.rejected')}
          </Button>,
          <Button
            onClick={() => passOrReject("approved")}
            type={"primary"}
            loading={loading.approvedLoading}
            disabled={!PROJECT_APPROVER || loading.rejectedLoading}
          >
            {t('task.audit.approved')}
          </Button>
        ]}
      >
        <div className={styles.changedTip}>{t('task.audit.title')}</div>

        <div className={styles.detailTable}>
          <div className={styles.header}>
            <div>{t('task.audit.addResource')}</div>
            <div>{t('task.audit.modifyResource')}</div>
            <div>{t('task.audit.deleteResource')}</div>
          </div>
          <div className={styles.row}>
            <div>{renderNumber("resAdded")}</div>
            <div>{renderNumber("resChanged")}</div>
            <div>{renderNumber("resDestroyed")}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AuditModal;
