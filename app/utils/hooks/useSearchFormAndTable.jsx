import { useState, useEffect } from 'react';
import omit from 'lodash/omit';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import { t } from 'utils/i18n';

/** 搜索表单和表格关联封装 */
export const useSearchFormAndTable = props => {
  const {
    /** 需要自定义的分页属性 */
    pagination = {},

    /** 默认搜索参数 */
    defaultSearchParams,

    /** 表格数据 */
    tableData = { list: [], total: 0 },

    /** 触发搜索 */
    onSearch = noop,
  } = props || {};

  const {
    /** 分页搜索参数 */
    paginate: defaultPaginate = { current: 1, pageSize: 10 },

    /** 表单搜索参数 */
    form: defaultFormParams = {},

    /** 排序搜索参数 */
    sorter: defaultSorter = {},

    /** 表格过滤搜索参数 */
    filters: defaultFilters = {},
  } = defaultSearchParams || {};

  const [searchParams, setSearchParams] = useState({
    paginate: defaultPaginate,
    form: defaultFormParams,
    sorter: defaultSorter,
    filters: defaultFilters,
  });

  useEffect(() => {
    const { paginate, form, sorter, filters } = searchParams;
    onSearch({ ...paginate, ...form, ...sorter, ...filters });
  }, [searchParams]);

  /** 设定分页搜索参数 */
  const setPaginate = state => {
    setSearchParams(({ paginate, ...restParams }) => ({
      paginate: isFunction(state) ? state(paginate) : state,
      ...restParams,
    }));
  };

  /** 设定表单搜索参数 */
  const setFormParams = state => {
    setSearchParams(({ form, ...restParams }) => ({
      form: isFunction(state) ? state(form) : state,
      ...restParams,
    }));
  };

  /** 设定排序搜索参数 */
  const setSorter = state => {
    setSearchParams(({ sorter, ...restParams }) => ({
      sorter: isFunction(state) ? state(sorter) : state,
      ...restParams,
    }));
  };

  /** 设定表格过滤搜索参数 */
  const setFilters = state => {
    setSearchParams(({ filters, ...restParams }) => ({
      filters: isFunction(state) ? state(filters) : state,
      ...restParams,
    }));
  };

  /** 改变搜索参数 */
  const onChangeFormParams = changeParams => {
    setFormParams(preValue => ({ ...preValue, ...changeParams }));
    resetPageCurrent();
  };

  /** 重置页码 */
  const resetPageCurrent = () => {
    setPaginate(({ pageSize }) => ({ current: 1, pageSize }));
  };

  /** 分页、排序、筛选变化时触发 同步各搜索模块参数 */
  const onTableChange = (pagination, newFilters, sorter, { action }) => {
    const { current, pageSize } = pagination;
    const { field, order } = sorter;
    switch (action) {
      case 'paginate':
        setPaginate({ current, pageSize });
        break;
      case 'filter':
        setSearchParams(({ filters, paginate, ...restParams }) => ({
          paginate: { current: 1, pageSize },
          filters: newFilters,
          ...restParams,
        }));
        break;
      case 'sort':
        setSorter({ field, order });
        break;
      default:
        break;
    }
  };

  return {
    /** tableProps 关联预置表格属性
     *  -dataSource 当前页数据
     *  -pagination 关联预置分页属性
     */
    tableProps: {
      dataSource: tableData.list,
      pagination: {
        current: searchParams.paginate.current,
        pageSize: searchParams.paginate.pageSize,
        total: tableData.total,
        showSizeChanger: true,
        showTotal: total =>
          t('define.pagination.showTotal', { values: { total } }),
        ...omit(pagination, ['current', 'pageSize', 'total', 'onChange']),
      },
      onChange: onTableChange,
    },
    searchParams,
    setSearchParams,
    onChangeFormParams,
    resetPageCurrent,
    setPaginate,
    setFormParams,
    setSorter,
    setFilters,
  };
};
