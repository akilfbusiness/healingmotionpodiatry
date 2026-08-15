import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import Script from 'next/script'
import { getSiteSettings } from '@/lib/sanity/data'
import './globals.css'

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-4F4S44BBW0'
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'xzip0uabkk'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

// Hardcoded fallbacks — only used if Sanity has no siteSettings.defaultSeo
// value set yet (e.g. very first load, before the Studio doc is filled in).
// Once "Default SEO" is set in /studio > Site Configuration > Site Settings,
// those values take over here automatically.
const FALLBACK_TITLE =
  'BEST Podiatrist in Melbourne | Expert Family, Sports and Custom Orthotics Podiatry in Roxburgh Park Melbourne | Healing Motion Podiatry'
const FALLBACK_DESCRIPTION =
  'Expert Family, Sports, Custom Orthotics & Heel Pain Podiatry in Roxburgh Park Melbourne — specialise in ingrown toenails, diabetic foot care, orthotics, sports injuries, and general foot health. Shop 25E/250 Somerton Rd, Roxburgh Park VIC 3064 or Call 0415 595 956'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings.defaultSeo?.metaTitle || FALLBACK_TITLE
  const description = settings.defaultSeo?.metaDescription || FALLBACK_DESCRIPTION

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description,
    generator: 'v0.app',
    keywords: [
      'podiatrist Roxburgh Park',
      'podiatry clinic Melbourne',
      'ingrown toenail treatment',
      'diabetic foot care',
      'custom orthotics',
      'heel pain treatment',
      'Husein Alzurifi podiatrist',
    ],
    authors: [{ name: settings.name }],
    alternates: {
      canonical: '/',
    },
    robots: settings.defaultSeo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: settings.siteUrl,
      siteName: settings.name,
      title,
      description,
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}');
              `}
            </Script>
            <Script id="clarity-init" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
