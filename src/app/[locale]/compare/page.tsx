'use client';

// import { CompareAasContextProvider } from 'components/contexts/CompareAasContext';
// import { Box } from '@mui/material';
// import { CompareView } from './_components/CompareView';

/**
 * Comparison View
 * The initial Aas to compare are expected to be provided through query parameter within the route
 * e.g. Having two initial aas: /compare?aasId=1361235-97c3-477b-acb2-ff6123123&aasId=13123123213123123123
 * @constructor
 */
export default function page() {
    // const pageStyles = {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: '30px',
    //     width: '100%',
    //     marginBottom: '50px',
    //     marginTop: '20px',
    // };
    // return (
    //     <CompareAasContextProvider>
    //         <Box sx={pageStyles}>
    //             <CompareView></CompareView>
    //         </Box>
    //     </CompareAasContextProvider>
    // );

    // Disables the comparison feature for now as it is broken
    // TODO MNE-299: Make Comparison Feature work again
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return <h3>Comparison Feature currently not available...</h3>;
}
