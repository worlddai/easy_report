import EasyReport from './classes/EasyReport';
// import MODE from './enum/mode'

// const instance =null;
const ER = {
    version: "1.0.0",

    getInstance(parent, opts) {
        return new EasyReport(parent, opts);;
    }   

};



export default ER;