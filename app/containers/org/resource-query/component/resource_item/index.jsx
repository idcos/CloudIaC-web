import React from 'react'
import styles from './styles.less';
export default () => {
  return (
    <div className={styles.resource_item}>
      <div className={styles.header}>
        <div className={styles.item}>
          <span className={styles.label}>项目</span>
          <span className={styles.value}>云原生产品线</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>环境</span>
          <span className={styles.value}><a href="#">测试环境</a></span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>资源类型</span>
          <span className={styles.value}>alicloud-instance</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>资源名称</span>
          <span className={styles.value}>web01</span>
        </div>
      </div>
      <div className={styles.json}>

      </div>
    </div>
  )
}
