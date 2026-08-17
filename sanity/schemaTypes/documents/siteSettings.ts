import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Business Name', type: 'string' }),
    defineField({ name: 'legalName', title: 'Legal Name', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
    defineField({ name: 'phoneDisplay', title: 'Phone (Display)', type: 'string' }),
    defineField({
      name: 'phoneIntl',
      title: 'Phone (International, e.g. +61415595956)',
      type: 'string',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'siteUrl', title: 'Site URL', type: 'url' }),
    defineField({ name: 'hoursDisplay', title: 'Hours (Display Text)', type: 'string' }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'suburb', title: 'Suburb', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'postcode', title: 'Postcode', type: 'string' }),
        defineField({ name: 'country', title: 'Country Code', type: 'string' }),
        defineField({ name: 'countryName', title: 'Country Name', type: 'string' }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'hoursEntry',
          title: 'Hours Entry',
          fields: [
            defineField({ name: 'day', title: 'Day', type: 'string' }),
            defineField({ name: 'open', title: 'Open', type: 'string' }),
            defineField({ name: 'close', title: 'Close', type: 'string' }),
            defineField({ name: 'closed', title: 'Closed', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'day', open: 'open', close: 'close', closed: 'closed' },
            prepare({ title, open, close, closed }) {
              return { title, subtitle: closed ? 'Closed' : `${open || '?'} – ${close || '?'}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'X'],
              },
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      description: 'Sitewide fallback SEO used when a page does not set its own',
      type: 'seo',
    }),
    defineField({
      name: 'ahpraNumber',
      title: 'AHPRA Registration Number',
      description: 'Used in JSON-LD Person/MedicalClinic structured data',
      type: 'string',
    }),
    defineField({
      name: 'geo',
      title: 'Geo Coordinates',
      description: 'Used in JSON-LD structured data for local SEO',
      type: 'object',
      fields: [
        defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
        defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
      ],
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      description: 'Where "Book Now" buttons should link to',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name' },
    prepare({ title }) {
      return { title: title || 'Site Settings' }
    },
  },
})
