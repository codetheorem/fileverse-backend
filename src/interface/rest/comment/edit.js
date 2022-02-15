const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const editValidation = {
  body: Joi.object({
    text: Joi.string().required(),
  }),
  params: Joi.object({
    uuid: Joi.string().required(),
    shortId: Joi.string().required(),
  }),
};

async function edit(req, res) {
  const { text } = req.body;
  const { userId } = req;
  const { shortId } = req.params;
  const updatedComment = await Comment.edit({
    shortId,
    text,
    userId,
  });
  res.json(updatedComment);
}

module.exports = [validate(editValidation), edit];
