import { useLocale, useTranslations } from 'next-intl';

import Alert from '@/components/Alert/Alert';

export default function TranslationMissingAlert() {
  const locale = useLocale();
  const t = useTranslations();

  return locale !== 'en' ? (
    <Alert color="warning">{t('new_such_moth_ask')}</Alert>
  ) : null;
}
