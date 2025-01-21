import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createTodoHandler } from "./server/create-todo-handler";
import { vikeHandler } from "./server/vike-handler";
import { createHandler } from "@universal-middleware/express";
import express from "express";
import setRoutes from "./server/routes";
import compression from 'compression'
import cookieParser from 'cookie-parser'
import authenticateJWTFromCookie from "./server/middleware/auth";
import { renderPage } from "vike/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

// Add new middleware
const extractComicSlug = (req: any, res: any, next: any) => {
  const hostname = req.hostname; // e.g., "my-comic.webcomic.studio"
  const parts = hostname.split('.');
  
  if (parts.length >= 3) {
    req.comicSlug = parts[0];
  } else {    req.comicSlug = null;
  }
  next();
};

export default (await startServer()) as unknown;


async function startServer() {
  console.log("Starting server");
  const app = express();
  
  console.log("Setting up middleware");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression());
  app.use(authenticateJWTFromCookie);
  
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`));
  } else {
    console.log("Setting up Vite");
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
    app.use(extractComicSlug);
  }

  console.log("Setting up routes");
  setRoutes(app, root);

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  // app.all("*", createHandler(vikeHandler)());
  console.log("Setting up Vike route");
  app.all('*', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      user: req.user,
      // Add comic slug to the page context so it's available in your pages
      comicSlug: req.comicSlug,
    }
    console.time('renderPage');
    const pageContext = await renderPage(pageContextInit);
    console.timeEnd('renderPage');
    const response = pageContext.httpResponse;

    const { readable, writable } = new TransformStream();
    response.pipe(writable);

    if (pageContext.errorWhileRendering) {
    }
    const { httpResponse } = pageContext
    if (res.writeEarlyHints) res.writeEarlyHints({ link: httpResponse.earlyHints.map((e) => e.earlyHintLink) })
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    res.send(httpResponse.body)
  });


  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return app;
}
