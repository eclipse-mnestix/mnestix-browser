/**
 * Returns the breadcrumb links for the catalog.
 * The first letter of each breadcrumb label is capitalized.
 * @param t Translation function
 * @param category Optional: current manufacturer/category
 */
export function getCatalogBreadcrumbs(
    t: (key: string) => string,
    category?: string
): Array<{ label: string; path: string }> {
    function capitalizeFirstLetter(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const links = [
        { label: capitalizeFirstLetter(t('marketplaceTitle')), path: '/marketplace' }
    ];
    if (category) {
        links.push({
            label: capitalizeFirstLetter(category),
            path: `/catalog/${encodeURIComponent(category)}`
        });
    }
    return links;
}
