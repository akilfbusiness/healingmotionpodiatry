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
  faqsQuery,
  footerNavigationQuery,
  homePageQuery,
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
export type CuratedCard = {
  displayTitle?: string
  displayBlurb: string
  linkLabel?: string
  icon?: string
  image?: SanityImageSource & { alt?: string }
  refType?: 'service' | 'serviceArea' | 'blogPost' | 'page'
  refSlug?: string
  refTitle?: string
  refSuburb?: string
  refPostTitle?: string
}

export type CuratedSection = {
  heading?: string
  subheading?: string
  cards?: CuratedCard[]
}

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
  conditionsGrid: CuratedSection
  servicesGrid: CuratedSection
  suburbsServed: CuratedSection
  practitionerSection: {
    heading?: string
    member?: TeamMember
  }
  faqPreview: {
    heading?: string
    faqs?: Faq[]
  }
  testimonialsSection: {
    heading?: string
    testimonials?: Testimonial[]
  }
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
}> {
  return sanityFetch(allSlugsQuery)
}
