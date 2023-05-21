
//pagination object
/**
 * @typedef {Object} paginate
 * @property {boolean} full - if true, the table will show all the entries
 * @property {Object} search - object to control the search
 * @property {boolean} search.state - if true, the table will show only the entries that match the search
 * @property {number} search.column - the column to search
 * @property {string} search.value - the value to search
 * @property {number} page - the current page
 * @property {number} limit - the number of entries per page
 * @property {number} first - the first entry to show
 * @property {number} last - the last entry to show
 * @property {number} total - the total number of entries
 * @property {number} totalPages - the total number of pages
 * @property {string} message - message to display error information
 */
export const paginate = {
    full: false,
    search: {
        state: false,
        column: null,
        value: null
    },
    page: 1,
    limit: 10,
    first: 1,
    last: 10,
    total: null,
    totalPages: null,
    message: ''
};

//state machine to control the flow of the program
/**
 * @typedef {Object} STATE
 * @property {string} CURRENT - the current state
 * @property {string} QUIT - the state to quit the program
 * @property {string} START - the state to start the program
 * @property {string} LIST - the state to list the content of the file
 */
export const STATE = {
    CURRENT: 'START',
    QUIT: 'QUIT',
    START: 'START',
    LIST: 'LIST',
};

//name of the file to be read if given as argument, else undefined
/**
 * @typedef {Object} fileName
 * @property {string} value - the name of the file to be read
 * @default undefined
 */
export let fileName = {
    "value": process.argv[2] ? process.argv[2].concat('.csv') : undefined
}

//array of column names
/**
 * @typedef {Object} cols
 * @property {string[]} value - the array of column names
 */
export let cols = {
    "value": []
};
