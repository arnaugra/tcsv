
//pagination object
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
export const STATE = {
    CURRENT: 'START',
    QUIT: 'QUIT',
    START: 'START',
    LIST: 'LIST',
};

//name of the file to be read if given as argument, else undefined
export let fileName = {
    "value": process.argv[2] ? process.argv[2].concat('.csv') : undefined
}

//array of column names
export let cols = {
    "value": []
};
