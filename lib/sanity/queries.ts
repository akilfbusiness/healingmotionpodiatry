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

// Shared listing shape for Category/Condition/Treatment answer cards (hub
// pages, home page sections, category grids, related items). See
// AnswerCard in lib/sanity/data.ts for the matching frontend type.
const answerCardFields = /* groq */ `
  title,
  "slug": slug.current,
  answerCapsule,
  homepageBlurb,
  heroImage
`

export const homePageQuery = groq`*[_type == "homePage"][0]{
  hero,
  about,
  "quickLinks": quickLinks[]->{ ${answerCardFields} },
  trustLogos,
  practitionerSection{
    heading,
    practitioner->{ name, title, credentials, bio, photo, ahpraNumber, specialInterests, languagesSpoken }
  },
  faqPreview{
    heading,
    "faqs": select(
      count(faqs) > 0 => faqs[]->{ question, answer, order } | order(order asc),
      *[_type == "faq"] | order(order asc){ question, answer, order }
    )
  },
  firstAppointmentBody,
  feesBody,
  additionalSections[]{
    ${pageBuilderProjection}
  },
  seo{ ${seoFields} }
}`

// --- Core 30: Category / Condition / Treatment -----------------------------
//
// Category sits above Condition and Treatment. Every condition/treatment has
// exactly one required `category` reference (its one true home in the site
// hierarchy — see condition.ts/treatment.ts for why this matters for SEO).
// The Condition <-> Treatment relationship is stored ONLY on
// condition.relatedTreatments; a Treatment's "conditions this treats" list
// is always derived via the reverse `references()` lookup below, so there is
// a single source of truth and the two sides cannot drift out of sync.

export const categoriesQuery = groq`*[_type == "category"] | order(orderRank asc){
  title,
  "slug": slug.current,
  intro,
  heroImage,
  orderRank
}`

export const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  h1,
  intro,
  heroImage,
  body[]{ ${pageBuilderProjection} },
  "conditions": *[_type == "condition" && (category._ref == ^._id || ^._id in alsoListIn[]._ref)]{ ${answerCardFields} },
  "treatments": *[_type == "treatment" && (category._ref == ^._id || ^._id in alsoListIn[]._ref)]{ ${answerCardFields} },
  "faqs": faqs[]->{ question, answer, order } | order(order asc),
  seo{ ${seoFields} }
}`

export const conditionsQuery = groq`*[_type == "condition"] | order(title asc){
  title,
  "slug": slug.current,
  answerCapsule,
  heroImage,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title
}`

export const conditionBySlugQuery = groq`*[_type == "condition" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  h1,
  answerCapsule,
  heroImage,
  body[]{ ${pageBuilderProjection} },
  "category": category->{ title, "slug": slug.current },
  "alsoListIn": alsoListIn[]->{ title, "slug": slug.current },
  "relatedTreatments": relatedTreatments[]->{ ${answerCardFields} },
  "relatedConditions": relatedConditions[]->{ ${answerCardFields} },
  "faqs": faqs[]->{ question, answer, order } | order(order asc),
  seo{ ${seoFields} }
}`

export const treatmentsQuery = groq`*[_type == "treatment"] | order(title asc){
  title,
  "slug": slug.current,
  answerCapsule,
  heroImage,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title
}`

export const treatmentBySlugQuery = groq`*[_type == "treatment" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  h1,
  answerCapsule,
  heroImage,
  body[]{ ${pageBuilderProjection} },
  "category": category->{ title, "slug": slug.current },
  "alsoListIn": alsoListIn[]->{ title, "slug": slug.current },
  "relatedConditions": *[_type == "condition" && references(^._id)]{ ${answerCardFields} },
  "faqs": faqs[]->{ question, answer, order } | order(order asc),
  seo{ ${seoFields} }
}`

export const hubPageQuery = groq`*[_type == "hubPage" && hubType == $hubType][0]{
  title,
  h1,
  intro,
  seo{ ${seoFields} }
}`

// Full grouped listing for the Conditions Hub (/conditions): every category
// that has at least one published condition, each with its full list of
// conditions (Answer Capsule used as the listing blurb).
export const conditionsHubListQuery = groq`*[_type == "category"] | order(orderRank asc){
  title,
  "slug": slug.current,
  "items": *[_type == "condition" && (category._ref == ^._id || ^._id in alsoListIn[]._ref)] | order(title asc){ ${answerCardFields} }
}[count(items) > 0]`

// Same shape, for the Treatments Hub (/treatments).
export const treatmentsHubListQuery = groq`*[_type == "category"] | order(orderRank asc){
  title,
  "slug": slug.current,
  "items": *[_type == "treatment" && (category._ref == ^._id || ^._id in alsoListIn[]._ref)] | order(title asc){ ${answerCardFields} }
}[count(items) > 0]`

// Drives the home page's category sections. For each category (in
// orderRank order): the hand-picked `featuredOnHome` items first, then every
// other published condition/treatment in that category, so nothing can be
// silently left off the home page just because it wasn't hand-featured.
export const homePageCategorySectionsQuery = groq`*[_type == "category"] | order(orderRank asc){
  title,
  "slug": slug.current,
  "featured": featuredOnHome[]->{
    ${answerCardFields},
    "type": _type
  },
  "remainingConditions": *[
    _type == "condition" &&
    category._ref == ^._id &&
    !(_id in ^.featuredOnHome[]._ref)
  ] | order(title asc){ ${answerCardFields} },
  "remainingTreatments": *[
    _type == "treatment" &&
    category._ref == ^._id &&
    !(_id in ^.featuredOnHome[]._ref)
  ] | order(title asc){ ${answerCardFields} }
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
  "pages": *[_type == "page" && defined(slug.current)].slug.current,
  "categories": *[_type == "category" && defined(slug.current)].slug.current,
  "conditions": *[_type == "condition" && defined(slug.current)].slug.current,
  "treatments": *[_type == "treatment" && defined(slug.current)].slug.current
}`
