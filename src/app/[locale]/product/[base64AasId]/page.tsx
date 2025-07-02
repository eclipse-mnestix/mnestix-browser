'use client';
import { CurrentAasContextProvider } from 'components/contexts/CurrentAasContext';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductViewer } from '../_components/ProductViewer';

export default function () {
    const params = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(params.base64AasId).replace(/=+$|[%3D]+$/, '');
    const aasIdDecoded = safeBase64Decode(base64AasId);
    const encodedRepoUrl = useSearchParams().get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;

    return (
        <CurrentAasContextProvider aasId={aasIdDecoded} repoUrl={repoUrl}>
            <ProductViewer />
        </CurrentAasContextProvider>
    );
}
