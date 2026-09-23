/**
 * v2 form field — input, number, select or textarea in one component.
 *
 * The biggest visible break from legacy: the Material floating label is gone. A
 * label that starts at 16px inside the box and shrinks into a notch costs vertical
 * rhythm, breaks with long Russian and German strings, and is the single strongest
 * "Material 2015" signal in the product. v2 uses a static 12px label above a 40px
 * field, so a row of fields aligns regardless of label length.
 *
 * `labelMode="notch"` is available for screens that must sit next to un-migrated
 * `mat-form-field appearance="outline"` forms; it is not the v2 default.
 *
 * Units stay separate from the number, as in the source (`uom.km-h`) — pass them
 * as `suffix`, never bake them into `label`.
 */
export interface DsFieldProps {
  label?: string;
  /** Persistent helper line. Replaced by `error` when present. */
  hint?: string;
  /** Error message. Recolours the border and the description line. */
  error?: string;
  required?: boolean;
  /** `top` (default) renders a static label above the box; `notch` floats it into the top border (legacy parity). */
  labelMode?: 'top' | 'notch';
  as?: 'input' | 'select' | 'textarea';
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLElement>) => void;
  placeholder?: string;
  /** For `as="select"`: strings or `{value,label}`. */
  options?: Array<string | { value: string; label: string }>;
  /** Leading Material Symbols ligature. */
  icon?: string;
  /** Trailing unit or hint text — `km/h`, `сек`, `%`. */
  suffix?: string;
  /** Render the value in --ds-font-mono. Use for coordinates, IMEI, speeds. */
  mono?: boolean;
  disabled?: boolean;
  rows?: number;
  width?: number | string;
  id?: string;
}
export declare function DsField(props: DsFieldProps): JSX.Element;
