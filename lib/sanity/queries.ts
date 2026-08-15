import { groq } from 'next-sanity'

// Shared fragment: resolves a navItem's internal reference down to a type +
// slug so the frontend can build hrefs without extra lookups. Supports up to
// 3 levels of nesting, matching what's actually seeded (Services, Areas We
// Serve dropdowns). navItem itself supports unlimited depth in the Studio.
const navItemFields = /* groq */ `
  label,
  linkType,
  externalUrl,
  openInNewTab,
  "internalType": internalRef->_type,
  "internalSlug": internalRef->slug.current
`

const navItemProjection = /* groq */ `
  ${navItemFields},
  children[]{
    ${navItemFields},
    children[]{
      ${navItemFields}
    }
  }
`

// Resolves an internal-link mark's reference down to a type + slug so the
// frontend (see resolveInternalHref in lib/sanity/nav.ts) can build an href
// without an extra lookup. Reused for every rich-text field that supports
// internal linking (the richText block, and the nested body/content arrays
// inside the columns and tabs blocks).
const richTextProjection = /* groq */ `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      "internalType": reference->_type,
      "internalSlug": reference->slug.current
    }
  }
`

// Expands the flexible Page Builder array. Reference-bearing blocks are
// dereferenced here so pages/services/posts/areas can all reuse this fragment.
const pageBuilderProjection = /* groq */ `
  ...,
  _type == "richText" => {
    content[]{ ${richTextProjection} }
  },
  _type == "columns" => {
    heading,
    items[]{ ..., body[]{ ${richTextProjection} } }
  },
  _type == "tabs" => {
    heading,
    items[]{ ..., content[]{ ${richTextProjection} } }
  },
  _type == "testimonialsBlock" => { heading, testimonials[]-> },
  _type == "faqAccordionBlock" => { heading, faqs[]-> },
  _type == "teamGrid" => { heading, members[]-> }
`

const seoFields = /* groq */ `
  metaTitle,
  metaDescription,
  ogImage,
  h1,
  canonicalUrl,
  noIndex
`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name,
  legalName,
  logo,
  favicon,
  phoneDisplay,
  phoneIntl,
  email,
  siteUrl,
  hoursDisplay,
  address,
  hours,
  defaultSeo{ ${seoFields} }
}`

export const mainNavigationQuery = groq`*[_type == "mainNavigation"][0]{
  items[]{
    ${navItemProjection}
  }
}`

export const footerNavigationQuery = groq`*[_type == "footerNavigation"][0]{
  columns[]{
    heading,
    items[]{
      ${navItemProjection}
    }
  },
  bottomText,
  bottomLinks[]{
    ${navItemProjection}
  }
}`

// Resolves one hand-built curated card down to what the frontend needs to
// render it and build its link: the editor's own title/blurb/label/icon,
// plus the linked document's type + slug (never its content — the card's
// text is written for this placement, not pulled from the target page).
const curatedCardProjection = /* groq */ `
  displayTitle,
  displayBlurb,
  linkLabel,
  icon,
  image,
  "refType": reference->_type,
  "refSlug": reference->slug.current,
  "refTitle": reference->name,
  "refSuburb": reference->suburb,
  "refPostTitle": reference->title
`

export const homePageQuery = groq`*[_type == "homePage"][0]{
  hero,
  about,
  conditionsGrid{
    heading,
    subheading,
    cards[]{ ${curatedCardProjection} }
  },
  servicesGrid{
    heading,
    subheading,
    cards[]{ ${curatedCardProjection} }
  },
  suburbsServed{
    heading,
    subheading,
    cards[]{ ${curatedCardProjection} }
  },
  practitionerSection{
    heading,
    member->{ name, slug, jobTitle, credentials, bio, photo }
  },
  faqPreview{
    heading,
    faqs[]->{ question, answer, order } | order(order asc)
  },
  testimonialsSection{
    heading,
    testimonials[]->{ authorName, authorRole, quote, rating, photo, source }
  },
  additionalSections[]{
    ${pageBuilderProjection}
  },
  seo{ ${seoFields} }
}`

export const servicesQuery = groq`*[_type == "service"] | order(order asc){
  name,
  "slug": slug.current,
  summary,
  icon,
  order,
  "parentSlug": parentService->slug.current
}`

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0]{
  name,
  "slug": slug.current,
  summary,
  icon,
  heroImage,
  "parentName": parentService->name,
  "parentSlug": parentService->slug.current,
  answerCapsule,
  body[]{
    ${pageBuilderProjection}
  },
  relatedServices[]->{ name, "slug": slug.current, summary },
  seo{ ${seoFields} }
}`

export const faqsQuery = groq`*[_type == "faq"] | order(order asc){
  question,
  answer,
  order
}`

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(featured desc){
  authorName,
  authorRole,
  quote,
  rating,
  photo,
  source,
  featured
}`

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc){
  name,
  "slug": slug.current,
  jobTitle,
  credentials,
  bio,
  photo,
  isPrimary
}`

export const blogPostsQuery = groq`*[_type == "blogPost"] | order(publishedDate desc){
  title,
  "slug": slug.current,
  excerpt,
  featuredImage,
  publishedDate,
  updatedDate,
  readingTime,
  featured,
  "authorName": author->name,
  "categories": categories[]->{ title, "slug": slug.current }
}`

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  excerpt,
  featuredImage,
  tldr,
  body[]{
    ${pageBuilderProjection}
  },
  sources,
  publishedDate,
  updatedDate,
  readingTime,
  showTableOfContents,
  "author": author->{ name, "slug": slug.current, jobTitle, credentials, photo },
  medicalReviewer{
    "reviewer": reviewer->{ name, jobTitle, credentials },
    reviewedDate
  },
  "categories": categories[]->{ title, "slug": slug.current },
  tags,
  "relatedServices": relatedServices[]->{ name, "slug": slug.current, summary },
  "relatedPosts": relatedPosts[]->{ title, "slug": slug.current, excerpt, featuredImage, publishedDate },
  seo{ ${seoFields} }
}`

export const blogCategoriesQuery = groq`*[_type == "blogCategory"] | order(title asc){
  title,
  "slug": slug.current,
  description
}`

export const serviceAreasQuery = groq`*[_type == "serviceArea"] | order(order asc){
  suburb,
  "slug": slug.current,
  region,
  postcode,
  summary,
  heroImage,
  distanceFromClinic
}`

export const serviceAreaBySlugQuery = groq`*[_type == "serviceArea" && slug.current == $slug][0]{
  suburb,
  "slug": slug.current,
  region,
  postcode,
  summary,
  heroImage,
  distanceFromClinic,
  "featuredServices": featuredServices[]->{ name, "slug": slug.current, summary },
  answerCapsule,
  body[]{
    ${pageBuilderProjection}
  },
  seo{ ${seoFields} }
}`

export const areasHubQuery = groq`*[_type == "areasHub"][0]{
  heading,
  intro,
  "featuredAreas": featuredAreas[]->{ suburb, "slug": slug.current, summary, heroImage, distanceFromClinic },
  additionalSections[]{
    ${pageBuilderProjection}
  },
  seo{ ${seoFields} }
}`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  template,
  heroImage,
  answerCapsule,
  body[]{
    ${pageBuilderProjection}
  },
  seo{ ${seoFields} }
}`

export const notFoundPageQuery = groq`*[_type == "notFoundPage"][0]{
  heading,
  body,
  buttonLabel,
  buttonUrl,
  suggestedLinks[]{
    ${navItemProjection}
  }
}`

export const redirectBySourceQuery = groq`*[_type == "redirect" && source == $source][0]{
  source,
  destination,
  permanent
}`

export const allSlugsQuery = groq`{
  "services": *[_type == "service" && defined(slug.current)].slug.current,
  "posts": *[_type == "blogPost" && defined(slug.current)].slug.current,
  "areas": *[_type == "serviceArea" && defined(slug.current)].slug.current,
  "pages": *[_type == "page" && defined(slug.current)].slug.current
}`
