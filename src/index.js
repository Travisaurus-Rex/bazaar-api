import app from './app';

const APP_PORT = process.env.APP_PORT;

app.listen(APP_PORT, (err) => {
    if (err) return console.error(err);
    console.log(`listening on port: ${APP_PORT}`);
})

