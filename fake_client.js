import pure_router from "./index.js";

export default function runFakeClientServer() {
  const router = pure_router.createRouter();

  router.use((request, response) => {
    console.log(
      new Date().toISOString(),
      request.method,
      request.url,
    );
  });

  router.use(pure_router.createStaticHandler("public/"));

  router.get("/", (request, response) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    response.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"  content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible"  content="ie=edge">
          <title>Not found</title>
          <link rel="stylesheet" href="global.css">
        </head>
        <body>
          <h1>Hello, there!</h1>
        </body>
      </html>
    `);
    response.end();
  });

  router.listen(3333, () => {
    console.log("Server started at http://localhost:3333/");
  });
}
