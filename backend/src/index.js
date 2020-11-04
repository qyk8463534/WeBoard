const fs = require('fs');
const PORT = 9900
const connectDB = require("./db")
const app = require('./app')


/**
 * start the server
 */
const start = async () => {
  // prepare directory
  console.log(`\n>>> Preparing <<<`);


  // connect database
  const db = await connectDB();
  console.log(`>>> Database connected <<<`);

  // start listening
  const server = app.listen(PORT, () =>
    console.log(`>>> Server started listening at port: ${PORT}`)
  );

  // handle exit
  process.on("exit", () => {
    console.log(`>>> Server closed <<<`);
  });


};

/*
 * fire the server
 */

if (require.main === module) {
  start();
}
