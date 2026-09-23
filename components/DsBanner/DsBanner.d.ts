/**
 * v2 message banner. Carries over the legacy rule that this is the ONE sanctioned
 * permanent message surface — but drops the 4px left accent bar, which is the most
 * dated pattern in the old library, and the Roboto fallback the Material banner
 * pulled in.
 *
 * Tone sets `role` automatically: `danger` announces as `alert`, everything else
 * as `status`.
 *
 * `actions` also accepts a child carrying `slot="actions"`; unslotted children are
 * the body copy.
 */
export interface DsBannerProps {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: React.ReactNode;
  /** Body copy. Full sentences here take a terminal period; the title does not. */
  children?: React.ReactNode;
  /** Buttons — normally one DsButton tone="secondary" size="sm". */
  actions?: React.ReactNode;
  /** Omit for a message the operator must not be able to hide. */
  onClose?: () => void;
  compact?: boolean;
}
export declare function DsBanner(props: DsBannerProps): JSX.Element;
