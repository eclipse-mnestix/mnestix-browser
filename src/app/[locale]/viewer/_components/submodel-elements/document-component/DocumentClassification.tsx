import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { findSubmodelElementBySemanticIdsOrIdShort, getTranslationText } from 'lib/util/SubmodelResolverUtil';
import {
    DocumentSpecificSemanticId,
    DocumentSpecificSemanticIdIrdi,
} from 'app/[locale]/viewer/_components/submodel-elements/document-component/DocumentSemanticIds';
import { MultiLanguageProperty, Property } from '@aas-core-works/aas-core3.0-typescript/types';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

export type DocumentClassification = {
    classId: string;
    className: string;
    classificationSystem: string;
};
export const DocumentClassification = (props: { classificationData: SubmodelElementCollection }) => {
    const locale = useLocale();
    const [classificationData, setClassificationData] = useState<DocumentClassification>();

    function extractDocumentClassificationData() {
        const classId = findSubmodelElementBySemanticIdsOrIdShort(props.classificationData.value, 'ClassId', [
            DocumentSpecificSemanticId.ClassId,
            DocumentSpecificSemanticIdIrdi.ClassId,
        ]);
        const className = findSubmodelElementBySemanticIdsOrIdShort(props.classificationData.value, 'ClassName', [
            DocumentSpecificSemanticId.ClassName,
            DocumentSpecificSemanticIdIrdi.ClassName,
        ]);
        const classificationSystem = findSubmodelElementBySemanticIdsOrIdShort(
            props.classificationData.value,
            'ClassificationSystem',
            [DocumentSpecificSemanticId.ClassificationSystem, DocumentSpecificSemanticIdIrdi.ClassificationSystem],
        );

        const classification: DocumentClassification = {
            classId: (classId as Property).value || '',
            className: getTranslationText(className as MultiLanguageProperty, locale),
            classificationSystem: (classificationSystem as Property).value || '',
        };

        return classification;
    }

    useEffect(() => {
        setClassificationData(extractDocumentClassificationData());
    }, [props.classificationData]);

    return (
        <Box>
            <Typography variant="body2" color="text.secondary" >{props.classificationData.idShort}: </Typography>
            <Box display="flex" flexDirection="row" gap={1}>
                {classificationData?.classificationSystem && (
                    <Typography fontWeight="500">{classificationData?.classificationSystem}: </Typography>
                )}
                <Tooltip title={`ClassId: ${classificationData?.classId}`}>
                    <Typography>{classificationData?.className}</Typography>
                </Tooltip>
            </Box>
        </Box>
    );
};
