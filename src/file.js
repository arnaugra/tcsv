import fs from 'fs';
import readlineSync from 'readline-sync';
import Table from 'cli-table';

import { STATE, fileName } from './variables.js';

/**
 * If file indicated, read it, else list all files in current directory with .csv extension and ask for file name
 */
export function getFile() {
    //if no file name is given, list all files in current directory
    if (fileName.value === undefined) {
        const path = fs.readdirSync('./');

        console.log('List of files in current directory');
        const files = new Table({ head: ['File name (csv only)'] });
        path.forEach(file => {
            file.endsWith('.csv') ? files.push([file]) : null;
        });
        console.log(files.toString() + '\n');

        console.log('Enter the name of the file you want to read (without the extension)');
        fileName.value = readlineSync.question(' > ').concat('.csv');
        
    }
    
    STATE.CURRENT = STATE.LIST;
    
    //check if file exists
    if (!fs.existsSync(fileName.value)) {
        console.log(`File '${fileName.value}' does not exist!`);
        STATE.CURRENT = STATE.QUIT;
    }
}

/**
 * Print the name of the file in a box
 */
export function fileTitle(file) {
    console.log('┌' + '─'.repeat(file.length + 2) + '┐')
    console.log('│ ' + file + ' │')
    console.log('└' + '─'.repeat(file.length + 2) + '┘');
}