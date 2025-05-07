// src/server.ts
import express, { RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// ▶ Be explicit: point at index.js inside the dist/schemas folder
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  db.on('error', console.error);
  db.once('open', () => console.log('✅ MongoDB connected'));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    '/graphql',
    expressMiddleware(server) as unknown as RequestHandler
  );

  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
}

start().catch(err => console.error(err));
