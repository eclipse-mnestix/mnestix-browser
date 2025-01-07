import { Box, Card, CardContent, Divider, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import { SubmodelDetail } from './submodel/SubmodelDetail';
import { TabSelectorItem, VerticalTabSelector } from 'components/basics/VerticalTabSelector';
import { MobileModal } from 'components/basics/MobileModal';
import ErrorIcon from '@mui/icons-material/Error';
import { SortNameplateElements } from 'app/[locale]/viewer/_components/submodel/sorting/SortNameplateElements';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import ErrorBoundary from 'components/basics/ErrorBoundary';
import { useTranslations } from 'next-intl';

export type SubmodelsOverviewCardProps = {
    readonly submodelIds: SubmodelOrIdReference[] | undefined;
    readonly submodelsLoading?: boolean;
};

export function SubmodelsOverviewCard({ submodelIds, submodelsLoading }: SubmodelsOverviewCardProps) {
    const [submodelSelectorItems, setSubmodelSelectorItems] = useState<TabSelectorItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<TabSelectorItem>();
    const t = useTranslations('submodels');

    SortNameplateElements(selectedItem?.submodelData);

    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useIsMobile();
    const firstSubmodelIdShort = 'Nameplate';

    function getSubmodelTabs(): TabSelectorItem[] {
        if (!submodelIds) return []; // do other state stuff

        return submodelIds
            .map(getAsTabSelectorItem)
            .filter((item) => !!item)
            .sort(function (x, y) {
                return x.label == firstSubmodelIdShort ? -1 : y.label == firstSubmodelIdShort ? 1 : 0;
            });
    }

    function getAsTabSelectorItem(submodelId: SubmodelOrIdReference): TabSelectorItem {
        if (submodelId.submodel) {
            return {
                id: submodelId.id,
                label: submodelId.submodel.idShort ?? '',
                submodelData: submodelId.submodel,
            };
        } else {
            return {
                id: submodelId.id,
                label: submodelId.id,
                startIcon: <ErrorIcon />,
            };
        }
    }

    useEffect(() => {
        setOpen(!!selectedItem && isMobile);
    }, [isMobile, selectedItem]);

    useEffect(() => {
        const submodelTabs = getSubmodelTabs();
        setSubmodelSelectorItems(submodelTabs);
    }, [submodelIds]);

    useEffect(() => {
        const nameplateTab = submodelSelectorItems.find((tab) => tab.submodelData?.idShort === firstSubmodelIdShort);
        if (!selectedItem && !isMobile && nameplateTab) {
            setSelectedItem(nameplateTab);
        }
    }, [isMobile, submodelSelectorItems]);

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(undefined);
    };

    function SelectedContent() {
        if (selectedItem?.submodelData) {
            return (
                <ErrorBoundary message={t('renderError')}>
                    <SubmodelDetail submodel={selectedItem?.submodelData} />
                </ErrorBoundary>
            );
        } else if (submodelsLoading) {
            return (
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="30%" />
                    <Divider sx={{ mt: 2 }} />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="30%" />
                    <Divider sx={{ mt: 2 }} />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="30%" />
                </Box>
            );
        }
        return null;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h3" marginBottom="15px">
                    {t('title')}
                </Typography>
                <Box display="grid" gridTemplateColumns={isMobile ? '1fr' : '1fr 2fr'} gap="40px">
                    <Box>
                        <VerticalTabSelector
                            items={submodelSelectorItems}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                        />
                        {submodelsLoading && (
                            <Skeleton height={70} sx={{ mb: 2 }} data-testid="submodelOverviewLoadingSkeleton" />
                        )}
                    </Box>
                    {isMobile ? (
                        <MobileModal
                            title={selectedItem?.label}
                            open={open}
                            handleClose={handleClose}
                            content={SelectedContent()}
                        />
                    ) : (
                        <SelectedContent />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
