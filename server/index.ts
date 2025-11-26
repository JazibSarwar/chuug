// import express, { Express } from 'express';

// import { createRequestHandler } from "@remix-run/express";
// import { shopifyApp, ApiVersion } from '@shopify/shopify-app-remix/server';
// import "dotenv/config";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import prisma from "../app/db.server.js";
// const app: Express = express();
// const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// const HOST = '0.0.0.0';
// const sessionStorage = new PrismaSessionStorage(prisma, {
//   tableName: "shopify_sessions", // optional, default: "Session"
//   connectionRetries: 3,           // optional
//   connectionRetryIntervalMs: 500  // optional
// });

// // Parse JSON bodies
// app.use(express.json());

// // Shopify middleware
// app.use(
//   shopifyApp({
//     apiKey: process.env.SHOPIFY_API_KEY!,
//     apiSecretKey: process.env.SHOPIFY_API_SECRET!,
//     scopes: process.env.SCOPES!.split(","),
//     appUrl: process.env.SHOP_APP_URL!,
//     sessionStorage: sessionStorage,
//     apiVersion: ApiVersion.October25, // required
//   }) as unknown as express.RequestHandler
// );

// // Remix request handler
// const build = await import("../build/index.js");
// app.all(
//   "*",
//   createRequestHandler({
//     build: (build as any).default ?? build,
//     mode: process.env.NODE_ENV,
//   })
// );

// app.listen(PORT, HOST, () => {
//   console.log(`Server running on http://${HOST}:${PORT}`);
// });


import express, { Express } from 'express';
import { createRequestHandler } from "@remix-run/express";
import { shopifyApp, ApiVersion } from '@shopify/shopify-app-remix/server';
import "dotenv/config";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "../app/db.server.js"; // your Prisma client

const app: Express = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = '0.0.0.0';

// ------------------------------
// Shopify Session Storage
// ------------------------------
const sessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "shopify_sessions", 
  connectionRetries: 3,
  connectionRetryIntervalMs: 500
});

// ------------------------------
// Parse JSON bodies
// ------------------------------
app.use(express.json());

// ------------------------------
// Shopify Middleware
// ------------------------------
app.use(
  shopifyApp({
    apiKey: process.env.SHOPIFY_API_KEY!,
    apiSecretKey: process.env.SHOPIFY_API_SECRET!,
    scopes: process.env.SCOPES!.split(","),
    appUrl: process.env.SHOP_APP_URL!,
    sessionStorage,
    apiVersion: ApiVersion.October25,
  }) as unknown as express.RequestHandler
);

// ------------------------------
// Remix Request Handler
// ------------------------------
const build = await import("../build/index.js"); // top-level await works with ESM
app.all(
  "*",
  createRequestHandler({
    build: (build as any).default ?? build,
    mode: process.env.NODE_ENV
  })
);

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
