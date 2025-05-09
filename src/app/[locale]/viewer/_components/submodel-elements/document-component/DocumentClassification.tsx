import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationValue } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { MultiLanguageProperty, Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { tooltipText } from 'lib/util/ToolTipText';

export type DocumentClassification = {
    classId: string;
    className: string;
    classificationSystem: string;
};
export const DocumentClassification = (props: {
    classificationData: SubmodelElementCollection[];
    openDetailDialog: () => void;
}) => {
    const locale = useLocale();
    const [classificationData, setClassificationData] = useState<DocumentClassification[]>();
    const t = useTranslations('components.documentComponent');

    function extractDocumentClassificationData() {
        const classifications: DocumentClassification[] = [];
        props.classificationData.map((classificationElement) => {
            const classId = findSubmodelElementBySemanticIdsOrIdShort(classificationElement.value, 'ClassId', [
                DocumentSpecificSemanticId.ClassId,
                DocumentSpecificSemanticIdIrdi.ClassId,
            ]);
            const className = findSubmodelElementBySemanticIdsOrIdShort(classificationElement.value, 'ClassName', [
                DocumentSpecificSemanticId.ClassName,
                DocumentSpecificSemanticIdIrdi.ClassName,
            ]);

            // The ClassName has to be a MultiLanguageProperty by the AAS standard, but Mnestix should not crash if it has a different type.
            let translatedClassName = '';
            try {
                translatedClassName = getTranslationValue(className as MultiLanguageProperty, locale) ?? '';
            } catch (e) {
                console.warn('Invalid property for classname' + e);
            }

            const classificationSystem = findSubmodelElementBySemanticIdsOrIdShort(
                classificationElement.value,
                'ClassificationSystem',
                [DocumentSpecificSemanticId.ClassificationSystem, DocumentSpecificSemanticIdIrdi.ClassificationSystem],
            );

            const classification: DocumentClassification = {
                classId: (classId as Property).value || '',
                className: translatedClassName,
                classificationSystem: (classificationSystem as Property).value || '',
            };
            if (classification.classId || classification.className || classification.classificationSystem) {
                classifications.push(classification);
            }
        });

        return classifications;
    }

    useEffect(() => {
        setClassificationData(extractDocumentClassificationData());
    }, [props.classificationData]);

    return (
        <>
            {classificationData && classificationData.length > 0 && (
                <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        {t('classification')}:
                    </Typography>
                    {classificationData?.slice(0, 2).map((classificationData) => (
                        <Box display="flex" flexDirection="row" gap={1} key={classificationData?.classId}>
                            <Typography component="span" sx={{ mx: 1 }}>
                                •
                            </Typography>
                            {classificationData?.classificationSystem && (
                                <Typography fontWeight="500">{classificationData?.classificationSystem}: </Typography>
                            )}
                            <Typography>{tooltipText(classificationData?.className, 20)}</Typography>
                        </Box>
                    ))}
                    {classificationData?.length > 2 && (
                        <Button variant="text" onClick={props.openDetailDialog}>
                            {t('showMoreButton')}
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};
