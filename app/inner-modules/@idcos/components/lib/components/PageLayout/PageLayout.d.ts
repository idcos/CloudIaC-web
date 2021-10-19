import { CSSProperties, FC, ReactNode } from 'react';
export interface PageLayoutPropsStrict {
    /** Page's title */
    title?: string;
    /** El append after title */
    extraTitle?: ReactNode;
    /** El append end of header */
    extraHeader?: ReactNode;
    /** At inner page onBack alway set `true`, unless you want handle back behaviour by yourself */
    onBack?: boolean | Function;
    /** Maybe you want customize content container's style */
    contentStyle?: CSSProperties;
    /** Maybe you want customize footer container's style */
    footerStyle?: CSSProperties;
    /** Footer bar's content */
    footer?: ReactNode;
    /** Antd tabs */
    tabHeader?: ReactNode;
    /** Sometimes we need getContentContainerId */
    contentId?: string;
    /** Breadcrumb */
    breadcrumb?: ReactNode;
    /** ClassName */
    className?: string;
}
export interface PageLayoutProps extends PageLayoutPropsStrict {
    [propName: string]: any;
}
export declare const PageLayout: FC<PageLayoutProps>;
