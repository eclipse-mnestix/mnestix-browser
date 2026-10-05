import { SubmodelElementCollection } from 'lib/api/aas/models';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { fetchFileServerSide } from 'lib/services/fileActions';
import { RepositoryWithInfrastructure } from 'lib/services/database/InfrastructureMappedTypes';

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
 * Fetches a file URL from a repository. Files are always proxied through the server, since the
 * repository origin (e.g. an internal Docker hostname) is often not reachable directly from the browser.
 * @param fileUrl
 * @param repositoryUrl
 */
export async function getFileUrl(fileUrl: string, repository?: RepositoryWithInfrastructure) {
    if (!repository?.url || !fileUrl.startsWith(repository.url)) {
        return fileUrl;
    }

    try {
        const response = await fetchFileServerSide(repository);
        if (response.isSuccess) {
            return window.URL.createObjectURL(response.result);
        }
        return;
    } catch (e) {
        console.warn(`Failed to fetch file via server proxy: ${e}`);
        return fileUrl;
    }
}
