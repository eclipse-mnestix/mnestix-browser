import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { ReferenceComponent } from './ReferenceComponent';
import { Reference, Key, KeyTypes, ReferenceTypes } from '@aas-core-works/aas-core3.0-typescript/types';

describe('ReferenceComponent', () => {
    const createMockKey = (value: string, type: KeyTypes): Key => new Key(type, value);

    const createMockReference = (keys: Key[], type?: ReferenceTypes): Reference =>
        new Reference(type || ReferenceTypes.ExternalReference, keys);

    // Helper to create a reference with invalid data for testing error cases
    const createPartialReference = (data: Partial<Reference>): Reference => data as Reference;

    it('should display "No type specified" when reference type is undefined', () => {
        // Create a partial reference object without type to test the component's error handling
        const reference = createPartialReference({});
        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByTestId('no-type-specified')).toBeInTheDocument();
    });

    it('should display "No reference path available" when keys are undefined', () => {
        const reference = createPartialReference({
            type: ReferenceTypes.ExternalReference,
            keys: undefined,
        });
        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByTestId('no-reference-path-available')).toBeInTheDocument();
    });

    it('should display "No reference path available" when keys array is empty', () => {
        const reference = createPartialReference({
            type: ReferenceTypes.ExternalReference,
            keys: [],
        });
        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByTestId('no-reference-path-available')).toBeInTheDocument();
    });

    it('should render single key correctly', () => {
        const keys = [createMockKey('TestKey', KeyTypes.Submodel)];
        const reference = createMockReference(keys);

        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByText('TestKey')).toBeInTheDocument();
        expect(screen.getByText('(20)')).toBeInTheDocument();
        expect(screen.getByText('Reference type: 0')).toBeInTheDocument();
    });

    it('should render multiple keys with arrows between them', () => {
        const keys = [
            createMockKey('FirstKey', KeyTypes.AssetAdministrationShell),
            createMockKey('SecondKey', KeyTypes.Submodel),
            createMockKey('ThirdKey', KeyTypes.SubmodelElement),
        ];
        const reference = createMockReference(keys);

        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByText('FirstKey')).toBeInTheDocument();
        expect(screen.getByText('(1)')).toBeInTheDocument();
        expect(screen.getByText('SecondKey')).toBeInTheDocument();
        expect(screen.getByText('(20)')).toBeInTheDocument();
        expect(screen.getByText('ThirdKey')).toBeInTheDocument();
        expect(screen.getByText('(21)')).toBeInTheDocument();

        // Should have 2 arrows for 3 keys
        const arrows = document.querySelectorAll('[data-testid="ArrowForwardIcon"]');
        expect(arrows).toHaveLength(2);
    });

    it('should style the last key differently (as primary)', () => {
        const keys = [createMockKey('FirstKey', KeyTypes.Submodel), createMockKey('LastKey', KeyTypes.SubmodelElement)];
        const reference = createMockReference(keys);

        CustomRender(<ReferenceComponent reference={reference} />);

        const lastKeyElement = screen.getByText('LastKey').closest('div');
        const firstKeyElement = screen.getByText('FirstKey').closest('div');

        // The last key should have different styling (primary color)
        expect(lastKeyElement).toHaveStyle('background-color: rgb(25, 118, 210)'); // primary.main
        expect(firstKeyElement).not.toHaveStyle('background-color: rgb(25, 118, 210)');
    });

    it('should handle string keys (fallback)', () => {
        const reference = createPartialReference({
            type: ReferenceTypes.ExternalReference,
            keys: ['StringKey1', 'StringKey2'] as unknown as Key[],
        });

        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByText('StringKey1')).toBeInTheDocument();
        expect(screen.getByText('StringKey2')).toBeInTheDocument();
        expect(screen.getAllByText('(Unknown)')).toHaveLength(2);
    });

    it('should display correct reference type', () => {
        const keys = [createMockKey('TestKey', KeyTypes.Submodel)];
        const reference = createMockReference(keys, ReferenceTypes.ModelReference);

        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByText('Reference type: 1')).toBeInTheDocument();
    });

    it('should handle null or undefined key objects', () => {
        const reference = createPartialReference({
            type: ReferenceTypes.ExternalReference,
            keys: [null, undefined, createMockKey('ValidKey', KeyTypes.Submodel)] as unknown as Key[],
        });

        CustomRender(<ReferenceComponent reference={reference} />);

        expect(screen.getByText('null')).toBeInTheDocument();
        expect(screen.getByText('undefined')).toBeInTheDocument();
        expect(screen.getByText('ValidKey')).toBeInTheDocument();
        expect(screen.getByText('(20)')).toBeInTheDocument();
    });

    it('should display only the last key when showAllKeys is false', () => {
        const keys = [
            createMockKey('FirstKey', KeyTypes.AssetAdministrationShell),
            createMockKey('SecondKey', KeyTypes.Submodel),
            createMockKey('ThirdKey', KeyTypes.SubmodelElement),
        ];
        const reference = createMockReference(keys);
        CustomRender(<ReferenceComponent reference={reference} showAllKeys={false} />);

        expect(screen.queryByText('FirstKey')).not.toBeInTheDocument();
        expect(screen.queryByText('SecondKey')).not.toBeInTheDocument();
        expect(screen.queryByText('ThirdKey')).toBeInTheDocument();
    });
});
