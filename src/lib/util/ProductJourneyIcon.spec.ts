import fs from 'fs';
import { expect } from '@jest/globals';

/**
 * We currently use this workaround to make sure that the LocationMarkers are there.
 * If in a future release, Nextjs --turbo mode supports a configuration to handle '.svg?url' like webpack
 * this test can be removed after the ProductCarbonFootprint visualization was adapted to use '.svg?url' imports again.
 */
describe('Check that ProductJourneyIcons are available', () => {
    it('Asserts that all LocationMarker SVGs are in the public folder.', (done) => {
        const images = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2', 'C3', 'C4', 'D'];

        images.forEach((image) => {
            const path = `./public/LocationMarkers/LocationMarker_${image}.svg`;
            fs.access(path, fs.constants.F_OK, (err) => {
                expect(err).toBe(null);
                done();
            });
        });
    });
});
