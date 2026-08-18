import { defineField, defineType } from 'sanity'

// A locked singleton for the two Core 30 index pages: /conditions and
// /treatments. `hubType` distinguishes which one this document is (pinned
// in structure.ts to two fixed document IDs, so editors can't create a
// third). The actual listing grid (every condition or treatment, grouped by
// category, with its Answer Capsule) is fully derived at query time from the
// condition/treatment documents — this schema only holds the page-level
// intro copy and SEO, not the list itself.
export const hubPage = defineType({
  name: 'hubPage',
  title: 'Hub Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'hubType',
      title: 'Hub Type',
      type: 'string',
      options: {
        list: [
          { title: 'Conditions Hub (/conditions)', value: 'conditions' },
          { title: 'Treatments Hub (/treatments)', value: 'treatments' },
        ],
      },
      readOnly: true,
      group: 'content',
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content' }),
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
      description: 'Intro copy shown above the grouped listing, ~200-300 words',
      type: 'text',
      rows: 5,
      group: 'content',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', hubType: 'hubType' },
    prepare({ title, hubType }) {
      return { title: title || 'Hub Page', subtitle: hubType }
    },
  },
})
