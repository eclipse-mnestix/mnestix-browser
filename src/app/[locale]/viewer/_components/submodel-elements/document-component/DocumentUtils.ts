import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { fetchFileServerSide } from 'lib/api/infrastructure';

/**
 * Finds the latest idShort for a given SubmodelElementCollection based on semantic IDs or prefix to build a idShortPath.
 * @param submodelElement
 * @param prefix
 * @param semanticIds
 */
export function findIdShortForLatestElement(
    submodelElement: SubmodelElementCollection,
    prefix: string,
    ...semanticIds: string[]
): string {
    const foundIdShorts = submodelElement.value
        ?.filter(
            (element) =>
                element &&
                element.idShort &&
                (hasSemanticId(element, ...semanticIds) || element.idShort.startsWith(prefix)),
        )
        .map((value) => value.idShort)
        .sort()
        .filter((value) => value != null);

    const lastIdShort = foundIdShorts ? foundIdShorts.at(-1) : null;

    if (!foundIdShorts || !lastIdShort || foundIdShorts.length < 1) {
        console.error('Did not find a digital File');
        return 'DigitalFile';
    }

    if (foundIdShorts.length > 1) {
        console.warn(
            `Found multiple versions of documents: ${foundIdShorts}, 
                displaying the last one when sorted alphabetically: ${lastIdShort}`,
        );
    }

    return lastIdShort;
}

/**
 * Fetches a file URL from a repository. When the file URL matches the repository URL of the submodel,
 * the bearer token is sent in the request.
 * @param fileUrl
 * @param accessToken
 * @param repositoryUrl
 */
export async function getFileUrl(fileUrl: string, accessToken?: string, repositoryUrl?: string) {
    if (!accessToken || !repositoryUrl || !fileUrl.startsWith(repositoryUrl)) {
        return fileUrl;
    }

    try {
        const response = await fetchFileServerSide(fileUrl, accessToken);
        if(response.isSuccess) {
            return window.URL.createObjectURL(response.result);
        } return;
    } catch (e) {
        console.warn(`Failed to open file with auth: ${e}`);
        return fileUrl;
    }
}
