import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

export const filterTreeData = (data, keyword) => {
  try {
    const reg = new RegExp(keyword, 'gi');
    // 匹配关键词的资源方法
    const filterByKeyword = (it) => !keyword || reg.test(it.resourceName);
    // 获取所有子节点的资源列表
    const getAllResourcesList = (children) => {
      let allResourcesList = [];
      (children || []).forEach((item) => {
        const itemChildren = item.children || [];
        const resourcesList = (item.resourcesList || []).filter(filterByKeyword);
        if (resourcesList.length > 0) {
          allResourcesList = [...allResourcesList, ...resourcesList];
        } else {
          allResourcesList = [...allResourcesList, ...getAllResourcesList(itemChildren)];
        }
      });
      return allResourcesList;
    };
    // 格式化树数据
    const formatTreeData = (data) => {
      data = data || {};
      const resourcesList = isEmpty(data.resourcesList) ? getAllResourcesList(data.children) : data.resourcesList.filter(filterByKeyword);
      const children = (data.children || []).map((it) => formatTreeData(it));
      return {
        ...data,
        resourcesList,
        children
      };
    };
    // 过滤掉没有资源的节点
    const filterChildren = (children) => {
      const newChildren = (children || []).filter((it) => (it.resourcesList || []).length > 0);
      newChildren.forEach(it => it.children && (it.children = filterChildren(it.children)));
      return newChildren;
    };
    data = cloneDeep(data) || {};
    const formatData = formatTreeData(data);
    formatData.children = filterChildren(formatData.children);
    return formatData;
  } catch (error) {
    console.error('解析树状数据异常');
    return {};
  }
};


export const filterListData = (data, keyword) => {
  data = cloneDeep(data) || [];
  try {
    const reg = new RegExp(keyword, 'gi');
    // 匹配关键词的资源方法
    const filterByKeyword = (it) => !keyword || reg.test(it.name);
    const filterData = data.map((it) => {
      it.list = (it.list || []).filter(filterByKeyword);
      return it;
    }).filter(it => it.list.length > 0);
    return filterData;
  } catch (error) {
    console.error('解析列表数据异常');
    return [];
  }
};