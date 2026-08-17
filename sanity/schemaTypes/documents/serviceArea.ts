import { defineField, defineType } from 'sanity'

export const serviceArea = defineType({
  name: 'serviceArea',
  title: 'Service Area',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'more', title: 'Page Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'suburb',
      title: 'Suburb / Area Name',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'suburb' },
      group: 'content',
    }),
    defineField({
      name: 'region',
      title: 'Region / State',
      description: 'e.g. Melbourne, VIC',
      type: 'string',
      group: 'content',
    }),
    defineField({ name: 'postcode', title: 'Postcode', type: 'string', group: 'content' }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Short description shown on the Areas We Serve hub and in cards',
      type: 'text',
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
      name: 'distanceFromClinic',
      title: 'Distance from Clinic',
      description: 'e.g. 5 minutes from Roxburgh Park',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services',
      description: 'Services to highlight for this area. Leave empty to show all services.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'content',
    }),
    defineField({
      name: 'featuredConditions',
      title: 'Featured Conditions',
      description:
        'Conditions to highlight and internally link to from this suburb page. Leave empty to show none.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'condition' }] }],
      group: 'content',
    }),
    defineField({
      name: 'landmarks',
      title: 'Local Landmarks',
      description: 'Nearby landmarks to mention for local relevance, e.g. "Roxburgh Park Shopping Centre"',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    defineField({
      name: 'travelInfo',
      title: 'Travel Info',
      description: 'How to get to the clinic from this suburb, e.g. parking, public transport',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      group: 'content',
    }),

    defineField({
      name: 'body',
      title: 'Page Content',
      description:
        'Full creative freedom — rich text with headings, lists, internal/external links, images, tables, plus 17 other content blocks (galleries, video, FAQs, CTAs, testimonials, and more).',
      type: 'pageBuilder',
      group: 'more',
    }),
    defineField({
      name: 'answerCapsule',
      title: 'Answer Capsule',
      description:
        'A short, self-contained direct answer (40–80 words) to "Do you have a podiatrist in [suburb]?" — placed at the top of the page for AI answer engines to quote directly.',
      type: 'text',
      rows: 3,
      group: 'more',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      name: 'orderAsc',
      title: 'Display Order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'suburb', subtitle: 'region', media: 'heroImage' },
  },
})
