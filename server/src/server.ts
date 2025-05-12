// src/server.ts
import express, { RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PORT       = Number(process.env.PORT) || 3001;

async function start() {
  // 1) Connect to MongoDB
  db.on('error', console.error);
  db.once('open', () => console.log('✅ MongoDB connected'));

  // 2) Create Express app
  const app = express();

  // 3) Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:            ["'self'"],
          scriptSrc:             ["'self'"],       // no eval allowed
          objectSrc:             ["'none'"],
          upgradeInsecureRequests: [],
        }
      }
    })
  );

  // 4) CORS & body parsing
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 5) Start Apollo and apply as middleware
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server) as unknown as RequestHandler
  );

  // 6) Serve React build
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  // 7) Listen
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
