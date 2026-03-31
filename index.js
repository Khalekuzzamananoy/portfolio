const express = require('express');
const app = express();
const port = 3000;

// This line is the magic trick. It tells Express to look inside your 'public' folder 
// and automatically serve the index.html file and all the assets (CSS, images) connected to it.
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});