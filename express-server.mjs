import express from 'express';
import cors from 'cors';

const app = express()
app.use(cors())
const port = 3000

app.post('/create-account', (req, res) => {
    res.status(201).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})