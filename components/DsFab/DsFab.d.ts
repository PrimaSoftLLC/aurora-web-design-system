/**
 * v2 floating action button.
 *
 * The v1 FAB had `box-shadow: none` forced on it, which made it a circle with no
 * reason to be a circle. v2 gives it back the one thing a FAB is for — floating
 * over content (the map, a long table) — so it carries `--ds-shadow-md`.
 *
 * On the monitoring map this is "Add object" / "Add geofence"; anywhere a normal
 * toolbar exists, use DsButton instead.
 */
export interface DsFabProps {
  /** Material Symbols Outlined ligature. Default `add`. */
  icon?: string;
  /** Required for accessibility; also the visible text when `extended`. */
  label?: string;
  /** Pill with an icon and the label, instead of a circle. */
  extended?: boolean;
  /** `surface` is the white-on-map variant used by the map rail. */
  tone?: 'primary' | 'accent' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare function DsFab(props: DsFabProps): JSX.Element;
