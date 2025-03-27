import { Box, Typography } from '@mui/material';
import { AddressPerLifeCyclePhase } from './ProductJourney';

export function ProductJourneyAddressList(props: { addressesPerLifeCyclePhase: AddressPerLifeCyclePhase[] }) {
    const rowsAdressesList = props.addressesPerLifeCyclePhase
        .filter((v) => v.address.street && v.address.houseNumber && v.address.zipCode && v.address.cityTown)
        .map((phase, index) => {
            return (
                <Typography data-testid="test-address-list" key={index} variant="body1" sx={{ color: 'primary.main' }}>
                    <Typography key={index} sx={{ color: 'inherit', fontWeight: 600 }} component="span">
                        {`${phase.lifeCyclePhase}:`}{' '}
                    </Typography>
                    {`${phase.address.street} ${phase.address.houseNumber}, ${phase.address.zipCode} ${
                        phase.address.cityTown
                    }${phase.address.country ? `, ${phase.address.country}` : ''}`}
                </Typography>
            );
        });

    return <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column' }}>{rowsAdressesList}</Box>;
}
