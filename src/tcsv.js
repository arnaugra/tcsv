
import { list } from "./list.js";
import { control, clear } from "./control.js";
import { getFile, fileTitle } from "./file.js";
import { fileName, cols, STATE } from "./variables.js";

export default async function app() {
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
                await list()
                    .then((table) => {
                        fileTitle(fileName.value);
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
}