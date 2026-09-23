/**
 * v2 chip. Replaces `mat-chip`, which was the one component in the legacy system
 * that ignored theming entirely — it stayed indigo-pink grey in every brand
 * because it came from Angular Material's prebuilt theme. The v2 chip is a project
 * component, so a selected chip is brand-tinted like every other selected thing.
 *
 * Two jobs: a selectable filter token (`selected`, optional `count`) and a
 * removable value token (`removable`).
 */
export interface DsChipProps {
  children?: React.ReactNode;
  icon?: string;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  /** Trailing count pill — "Offline 12". */
  count?: number;
}
export declare function DsChip(props: DsChipProps): JSX.Element;
