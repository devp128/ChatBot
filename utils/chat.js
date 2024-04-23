import openai from '../config/open-ai.js';
import readLineSync from 'readline-sync';
import colors from 'colors';
import Message from '../models/messages.js';

export const initiateChat = async (chatHistory) => {
  while (true) {
    const userInput = readLineSync.question(colors.yellow('You: '));
    try {
      let messages = [];
      if (chatHistory.messages.length > 0) {
        messages = chatHistory.messages.map((message) => ({
          role: message.role,
          content: message.content,
        }));
      }

      messages.push({ role: 'user', content: userInput });
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
      });

      const completionText = completion.choices[0].message.content;

      console.log(colors.green('Bot: ' + completionText));

      let filter = { _id: chatHistory._id };
      let update = { role: 'user', content: userInput };
      let updatedMessages = await Message.findOneAndUpdate(
        filter,
        {
          $push: { messages: update },
        },
        {
          returnOriginal: false,
        }
      );
      update = { role: 'assistant', content: completionText };
      updatedMessages = await Message.findOneAndUpdate(
        filter,
        {
          $push: { messages: update },
        },
        {
          returnOriginal: false,
        }
      );

      if (userInput.toLowerCase() === 'exit') {
        break;
      }
    } catch (error) {
      console.error(colors.red(error));
    }
  }
};
