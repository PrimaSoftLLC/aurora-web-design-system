/**
 * The blank-area state: a glyph, a title that says what is missing, one line of
 * why, and the action that resolves it. It covers all three cases the product
 * kept writing by hand — nothing matched a filter, nothing exists yet, and a
 * request failed — because they differ only in `tone`, `icon` and copy.
 *
 * v1 painted these as a centred `No data` string, so an operator could not tell a
 * genuinely empty period from a dropped connection, and there was nothing to click.
 * Rules:
 * - always name the action. "Изменить период" / "Повторить", never a bare message;
 * - an error state is `tone="danger"` with a retry — it is NOT a DsBanner. A banner
 *   annotates content that exists; an empty state replaces content that does not;
 * - keep it inside the container that would have held the data (panel body, table
 *   body, tree), never as a full-page takeover;
 * - `size="sm"` for narrow containers — the object panel, a card column.
 *
 * Loading is not an empty state: use DsSkeleton while data is on its way, and only
 * fall back to this once the response is in.
 *
 * `action` and `secondary` also accept children carrying `slot="action"` /
 * `slot="secondary"`, for composition from static markup.
 */
export interface DsEmptyStateProps {
  children?: React.ReactNode;
  /** Material Symbols Outlined name. Say what is missing (`route`, `assessment`, `cloud_off`, `error`). */
  icon?: string;
  title: React.ReactNode;
  /** One line, wrapped at ~34 characters. */
  description?: React.ReactNode;
  /** Primary DsButton — the way out of the state. */
  action?: React.ReactNode;
  /** Optional second, quieter action. */
  secondary?: React.ReactNode;
  /** `danger` for failures, `info` for "nothing yet, here is how to start". */
  tone?: 'neutral' | 'danger' | 'info' | 'warning';
  size?: 'md' | 'sm';
}
export declare function DsEmptyState(props: DsEmptyStateProps): JSX.Element;
