import { useTranslations } from 'next-intl';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';

export const HelloWorldComponent = ({ submodel }: SubmodelVisualizationProps) => {
    const t = useTranslations('user-plugins.submodels.hello-world-component');
    return <p>{`${t('title')}: ${submodel.idShort}`}</p>;
};
