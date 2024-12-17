import { Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { messages } from 'lib/i18n/localization';
import {
    Entity,
    File,
    ISubmodelElement,
    KeyTypes,
    MultiLanguageProperty,
    Property,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { PropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/PropertyComponent';
import { EntityComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/EntityComponent';
import { MultiLanguagePropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/MultiLanguagePropertyComponent';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import { SubmodelElementCollectionComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/SubmodelElementCollectionComponent';
import { DifferenceSymbol } from 'components/basics/DifferenceSymbol';

type CompareSubmodelElementProps = {
    readonly submodelElement?: ISubmodelElement;
    readonly isMarked?: boolean;
};

export function CompareSubmodelElement(props: CompareSubmodelElementProps) {
    const isMarked = props.isMarked;

    function getRenderElement() {
        if (!props.submodelElement) {
            return;
        }

        const submodelElementType = getKeyType(props.submodelElement);

        switch (submodelElementType) {
            case KeyTypes.Property:
                return (
                    <>
                        <Box display="flex" alignItems="center">
                            {isMarked && <DifferenceSymbol />}
                            <Box display="inline-block">
                                <PropertyComponent property={props.submodelElement as Property} />
                            </Box>
                        </Box>
                    </>
                );
            case KeyTypes.SubmodelElementCollection:
                return (
                    <SubmodelElementCollectionComponent
                        submodelElementCollection={props.submodelElement as SubmodelElementCollection}
                    />
                );
            case KeyTypes.SubmodelElementList:
                return (
                    <SubmodelElementCollectionComponent
                        submodelElementCollection={props.submodelElement as SubmodelElementCollection}
                    />
                );
            case KeyTypes.File:
                return <FileComponent file={props.submodelElement as File} />;
            case KeyTypes.MultiLanguageProperty:
                return (
                    <>
                        <Box display="flex" alignItems={'center'}>
                            {isMarked && <DifferenceSymbol />}
                            <Box display="inline-block">
                                <MultiLanguagePropertyComponent
                                    mLangProp={props.submodelElement as MultiLanguageProperty}
                                />
                            </Box>
                        </Box>
                    </>
                );
            case KeyTypes.Entity:
                return <EntityComponent entity={props.submodelElement as Entity} />;
            default:
                return (
                    <Typography color="error" variant="body2">
                        <FormattedMessage
                            {...messages.mnestix.unknownModelType}
                            values={{ type: `${submodelElementType}` }}
                        />
                    </Typography>
                );
        }
    }

    return <>{getRenderElement()}</>;
}
