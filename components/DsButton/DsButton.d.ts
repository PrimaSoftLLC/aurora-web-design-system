/**
 * v2 button. Replaces the legacy three-level architecture (`.app-button` + a colour
 * class + a semantic Angular wrapper per action) with one component and a `tone`.
 * Height, padding and gap come from the density tokens, so the same button is 30px
 * in a compact table toolbar and 36px on a cozy form.
 */
export interface DsButtonProps {
  /** `primary` brand fill · `secondary` bordered surface · `subtle` brand tint · `ghost` bare · `danger` · `accent`. */
  tone?: 'primary' | 'secondary' | 'subtle' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  /** Material Symbols Outlined ligature, leading. */
  icon?: string;
  /** Trailing ligature — chevrons, external-link. */
  iconRight?: string;
  /** Swaps the leading icon for a spinner and disables the button. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}
/** Hover (mouse only) and momentary press 16% on every input — mouse, touch, pen, Space, Enter. */
export declare function DsButton(props: DsButtonProps): JSX.Element;
/** The shared hover / press rule of DsButton, DsIconButton and DsFab. Consumer handlers in `rest` are chained, not replaced. */
export declare function usePress(disabled: boolean, rest?: Record<string, any>): {
  hover: boolean; pressed: boolean; handlers: Record<string, (e: any) => void>; rest: Record<string, any>;
};
