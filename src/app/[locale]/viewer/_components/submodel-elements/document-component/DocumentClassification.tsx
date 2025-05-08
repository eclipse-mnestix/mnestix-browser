import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationValue } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { MultiLanguageProperty, Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { tooltipText } from 'lib/util/ToolTipText';

export type DocumentClassification = {
    classId: string;
    className: string;
    classificationSystem: string;
};
export const DocumentClassification = (props: { classificationData: SubmodelElementCollection[] }) => {
    const locale = useLocale();
    const [classificationData, setClassificationData] = useState<DocumentClassification[]>();
    const t = useTranslations('components.documentComponent')

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
            classifications.push(classification);
        });

        return classifications;
    }

    useEffect(() => {
        setClassificationData(extractDocumentClassificationData());
    }, [props.classificationData]);

    return (
        <Box>
            <Typography variant="body2" color="text.secondary">
                {t('classification')}:
            </Typography>
            {classificationData?.map((classificationData) => (
                <Box display="flex" flexDirection="row" gap={1} key={classificationData?.classId}>
                    {classificationData?.classificationSystem && (
                        <Typography fontWeight="500">{classificationData?.classificationSystem}: </Typography>
                    )}
                    <Typography>{tooltipText(classificationData?.className, 20)}</Typography>
                </Box>
            ))}
        </Box>
    );
};
