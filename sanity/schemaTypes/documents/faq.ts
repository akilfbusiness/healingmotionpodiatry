import { defineField, defineType } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'text' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To',
      description:
        'Optional — link this FAQ to specific Categories/Conditions/Treatments/Pages so it can be filtered to just those pages instead of only appearing in the global FAQ list.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }, { type: 'condition' }, { type: 'treatment' }, { type: 'page' }],
        },
      ],
    }),
  ],
  orderings: [
    { name: 'orderAsc', title: 'Display Order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})
