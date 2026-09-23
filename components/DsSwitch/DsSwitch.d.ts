/**
 * v2 slide toggle. 36x20 track, brand fill when on.
 * Use for a setting that takes effect immediately (map layer, invalid-data
 * visibility); use DsCheckbox inside a form that has a Save button.
 */
export interface DsSwitchProps {
  label?: React.ReactNode;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  /** Omit only in a static specimen — without it the input is marked read-only. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function DsSwitch(props: DsSwitchProps): JSX.Element;
