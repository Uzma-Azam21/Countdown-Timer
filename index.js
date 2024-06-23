#! /usr/bin/env node
// CLI based Countdown Timer by using Javascript:
import inquirer from "inquirer";
import chalk from "chalk";
async function getTimerInput() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "hours",
            message: chalk.bold("Enter hours:"),
            default: 0,
            validate: function (input) {
                const isValid = !isNaN(parseInt(input)) && parseInt(input) >= 0;
                return isValid || chalk.red("Please enter a valid number of hours");
            },
        },
        {
            type: "input",
            name: "minutes",
            message: chalk.bold("Enter minutes:"),
            default: 0,
            validate: function (input) {
                const isValid = !isNaN(parseInt(input)) && parseInt(input) >= 0;
                return isValid || chalk.red("Please enter a valid number of minutes");
            },
        },
        {
            type: "input",
            name: "seconds",
            message: chalk.bold("Enter seconds:"),
            default: 0,
            validate: function (input) {
                const isValid = !isNaN(parseInt(input)) && parseInt(input) >= 0;
                return isValid || chalk.red("Please enter a valid number of seconds");
            },
        },
    ]);
    return {
        hours: parseInt(answers.hours),
        minutes: parseInt(answers.minutes),
        seconds: parseInt(answers.seconds),
    };
}
async function askToContinue() {
    const answers = await inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: chalk.cyan.bold("\nDo you want to continue the countdown? (Y/n)\n"),
            default: true,
        },
    ]);
    return answers.continue;
}
function formatTimeUnit(value) {
    return value.toString().padStart(2, "0");
}
async function startCountdown(duration) {
    let totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
    const countdown = () => {
        const interval = setInterval(() => {
            if (totalSeconds <= 0) {
                console.log(chalk.blue.bold("\nCountdown finished!"));
                clearInterval(interval);
                return;
            }
            totalSeconds--;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            console.log(chalk.bold(`Time remaining: ${hours}h ${formatTimeUnit(minutes)}m ${formatTimeUnit(seconds)}s`));
        }, 1000);
    };
    // Run for 1 second before asking the user
    const initialInterval = setInterval(async () => {
        if (totalSeconds <= 0) {
            console.log(chalk.blue.bold("Countdown finished!"));
            clearInterval(initialInterval);
            return;
        }
        totalSeconds--;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        console.log(chalk.bold(`\nTime remaining: ${hours}h ${formatTimeUnit(minutes)}m ${formatTimeUnit(seconds)}s`));
        clearInterval(initialInterval);
        const shouldContinue = await askToContinue();
        if (shouldContinue) {
            countdown();
        }
        else {
            console.log(chalk.blue.bold("\nCountdown has been stopped."));
        }
    }, 1000);
}
async function main() {
    const timerInput = await getTimerInput();
    startCountdown(timerInput);
}
main().catch((error) => {
    console.error(chalk.bold("An error occurred:", error));
});
