/**
 *
 * @param {String} url
 */
export default function notFoundPage(url) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"  content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible"  content="ie=edge">
        <title>Not found</title>
      </head>
      <body>
        <h1>Not found: ${url}</h1>
      </body>
    </html>
  `;
}
