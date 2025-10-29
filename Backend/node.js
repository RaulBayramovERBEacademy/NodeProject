const fsP = require("fs").promises;
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

async function readFile_(fileName) {
  const html = await fsP.readFile(
    path.join(__dirname, "public", fileName),
    "utf-8"
  );
  return html;
}

const server = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  let singlePageAplication = fs.readFileSync(
    path.join(__dirname, "public", "index.html"),
    "utf-8"
  );
  console.log(parsedUrl.pathname);
  const pathname = parsedUrl.pathname.toLocaleLowerCase();

  if (pathname.endsWith(".js")) {
    response.setHeader("Content-Type", "application/javascript");
    response.end(await readFile_(pathname.slice(1)));
    return;
    /*Çünkü bir isteğe yanıt verildikten (response.end()) sonra
    aynı isteğe ikinci defa yanıt vermek hatadır.
    Yani eğer response.end() çağırdıysan, artık başka response.end() gelmemeli.*/
  }
  if (pathname.endsWith(".css")) {
    response.setHeader("Content-Type", "text/css");
    response.end(await readFile_(pathname.slice(1)));
    return;
  }

  let pageTitle = "";
  switch (
    pathname.replace(".html", "") //bug1  pathname = /contact.html instead of /contact
  ) {
    case "/":
      pageTitle = "You are in the Home page!";
      break;
    case "/contact":
      // response.setHeader("Content-Type", "text/html; charset=utf-8");
      // response.end(await readFile_("contact.html")); // Sabit dosya adı
      pageTitle = "You are in the Contact page!";
      break;
    case "/about":
      // response.end(await readFile_("about.html")); // Sabit dosya adı
      pageTitle = "You are in the About page!";
      break;
    default:
      // response.end("<h1>Page not found</h1>");
      return;
  }

  singlePageAplication = singlePageAplication
    .replace("{{%CONTENT%}}", pageTitle)
    .replace("{{%header%}}", await readFile_("HTML/header.html"));
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(singlePageAplication);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server listening on http://127.0.0.1:3000");
  console.log(typeof global !== "undefined");
});
