import { defineField, defineType } from 'sanity'

// A single diagnosable foot/ankle condition (e.g. "Plantar Fasciitis"),
// living at /conditions/[slug]. `category` is a required SINGLE reference —
// every condition has exactly one home in the site hierarchy, which is what
// keeps this page's search intent distinct from its siblings and prevents
// two pages from competing for the same query (cannibalization). `alsoListIn`
// lets it additionally be *listed* under a second category's grid without
// creating a duplicate page or changing its one true home/URL.
//
// `relatedTreatments` is the ONLY place this relationship is stored — the
// matching Treatment document does NOT store a back-reference to its
// conditions. The Treatment's "Conditions this treats" list is entirely
// derived at query time via a reverse GROQ lookup
// (*[_type=="treatment" && references(^._id)]), so there is a single
// source of truth and no risk of the two sides drifting out of sync.
export const condition = defineType({
  name: 'condition',
  title: 'Condition',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'linking', title: 'Category & Linking' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Path: /conditions/[slug]',
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
      name: 'answerCapsule',
      title: 'Answer Capsule',
      description:
        'A short, self-contained direct answer (40–60 words) placed at the top of the page for AI answer engines (ChatGPT, Perplexity, AI Overviews) to quote directly. Also used as the listing blurb on the Conditions hub page.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(500).warning('Aim for 40–60 words'),
    }),
    defineField({
      name: 'homepageBlurb',
      title: 'Home Page Blurb Override',
      description:
        'Optional — a different, shorter blurb used only when this condition is featured on the home page. Leave blank to reuse the Answer Capsule there instead.',
      type: 'text',
      rows: 2,
      group: 'content',
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
      name: 'category',
      title: 'Category',
      description: 'This condition\'s one true home in the site hierarchy',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'linking',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alsoListIn',
      title: 'Also List In',
      description:
        'Optional — additionally list this condition under these categories\' grids, without changing its main category or URL.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'linking',
    }),
    defineField({
      name: 'relatedTreatments',
      title: 'Related Treatments',
      description:
        'Treatments that help this condition. This is the single source of truth for the Condition ↔ Treatment relationship — the matching Treatment page automatically lists this condition back, derived from this field.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
      group: 'linking',
    }),
    defineField({
      name: 'relatedConditions',
      title: 'Related Conditions',
      description: 'Other conditions to cross-link from this page',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'condition' }] }],
      group: 'linking',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'content',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ name: 'title', title: 'Title', by: [{ field: 'title', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'heroImage' },
  },
})
