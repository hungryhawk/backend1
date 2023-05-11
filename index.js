const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/blockRoute'));

app.listen(5000, () => {
  console.log('At port 5000');
});

// https://github.com/HussainArif12/postgres-notes-tutorial/tree/main/views
