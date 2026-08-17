import { defineField, defineType } from 'sanity'

// A single treatment/service offering (e.g. "Custom Orthotics"), living at
// /treatments/[slug]. Deliberately has NO "conditions this treats" reference
// field — that relationship is owned entirely by condition.relatedTreatments
// and derived here at query time via a reverse GROQ lookup
// (*[_type=="condition" && references(^._id)]). Storing it on both sides
// would create two sources of truth that can silently drift; this way there
// is exactly one place an editor curates the relationship.
export const treatment = defineType({
  name: 'treatment',
  title: 'Treatment',
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
      description: 'Path: /treatments/[slug]',
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
        'A short, self-contained direct answer (40–60 words) placed at the top of the page for AI answer engines (ChatGPT, Perplexity, AI Overviews) to quote directly. Also used as the listing blurb on the Treatments hub page.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.max(500).warning('Aim for 40–60 words'),
    }),
    defineField({
      name: 'homepageBlurb',
      title: 'Home Page Blurb Override',
      description:
        'Optional — a different, shorter blurb used only when this treatment is featured on the home page. Leave blank to reuse the Answer Capsule there instead.',
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
      description: 'This treatment\'s one true home in the site hierarchy',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'linking',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alsoListIn',
      title: 'Also List In',
      description:
        'Optional — additionally list this treatment under these categories\' grids, without changing its main category or URL.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
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
