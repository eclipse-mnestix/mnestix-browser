import { Link } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { MessageDescriptorWithId } from 'lib/i18n/localization';

export type ExternalLinkProps = {
    href: string | undefined;
    descriptor: MessageDescriptorWithId;
};

export function ExternalLink({ href, descriptor }: ExternalLinkProps) {
    return (
        <Link
            color="primary.contrastText"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            data-testid="external-link"
        >
            <FormattedMessage {...descriptor} />
        </Link>
    );
}
