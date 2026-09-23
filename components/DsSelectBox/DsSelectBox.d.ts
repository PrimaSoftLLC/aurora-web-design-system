/**
 * The selection box used by every level of the object tree (user → group → object)
 * and by DsSelectionBar's select-all.
 *
 * It exists separately from `DsCheckbox` because list selection is not form input:
 * it needs a tri-state (`some` for a partially selected user or group), a 36px
 * circular hit area that lines up with the other trailing controls in a row, and it
 * must swallow the click so the row underneath does not also fire. `DsCheckbox`
 * stays the labelled form control.
 *
 * Legacy note: the old library painted list selection in the accent colour. v2
 * selection is `--ds-brand` everywhere — accent is reserved for unread counts.
 */
export interface DsSelectBoxProps {
  /** `some` renders the dash — use it on a partially selected user/group. */
  state?: 'on' | 'some' | 'off';
  /** aria-label and title; say what is being selected ("Select all objects of Petrov S."). */
  label?: string;
  disabled?: boolean;
  /** Called with the next state: `off` → `on`, `on`/`some` → `off`. */
  onChange?: (next: 'on' | 'off') => void;
}
export declare function DsSelectBox(props: DsSelectBoxProps): JSX.Element;
