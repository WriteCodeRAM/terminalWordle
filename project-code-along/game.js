//imports
import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';

// game logic

//helper to resolve animations
//ms = 2000 miliseconds, after 2 seconds, the promise will resolve
let playerName;
const spinner = createSpinner('process loading. . .');

const resolveAnimations = (ms = 2000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//start game function
async function startGame() {
  //welcome message utilizing the chalk animation package
  const welcomeMsg = chalkAnimation.rainbow(
    `welcome to the choose your adventure game \n`
  );
  //call helper
  await resolveAnimations();
  //stop the animation
  welcomeMsg.stop();
  //prompt for the game
  console.log(`
    ${chalk.bgGreenBright('we shall begin')}
    this adventure lives in your terminal
    if you choose any of the wrong choices, I will ${chalk.bgRed('terminate')}
    if you make it to the end, you will be rewarded
    `);
}

async function pathQuestion() {
  const answers = await inquirer.prompt({
    name: 'question_1',
    type: 'list',
    message: `Welcome ${playerName}, what path will you choose? \n`,
    choices: [
      {
        name: 'left - you hear a breeze echoing down the tunnel',
        value: 'left',
      },
      {
        name: 'right - you hear rocks crumbling in the distance',
        value: 'right',
      },
      { name: 'straight - you hear an eerie silence', value: 'straight' },
    ],
  });

  //left question logic
  async function leftQuestion() {
    const answers = await inquirer.prompt({
      name: 'leftQuestion',
      type: 'list',
      message: `You have two choices: \n`,
      choices: ['Press the button', `Don't press the button`],
    });
    return handleLeftAnswer(answers.leftQuestion == 'Press the button');
  }
  //handle user choice
  async function handleLeftAnswer(choice) {
    spinner.start();
    await resolveAnimations();
    if (choice) {
      spinner.success({
        text: `a secret passage opens, ${playerName}, you made the right choice`,
      });
      await finalQuestion();
    } else {
      spinner.warn({
        text: `${playerName}, you should have pressed the button. ${chalk.bgRed(
          `FATAL - terminating process due to inactivity`
        )}`,
      });
      process.exit(1);
    }
  }

  await pathChoice(answers.question_1);
  //continue down the left path
  if (answers.question_1 === 'left') {
    leftQuestion();
    //continue down the right path
  } else if (answers.question_1 === 'right') {
    rightQuestion();
  }
}

async function pathChoice(choice) {
  spinner.start();
  await resolveAnimations();
  //   spinner.stop();

  if (choice === 'left') {
    spinner.success({ text: `Interesting choice, ${playerName}, continue on` });
  } else if (choice === 'right') {
    spinner.warn({ text: `Interesting choice, ${playerName}, continue on` });
  } else {
    spinner.error({ text: chalk.bgRed(`FATAL - terminating process`) });
    process.exit(1);
  }
}

async function playerInfo() {
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'Hello, please enter your name.',
  });
  playerName = answers.player_name;
  await pathQuestion();
}

async function main() {
  //invoke our game functions here
  await startGame();
  await playerInfo();
}

main();
