import type { SanityImageSource } from '@sanity/image-url'
import type { PortableTextBlock } from '@portabletext/react'
import { business as fallbackBusiness } from '@/lib/business-data'
import { sanityFetch } from './client'
import {
  allSlugsQuery,
  areasHubQuery,
  blogCategoriesQuery,
  blogPostBySlugQuery,
  blogPostsQuery,
  categoriesQuery,
  categoryBySlugQuery,
  conditionBySlugQuery,
  conditionsHubListQuery,
  conditionsQuery,
  faqsQuery,
  footerNavigationQuery,
  homePageCategorySectionsQuery,
  homePageQuery,
  hubPageQuery,
  mainNavigationQuery,
  notFoundPageQuery,
  pageBySlugQuery,
  redirectBySourceQuery,
  serviceAreaBySlugQuery,
  serviceAreasQuery,
  serviceBySlugQuery,
  servicesQuery,
  siteSettingsQuery,
  teamMembersQuery,
  testimonialsQuery,
  treatmentBySlugQuery,
  treatmentsHubListQuery,
  treatmentsQuery,
} from './queries'
import type { ResolvedNavItem } from './nav'

// A single flexible Page Builder block. Each block carries its own `_type`
// and whatever fields that block type defines — see lib/sanity/page-builder.tsx
// for the renderer that switches on `_type`.
export type PageBuilderBlock = { _type: string; _key: string } & Record<string, unknown>

export type Seo = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageSource
  h1?: string
  canonicalUrl?: string
  noIndex?: boolean
}

export type HoursEntry = {
  day: string
  open?: string
  close?: string
  closed?: boolean
}

export type SiteSettings = {
  name: string
  legalName?: string
  logo?: SanityImageSource
  favicon?: SanityImageSource
  phoneDisplay: string
  phoneIntl: string
  email: string
  siteUrl: string
  hoursDisplay: string
  address: {
    street: string
    suburb: string
    state: string
    postcode: string
    country: string
    countryName: string
  }
  hours: HoursEntry[]
  defaultSeo?: Seo
}

// --- Core 30: Category / Condition / Treatment -----------------------------
//
// AnswerCard is the shared shape used for every condition/treatment listing
// context (category grids, hub page listings, home page sections, related
// items) — see answerCardFields in lib/sanity/queries.ts.
export type AnswerCard = {
  title: string
  slug: string
  answerCapsule?: string
  homepageBlurb?: string
  heroImage?: SanityImageSource
}

export type Category = {
  title: string
  slug: string
  intro?: string
  heroImage?: SanityImageSource
  orderRank?: number
}

export type CategoryDetail = Omit<Category, 'orderRank'> & {
  h1?: string
  body?: PageBuilderBlock[]
  conditions: AnswerCard[]
  treatments: AnswerCard[]
  faqs?: Faq[]
  seo?: Seo
}

export type Condition = {
  title: string
  slug: string
  answerCapsule?: string
  heroImage?: SanityImageSource
  categorySlug?: string
  categoryTitle?: string
}

export type ConditionDetail = Omit<Condition, 'categorySlug' | 'categoryTitle'> & {
  h1?: string
  body?: PageBuilderBlock[]
  category?: { title: string; slug: string }
  alsoListIn?: { title: string; slug: string }[]
  relatedTreatments?: AnswerCard[]
  relatedConditions?: AnswerCard[]
  faqs?: Faq[]
  seo?: Seo
}

export type Treatment = {
  title: string
  slug: string
  answerCapsule?: string
  heroImage?: SanityImageSource
  categorySlug?: string
  categoryTitle?: string
}

export type TreatmentDetail = Omit<Treatment, 'categorySlug' | 'categoryTitle'> & {
  h1?: string
  body?: PageBuilderBlock[]
  category?: { title: string; slug: string }
  alsoListIn?: { title: string; slug: string }[]
  // Derived via reverse lookup from condition.relatedTreatments — see
  // treatmentBySlugQuery. Not stored on the treatment document itself.
  relatedConditions?: AnswerCard[]
  faqs?: Faq[]
  seo?: Seo
}

export type HubPage = {
  title?: string
  h1?: string
  intro?: string
  seo?: Seo
}

export type HubGroup = {
  title: string
  slug: string
  items: AnswerCard[]
}

// One category's home page section: hand-featured items first, then every
// remaining published condition/treatment in that category — see
// homePageCategorySectionsQuery. This guarantees full listing completeness
// without relying on anyone remembering to feature every item.
export type HomePageCategorySection = {
  title: string
  slug: string
  featured: (AnswerCard & { type: 'condition' | 'treatment' })[]
  remainingConditions: AnswerCard[]
  remainingTreatments: AnswerCard[]
}

export type Service = {
  name: string
  slug: string
  summary?: string
  icon?: string
  order?: number
  parentSlug?: string | null
}

export type ServiceDetail = Service & {
  heroImage?: SanityImageSource
  parentName?: string | null
  answerCapsule?: string
  body?: PageBuilderBlock[]
  relatedServices?: Service[]
  seo?: Seo
}

export type Faq = {
  question: string
  answer: string
  order?: number
}

export type Testimonial = {
  authorName: string
  authorRole?: string
  quote: string
  rating?: number
  photo?: SanityImageSource
  source?: string
  featured?: boolean
}

export type TeamMember = {
  name: string
  slug?: { current: string }
  jobTitle?: string
  credentials?: string
  bio?: PortableTextBlock[]
  photo?: SanityImageSource
  isPrimary?: boolean
}

// A hand-built curated card, as resolved for the frontend: the editor's own
// title/blurb/link label/icon/image, plus the type + slug needed to build a
// link to the real page it references. See curatedCardProjection in
// lib/sanity/queries.ts for how `refType`/`refSlug`/etc. are derived.
export type Practitioner = {
  name: string
  title?: string
  credentials?: string
  bio?: string
  photo?: SanityImageSource
  ahpraNumber?: string
  specialInterests?: string[]
  languagesSpoken?: string[]
}

// The home page is now mostly an engine, not a manual curation surface —
// see homePage.ts. Category/condition/treatment sections are derived at
// query time via homePageCategorySectionsQuery, not stored on this document.
export type HomePage = {
  hero: {
    badge?: string
    headline: string
    subheading?: string
    image?: SanityImageSource
    imageAlt?: string
    primaryButtonLabel?: string
    primaryButtonUrl?: string
    secondaryButtonLabel?: string
    secondaryButtonUrl?: string
  }
  about: {
    heading: string
    body?: PortableTextBlock[]
    image?: SanityImageSource
    imageAlt?: string
    points?: { title?: string; description?: string }[]
  }
  quickLinks?: AnswerCard[]
  trustLogos?: (SanityImageSource & { alt?: string })[]
  practitionerSection: {
    heading?: string
    practitioner?: Practitioner
  }
  faqPreview: {
    heading?: string
    faqs?: Faq[]
  }
  firstAppointmentBody?: PortableTextBlock[]
  feesBody?: PortableTextBlock[]
  additionalSections?: PageBuilderBlock[]
  seo?: Seo
}

export type BlogPostSummary = {
  title: string
  slug: string
  excerpt?: string
  featuredImage?: SanityImageSource
  publishedDate: string
  updatedDate?: string
  readingTime?: number
  featured?: boolean
  authorName?: string
  categories?: { title: string; slug: string }[]
}

export type BlogPostDetail = BlogPostSummary & {
  tldr?: PortableTextBlock[]
  body?: PageBuilderBlock[]
  sources?: { label: string; url: string }[]
  updatedDate?: string
  showTableOfContents?: boolean
  author?: TeamMember
  medicalReviewer?: { reviewer?: TeamMember; reviewedDate?: string }
  tags?: string[]
  relatedServices?: Service[]
  relatedPosts?: BlogPostSummary[]
  seo?: Seo
}

export type BlogCategory = {
  title: string
  slug: string
  description?: string
}

export type ServiceArea = {
  suburb: string
  slug: string
  region?: string
  postcode?: string
  summary?: string
  heroImage?: SanityImageSource
  distanceFromClinic?: string
}

export type ServiceAreaDetail = ServiceArea & {
  featuredServices?: Service[]
  answerCapsule?: string
  body?: PageBuilderBlock[]
  seo?: Seo
}

export type AreasHub = {
  heading?: string
  intro?: PortableTextBlock[]
  featuredAreas?: ServiceArea[]
  additionalSections?: PageBuilderBlock[]
  seo?: Seo
}

export type PageDoc = {
  title: string
  slug: string
  template?: 'standard' | 'landing'
  heroImage?: SanityImageSource
  answerCapsule?: string
  body?: PageBuilderBlock[]
  seo?: Seo
}

export type NotFoundPageData = {
  heading?: string
  body?: string
  buttonLabel?: string
  buttonUrl?: string
  suggestedLinks?: ResolvedNavItem[]
}

export type MainNavigation = {
  items: ResolvedNavItem[]
}

export type FooterNavigation = {
  columns: { heading?: string; items: ResolvedNavItem[] }[]
  bottomText?: string
  bottomLinks: ResolvedNavItem[]
}

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  name: fallbackBusiness.name,
  legalName: fallbackBusiness.legalName,
  phoneDisplay: fallbackBusiness.phoneDisplay,
  phoneIntl: fallbackBusiness.phoneIntl,
  email: fallbackBusiness.email,
  siteUrl: fallbackBusiness.siteUrl,
  hoursDisplay: fallbackBusiness.hoursDisplay,
  address: fallbackBusiness.address,
  hours: fallbackBusiness.hours.map((h) => ({ ...h, closed: false })),
}

export function getFullAddress(address: SiteSettings['address']) {
  return `${address.street}, ${address.suburb} ${address.state} ${address.postcode}`
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings | null>(siteSettingsQuery)
  return data ?? FALLBACK_SITE_SETTINGS
}

export async function getMainNavigation(): Promise<MainNavigation> {
  const data = await sanityFetch<MainNavigation | null>(mainNavigationQuery)
  return data ?? { items: [] }
}

export async function getFooterNavigation(): Promise<FooterNavigation> {
  const data = await sanityFetch<FooterNavigation | null>(footerNavigationQuery)
  return data ?? { columns: [], bottomLinks: [] }
}

export async function getHomePage(): Promise<HomePage | null> {
  return sanityFetch<HomePage | null>(homePageQuery)
}

// --- Core 30: Category / Condition / Treatment -----------------------------

export async function getCategories(): Promise<Category[]> {
  return sanityFetch<Category[]>(categoriesQuery)
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  return sanityFetch<CategoryDetail | null>(categoryBySlugQuery, { slug })
}

export async function getConditions(): Promise<Condition[]> {
  return sanityFetch<Condition[]>(conditionsQuery)
}

export async function getConditionBySlug(slug: string): Promise<ConditionDetail | null> {
  return sanityFetch<ConditionDetail | null>(conditionBySlugQuery, { slug })
}

export async function getTreatments(): Promise<Treatment[]> {
  return sanityFetch<Treatment[]>(treatmentsQuery)
}

export async function getTreatmentBySlug(slug: string): Promise<TreatmentDetail | null> {
  return sanityFetch<TreatmentDetail | null>(treatmentBySlugQuery, { slug })
}

export async function getConditionsHubPage(): Promise<HubPage | null> {
  return sanityFetch<HubPage | null>(hubPageQuery, { hubType: 'conditions' })
}

export async function getTreatmentsHubPage(): Promise<HubPage | null> {
  return sanityFetch<HubPage | null>(hubPageQuery, { hubType: 'treatments' })
}

export async function getConditionsHubList(): Promise<HubGroup[]> {
  return sanityFetch<HubGroup[]>(conditionsHubListQuery)
}

export async function getTreatmentsHubList(): Promise<HubGroup[]> {
  return sanityFetch<HubGroup[]>(treatmentsHubListQuery)
}

export async function getHomePageCategorySections(): Promise<HomePageCategorySection[]> {
  return sanityFetch<HomePageCategorySection[]>(homePageCategorySectionsQuery)
}

export async function getServices(): Promise<Service[]> {
  return sanityFetch<Service[]>(servicesQuery)
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  return sanityFetch<ServiceDetail | null>(serviceBySlugQuery, { slug })
}

export async function getFaqs(): Promise<Faq[]> {
  return sanityFetch<Faq[]>(faqsQuery)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return sanityFetch<Testimonial[]>(testimonialsQuery)
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>(teamMembersQuery)
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return sanityFetch<BlogPostSummary[]>(blogPostsQuery)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  return sanityFetch<BlogPostDetail | null>(blogPostBySlugQuery, { slug })
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return sanityFetch<BlogCategory[]>(blogCategoriesQuery)
}

export async function getServiceAreas(): Promise<ServiceArea[]> {
  return sanityFetch<ServiceArea[]>(serviceAreasQuery)
}

export async function getServiceAreaBySlug(slug: string): Promise<ServiceAreaDetail | null> {
  return sanityFetch<ServiceAreaDetail | null>(serviceAreaBySlugQuery, { slug })
}

export async function getAreasHub(): Promise<AreasHub | null> {
  return sanityFetch<AreasHub | null>(areasHubQuery)
}

export async function getPageBySlug(slug: string): Promise<PageDoc | null> {
  return sanityFetch<PageDoc | null>(pageBySlugQuery, { slug })
}

export async function getNotFoundPage(): Promise<NotFoundPageData | null> {
  return sanityFetch<NotFoundPageData | null>(notFoundPageQuery)
}

export async function getRedirectBySource(
  source: string,
): Promise<{ source: string; destination: string; permanent?: boolean } | null> {
  return sanityFetch(redirectBySourceQuery, { source })
}

export async function getAllSlugs(): Promise<{
  services: string[]
  posts: string[]
  areas: string[]
  pages: string[]
  categories: string[]
  conditions: string[]
  treatments: string[]
}> {
  return sanityFetch(allSlugsQuery)
}
