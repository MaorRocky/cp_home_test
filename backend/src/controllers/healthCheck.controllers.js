import mongoose from 'mongoose';

export const healthCheck = (req, res) => {
  mongoose.connection.db.admin().ping((error, result) => {
    if (error || !result) {
      res.send(`ping failed ${error}`);
    }
    res.send(`connection is up `);
  });
};
