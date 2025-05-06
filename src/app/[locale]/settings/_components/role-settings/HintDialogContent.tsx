import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslations } from 'next-intl';
import { useEnv } from 'app/EnvProvider';
import { ArrowRightAlt } from '@mui/icons-material';

export function KeycloakHint({ onClose, hint }: { onClose: () => void; hint: 'create' | 'delete' }) {
    const t = useTranslations('pages.settings.rules.keycloakHint');
    const envs = useEnv();

    const keycloakUrl = new URL(`/admin/master/console/#/${envs.KEYCLOAK_REALM}/roles`, envs.KEYCLOAK_ISSUER);

    return (
        <>
            <DialogContent>
                <Typography variant="h2" color="primary" sx={{ mb: '1rem' }}>
                    {t('title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: '0.5rem' }}>
                    {t(hint)}
                </Typography>
                <Button
                    startIcon={<ArrowRightAlt />}
                    href={keycloakUrl.toString()}
                    variant="contained"
                    target="_blank"
                    color="primary"
                    data-testid="role-hint-keycloak"
                >
                    Keycloak
                </Button>
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<CheckIcon />}
                    variant="contained"
                    onClick={onClose}
                    data-testid="role-hint-acknowledge"
                >
                    {t('acknowledge')}
                </Button>
            </DialogActions>
        </>
    );
}
