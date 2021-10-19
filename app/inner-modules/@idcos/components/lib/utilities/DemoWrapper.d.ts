import { ReactNode } from 'react';
interface DemoWrapperProps {
    children: ReactNode | ReactNode[];
    title: ReactNode;
    describe: ReactNode;
}
export declare const DemoWrapper: ({ children, title, describe, }: DemoWrapperProps) => JSX.Element;
export {};
