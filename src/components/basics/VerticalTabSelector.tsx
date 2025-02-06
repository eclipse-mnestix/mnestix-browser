import { alpha, Box, Button, styled, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { ReactElement, useState } from 'react';
import { Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { tooltipText } from 'lib/util/ToolTipText';
import { SubmodelInfoDialog } from 'app/[locale]/viewer/_components/submodel/SubmodelInfoDialog';
import { useTranslations } from 'next-intl';

export type TabSelectorItem = {
    readonly id: string;
    readonly label: string;
    readonly startIcon?: ReactElement<SvgIconProps>;
    readonly submodelData?: Submodel;
    readonly submodelError?: string | Error;
};

type VerticalTabSelectorProps = {
    readonly items: TabSelectorItem[];
    readonly selected?: TabSelectorItem;
    readonly hovered?: TabSelectorItem;
    readonly setSelected?: (selected: TabSelectorItem) => void;
    readonly setHovered?: (hovered: TabSelectorItem | undefined) => void;
};

const Tab = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '60px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderColor: theme.palette.divider,
    transition: 'border-color 0s',
    borderRadius: '0',
    padding: '20px',
    '&.selected': {
        background: alpha(theme.palette.primary.main, 0.1),
        borderColor: 'transparent',
        fontWeight: '500',
        color: theme.palette.primary.main,
        '& + .tab-item': {
            borderColor: 'transparent',
        },
    },
    '&:hover': {
        background: theme.palette.grey['100'],
        cursor: 'pointer',
    },
    '&:active': {
        borderColor: 'transparent',
    },
    '&.Mui-disabled': {
        pointerEvents: 'auto',
        '&:hover': {
            background: 'none',
        },
    },
}));

export function VerticalTabSelector(props: VerticalTabSelectorProps) {
    const [submodelInfoDialogOpen, setSubmodelInfoDialogOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<TabSelectorItem>();
    const [dialogItem, setDialogItem] = useState<TabSelectorItem>();
    const t = useTranslations('submodels.errors');
    type message = 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL_SERVER_ERROR' | 'UNKNOWN';

    const selectedCSSClass = (id: string) => (id === props.selected?.id ? 'selected' : '');

    const handleSubmodelInfoModalClose = () => {
        setHoveredItem(undefined);
        setSubmodelInfoDialogOpen(false);
    };

    return (
        <Box
            sx={{ 'Button:nth-of-type(1)': { borderColor: 'transparent' } }}
            onMouseLeave={() => setHoveredItem(undefined)}
        >
            {props.items.map((item, index) => {
                return (
                    <Box key={index} onMouseEnter={() => setHoveredItem(item)}>
                        <Tab
                            data-testid="submodel-tab"
                            onClick={() => props.setSelected && props.setSelected(item)}
                            className={`tab-item ${selectedCSSClass(item.id)}`}
                            disabled={!!item.submodelError}
                        >
                            <Box
                                display="flex"
                                alignItems="left"
                                style={{ whiteSpace: 'nowrap', paddingRight: '20px' }}
                            >
                                <Typography>{tooltipText(item.label, 40) || ''}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={2}>
                                <Box
                                    visibility={
                                        item.id === props.selected?.id || item.id === hoveredItem?.id
                                            ? 'visible'
                                            : 'hidden'
                                    }
                                >
                                    {item.submodelError ? (
                                        <Tooltip title={t(item.submodelError.toString() as message)}>
                                            <Box display="flex" sx={{ cursor: 'pointer' }}>
                                                {item.startIcon}
                                            </Box>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={item.id.toString()}>
                                            <Box
                                                display="flex"
                                                sx={{ cursor: 'pointer' }}
                                                onClick={(event) => {
                                                    setDialogItem(hoveredItem);
                                                    setSubmodelInfoDialogOpen(true);
                                                    event.stopPropagation(); // don't open the tab
                                                }}
                                            >
                                                {item.startIcon}
                                            </Box>
                                        </Tooltip>
                                    )}
                                </Box>
                                <ArrowForward color={item.submodelError ? 'disabled' : 'primary'} />
                            </Box>
                        </Tab>
                    </Box>
                );
            })}
            <SubmodelInfoDialog
                open={submodelInfoDialogOpen}
                onClose={handleSubmodelInfoModalClose}
                id={dialogItem?.id}
                idShort={dialogItem?.submodelData?.idShort}
            />
        </Box>
    );
}
