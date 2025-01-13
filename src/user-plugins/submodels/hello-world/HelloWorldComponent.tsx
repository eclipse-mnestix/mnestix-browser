import { useTranslations } from 'next-intl';

export const HelloWorldComponent = () => {
    const t = useTranslations('user-plugins.submodels.hello-world-component');
    return <p>{t('title')}</p>;
};
