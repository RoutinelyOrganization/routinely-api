const ENV = process.env.NODE_ENV;

export const CONFIGURE_MODULE = {
  envFilePath: !ENV ? '.env' : `.env.${ENV}`,
};

export const CREDENTIALS_KEY = 'account.credentials';
