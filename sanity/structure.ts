import { createElement } from 'react'

import { Icon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

// This version of @sanity/icons only ships a single generic `Icon`
// component (rendered with a `symbol` prop), not individually importable
// PascalCase icon components. It must be rendered as a component via
// createElement/JSX — calling it directly as a plain function crashes.
const CogIcon = () => createElement(Icon, { symbol: 'cog' })

// Document types pulled into custom singleton items below. Everything else
// is rendered with the default per-type list further down, unchanged.
const SITE_CONFIG_TYPES = ['siteSettings', 'mainNavigation', 'footerNavigation', 'notFoundPage']
const SINGLETON_TYPES = [...SITE_CONFIG_TYPES, 'homePage', 'areasHub', 'hubPage']
// Non-singleton document types that are nested under a custom group item
// below (e.g. Service/Service Area under "Services") and therefore must
// also be excluded from the flat fallback list, or they'd render twice.
const GROUPED_COLLECTION_TYPES = [
  'category',
  'condition',
  'treatment',
  'service',
  'serviceArea',
  'practitioner',
  'teamMember',
  'blogPost',
  'blogCategory',
  'page',
  'faq',
  'testimonial',
  'redirect',
]
// "Page" gets its own top-level spot (see below) rather than nesting under
// "Site Content" — pages are freestanding documents that can be linked from
// anywhere in the nav (their own top-level dropdown, the footer, buried
// under another section, or not linked at all), so they shouldn't read as
// scoped to "Site Content" alongside FAQs/Testimonials/Redirects.
const HIDDEN_FROM_FLAT_LIST = [...SINGLETON_TYPES, ...GROUPED_COLLECTION_TYPES]

/**
 * Existing document IDs for each singleton. Pinning to these exact IDs
 * (instead of a document type list) removes the "+ Create" action and
 * makes it impossible to create a second, duplicate document of the
 * same type.
 */
const SITE_SETTINGS_ID = '028bc799-5c07-4c06-969d-ce3d9b1ae776'
const MAIN_NAVIGATION_ID = 'edd4e49e-bc82-424b-b3bb-5d9162150199'
const FOOTER_NAVIGATION_ID = 'e80fc844-220b-45d3-8d44-9086d28bf6b6'
const NOT_FOUND_PAGE_ID = '14ab7656-db4e-4536-b16d-a3e558ddc3d6'
const HOME_PAGE_ID = '39e7c8e6-ddb6-4330-bcf9-d73cb3744f81'
const AREAS_HUB_ID = '10ef321c-4d66-4306-82f6-3ebcac3ef12d'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Configuration')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID)),
              S.listItem()
                .title('Main Navigation')
                .child(S.document().schemaType('mainNavigation').documentId(MAIN_NAVIGATION_ID)),
              S.listItem()
                .title('Footer Navigation')
                .child(
                  S.document().schemaType('footerNavigation').documentId(FOOTER_NAVIGATION_ID),
                ),
              S.listItem()
                .title('404 Page')
                .child(S.document().schemaType('notFoundPage').documentId(NOT_FOUND_PAGE_ID)),
            ]),
        ),

      S.listItem()
        .title('Home Page')
        .child(S.document().schemaType('homePage').documentId(HOME_PAGE_ID)),

      S.listItem()
        .title('Services')
        .child(
          S.list()
            .title('Services')
            .items([
              S.documentTypeListItem('service').title('Service'),
              S.documentTypeListItem('serviceArea').title('Service Area'),
              S.listItem()
                .title('Areas We Serve (Hub Page)')
                .child(S.document().schemaType('areasHub').documentId(AREAS_HUB_ID)),
            ]),
        ),

      S.listItem()
        .title('People')
        .child(
          S.list()
            .title('People')
            .items([
              S.documentTypeListItem('practitioner').title('Practitioner'),
              S.documentTypeListItem('teamMember').title('Team Member'),
            ]),
        ),

      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('blogPost').title('Blog Post'),
              S.documentTypeListItem('blogCategory').title('Blog Category'),
            ]),
        ),

      // Its own top-level category: freeform "Page" documents (About,
      // Privacy Policy, Terms, Careers, one-off landing pages, etc.) that
      // aren't Services or Blog Posts. Each has the same full Page Builder
      // freedom and can be linked from anywhere in the nav independently.
      S.documentTypeListItem('page').title('Pages'),

      S.listItem()
        .title('Site Content')
        .child(
          S.list()
            .title('Site Content')
            .items([
              S.documentTypeListItem('faq').title('FAQ'),
              S.documentTypeListItem('testimonial').title('Testimonial'),
              S.documentTypeListItem('redirect').title('Redirect'),
            ]),
        ),

      S.divider(),

      // Everything else, unchanged: one flat list item per remaining
      // document type, each with the default "+ Create" / list behavior.
      // Not yet migrated to a custom structure — still edited the same
      // way as before, just now living in this Studio too.
      ...S.documentTypeListItems().filter(
        (listItem) => !HIDDEN_FROM_FLAT_LIST.includes(listItem.getId() ?? ''),
      ),
    ])
