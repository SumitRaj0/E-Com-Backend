const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});