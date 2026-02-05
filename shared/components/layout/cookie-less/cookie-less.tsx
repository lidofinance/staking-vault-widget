import Link from 'next/link';

import { config } from 'config';

import { CookieText, CookieWrapper } from './styles';

const link = `${config.rootOrigin}/privacy-notice`;

export const CookieLess = () => {
  return (
    <CookieWrapper>
      <CookieText size="xxs" color="secondary">
        Your privacy matters. We use cookieless analytics and collect only
        anonymized data for improvements. Cookies are used for functionality
        only. For more info read{' '}
        <Link target="_blank" href={link} rel="noopener noreferrer">
          Privacy Notice
        </Link>
        .
      </CookieText>
    </CookieWrapper>
  );
};
