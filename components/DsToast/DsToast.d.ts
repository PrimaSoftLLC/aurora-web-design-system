/**
 * v2 transient message — the replacement for `SnackBar` (`mat-snack-bar`).
 *
 * v1's snack-bar had no icon and accent-coloured actions, and it looked close enough
 * to the message banner that the two were used interchangeably. v2 makes the
 * distinction structural: a **banner** is tinted, permanent and sits in the layout;
 * a **toast** is inverse, floats, and goes away. If the operator must be able to
 * find the message again later, it is a banner.
 */
export interface DsToastProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  /** One action only — normally Undo. */
  action?: () => void;
  actionLabel?: string;
  onClose?: () => void;
  /** Override the tone's default glyph. */
  icon?: string;
}
export declare function DsToast(props: DsToastProps): JSX.Element;
export interface DsToastStackProps {
  children?: React.ReactNode;
  position?: 'bottom-center' | 'bottom-right';
}
export declare function DsToastStack(props: DsToastStackProps): JSX.Element;
