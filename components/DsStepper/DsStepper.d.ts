/**
 * v2 stepper — replaces `StepperHeader`.
 *
 * Used by the multi-step flows in the admin portal (add object, add user, import).
 * A completed step turns `--ds-success-solid` with a tick and stays clickable; a
 * future step is inert, because letting an operator jump forward past validation is
 * how half-created objects happen.
 */
export interface DsStep { id?: string; label: React.ReactNode; hint?: string }
export interface DsStepperProps {
  steps?: DsStep[];
  /** Zero-based index of the current step. */
  active?: number;
  /** Omit to make the stepper read-only. */
  onSelect?: (index: number) => void;
  /** Explicit completed indices. Defaults to everything before `active`. */
  completed?: number[];
}
export declare function DsStepper(props: DsStepperProps): JSX.Element;
