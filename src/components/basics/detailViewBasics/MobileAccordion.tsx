import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconCircleWrapper } from 'components/basics/IconCircleWrapper';

type MobileAccordionProps = {
    readonly content: React.ReactNode;
    readonly title: string;
    readonly icon?: React.ReactNode;
};

export function MobileAccordion(props: MobileAccordionProps) {
    return (
        <Accordion disableGutters elevation={0} style={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ArrowDropDownIcon sx={{ color: 'grey.600' }} />}>
                <Box display="flex" alignItems="center" data-testid="mobile-accordion-header">
                    {props.icon && <IconCircleWrapper sx={{ mr: 1 }}>{props.icon}</IconCircleWrapper>}
                    <Typography>{props.title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails data-testid="mobile-accordion-content">{props.content}</AccordionDetails>
        </Accordion>
    );
}