import { defineField, defineType } from 'sanity'

// The home page is now mostly an ENGINE, not a manual curation surface. The
// category/condition/treatment sections (which used to be hand-built
// curatedCard arrays here) are gone — they're derived entirely at query
// time from the category/condition/treatment documents (see
// lib/sanity/queries.ts homePageQuery), grouped by category.orderRank, with
// each category's featuredOnHome items shown first and its remaining
// children auto-filled in below. This guarantees every published
// condition/treatment appears on the home page without anyone remembering
// to add a card for it.
//
// Testimonials have been removed entirely from the home page per AHPRA
// National Law s133, which prohibits health services from using
// testimonials/reviews in advertising. The `testimonial` schema stays
// registered (in case another use is found later) but is not linked from
// anywhere in this rebuild.
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'quickLinks', title: 'Quick Links' },
    { name: 'practitioner', title: 'Practitioner' },
    { name: 'faq', title: 'FAQ Preview' },
    { name: 'access', title: 'Fees & First Appointment' },
    { name: 'more', title: 'Additional Sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'badge', title: 'Badge Text', type: 'string' }),
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
        defineField({ name: 'primaryButtonLabel', title: 'Primary Button Label', type: 'string' }),
        defineField({ name: 'primaryButtonUrl', title: 'Primary Button URL', type: 'string' }),
        defineField({
          name: 'secondaryButtonLabel',
          title: 'Secondary Button Label',
          type: 'string',
        }),
        defineField({ name: 'secondaryButtonUrl', title: 'Secondary Button URL', type: 'string' }),
      ],
    }),

    // About
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'about',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
        defineField({
          name: 'points',
          title: 'Highlight Points',
          type: 'array',
          of: [{ type: 'aboutPoint' }],
        }),
      ],
    }),

    // Quick Links — a short hand-picked strip of standout Conditions shown
    // near the top of the page. The full category/condition/treatment
    // grids further down are NOT configured here — they're derived
    // automatically from category.orderRank + category.featuredOnHome plus
    // every remaining published condition/treatment in that category. This
    // field is intentionally small (max 8) and supplementary, not the
    // primary listing mechanism.
    defineField({
      name: 'quickLinks',
      title: 'Quick Links Strip',
      description: 'Up to 8 hand-picked conditions to feature near the top of the home page',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'condition' }] }],
      group: 'quickLinks',
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'trustLogos',
      title: 'Trust Logos',
      description: 'e.g. Medicare, HICAPS, private health fund logos',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        },
      ],
      group: 'quickLinks',
    }),

    // Practitioner
    defineField({
      name: 'practitionerSection',
      title: 'Practitioner Section',
      type: 'object',
      group: 'practitioner',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'practitioner',
          title: 'Practitioner',
          description: 'Used for both the on-page section and the JSON-LD Person structured data',
          type: 'reference',
          to: [{ type: 'practitioner' }],
        }),
      ],
    }),

    // FAQ Preview
    defineField({
      name: 'faqPreview',
      title: 'FAQ Preview Section',
      type: 'object',
      group: 'faq',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'faqs',
          title: 'FAQs to Feature',
          description: 'Leave empty to automatically show all FAQs',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'faq' }] }],
        }),
      ],
    }),

    // Fees & First Appointment — replaces the removed Testimonials section.
    defineField({
      name: 'firstAppointmentBody',
      title: 'What to Expect (First Appointment)',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'access',
    }),
    defineField({
      name: 'feesBody',
      title: 'Fees & Funding',
      description: 'e.g. Medicare EPC, NDIS, HICAPS, private health — link out to the relevant access pages',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'access',
    }),

    defineField({
      name: 'additionalSections',
      title: 'Additional Sections',
      description:
        'Extra flexible content rendered below the fixed home page sections above — any mix of the 18 Page Builder blocks (rich text, galleries, stats, CTAs, testimonials, and more).',
      type: 'pageBuilder',
      group: 'more',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'hero.headline' },
    prepare({ title }) {
      return { title: title || 'Home Page' }
    },
  },
})
