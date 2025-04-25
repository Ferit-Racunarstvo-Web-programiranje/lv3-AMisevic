const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Poslužuj statičke datoteke (HTML, CSS, JS, CSV)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
console.log(`Server je pokrenut na http://localhost:${port}`);
});