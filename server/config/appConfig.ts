const appConfig = {
    corsOptions: {
      origin: ['http://localhost:3000', 'https://yourfrontend.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    rateLimitOptions: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
    },
  };
  
  export default appConfig;