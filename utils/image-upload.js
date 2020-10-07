

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
const limits = {
    fileSize: 1024*1024*10,
};
var upload = multer({storage,limits});
module.exports = upload;