import { FC } from 'react';
import { PageSearchProps } from './PageSearch.define';
/** 过滤对象空值的属性 */
export declare const filterEmptyPropValue: (object: any) => any;
/** 默认的条件列表 */
export declare const DEFAULT_CONDITION_LIST: {
    name: string;
    code: string;
}[];
export declare const PageSearch: FC<PageSearchProps>;
