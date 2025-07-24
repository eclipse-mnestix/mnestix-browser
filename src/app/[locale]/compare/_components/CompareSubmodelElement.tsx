import { Box, Typography } from '@mui/material';
import { SubmodelElementChoice, KeyTypes } from 'lib/api/aas/models';
import { EntityComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/EntityComponent';
import { MultiLanguagePropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/MultiLanguagePropertyComponent';
import { FileComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/FileComponent';
import { SubmodelElementCollectionComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/SubmodelElementCollectionComponent';
import { DifferenceSymbol } from 'components/basics/DifferenceSymbol';
import { useTranslations } from 'next-intl';
import { GenericPropertyComponent } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/GenericPropertyComponent';

type CompareSubmodelElementProps = {
    readonly submodelElement?: SubmodelElementChoice;
    readonly isMarked?: boolean;
};

export function CompareSubmodelElement(props: CompareSubmodelElementProps) {
    const isMarked = props.isMarked;
    const t = useTranslations('pages.compare');

    function getRenderElement() {
        if (!props.submodelElement) {
            return;
        }

        switch (props.submodelElement.modelType) {
            case KeyTypes.Property:
                return (
                    <>
                        <Box display="flex" alignItems="center">
                            {isMarked && <DifferenceSymbol />}
                            <Box display="inline-block">
                                <GenericPropertyComponent property={props.submodelElement} withCopyButton={true} />
                            </Box>
                        </Box>
                    </>
                );
            case KeyTypes.SubmodelElementCollection:
                return <SubmodelElementCollectionComponent submodelElementCollection={props.submodelElement} />;
            case KeyTypes.SubmodelElementList:
                return <SubmodelElementCollectionComponent submodelElementCollection={props.submodelElement} />;
            case KeyTypes.File:
                return <FileComponent file={props.submodelElement} />;
            case KeyTypes.MultiLanguageProperty:
                return (
                    <>
                        <Box display="flex" alignItems={'center'}>
                            {isMarked && <DifferenceSymbol />}
                            <Box display="inline-block">
                                <MultiLanguagePropertyComponent mLangProp={props.submodelElement} />
                            </Box>
                        </Box>
                    </>
                );
            case KeyTypes.Entity:
                return <EntityComponent entity={props.submodelElement} />;
            default:
                return (
                    <Typography color="error" variant="body2">
                        {t('errors.unknownModelType', { type: `${props.submodelElement.modelType}` })}
                    </Typography>
                );
        }
    }

    return <>{getRenderElement()}</>;
}
