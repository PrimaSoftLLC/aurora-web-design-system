import { Directive } from '@angular/core';

/** Projected content; layout inside each slot belongs to the application. */
@Directive({ selector: '[dsPrefix]' })
export class DsPrefixDirective {}

@Directive({ selector: '[dsSuffix]' })
export class DsSuffixDirective {}

@Directive({ selector: '[dsHint]' })
export class DsHintDirective {}

/** Presence means the application has decided to show an error. */
@Directive({ selector: '[dsError]' })
export class DsErrorDirective {}
