const express = require('express');
const app = express();
const PORT = 3001;
const data = require('./routes/books')

app.use(express.json())
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/books', data)


app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
