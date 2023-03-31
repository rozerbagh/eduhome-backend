import multer from "multer";
const { diskStorage } = multer;

const multerFilter = (req, file, cb) => {
	console.log("getting inside multer",file);
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	}
	else if(file.mimetype.startsWith("video")){
		cb(null, true);
	} else {
		cb("Please upload only images.", false);
	}
};

const storage = diskStorage({
	destination: function (req, file, cb) {
		if(req.files?.media_file) cb(null, './uploads/media_file');
		else if (req.files?.category_icon) cb(null, './uploads/category_icom');
		else if (req.files?.state_icon) cb(null, './uploads/state_icom');
		else if (req.files?.category_icon) cb(null, './uploads/image');
		else cb(null, './uploads/pictures');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
})


const upload = multer({
	storage: storage,
	fileFilter: multerFilter
});

export default upload;
