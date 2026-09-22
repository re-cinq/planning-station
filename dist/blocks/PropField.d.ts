export interface PropSpec {
    default: string | number | boolean;
    values?: readonly string[];
}
export interface PropFieldProps {
    name: string;
    spec: PropSpec;
    value: unknown;
    onChange: (value: string | number | boolean) => void;
    readOnly: boolean;
}
export declare function PropField({ name, ...input }: PropFieldProps): import("react").JSX.Element;
