const fs = require("fs");
const formatDate = require("date-fns/format")

class Logger{
    constructor(folder = "./", ext = "txt"){
        const now = new Date();

        if(folder != "./"){
            if(!fs.existsSync(folder)){
                fs.mkdir(folder, error => {
                    if(error){
                        console.error(">>> Creating dir error: ", error);
                    }
                }); 
            }
        }
        this.firstLog = true;
        this.fileName = folder + "/" + formatDate(now, formatDate(now,"yyyy-MM-ddTHH-mm-ss")) + `.${ext}`;
    }

    log(value) {
        return new Promise((resolve, reject) => {
            let val = this.firstLog ? value : `\r\n${value}`; 
            this.firstLog = false;
            fs.appendFile(`${this.fileName}`, val, 'utf8', error => {
                if(error){
                    console.error(">>> Logging error: ", error);
                    reject(">>> Logging error: ", error);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = Logger;