const fs = require("fs");
const formatDate = require("date-fns/format")

class Logger{
    constructor(folder = "./", prefix = "", ext = "txt"){
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
        this.fileName = `${folder}/${prefix}${formatDate(now,"yyyy-MM-dd")}T${formatDate(now,"HH-mm-ss")}.${ext}`;
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