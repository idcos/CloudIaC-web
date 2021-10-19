import { CSSProperties } from "react";
export declare type FieldType = 'input' | 'select' | 'datePicker' | 'dateRangePicker' | 'timePicker' | 'timeRangePicker';
export interface Condition {
    /** 搜索条件的英文 */
    code: string;
    /** 搜索条件的中文 */
    name: string;
    /** 搜索条件的表单类型 */
    fieldType?: FieldType;
    /** 搜索条件的表单属性 */
    fieldProps?: any;
}
export interface SearchValuesPropValue {
    /** 搜索结果的名称 */
    name: string;
    /** 搜索结果的值 */
    value: any;
    /** 搜索结果需要展示的值 */
    showValue: string;
}
export interface SearchValues {
    [propName: string]: SearchValuesPropValue;
}
export interface PageSearchProps {
    /** 高级搜索的条件组合列表 */
    conditionList?: Condition[];
    /** 搜索的表单元素宽度 */
    width?: number | string;
    /** 设置 PageSearch 的模式为简单或组合 */
    mode?: 'simple' | 'multiple';
    /** 搜索的条件类型表单元素宽度占比，0～1之间的数字 */
    conditionTypeFieldWidthRatio?: number;
    /** 搜索表单变化时需要执行的函数 */
    onChange?: Function;
    /** 搜索时需要执行的函数 */
    onSearch?: Function;
    /** 获取渲染搜索结果标签的容器 */
    getSearchResultTagsContainer?: Function;
    /** 默认搜索条件的值 */
    defaultSearchValues?: SearchValues;
    /** 在初始化时是否触发搜索 */
    initialTriggerSearch?: boolean;
    /** 搜索组件的className */
    className?: string;
    /** 搜索组件的style */
    style?: CSSProperties;
    [propName: string]: any;
}
/** 默认的表单类型 */
export declare const DEFAULT_FIELD_TYPE = "input";
/** 默认的多项分割符 */
export declare const DEFAULT_SPLIT_CHAR = " | ";
/** 默认的区段符 */
export declare const DEFAULT_RANGE_CHAR = " ~ ";
