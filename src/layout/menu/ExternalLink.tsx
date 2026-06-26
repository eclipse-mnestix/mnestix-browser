import { Link } from '@mui/material';

export type ExternalLinkProps = {
    href: string | undefined;
    descriptor: string;
};

export function ExternalLink({ href, descriptor }: ExternalLinkProps) {
    return (
        <Link
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            data-testid="external-link"
            sx={{
                color: 'primary.contrastText'
            }}
        >
            {descriptor}
        </Link>
    );
}
