
const mongoose = require('mongoose');
const defaultUri = "mongodb+srv://admin:ydeTPFgzJ7YHCBuM@cluster0.x8n0x.mongodb.net/kanban?retryWrites=true&w=majority";
const defaultDBName = "kanban"
const connectDB = async () => {
    try {
      const dbOption = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        dbName: defaultDBName
      };
      await mongoose.connect(defaultUri, dbOption);
      const db = mongoose.connection;
      return db;
    } catch (error) {
      console.error(error);
      console.log(">>> DB failed to connect <<<");
      process.exit();
    }
  };
 module.exports = connectDB;