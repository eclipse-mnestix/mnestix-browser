/**
 * Type definition for external links configured via environment variables
 */
export interface ExternalLink {
    /**
     * Display label for the link.
     * Can be either a string or an object with language-specific labels.
     */
    label: string | Record<string, string>;
    /**
     * URL to navigate to
     */
    url: string;
    /**
     * Optional icon - can be a Material-UI icon name or a base64 encoded image
     */
    icon?: string;
    /**
     * Optional target attribute (e.g., '_blank')
     */
    target?: string;
}
