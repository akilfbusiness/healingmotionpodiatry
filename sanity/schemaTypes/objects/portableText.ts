import { defineArrayMember, defineField } from 'sanity'

// Shared rich-text configuration reused everywhere editors need "complete
// creative freedom" prose: the richText page-builder block's `content`
// field, plus nested body/content fields inside the `columns` and `tabs`
// blocks. Keeping this in one place means every rich-text field in the
// Studio supports the same headings, lists, marks, internal linking, images,
// and tables — and stays in sync with the renderers in
// components/portable-text.tsx.
//
// Internal Link annotations resolve against these document types because
// only these have a dedicated frontend route (see lib/sanity/nav.ts).
const INTERNAL_LINK_TYPES = [
  'service',
  'serviceArea',
  'blogPost',
  'page',
  'category',
  'condition',
  'treatment',
  'hubPage',
]

export const portableTextOf = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading 2', value: 'h2' },
      { title: 'Heading 3', value: 'h3' },
      { title: 'Heading 4', value: 'h4' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bulleted list', value: 'bullet' },
      { title: 'Numbered list', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Bold', value: 'strong' },
        { title: 'Italic', value: 'em' },
        { title: 'Underline', value: 'underline' },
        { title: 'Strikethrough', value: 'strike-through' },
        { title: 'Code', value: 'code' },
      ],
      annotations: [
        defineField({
          name: 'link',
          title: 'External Link',
          type: 'object',
          icon: () => '🔗',
          fields: [
            defineField({ name: 'href', title: 'URL', type: 'url' }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
        defineField({
          name: 'internalLink',
          title: 'Internal Link',
          type: 'object',
          fields: [
            defineField({
              name: 'reference',
              title: 'Page to link to',
              type: 'reference',
              to: INTERNAL_LINK_TYPES.map((type) => ({ type })),
            }),
          ],
          preview: {
            select: { title: 'reference.name', title2: 'reference.title', title3: 'reference.suburb' },
            prepare({ title, title2, title3 }) {
              return { title: title || title2 || title3 || 'Internal link' }
            },
          },
        }),
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    ],
  }),
  defineArrayMember({
    type: 'object',
    name: 'table',
    title: 'Table',
    fields: [
      defineField({
        name: 'rows',
        title: 'Rows',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'tableRow',
            title: 'Row',
            fields: [
              defineField({
                name: 'cells',
                title: 'Cells',
                type: 'array',
                of: [defineArrayMember({ type: 'string' })],
                options: { layout: 'tags' },
              }),
            ],
            preview: {
              select: { cells: 'cells' },
              prepare({ cells }) {
                return { title: Array.isArray(cells) ? cells.join(' | ') : 'Row' }
              },
            },
          }),
        ],
      }),
    ],
    preview: {
      select: { rows: 'rows' },
      prepare({ rows }) {
        return { title: `Table (${Array.isArray(rows) ? rows.length : 0} rows)` }
      },
    },
  }),
]
