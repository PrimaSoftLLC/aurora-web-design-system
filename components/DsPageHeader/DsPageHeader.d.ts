/**
 * v2 page header — replaces `PageHeader`.
 *
 * v1's was a 35px strip holding a title and nothing else, so every screen grew its
 * own ad-hoc row of breadcrumbs, back arrows and action buttons above the content.
 *
 * `actions`, `meta` and `tabs` also accept a child carrying `slot="actions" |
 * "meta" | "tabs"`, for composition from static markup.
 * v2 absorbs all of it, including an optional tab strip that sits flush on the
 * bottom border (pass `tabs={<DsTabs tone="underline" …/>}`).
 */
export interface DsBreadcrumb { label: React.ReactNode; onClick?: () => void }
export interface DsPageHeaderProps {
  title?: React.ReactNode;
  /** 11px uppercase category above the title. */
  eyebrow?: React.ReactNode;
  /** Trail; the last item is normally the current page and has no onClick. */
  breadcrumbs?: DsBreadcrumb[];
  /** Renders a bordered back button before the title. */
  onBack?: () => void;
  /** Badges / status sitting immediately after the title. */
  meta?: React.ReactNode;
  /** Right-aligned buttons. */
  actions?: React.ReactNode;
  /** A DsTabs with tone="underline", flush to the bottom border. */
  tabs?: React.ReactNode;
  border?: boolean;
}
export declare function DsPageHeader(props: DsPageHeaderProps): JSX.Element;
