// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PORT       = Number(process.env.PORT) || 3001;

async function start() {
  // 1) Connect to Mongo
  db.once('open', () => console.log('✅ MongoDB connected'));

  // 2) Create your Express app
  const app = express();

  // 3) Mount Helmet (CSP) differently in dev vs prod
  if (process.env.NODE_ENV !== 'production') {
    // in dev: disable Helmet’s CSP so Apollo Sandbox can load
    app.use(helmet({ contentSecurityPolicy: false }));
  } else {
    // in prod: enforce a strict CSP (no eval)
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'"],
            objectSrc:  ["'none'"],
            upgradeInsecureRequests: [],
          }
        }
      })
    );
  }

  // 4) Mount CORS
  const CLIENT_URL = process.env.CLIENT_URL;
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true
    })
  );

  // 5) Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 6) Start Apollo and attach via expressMiddleware
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server) as any
  );

  // 7) Serve your React build
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  // 8) Listen
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
