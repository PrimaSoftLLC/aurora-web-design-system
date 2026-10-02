/** Strings and formatter functions grouped by interface area. */
export type DsStringValue = string | ((...args: any[]) => string);
export type DsStrings = Record<string, Record<string, DsStringValue>>;
export interface DsStringsProviderProps {
  /** Partial groups override the inherited dictionary. */
  strings?: DsStrings;
  children?: React.ReactNode;
}
export declare function DsStringsProvider(props: DsStringsProviderProps): JSX.Element;
export declare function useDsStrings(): DsStrings;
export declare const dsStringsRu: DsStrings;
export declare const dsStringsEn: DsStrings;
