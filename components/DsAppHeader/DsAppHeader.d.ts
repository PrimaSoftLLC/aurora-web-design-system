/**
 * v2 app header. Same idea as the legacy 60px primary header, four changes:
 * it is density-sized (56px cozy / 48px compact) rather than a fixed 60px, the
 * product title is set in the UI face instead of the Nasalization logo font (which
 * was unreadable at 18px and untranslatable), the tab rail is no longer pinned to
 * the 350px side-panel axis — it flows, so it survives a narrow window — and the
 * chrome is **neutral**: brand appears as the logo plate and the active-tab
 * indicator, not as a filled band.
 *
 * Every colour resolves through `--ds-header-*`, so the direction is a token
 * decision, not a component fork: a tenant that needs a coloured band overrides
 * those aliases in its own theme block.
 *
 * The tenant logo and title stay runtime-swappable, so never design the lockup as
 * a fixed-width block.
 * `actions` also accepts a child carrying `slot="actions"`; unslotted children are
 * the tab rail, as before.
 */
export interface DsAppHeaderProps {
  /** Tenant product title. Runtime-customisable — leave room for a longer string. */
  product?: string;
  /** Current area, shown after a hairline divider. */
  section?: string;
  /**
   * Tenant mark. Sits on a `--ds-header-plate` square so the stock white-on-
   * transparent mark stays legible on neutral chrome. When a tenant supplies a
   * dark mark, set `--ds-header-plate: transparent` for that tenant.
   */
  logoSrc?: string;
  /** Environment tag — `DEV`, `LOCAL`. */
  env?: string;
  /** Tab rail, normally a DsTabs with tone="onHeader". */
  children?: React.ReactNode;
  /** Icon buttons, normally DsIconButton tone="onHeader". */
  actions?: React.ReactNode;
  /** User name — rendered as a pill with a chevron. */
  user?: React.ReactNode;
  /**
   * Raise a shadow because content has scrolled under the header. Neutral chrome
   * separates from a light page on a 1px border at rest; once the page scrolls the
   * header genuinely floats, which is the one case the shadow rule allows. Drive it
   * from the scroll container's `onScroll`.
   */
  scrolled?: boolean;
}
export declare function DsAppHeader(props: DsAppHeaderProps): JSX.Element;
