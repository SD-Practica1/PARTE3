import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationExample = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('some.translation.key')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('ko')}>한국어</button>
    </div>
  );
};

export default TranslationExample;