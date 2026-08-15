import type { SchemaTypeDefinition } from 'sanity'

import { areasHub } from './documents/areasHub'
import { blogCategory } from './documents/blogCategory'
import { blogPost } from './documents/blogPost'
import { faq } from './documents/faq'
import { footerNavigation } from './documents/footerNavigation'
import { homePage } from './documents/homePage'
import { mainNavigation } from './documents/mainNavigation'
import { notFoundPage } from './documents/notFoundPage'
import { page } from './documents/page'
import { practitioner } from './documents/practitioner'
import { redirect } from './documents/redirect'
import { service } from './documents/service'
import { serviceArea } from './documents/serviceArea'
import { siteSettings } from './documents/siteSettings'
import { teamMember } from './documents/teamMember'
import { testimonial } from './documents/testimonial'
import { aboutPoint } from './objects/aboutPoint'
import { curatedCard } from './objects/curatedCard'
import { navItem } from './objects/navItem'
import {
  beforeAfter,
  columns,
  ctaBanner,
  customEmbed,
  divider,
  faqAccordionBlock,
  gallery,
  imageBlock,
  logoCloud,
  mapEmbed,
  pageBuilder,
  pricingTable,
  quote,
  richTextBlock,
  stats,
  tabs,
  teamGrid,
  testimonialsBlock,
  videoEmbed,
} from './objects/pageBuilder'
import { seo } from './objects/seo'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Site Configuration — fully migrated, locked as singletons in structure.ts
  siteSettings,
  mainNavigation,
  footerNavigation,
  notFoundPage,

  // Home Page — fully migrated, locked as a singleton in structure.ts.
  // (Hero and About now live as sections inside this one document, matching
  // what the live frontend already reads — the old standalone heroSection
  // and aboutSection documents were unused and have been deleted.)
  homePage,

  // Services — fully migrated. Service and Service Area remain normal
  // collections (default "+ Create" behavior); Areas We Serve (Hub Page)
  // is locked as a singleton in structure.ts.
  service,
  serviceArea,
  areasHub,

  // People — fully migrated, normal collections grouped under "People" in
  // structure.ts.
  practitioner,
  teamMember,

  // Blog — fully migrated, normal collections grouped under "Blog" in
  // structure.ts.
  blogPost,
  blogCategory,

  // Site Content / Misc — fully migrated, normal collections grouped under
  // "Site Content" in structure.ts. "Page" itself gets its own top-level
  // spot in structure.ts (not nested under Site Content) since editors can
  // freely place it anywhere in the nav.
  page,
  faq,
  testimonial,
  redirect,

  // Shared objects
  navItem,
  seo,
  aboutPoint,
  curatedCard,

  // Page Builder — the flexible block editor used for "body" on
  // Service/Service Area/Blog Post/Page and "additionalSections" on Home
  // Page/Areas hub. Each block type must be registered individually before
  // the `pageBuilder` array type that references them.
  richTextBlock,
  imageBlock,
  gallery,
  videoEmbed,
  columns,
  stats,
  testimonialsBlock,
  faqAccordionBlock,
  ctaBanner,
  quote,
  beforeAfter,
  teamGrid,
  pricingTable,
  mapEmbed,
  tabs,
  divider,
  logoCloud,
  customEmbed,
  pageBuilder,
]
