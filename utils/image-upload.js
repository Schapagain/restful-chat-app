
const path = require('path');
const appRoot = path.dirname(require.main.filename)
const multer = require('multer');
const uploadPath = appRoot.concat('/uploads');

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,uploadPath);
    },
    filename: (req,file,cb) => {
        const extension = file.originalname.split('.').pop();
        cb(null,req.params.username.concat('.',extension));
    },
});

const fileFilter = (req,file,cb) => {
    const acceptedFileTypes = new Set(['image/jpg','image/png','image/jpeg']);
    if(acceptedFileTypes.has(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error('Unacceptable image type. only jpg, jpeg and png supported.'));
    }

};

const limits = {
    fileSize: 1024*1024*10,
};

var upload = multer({storage,limits,fileFilter});
module.exports = upload;