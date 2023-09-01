//write your code here
import chalk from 'chalk';
import axios from 'axios';
import figlet from 'figlet';
import inquirer from 'inquirer';
import readline from 'readline';

//stats for summary page
let gamesPlayed = 0;
let gamesWon = 0;
let streak = 0;

//maybe add inquirer for wordlength options

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fetchWord = async () => {
  let wordLength;
  const wordLengthPrompt = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'length',
        message: 'Select a word length',
        choices: [4, 5, 6],
      },
    ])
    .then((answers) => {
      wordLength = answers.length;
    });

  //rapid api endpoint
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getRandom',
    params: { wordLength: wordLength },
    headers: {
      'X-RapidAPI-Key': 'dc93ee594cmsh3d384c14d13a9edp19dd7fjsn4cb68636655f',
      'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
    },
  };

  try {
    // console.log(`this is the length: ${wordLength} in try statement`);
    const response = await axios.request(options);
    return response.data.toUpperCase();
  } catch (error) {
    console.error(error);
  }
};

const gameRules = () => {
  figlet('Welcome!', function (err, data) {
    if (err) {
      console.log('Error:', err);
      return;
    }

    console.log(data);

    console.log(chalk.green('\nEasy: 5 Chances'));
    console.log(chalk.blue('Medium: 4 Chances'));
    console.log(chalk.red('Hard: 3 Chances'));
    console.log(chalk.blackBright('IMPOSSIBLE: 1 CHANCE\n'));

    //get difficulty from user
    const difficultyPrompt = inquirer
      .prompt([
        {
          type: 'list',
          name: 'difficulty',
          message: 'Select a difficulty',
          choices: ['Easy', 'Medium', 'Hard', 'IMPOSSIBLE'],
        },
      ])
      .then((answers) => {
        //display selection
        console.log(`You selected difficulty: ${answers.difficulty}`);
        if (answers.difficulty == 'Easy') {
          console.log(chalk.green('You have 5 chances to guess the word'));
          gameLogic(5);
        } else if (answers.difficulty == 'Medium') {
          console.log(chalk.blue('You have 4 chances to guess the word'));
          gameLogic(4);
        } else if (answers.difficulty == 'Hard') {
          console.log(chalk.yellow('You have 3 chances to guess the word'));
          gameLogic(3);
        } else {
          console.log(chalk.red('You have 1 chance to guess the word'));
          gameLogic(1);
        }
      });
  });
};

//get user input
const askForGuess = () => {
  return new Promise((resolve) => {
    rl.pause();
    rl.question('Enter your guess: ', (input) => {
      rl.resume();
      resolve(input);
    });
  });
};
//===================================================//

//main logic
const gameLogic = async (lives) => {
  let word = await fetchWord();
  word = word.toUpperCase();
  let tries = 0;
  let wordArray = word.toUpperCase().split('');
  let attempt = '';

  // console.log(word);

  while (lives > 0) {
    const guess = await askForGuess(); // Wait for user input

    for (let i = 0; i < word.length; i++) {
      attempt = '';
      //winning condition
      if (word === guess.toUpperCase()) {
        tries++;
        gamesWon++;
        console.log(
          chalk.green(`congrats you guessed the word in ${tries} tries`)
        );
        streak++;
        endGame(word, chalk.green);
        return playAgain();
      }

      if (word[i] === guess[i].toUpperCase()) {
        console.log(
          chalk.green(
            `Letter '${guess[i].toUpperCase()}' is in the correct spot (${
              i + 1
            })`
          )
        );

        attempt += chalk.green(guess[i]);
      } else if (wordArray.includes(guess[i].toUpperCase())) {
        console.log(
          chalk.yellow(
            `Letter '${guess[
              i
            ].toUpperCase()}' is in the word but in the incorrect spot (${
              i + 1
            })`
          )
        );
        attempt += chalk.yellow(guess[i]);
      } else {
        console.log(
          chalk.red(`Letter '${guess[i].toUpperCase()}' is not in the word`)
        );
        attempt += chalk.red(guess[i]);
      }
      // console.log(attempt);
    }
    tries++;
    lives--;
    console.log(chalk.red(`${lives} chances remaining`));
  }
  streak = 0;
  endGame(word, chalk.red);
  playAgain();
};
//===================================================//

//display the correct word
const endGame = (word, color) => {
  gamesPlayed++;
  return figlet(word, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(color(data));
  });
};
//===================================================//

//play again prompt
const playAgain = () => {
  const playAgainPrompt = inquirer
    .prompt([
      {
        type: 'list',
        name: 'play_again',
        message: 'Would you like to play again?',
        choices: ['yes', 'no'],
      },
    ])
    .then((answers) => {
      //display selection
      console.log(`You selected: ${answers.play_again}`);
      if (answers.play_again == 'yes') {
        gameRules();
      } else {
        displaySummary();
      }
    });
};
//===================================================//

//show summary of user stats!
const displaySummary = () => {
  figlet('G A M E     O V E R !  !  !', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.red(data));
  });

  figlet(`G A M E S     P L A Y E D : ${gamesPlayed}`, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }

    console.log(chalk.blue(data));
  });

  figlet(`G A M E S     W O N : ${gamesWon}`, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.cyan(data));
  });

  figlet(`C u r r e n t     S t r e a k : ${streak}`, function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    streak > 0 ? console.log(chalk.green(data)) : console.log(chalk.red(data));
  });
};
//===================================================//

//start
(() => {
  gameRules();
})();
