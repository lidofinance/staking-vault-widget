import { FC } from 'react';
import buildInfo from 'build-info.json';
import { config } from 'config';

import {
  FooterStyle,
  FooterLink,
  LogoLidoStyle,
  FooterDivider,
  Version,
  LinkDivider,
} from './styles';
import { LinkToIpfs } from './link-to-ipfs';

const getVersionInfo = () => {
  const { version, branch } = buildInfo;
  const repoBaseUrl = 'https://github.com/lidofinance/staking-vault-widget';
  if (version === 'REPLACE_WITH_VERSION')
    return {
      label: 'dev',
      link: repoBaseUrl,
    };
  if (version === branch + ':-unknown')
    return {
      label: 'preview',
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  if (version === 'staging' || version === 'dev') {
    return {
      label: version,
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  }
  return {
    label: `v${version}`,
    link: `${repoBaseUrl}/releases/tag/${version}`,
  };
};

const { label, link } = getVersionInfo();

const termsOfUseLink = `${config.rootOrigin}/terms-of-use`;
const privacyNoticeLink = `${config.rootOrigin}/privacy-notice`;

export const Footer: FC = () => {
  return (
    <FooterStyle size="full" forwardedAs="footer">
      <LogoLidoStyle />
      <FooterLink data-testid="termsOfUse" href={termsOfUseLink}>
        Terms of Use
      </FooterLink>
      <LinkDivider />
      <FooterLink
        data-testid="privacyNotice"
        href={privacyNoticeLink}
        $marginRight="auto"
      >
        Privacy Notice
      </FooterLink>
      <LinkToIpfs />
      <Version data-testid="appVersion" href={link}>
        {label}
      </Version>
      <FooterDivider />
    </FooterStyle>
  );
};
