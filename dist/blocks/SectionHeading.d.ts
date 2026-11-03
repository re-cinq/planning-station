export interface SectionHeadingProps {
    block: {
        props: {
            slot: string;
            title: string;
        };
    };
}
export declare function SectionHeading({ block }: SectionHeadingProps): import("react").JSX.Element;
