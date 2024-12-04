import dynamic from 'next/dynamic';

const TireRepairIcon = dynamic(() => import('@mui/icons-material/TireRepair'));
const FireHydrantAltIcon = dynamic(() => import('@mui/icons-material/FireHydrantAlt'));
const LabelIcon = dynamic(() => import('@mui/icons-material/Label'));

/**
 * Returns an icon component based on the provided product class type.
 * @param props
 */
export const GetProductClassIcon = (props: { productClassType: string }) => {
    const { productClassType } = props;
    switch (productClassType) {
        case 'pneumatics':
            return <TireRepairIcon color={'primary'} />;
        case 'hydraulics':
            return <FireHydrantAltIcon color={'primary'} />;
        default:
            return <LabelIcon color={'primary'} />;
    }
};
