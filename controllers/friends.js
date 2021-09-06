const { activeConnections } = require('../config/socketio');

exports.getOnlineFriends = async (req, res) => {
  try {
    res.json({ data: activeConnections });
    res.status(200);
  } catch (err) {
    res.json({ err });
    res.status(500).end();
  }
};
