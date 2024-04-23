import readLineSync from 'readline-sync';
import mongoose from 'mongoose';
import colors from 'colors';
import { login, register } from './utils/auth.js';
import { initiateChat } from './utils/chat.js';
import Message from './models/messages.js';

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to mongoDB!');
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  await connect();

  console.log(colors.bold.green('Hey there! Welcome to chatbox'));
  let user = null;
  while (true) {
    diplayOptions();
    const userInput = readLineSync
      .question(colors.yellow('You: '))
      .toLowerCase();
    if (userInput === 'l') {
      user = await login();

      if (user) {
        console.clear();
        console.log(colors.bold.green('Success: Login complete'));
        break;
      }
    } else if (userInput === 'r') {
      user = await register();
      if (user) {
        console.clear();
        console.log(colors.bold.green('Success: Registration complete'));
        break;
      }
    } else {
      console.log(
        colors.red('Invalid input. Please provide the correct input')
      );
    }
  }
  console.log(colors.bold.green(`Hey, ${user._doc.name}`));
  console.log(colors.bold.green('You can start chatting now'));

  let chatHistory = await Message.findOne({ userId: user._doc._id });
  if (chatHistory === null) {
    const message = await Message({
      userId: user._doc._id,
      messages: [],
    });
    await message.save();
  }
  chatHistory = await Message.findOne({ userId: user._doc._id });

  await initiateChat(chatHistory);
}

const diplayOptions = () => {
  console.log(colors.bold.green('Are you a new user? '));
  console.log(colors.bold.green('Enter `r` to register.'));
  console.log(colors.bold.green('OR'));
  console.log(colors.bold.green('Enter `l` to login.'));
};

main();
