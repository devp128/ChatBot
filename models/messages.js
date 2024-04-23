import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  messages: [
    {
      role: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
