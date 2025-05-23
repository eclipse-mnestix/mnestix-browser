/**
 * Returns the breadcrumb links for the catalog.
 * The first letter of each breadcrumb label is capitalized.
 * @param t Translation function
 * @param manufacturer Optional: current manufacturer
 */
export function getCatalogBreadcrumbs(
    t: (key: string) => string,
    manufacturer?: string
): Array<{ label: string; path: string }> {
    function capitalizeFirstLetter(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const links = [
        { label: capitalizeFirstLetter(t('marketplaceTitle')), path: '/marketplace' }
    ];
    if (manufacturer) {
        links.push({
            label: capitalizeFirstLetter(manufacturer),
            path: `/marketplace/catalog?manufacturer=${encodeURIComponent(manufacturer)}`
        });
    }
    return links;
}
