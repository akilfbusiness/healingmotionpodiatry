import { CategorySection } from '@/components/category-section'
import { getHomePageCategorySections } from '@/lib/sanity/data'

// Fetches every category (in orderRank order) and renders one CategorySection
// each — the home page's primary listing mechanism for the Core 30
// architecture. See homePageCategorySectionsQuery for how featured vs.
// remaining items are derived.
export async function CategorySections() {
  const categories = await getHomePageCategorySections()

  if (categories.length === 0) return null

  return (
    <>
      {categories.map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}
    </>
  )
}
