import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'conditions', title: 'Conditions We Treat' },
    { name: 'services', title: 'Services' },
    { name: 'suburbs', title: 'Suburbs Served' },
    { name: 'practitioner', title: 'Practitioner' },
    { name: 'faq', title: 'FAQ Preview' },
    { name: 'testimonials', title: 'Testimonials' },
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

    // Conditions We Treat — fully manual. Nothing here is auto-populated;
    // every card is hand-added, hand-written, and hand-ordered in the Studio.
    defineField({
      name: 'conditionsGrid',
      title: 'Conditions We Treat Section',
      type: 'object',
      group: 'conditions',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({
          name: 'cards',
          title: 'Cards',
          description:
            'Add, remove, and reorder cards freely. Each card links to a real Service page but has its own hand-written title, blurb, and link text.',
          type: 'array',
          of: [{ type: 'curatedCard' }],
        }),
      ],
    }),

    // Services — fully manual, same mechanism as Conditions above.
    defineField({
      name: 'servicesGrid',
      title: 'Services Section',
      type: 'object',
      group: 'services',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({
          name: 'cards',
          title: 'Cards',
          description:
            'Add, remove, and reorder cards freely. Each card links to a real Service page but has its own hand-written title, blurb, and link text.',
          type: 'array',
          of: [{ type: 'curatedCard' }],
        }),
      ],
    }),

    // Suburbs Served — fully manual, same mechanism, for internal linking to
    // Service Area pages.
    defineField({
      name: 'suburbsServed',
      title: 'Suburbs Served Section',
      type: 'object',
      group: 'suburbs',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
        defineField({
          name: 'cards',
          title: 'Cards',
          description:
            'Add, remove, and reorder cards freely. Each card links to a real Service Area page but has its own hand-written title, blurb, and link text.',
          type: 'array',
          of: [{ type: 'curatedCard' }],
        }),
      ],
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
          name: 'member',
          title: 'Team Member',
          type: 'reference',
          to: [{ type: 'teamMember' }],
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

    // Testimonials
    defineField({
      name: 'testimonialsSection',
      title: 'Testimonials Section',
      type: 'object',
      group: 'testimonials',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'testimonials',
          title: 'Testimonials to Feature',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
        }),
      ],
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
