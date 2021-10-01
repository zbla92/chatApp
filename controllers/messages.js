const { Message } = require('../models');

exports.postMessage = async (req, res) => {
  const { recipientId, senderId, content } = req.body;

  try {
    const result = await Message.create({
      recipientId,
      senderId,
      content,
    });

    res.json({ data: result });
    res.status(200);
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};

exports.getMessages = async (req, res) => {
  const { recipientId, senderId, page } = req.body;

  const limit = 2;
  const offset = (page - 1) * limit;

  try {
    const result = await Message.findAndCountAll({
      where: {
        recipientId: recipientId.toString(),
        senderId: senderId.toString(),
      },
      limit,
      offset,
    });

    result.maxPage = result.count / limit;

    res.json({ data: result });
    res.status(200);
  } catch (error) {
    res.json({ error });
    res.status(500);
  }
};
