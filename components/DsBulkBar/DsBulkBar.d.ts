/**
 * The bar that appears when a table has a selection: what you can do with those
 * N rows, and nothing else. Table selection in v1 had no home for its verbs —
 * bulk actions lived in a per-row `more_vert` menu, so "archive 12 objects"
 * meant twelve menus, and the count was a footer string with no actions near it.
 *
 * `DsBulkBar` is the table counterpart of `DsSelectionBar` (which belongs to the
 * monitoring panel's tree): a floating strip docked over the bottom of the table,
 * carrying the count, select-all/clear, and 2–4 verbs. It renders nothing while
 * `count` is 0, so the resting table is quiet — the bar is a mode, not chrome.
 *
 * Keep verbs to the ones that make sense on many rows at once (assign a group,
 * send a command, export, archive) and put the rest behind one `more_vert`
 * DsIconButton. Destructive verbs use `tone="danger"` and must confirm in a
 * DsDialog — never delete straight from the bar.
 *
 * `actions` also accepts a child carrying `slot="actions"`, for composition from
 * static markup. Set `floating={false}` when the bar sits inside a bordered
 * region that already separates it from the rows.
 */
export interface DsBulkBarProps {
  /** Rows currently selected. `0` (or undefined) renders nothing. */
  count?: number;
  /** Total rows in the filtered result — enables the select-all link. */
  total?: number;
  /** Plural noun for the selected things: `objects`, `users`, `reports`. */
  noun?: string;
  /** Called with `true` to select the whole result, `false` to clear it. */
  onSelectAll?: (all: boolean) => void;
  /** Renders the trailing close button — leaves the selection verbs and exits the mode. */
  onClear?: () => void;
  /** The verbs: small DsButton / DsIconButton. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  /** Elevated pill for a bar docked over content (default). `false` = flat inline strip. */
  floating?: boolean;
  style?: React.CSSProperties;
}
export declare function DsBulkBar(props: DsBulkBarProps): JSX.Element;
