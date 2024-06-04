const multer = require("multer");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
    destination:(request, file, cb) => {
        cb(null, __dirname+'/public/img');
    },
    filename:(request, file, cb) => {
        cb(null, file.originalname);
    }
});


const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const validaPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

const uploader = multer({storage: storage});

module.exports = {uploader, generaHash, validaPassword};