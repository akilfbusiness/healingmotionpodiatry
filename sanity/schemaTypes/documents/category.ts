import { defineField, defineType } from 'sanity'

// The top of the Core 30 content hierarchy. Every Condition and Treatment
// belongs to exactly one Category (see their required `category` reference)
// — this is what keeps each page's search intent distinct and prevents
// cannibalization between pages. `featuredOnHome` lets an editor hand-pick
// up to 3 standout items per category for the home page; everything else in
// the category still appears automatically in the "remaining items" grid
// derived at query time, so nothing can be silently orphaned from the home
// page just because it wasn't hand-featured.
export const category = defineType({
  name: 'category',
  title: 'Category',
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
      description: 'Top-level path, e.g. /foot-heel-pain',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
    }),
    defineField({
      name: 'h1',
      title: 'H1 Heading',
      description: 'Leave blank to use the Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Short intro copy shown at the top of the category page, ~60 words',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(500).warning('Aim for around 60 words'),
    }),
    defineField({
      name: 'body',
      title: 'Page Content',
      type: 'pageBuilder',
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
      name: 'featuredOnHome',
      title: 'Featured on Home Page',
      description:
        'Hand-pick up to 3 standout Conditions/Treatments from this category to feature on the home page. Everything else in this category still appears automatically in the "see all" grid — nothing is hidden by leaving this empty.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'condition' }, { type: 'treatment' }] }],
      group: 'content',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'content',
    }),
    defineField({
      name: 'orderRank',
      title: 'Display Order',
      description: 'Controls the order this category appears in on the home page',
      type: 'number',
      initialValue: 0,
      group: 'content',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { name: 'orderAsc', title: 'Display Order', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
})
