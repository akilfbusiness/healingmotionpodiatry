import { defineField, defineType } from 'sanity'

// A hand-built "featured link" card used on the Home Page's curated sections
// (Conditions We Treat, Services, Suburbs Served). Each card points at a real
// Service / Service Area / Blog Post / Page via `reference` — so it's always
// a genuine internal link to a real, indexable page — but every other field
// is written by the editor specifically for this placement. Nothing here is
// auto-generated: adding, removing, reordering, or rewriting a card never
// changes the underlying page it points to.
export const curatedCard = defineType({
  name: 'curatedCard',
  title: 'Curated Card',
  type: 'object',
  fields: [
    defineField({
      name: 'reference',
      title: 'Links To',
      description: 'The real page this card should link to.',
      type: 'reference',
      to: [{ type: 'service' }, { type: 'serviceArea' }, { type: 'blogPost' }, { type: 'page' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayTitle',
      title: 'Card Title',
      description: "Leave blank to use the linked page's own title.",
      type: 'string',
    }),
    defineField({
      name: 'displayBlurb',
      title: 'Card Text',
      description:
        'Your own short blurb for this card — written for this placement, not pulled from the linked page. This is where the SEO copy for the home page lives.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Text',
      description: 'Defaults to "Learn more" if left blank. Customize for internal-linking anchor text.',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (lucide-react)',
      description: 'Optional. E.g. "Footprints", "MapPin", "Stethoscope".',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Optional photo, used instead of or alongside the icon.',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
  ],
  preview: {
    select: {
      title: 'displayTitle',
      blurb: 'displayBlurb',
      media: 'image',
      refService: 'reference.name',
      refArea: 'reference.suburb',
      refBlog: 'reference.title',
      refPage: 'reference.title',
    },
    prepare({ title, blurb, media, refService, refArea, refBlog, refPage }) {
      return {
        title: title || refService || refArea || refBlog || refPage || 'Untitled card',
        subtitle: blurb,
        media,
      }
    },
  },
})
