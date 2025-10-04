const express = require('express');

const app = express();

const port = 5000;


app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Server!' 
  });
});

app.listen(port, () => {
  console.log(`Node.js Server Project (Tugas 2) berjalan di http://localhost:${port}`);
  console.log('Endpoint GET / siap melayani dengan pesan JSON.');
});
