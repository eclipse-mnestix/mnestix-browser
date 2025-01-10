import { useTranslations } from 'next-intl';

export const HelloWorldComponent = () => {
    const t = useTranslations('title');
    return <p>{t('test')}</p>;
};
