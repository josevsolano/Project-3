const authConfig = {
    jwtSecret: process.env.JWT_SECRET || 'yourSuperSecretKey',
    jwtExpiration: '1h', // Token expires in 1 hour
  };
  
  export default authConfig;