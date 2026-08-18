import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    defineField({
      name: 'template',
      title: 'Template',
      description:
        'Purely organizational — helps you tell apart short legal/utility pages from full custom landing pages when browsing the Pages list. Does not change rendering.',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Standard (e.g. About, Privacy Policy, Terms)', value: 'standard' },
          { title: 'Landing Page (custom, marketing-driven)', value: 'landing' },
        ],
      },
      initialValue: 'standard',
    }),

    defineField({
      name: 'body',
      title: 'Page Content',
      description:
        'Full creative freedom — rich text with headings, lists, internal/external links, images, tables, plus 17 other content blocks (galleries, video, FAQs, CTAs, testimonials, and more). This is a completely blank canvas: use it for anything that does not belong under Services, Blog, or a fixed section — About, Privacy Policy, Terms, Careers, or a one-off landing page.',
      type: 'pageBuilder',
      group: 'content',
    }),
    defineField({
      name: 'answerCapsule',
      title: 'Answer Capsule',
      description:
        'Optional — a short, self-contained direct-answer summary placed at the top of the page for AI answer engines to quote. Most useful on informational pages (About, FAQ-style pages); skip it for purely legal pages.',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description:
        'FAQs to render on this page, e.g. for access/funding pages like Medicare, NDIS, Fees, or WorkCover.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'content',
    }),

    defineField({
      name: 'showInNavByDefault',
      title: 'Suggest for Navigation',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      description:
        'Informational only — does not automatically add this page to the nav. Add it manually in Main Navigation or Footer Navigation.',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ name: 'title', title: 'Title', by: [{ field: 'title', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
})
