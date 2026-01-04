import { Amplify } from 'aws-amplify';

// Configure Amplify for both development and production
export const configureAmplify = () => {
  const config = {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
        region: import.meta.env.VITE_COGNITO_REGION,
        loginWith: {
          oauth: {
            domain: import.meta.env.VITE_COGNITO_DOMAIN,
            scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN],
            redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN],
            responseType: 'code' as const,
          },
        },
      },
    },
  };

  console.log('Configuring Amplify with:', {
    userPoolId: config.Auth.Cognito.userPoolId,
    userPoolClientId: config.Auth.Cognito.userPoolClientId,
    region: config.Auth.Cognito.region,
    oauthDomain: config.Auth.Cognito.loginWith.oauth.domain,
  });

  Amplify.configure(config);
};

// Token refresh interval (1 hour)
export const TOKEN_REFRESH_INTERVAL = parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL_SECONDS) * 1000;
