import { BreadcrumbLink } from 'components/basics/Breadcrumbs';

/**
 * Returns the breadcrumb links for the catalog.
 * The first letter of each breadcrumb label is capitalized.
 * @param t Translation function
 * @param manufacturer Optional: current manufacturer
 * @param repositoryUrl Optional: current repository URL
 */
export function getCatalogBreadcrumbs(
    t: (key: string) => string,
    manufacturer?: string | null,
    repositoryUrl?: string | null
): BreadcrumbLink[] {
    function capitalizeFirstLetter(text: string): string {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    const links: BreadcrumbLink[] = [];
    if (manufacturer) {
        links.push({
            label: capitalizeFirstLetter(manufacturer),
            path: `/marketplace/catalog?manufacturer=${encodeURIComponent(manufacturer)}`
        });
    } else if (repositoryUrl) {
        links.push({
            label: capitalizeFirstLetter(repositoryUrl),
            path: `/marketplace/catalog?repoUrl=${encodeURIComponent(repositoryUrl)}`
        });
    }
    return links;
}

