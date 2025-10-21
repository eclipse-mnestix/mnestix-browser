import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { BlueprintEditSectionHeading } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditSectionHeading';
import multiplicityDataJson from './multiplicity-data.json';
import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { MultiplicityData } from 'lib/types/MultiplicityData';
import { LockedTextField } from 'components/basics/LockedTextField';
import { useTranslations } from 'next-intl';
import { Qualifier, Submodel, SubmodelElementChoice } from 'lib/api/aas/models';

interface MultiplicityEditComponentProps {
    data: Submodel | SubmodelElementChoice;
    onChange: (data: Submodel | SubmodelElementChoice) => void;
    allowMultiplicityToBeSet: boolean;
}

export function MultiplicityEditComponent(props: MultiplicityEditComponentProps) {
    const multiplicityData = multiplicityDataJson as MultiplicityData;
    const [multiplicity, setMultiplicity] = useState(getMultiplicity());
    const [valueEnabled, setValueEnabled] = useState(!!multiplicity);
    const allowMultiplicityToBeSet = props.allowMultiplicityToBeSet;
    const t = useTranslations('pages.templates');

    const onAdd = () => {
        setValueEnabled(true);
        handleChange(undefined);
    };

    const onRemove = () => {
        setValueEnabled(false);
        setMultiplicity(undefined);
        handleChange(undefined);
    };

    const onMultiplicityTypeChange = (v: string) => {
        setMultiplicity(v);
        handleChange(v);
    };

    const handleChange = (newMultiplicity: string | undefined) => {
        const qualifiersIndex = props.data?.qualifiers?.findIndex((q: Qualifier) =>
            multiplicityData.qualifierTypes.includes(q.type),
        );

        // update/remove if existing
        if (props.data.qualifiers && qualifiersIndex !== undefined && qualifiersIndex > -1) {
            if (newMultiplicity) {
                props.data.qualifiers[qualifiersIndex].value = newMultiplicity;
            } else {
                props.data.qualifiers.splice(qualifiersIndex, 1);
            }
            // add as new
        } else if (newMultiplicity) {
            const newQualifier = multiplicityData.emptyTemplate;
            newQualifier.value = newMultiplicity;
            props.data.qualifiers = props.data.qualifiers ? [...props.data.qualifiers, newQualifier] : [newQualifier];
        }
        props.onChange(props.data);
    };

    const getDropdownItems = () => {
        const dropdownItems = [];
        for (const item in MultiplicityEnum) {
            if (isNaN(Number(item))) {
                dropdownItems.push(item);
            }
        }
        return dropdownItems;
    };

    function getMultiplicity(): string | undefined | null {
        const qualifier = props.data?.qualifiers?.find((q: Qualifier) =>
            multiplicityData.qualifierTypes.includes(q.type),
        );
        return qualifier?.value;
    }

    return (
        <>
            <BlueprintEditSectionHeading type="multiplicity" />
            {valueEnabled ? (
                <>
                    {allowMultiplicityToBeSet ? (
                        <Box display="flex" alignContent="center">
                            <FormControl variant="filled" fullWidth sx={{ mt: 1 }}>
                                <InputLabel id="multiplicity-select-label">Multiplicity</InputLabel>
                                <Select
                                    labelId="multiplicity-select-label"
                                    id="multiplicity-select"
                                    label="multiplicity"
                                    value={multiplicity ? multiplicity : ''}
                                    onChange={(e) => onMultiplicityTypeChange(e.target.value)}
                                >
                                    {getDropdownItems().map((option, i) => {
                                        return (
                                            <MenuItem value={option} key={i}>
                                                {option}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <IconButton color="primary" onClick={() => onRemove()} sx={{ alignSelf: 'center', ml: 1 }}>
                                <RemoveCircleOutline />
                            </IconButton>
                        </Box>
                    ) : (
                        <LockedTextField label="Multiplicity" fullWidth value={multiplicity} />
                    )}
                </>
            ) : (
                <Button
                    size="large"
                    startIcon={<AddCircleOutline />}
                    onClick={() => onAdd()}
                    disabled={!allowMultiplicityToBeSet}
                >
                    {t('actions.add')}
                </Button>
            )}
        </>
    );
}
