/**
 * v2 duration field — replaces `TimePicker`, the one non-Material control in v1.
 *
 * v1's was 32px tall with the mask `дд d чч : мм` hard-coded in Russian, a
 * `1px #cbd5e1` border (a literal hex that matched no token) and a bespoke
 * `0 0 0 1px --color-primary` focus ring. v2 rebuilds it on the shared field
 * tokens — same height, border and focus ring as DsField — and takes the unit
 * labels out of the mask so they can be translated.
 *
 * This is a **duration**, not a clock time: it is what "parking longer than", "trip
 * shorter than" and report intervals use. For a wall-clock time use
 * `DsField type="time"`.
 */
export interface DsDurationValue { d?: string; h?: string; m?: string }
export interface DsDurationProps {
  label?: string;
  value?: DsDurationValue;
  onChange?: (value: DsDurationValue) => void;
  hint?: string;
  error?: string;
  /** Amber border + amber description — "longer than the report interval". */
  warning?: string;
  /** false drops the days segment. */
  showDays?: boolean;
  disabled?: boolean;
  width?: number | string;
}
export declare function DsDuration(props: DsDurationProps): JSX.Element;
