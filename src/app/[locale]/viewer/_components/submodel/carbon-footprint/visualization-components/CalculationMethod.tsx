import { Link, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const LinkGHG = 'https://ghgprotocol.org/';

export function CalculationMethod(props: { calculationMethod: string }) {
    const { calculationMethod } = props;

    return (
        <Typography sx={{ color: 'primary.main', fontSize: 24, fontWeight: 'bold' }} data-testid="calculation-method">
            {calculationMethod}{' '}
            {calculationMethod === 'GHG Protocol' && (
                <Link href={LinkGHG} target="_blank" data-testid="calculation-method-link">
                    <OpenInNewIcon fontSize="small" />
                </Link>
            )}
        </Typography>
    );
}
