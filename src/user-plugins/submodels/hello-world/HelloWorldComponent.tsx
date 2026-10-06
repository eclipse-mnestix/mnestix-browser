import { useTranslations } from 'next-intl';
import { SubmodelVisualizationProps } from 'components/visualizations/submodel.types';

export const HelloWorldComponent = ({ submodel }: SubmodelVisualizationProps) => {
    const t = useTranslations('user-plugins.submodels.hello-world-component');
    return <p>{`${t('title')}: ${submodel.idShort}`}</p>;
};
