import { alpha, Box, Button, styled, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { ReactElement, useState } from 'react';
import { Submodel } from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';

export type TabSelectorItem = {
    readonly id: string;
    readonly label: string;
    readonly startIcon?: ReactElement<SvgIconProps>;
    readonly submodelData?: Submodel;
    readonly submodelError?: ErrorMessage;
    readonly repositoryUrl?: string;
};

type VerticalTabSelectorProps = {
    readonly items: TabSelectorItem[];
    readonly selected?: TabSelectorItem;
    readonly hovered?: TabSelectorItem;
    readonly setSelected: (selected: TabSelectorItem) => void;
    readonly setInfoItem?: (infoItem: TabSelectorItem) => void;
};

export type ErrorMessage = 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL_SERVER_ERROR' | 'UNKNOWN';

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

export function SubmodelInfoTooltip({
    item,
    setInfoItem,
}: {
    item: TabSelectorItem;
    setInfoItem?: (item: TabSelectorItem) => void;
}) {
    return (
        <Tooltip title={item.id.toString()}>
            <Box
                display="flex"
                sx={{ cursor: 'pointer' }}
                onClick={(event) => {
                    setInfoItem?.(item);
                    event.stopPropagation(); // don't open the tab
                }}
            >
                {item.startIcon}
            </Box>
        </Tooltip>
    );
}

export function VerticalTabSelector(props: VerticalTabSelectorProps) {
    const [hoveredItem, setHoveredItem] = useState<TabSelectorItem>();
    const isMobile = useIsMobile();
    const t = useTranslations('components.verticalTabSelector.errors');

    const selectedCSSClass = (id: string) => (id === props.selected?.id ? 'selected' : '');

    const TooltipContent = ({ item }: { item: TabSelectorItem }) => {
        if (item.submodelError) {
            return (
                <Tooltip title={t(item.submodelError)}>
                    <Box display="flex" sx={{ cursor: 'pointer' }}>
                        {item.startIcon}
                    </Box>
                </Tooltip>
            );
        }

        const showInfoTooltip = !isMobile && (item.id === props.selected?.id || item.id === hoveredItem?.id);

        if (showInfoTooltip) {
            return <SubmodelInfoTooltip item={item} setInfoItem={props.setInfoItem} />;
        }

        return <></>;
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
                                style={{
                                    whiteSpace: 'nowrap',
                                    paddingRight: '20px',
                                    maxWidth: '100%',
                                    minWidth: 0,
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '50vw',
                                    }}
                                >
                                    {item.label || ''}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 0, flexShrink: 0 }}>
                                <TooltipContent item={item} />
                                <ArrowForward color={item.submodelError ? 'disabled' : 'primary'} />
                            </Box>
                        </Tab>
                    </Box>
                );
            })}
        </Box>
    );
}
