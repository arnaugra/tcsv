import fs from 'fs';
import csvParse from 'csv-parse';
import readlineSync from 'readline-sync';
import Table from 'cli-table';

clear();

//state machine to control the flow of the program
const STATE = {
    CURRENT: 'START',
    QUIT: 'QUIT',
    START: 'START',
    LIST: 'LIST',
};

//name of the file to be read if given as argument, else undefined
let fileName = process.argv[2];

//pagination object
const paginate = {
    full: false,
    search: false,
    page: 1,
    limit: 10,
    first: 1,
    last: 10,
    total: null,
    totalPages: null,
    message: ''
};

//main loop
while (true) {
    //check if user wants to quit
    if (STATE.CURRENT === STATE.QUIT) break;

    clear();

    //switch to control the flow of the program
    switch (STATE.CURRENT) {
        case 'START':
            getFile();
            break;

        case 'LIST':
            await list(fileName)
                .then((table) => {
                    fileTitle(fileName);
                    console.log(table);
                    control();
                })
                .catch((err) => {
                    STATE.CURRENT = STATE.QUIT;
                    console.log(err)
                });
            break;
    }

}

/**
 * Clear the console
 */
function clear() {
    process.stdout.write('\x1Bc');
}

/**
 * Print the name of the file in a box
 */
function fileTitle(file) {
    console.log('┌' + '─'.repeat(file.length + 2) + '┐')
    console.log('│ ' + file + ' │')
    console.log('└' + '─'.repeat(file.length + 2) + '┘');
}

/**
 * Manage the different options of the program.
 * Quit, Next, Previous, First page, Last page, All entries, Search
 */
function control() {
    console.log(`${paginate.page} - ${paginate.totalPages} (${paginate.total}) ${paginate.message}\n`);
    console.log('= OPTIONS ==============================');
    console.log('\x1b[38;2;128;128;128;128m%s\x1b[0m', '\'*\' mean not done yet');
    console.log('[F]irst / [N]ext / [P]revious / [L]ast');
    console.log('[A]ll data / *[S]earch')
    console.log('[Q]uit\n');
    let input = readlineSync.question(` > `);

    paginate.message = '';
    STATE.CURRENT = STATE.LIST;

    //switch to control the actions of the program
    switch (input.toUpperCase()) {
        case 'Q':
            STATE.CURRENT = STATE.QUIT;
            break;

        case 'N':
            if (paginate.page != paginate.totalPages || paginate.full) {
                paginate.page++;
                paginate.first += paginate.limit;
                paginate.last += paginate.limit;
                paginate.full = false;
            } else {
                paginate.message = 'Already on last page';
            }
            break;

        case 'P':
            if (paginate.page != 1 || paginate.full) {
                paginate.page--;
                paginate.first -= paginate.limit;
                paginate.last -= paginate.limit;
                paginate.full = false;
            } else {
                paginate.message = 'Already on first page';
            }
            break;

        case 'L':
            if (paginate.page != paginate.totalPages || paginate.full) {
                paginate.page = paginate.totalPages;
                paginate.first = paginate.totalPages * paginate.limit - paginate.limit;
                paginate.last = paginate.total;
                paginate.full = false;
            } else {
                paginate.message = 'Already on last page';
            }
            break;

        case 'F':
            if (paginate.page != 1 || paginate.full) {
                paginate.page = 1;
                paginate.first = 1;
                paginate.last = 10;
                paginate.full = false;
            } else {
                paginate.message = 'Already on first page';
            }
            break;

        case 'A':
            if (!paginate.full) {
                paginate.page = 1;
                paginate.first = 1;
                paginate.last = paginate.total;
                paginate.full = true;
            } else {
                paginate.message = 'Already seeing all entries';
            }
            break;

        default:
            paginate.message = 'Invalid input';
            break;
    }
}

function getFile() {
    //if no file name is given, list all files in current directory
    if (fileName === undefined) {
        const path = fs.readdirSync('./');

        console.log('List of files in current directory');
        const files = new Table({ head: ['File name (csv only)'] });
        path.forEach(file => {
            file.endsWith('.csv') ? files.push([file]) : null;
        });
        console.log(files.toString() + '\n');

        console.log('Enter the name of the file you want to read (without the extension)');
        fileName = readlineSync.question(' > ').concat('.csv');

    }

    STATE.CURRENT = STATE.LIST;

    //check if file exists
    if (!fs.existsSync(fileName)) {
        console.log(`File '${fileName}' does not exist!`);
        STATE.CURRENT = STATE.QUIT;
    }
}

/**
 * List the content of the file in a table paginated by 10
 * @returns {Promise} Promise object represents the table
 */
function list(name) {
    return new Promise((resolve, reject) => {
        const table = new Table();
        let line = 0;

        //read the file and parse it to csv
        fs.createReadStream(name)
            .on('error', (err) => { //if file doesn't exist or is not a csv file, reject the promise
                reject('This file does not exist or doesn\'t have the `csv` format!');
            })
            .pipe(csvParse())//parse the csv file
            .on('data', (data) => { //for each line, push it to the table
                if (line === 0) {
                    table.options.head = ['p_ID', ...data]
                } else {
                    line >= paginate.first && line <= paginate.last ? table.push([line, ...data]) : null;
                };
                paginate.total = line;
                line++;
            })
            .on('end', () => { //when the file ends, resolve the promise
                const tableStr = table.toString();
                paginate.totalPages = paginate.full ? 1 : Math.ceil(paginate.total / paginate.limit);
                resolve(tableStr);
            })
            .on('error', (err) => { //if there is an error, reject the promise
                reject('You have a mistake on the line `' + err.message.split(' ').slice(-1)[0] + '` go and check it!');
            });
    });
}