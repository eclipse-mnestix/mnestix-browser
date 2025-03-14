export function getSanitizedHref(link: string | undefined | null): string {
    if (!link) {
        return '';
    }
    let sanitizedLink = link;
    if (!sanitizedLink.startsWith('http') && !sanitizedLink.startsWith('//')) {
        sanitizedLink = '//' + link;
    }
    return sanitizedLink;
}

export function getTelHref(tel: string | undefined | null): string {
    if (!tel) {
        return '';
    }
    // Remove everything but digits and '+'
    const sanitizedTel = tel.replace(/[^+\d]/g, '');
    return 'tel:' + sanitizedTel;
}

export function getMailToHref(email: string | undefined | null): string {
    if (!email) {
        return '';
    }
    return 'mailto:' + email;
}
