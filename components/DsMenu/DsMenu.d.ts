/**
 * v2 popover menu, and the header user menu built on it.
 *
 * v1 had no menu component: `AuthUserChip` + `HeaderMenuItem` + `HeaderDivider`
 * hand-assembled the user menu, and every row-actions menu in a table was a raw
 * `mat-menu` styled per screen. DsMenu is one anchored popover with items, so a
 * table's `more_vert`, a filter dropdown and the user menu are the same object.
 *
 * Panels are capped at 240px wide and 320px tall, matching v1's `menu panels max
 * 320px` rule.
 */
export interface DsMenuItem {
  id?: string;
  label?: React.ReactNode;
  icon?: string;
  /** Right-aligned keyboard hint, in the mono face. */
  shortcut?: string;
  /** Draws a tick — for a menu used as a single-select. */
  checked?: boolean;
  /** Red ink and a red hover ground. For "Move to archive". */
  tone?: 'default' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  /** Renders a 1px rule instead of an item; no other field applies. */
  divider?: boolean;
}
export interface DsMenuProps {
  /** Any element. DsMenu attaches the click handler itself. */
  trigger?: React.ReactNode;
  items?: DsMenuItem[];
  onSelect?: (item: DsMenuItem) => void;
  /** Which edge the panel aligns to. Default `start`. */
  align?: 'start' | 'end';
  width?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Controlled mode — pair with onOpenChange. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export declare function DsMenu(props: DsMenuProps): JSX.Element;
export interface DsUserMenuProps {
  name?: React.ReactNode;
  email?: string;
  avatarSrc?: string;
  items?: DsMenuItem[];
  onSelect?: (item: DsMenuItem) => void;
}
export declare function DsUserMenu(props: DsUserMenuProps): JSX.Element;
