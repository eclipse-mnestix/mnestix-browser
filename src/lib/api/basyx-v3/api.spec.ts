import { expect } from '@jest/globals';
import { AssetAdministrationShellRepositoryApi, SubmodelRepositoryApi, SubmodelRepositoryApiFetchParamCreator } from 'lib/api/basyx-v3/api';
import { encodeBase64 } from 'lib/util/Base64Util';

describe('SubmodelRepositoryApiFetchParamCreator.getAttachmentFromSubmodelElement', () => {
    const submodelId = 'https://test.de/submodel1';
    const submodelElementPath = 'GeneralInformation.CompanyLogo';

    // MNE-398: the attachment builder appends `/submodels/<id>/submodel-elements/...` to the base.
    // Combined with a plain repo base (the contract InfrastructureSearchService now guarantees),
    // the resulting URL must contain exactly ONE `/submodels/` segment — never a doubled path.
    it('builds a single, non-doubled /submodels/ path from a plain repo base', () => {
        const base = 'https://env-demo.dti';
        const { url } = SubmodelRepositoryApiFetchParamCreator().getAttachmentFromSubmodelElement(
            submodelId,
            submodelElementPath,
        );

        const fullUrl = base + url;
        expect(fullUrl).toBe(
            `https://env-demo.dti/submodels/${encodeBase64(submodelId)}/submodel-elements/${submodelElementPath}/attachment`,
        );
        expect(fullUrl.match(/\/submodels\//g)).toHaveLength(1);
    });
});

// Security regression: a repository base URL is client-supplied (only its *host* is egress-guarded,
// see repositoryFetchGuard.ts — path/query/fragment are intentionally not restricted, since a
// configured repo base can legitimately have its own path). Appending "/query/shells" or
// "/query/submodels" via naive string concatenation let a base URL crafted with a trailing "#"
// push the query endpoint segment into the URL fragment, which `fetch` never sends over the wire —
// the request then silently hit the repository's plain create-shell/create-submodel endpoint
// (POST /shells or POST /submodels) instead of the intended read-only query endpoint, using the
// same attached credentials. See `queryAssetAdministrationShells`/`querySubmodels` in api.ts.
describe('query endpoint URL construction (fragment/query-string injection regression)', () => {
    const testQuery = { $condition: { $boolean: true } };

    function fetchMock() {
        const fetch = jest.fn().mockResolvedValue({ isSuccess: true, result: { paging_metadata: {}, result: [] } });
        return { fetch };
    }

    it('queryAssetAdministrationShells targets /query/shells even when basePath has a trailing fragment', async () => {
        const http = fetchMock();
        const client = AssetAdministrationShellRepositoryApi.create('https://configured-host.example/shells#', http);

        await client.queryAssetAdministrationShells(testQuery);

        const requestedUrl = http.fetch.mock.calls[0][0] as string;
        expect(requestedUrl).toBe('https://configured-host.example/shells/query/shells');
        expect(requestedUrl).not.toContain('#');
    });

    it('queryAssetAdministrationShells targets /query/shells even when basePath has a trailing query string', async () => {
        const http = fetchMock();
        const client = AssetAdministrationShellRepositoryApi.create(
            'https://configured-host.example/shells?foo=bar',
            http,
        );

        await client.queryAssetAdministrationShells(testQuery);

        const requestedUrl = http.fetch.mock.calls[0][0] as string;
        expect(requestedUrl).toBe('https://configured-host.example/shells/query/shells');
    });

    it('querySubmodels targets /query/submodels even when baseUrl has a trailing fragment', async () => {
        const http = fetchMock();
        const client = SubmodelRepositoryApi.create('https://configured-host.example/submodels#', http);

        await client.querySubmodels(testQuery);

        const requestedUrl = http.fetch.mock.calls[0][0] as string;
        expect(requestedUrl).toBe('https://configured-host.example/submodels/query/submodels');
        expect(requestedUrl).not.toContain('#');
    });

    it('querySubmodels targets /query/submodels even when baseUrl has a trailing query string', async () => {
        const http = fetchMock();
        const client = SubmodelRepositoryApi.create('https://configured-host.example/submodels?foo=bar', http);

        await client.querySubmodels(testQuery);

        const requestedUrl = http.fetch.mock.calls[0][0] as string;
        expect(requestedUrl).toBe('https://configured-host.example/submodels/query/submodels');
    });
});
