import { LoginOutlined } from '@ant-design/icons';
import { Authenticator, css, useAPIClient } from '@nocobase/client';
import { Button, Space, message } from 'antd';
import React, { useEffect } from 'react';
import { useSamlTranslation } from './locale';
import { useLocation } from 'react-router-dom';

export const SAMLButton = ({ authenticator }: { authenticator: Authenticator }) => {
  const { t } = useSamlTranslation();
  const api = useAPIClient();
  const location = useLocation();

  const login = async () => {
    const response = await api.request({
      method: 'post',
      url: 'saml:getAuthUrl',
      headers: {
        'X-Authenticator': authenticator.name,
      },
    });

    const authUrl = response?.data?.data;
    window.location.replace(authUrl);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('authenticator');
    const error = params.get('error');
    if (name !== authenticator.name) {
      return;
    }
    if (error) {
      message.error(error);
      return;
    }
  });

  return (
    <Space
      direction="vertical"
      className={css`
        display: flex;
      `}
    >
      <Button shape="round" block icon={<LoginOutlined />} onClick={login}>
        {t(authenticator.title)}
      </Button>
    </Space>
  );
};
