import { Box } from '@mui/material';
import { ModelFile, Property, SubmodelElementCollection } from 'lib/api/aas/models';
import { DataRow } from 'components/basics/DataRow';
import { SingleMarkingsComponent } from 'app/[locale]/viewer/_components/submodel-elements/marking-components/SingleMarkingsComponent';
import { CustomSubmodelElementComponentProps } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';

interface MarkingsComponentProps extends CustomSubmodelElementComponentProps {
    readonly columnDisplay?: boolean;
}

export function MarkingsComponent(props: MarkingsComponentProps) {
    const markings: Array<SubmodelElementCollection> = Object.values(
        props.submodelElement?.value || {},
    ) as Array<SubmodelElementCollection>;

    // Iterate through all markings
    const markingImages = markings.map((el, index) => {
        let file: ModelFile | undefined;
        let name: Property | undefined;
        let additionalText: Property | undefined;

        let idShortPath = '';
        if (props.submodelElement?.modelType == 'SubmodelElementList') {
            idShortPath = props.submodelElement?.idShort + encodeURIComponent('[' + index.toString() + ']');
        } else if (props.submodelElement?.idShort) {
            idShortPath = props.submodelElement?.idShort + '.' + el.idShort;
        }

        // Iterate through single marking properties
        Object.values(el.value || {}).forEach((markingPart) => {
            switch (markingPart.idShort) {
                case 'MarkingFile':
                    file = markingPart as ModelFile;
                    break;
                case 'MarkingName':
                    name = markingPart as Property;
                    break;
                case 'MarkingAdditionalText':
                    additionalText = markingPart as Property;
                    break;
            }
        });
        // Build single marking
        return (
            !!file &&
            file.contentType &&
            file.contentType.startsWith('image') && (
                <SingleMarkingsComponent
                    key={index}
                    file={file}
                    name={name}
                    additionalText={additionalText}
                    submodelId={props.submodelId}
                    idShortPath={idShortPath}
                    // since all the markings should be displayed in a column, we want one marking to be in a row
                    rowDisplay={props.columnDisplay}
                />
            )
        );
    });
    // render all
    return (
        <DataRow title={props.submodelElement?.idShort} hasDivider={props.hasDivider}>
            <Box
                display="flex"
                gap="20px"
                flexWrap="wrap"
                flexDirection={props.columnDisplay ? 'column' : 'row'}
                sx={{ my: 1 }}
            >
                {markingImages}
            </Box>
        </DataRow>
    );
}
