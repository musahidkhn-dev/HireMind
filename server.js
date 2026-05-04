import "dotenv/config";

import app from "./src/app.js"
import connectDB from "./src/config/configDB.js"
import colors from "colors"



const PORT = process.env.PORT || 5000
                     


app.get("/", (req, res) => {
    res.json("Welcome To HireMind....")
})




connectDB().then(() => {
  const server = app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING ON PORT :  ${PORT}`.bgBlue.white)
  }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
          console.error(`Error: Port ${PORT} is already in use.`);
      } else {
          console.error(`Error starting server: ${err.message}`);
      }
      process.exit(1);
  });
  
server.timeout = 120000;
server.keepAliveTimeout = 120000; 

});