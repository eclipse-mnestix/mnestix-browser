import { expect } from '@jest/globals';
import { SubmodelRepositoryApiFetchParamCreator } from 'lib/api/basyx-v3/api';
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
