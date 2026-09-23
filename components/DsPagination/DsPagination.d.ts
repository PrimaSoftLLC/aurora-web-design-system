/**
 * v2 paginator — replaces `Paginator` (`mat-paginator`).
 *
 * v1's was 56px tall, right-aligned and sat *below* the table as its own band, which
 * is where the extra 2px primary rule came from. v2's is a plain inline cluster meant
 * to be passed as `DsTable footer` or `DsPanel footer`, so the table owns its own
 * bottom edge and there is nothing to separate.
 */
export interface DsPaginationProps {
  /** Zero-based. */
  page?: number;
  pageSize?: number;
  /** Total row count, not page count. */
  length?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  /** Omit to hide the page-size select entirely. */
  onPageSizeChange?: (size: number) => void;
  /** Drops the page-size select and the first/last buttons — for narrow panels. */
  compact?: boolean;
}
export declare function DsPagination(props: DsPaginationProps): JSX.Element;
