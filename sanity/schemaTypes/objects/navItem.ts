import { defineField, defineType } from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'internal',
      options: {
        layout: 'radio',
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'No Link (dropdown label only)', value: 'none' },
        ],
      },
    }),
    defineField({
      name: 'internalRef',
      title: 'Internal Page',
      type: 'reference',
      to: [
        { type: 'category' },
        { type: 'condition' },
        { type: 'treatment' },
        { type: 'faq' },
        { type: 'serviceArea' },
        { type: 'areasHub' },
        { type: 'blogPost' },
        { type: 'blogCategory' },
        { type: 'page' },
        // Legacy taxonomy, kept referenceable until `service` documents are
        // retired in favor of `condition`/`treatment`.
        { type: 'service' },
      ],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'children',
      title: 'Sub-items',
      description: 'Add nested dropdown items. Sub-items can have their own sub-items with no depth limit.',
      type: 'array',
      of: [{ type: 'navItem' }],
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'linkType' },
  },
})
