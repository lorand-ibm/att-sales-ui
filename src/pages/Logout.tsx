import React from 'react';
import { Card } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { getClientConfig } from '../auth/index';
import { useClient } from '../auth/hooks';
import Container from '../components/common/container/Container';

const T_PATH = 'pages.Logout';

const Logout = (): React.ReactElement => {
  const { t } = useTranslation();
  const currentConfig = getClientConfig();
  const { isAuthenticated } = useClient();

  const isLoggedIn = (): boolean => {
    if (!currentConfig) {
      return false;
    }
    return isAuthenticated();
  };

  return (
    <Container narrow>
      <Card style={{ textAlign: 'center' }}>
        <h1>{isLoggedIn() ? t(`${T_PATH}.loggedIn`) : t(`${T_PATH}.loggedOut`)}</h1>
      </Card>
    </Container>
  );
};

export default Logout;
