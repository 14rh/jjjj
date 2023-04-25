const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  lineURL: String,
  guildID: [String],
  channels: {
    type: Map,
    of: {
      name: String,
      url: String
    }
  }
});

const ConfigModel = mongoose.model('Config', configSchema);

module.exports = ConfigModel;
