/**
 * v2 filter toolbar. The legacy `CommonFilter` put one filter control inside each
 * table header cell (eight types: string, number, number-range, date, date-range,
 * checkbox-list, radio, sort-by), which made the header two rows tall and hid what
 * was actually applied.
 *
 * v2 separates the two jobs: the header sorts, and this bar owns search plus a
 * visible, removable chip per applied filter — so an operator can always see why a
 * table shows 12 rows instead of 148. The density switch lives here too, next to
 * the result count.
 */
export interface DsAppliedFilter { id: string; label: string; value: string }
export interface DsFilterBarProps {
  search?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  /** Applied filters, shown as removable chips on a second row. */
  filters?: DsAppliedFilter[];
  onRemoveFilter?: (id: string) => void;
  onClearAll?: () => void;
  /** Filter-opening buttons / selects, placed after the search box. */
  children?: React.ReactNode;
  /** Right-aligned result summary, e.g. "12 of 148". */
  resultCount?: React.ReactNode;
  density?: 'cozy' | 'compact';
  /** Omit to hide the density switch. */
  onDensityChange?: (density: 'cozy' | 'compact') => void;
}
export declare function DsFilterBar(props: DsFilterBarProps): JSX.Element;
