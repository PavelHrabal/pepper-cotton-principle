const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let comments = []; // uložené komentáře

app.use(bodyParser.urlencoded({ extended: true }));

// Funkce pro vyčištění komentářů každých 5 minut
setInterval(() => {
  console.log("Komentáře byly vyčištěny.");
  comments = []; // vymazání proměnné
}, 5 * 60 * 1000); // každých 5 minut

app.get("/", (req, res) => {
  const input = req.query.q || "";
  const commentList = comments.map(c => `<p>${c}</p>`).join("");
  res.send(`
  <!DOCTYPE html>
  <html lang="cs">
  <head>
    <meta charset="UTF-8">
    <title>Reflektované XSS - Demo</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        color: #333;
        padding: 2rem;
        max-width: 800px;
        margin: auto;
      }
      input, button, textarea {
        padding: 0.5rem;
        font-size: 1rem;
        width: 100%;
        margin-top: 0.5rem;
      }
      h1 {
        color: #007BFF;
      }
      .result {
        background: #fff;
        border: 1px solid #ddd;
        padding: 1rem;
        margin-top: 1rem;
      }
    </style>
  </head>
  <body>
    <h1>Hledání</h1>
    <form method="GET">
      <input type="text" name="q" placeholder="Hledaný výraz">
      <button>Hledat</button>
    </form>

    <div class="result">
      <h2>Výsledek:</h2>
      <p>${input}</p>
    </div>

    <div class="result">
      <h2>Komentáře:</h2>
      ${commentList}
      <form method="POST" action="/comment">
        <textarea name="comment" placeholder="Napiš komentář..."></textarea>
        <button type="submit">Odeslat</button>
      </form>
    </div>
  </body>
  </html>
`);
});

app.post("/comment", (req, res) => {
  const comment = req.body.comment || "";
  comments.push(comment); // žádné filtrování = XSS možný
  res.redirect("/"); // přesměrování zpět na hlavní stránku, aby se nový komentář vykreslil
});

app.listen(3000, () => {
  console.log("Server běží na portu 3000");
});