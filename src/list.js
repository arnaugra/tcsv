import fs from 'fs';
import csvParse from 'csv-parse';
import Table from 'cli-table';

import { paginate, cols, fileName } from './variables.js';

/**
 * List the content of the file in a table paginated by 10
 * @returns {Promise} Promise object represents the table
 */
export function list() {
    
    return new Promise((resolve, reject) => {
        const table = new Table();
        let line = 0;

        //read the file and parse it to csv
        fs.createReadStream(fileName.value)
            .on('error', (err) => { //if file doesn't exist or is not a csv file, reject the promise
                reject('This file does not exist or doesn\'t have the `csv` format!');
            })
            .pipe(csvParse())//parse the csv file
            .on('data', (data) => { //for each line, push it to the table
                if (line === 0) {
                    cols.value = ['p_ID', ...data];
                    table.options.head = cols.value;
                } else {
                    let content = [line.toString(), ...data];
                    if (paginate.search.state) {
                        if (content[paginate.search.column].toString().toLowerCase().includes(paginate.search.value.toLowerCase())) {
                            table.push(content);
                        }
                    } else if (line >= paginate.first && line <= paginate.last) {
                        table.push(content)
                    }
                };
                paginate.total = line;
                line++;
            })
            .on('end', () => { //when the file ends, resolve the promise
                const tableStr = table.toString();
                paginate.totalPages = paginate.full ? 1 : Math.ceil(paginate.total / paginate.limit);
                paginate.search.state = false;
                resolve(tableStr);
            })
            .on('error', (err) => { //if there is an error, reject the promise
                reject('You have a mistake on the line `' + err.message.split(' ').slice(-1)[0] + '` go and check it!');
            });
        });
}
