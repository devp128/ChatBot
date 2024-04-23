import readLineSync from 'readline-sync';
import colors from 'colors';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const login = async () => {
  const username = readLineSync.question(colors.green('Username: '));
  const password = readLineSync.question(colors.green('Password: '));

  const user = await User.findOne({
    username,
  });
  if (!user) {
    console.clear();

    console.log(colors.bold.red(`Error: Username doesn't exists`));
    return;
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    console.clear();
    console.log(colors.bold.red(`Error: Incorrect password`));
    return;
  }

  const { password: pw, ...publicDetails } = user;
  return publicDetails;
};

export const register = async () => {
  const name = readLineSync.question(colors.green('Name: '));
  const username = readLineSync.question(colors.green('Username: '));
  const password = readLineSync.question(colors.green('Password: '));
  const confirmPassword = readLineSync.question(
    colors.green('Confirm Password: ')
  );

  const user = await User.findOne({
    username,
  });
  if (user) {
    console.clear();

    console.log(
      colors.bold.red('Error: Username exists, please choose next username')
    );
    return;
  }

  if (password !== confirmPassword) {
    console.clear();

    console.log(
      colors.bold.red('Error: Confirm password and password do not match')
    );
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User({
    name,
    username,
    password: hashedPassword,
    session: new Date(),
  });

  const savedUser = await newUser.save();
  const { password: pw, ...publicDetails } = savedUser;
  return publicDetails;
};
