/**
 * v2 status badge — the shipped version of the legacy StatusChip spec, which was
 * written but never implemented in the product.
 *
 * Tones are deliberately NOT themed: an offline object must read as offline in every
 * brand and in dark. `solid` is for a badge sitting on a coloured or map
 * ground where a tint would not separate.
 */
export interface DsBadgeProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  /** Filled instead of tinted — for badges over map tiles or brand chrome. */
  solid?: boolean;
  /** Leading state dot. Preferred over an icon for connection state. */
  dot?: boolean;
  icon?: string;
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}
export declare function DsBadge(props: DsBadgeProps): JSX.Element;
