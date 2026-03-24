import { Dispatch, SetStateAction } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AssetKind } from 'lib/api/aas/models';

export function SelectAssetKind(props: {
    selectedAssetKinds: AssetKind[];
    onSelectedAssetKindsChanged: Dispatch<SetStateAction<AssetKind[]>>;
}) {
    const t = useTranslations('pages.aasList');

    const assetKindOptions: AssetKind[] = [AssetKind.Type, AssetKind.Instance, AssetKind.NotApplicable];

    const handleChange = (event: SelectChangeEvent<AssetKind[]>) => {
        const value = event.target.value as AssetKind[];
        props.onSelectedAssetKindsChanged(value);
    };

    return (
        <Box>
            <FormControl variant="standard" sx={{ minWidth: 200, maxWidth: 300 }}>
                <InputLabel id="asset-kind-select" sx={{ color: 'text.secondary' }}>
                    {t('assetKindFilter')}
                </InputLabel>
                <Select<AssetKind[]>
                    data-testid="asset-kind-select"
                    labelId="asset-kind-select"
                    variant="standard"
                    multiple
                    value={props.selectedAssetKinds}
                    label={t('assetKindFilter')}
                    onChange={handleChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                            ))}
                        </Box>
                    )}
                >
                    {assetKindOptions.map((kind) => (
                        <MenuItem key={kind} value={kind} data-testid={`asset-kind-select-item-${kind}`}>
                            {kind}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}