import React from "react";
import { Button, Modal } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons'
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
  const { visible, setVisible, passOrReject, data, envInfo, loading, PROJECT_APPROVER } = props;
  const { resAdded, resChanged, resDestroyed, resAddedCost, resUpdatedCost, resDestroyedCost } = data['planResult'] || {};
  const { isBilling } = envInfo || {};

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
            <div>{resAdded}</div>
            <div>{resChanged}</div>
            <div>{resDestroyed}</div>
          </div>
        </div>
        {!!isBilling && (
          <>
            <div className={styles.cost}>
              <CheckCircleFilled style={{ color: "#00A870" }} />
              <span>{t('task.audit.addResourceCost')}: ￥{(resAddedCost || 0).toFixed(2)}</span>
            </div>
            <div className={styles.cost}>
              <InfoCircleFilled style={{ color: "#FCAA37" }} />
              <span>{t('task.audit.modifyResourceCost')}: ￥{(resUpdatedCost || 0).toFixed(2)}</span>
            </div>
            <div className={styles.cost}>
              <ExclamationCircleFilled style={{ color: "#E34D59" }} />
              <span>{t('task.audit.deleteResourceCost')}: ￥{(resDestroyedCost || 0).toFixed(2)}</span>
            </div>
            <div className={styles.tip}>
              {t('task.audit.tip.cost')}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default AuditModal;
