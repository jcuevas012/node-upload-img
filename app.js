const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

//set multer storage

const storage = multer.diskStorage({
	destination: './public/uploads',
	filename: function(req, file, callback){
		callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
	}
})

//set upload
const upload = multer({
	storage,
	limits: {fileSize: 100000000},
	fileFilter: function(req, file, callback){
		checkFileType(file, callback)
	}
}).single('image')

function checkFileType(file, callback){
	//Allow ext
	const fileType = /jpg|jpeg|png|gif/
	//check ext
	const extname = fileType.test(path.extname(file.originalname).toLowerCase())
	//check mime
	const mimeType = fileType.test(file.mimetype)

	return extname && mimeType ? callback(null, true) : callback('Error: Img Only');
}

const port = 3000
const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if(err){
			res.render('index', {msg: err})
		}else {
			if (req.file === undefined){
				res.render('index', {msg: 'Not image selected'})
			} else {
				res.render('index', {msg: 'Imgage Uploaded', file: `uploads/${req.file.filename}`})
				//res.render('index', {msg: 'Image Uploaded', file: `uploads/${req.file.filename}`})
			}
		}

	})
})

app.listen(port, (req, res) => {
	console.log(`server start on port ${port} `)
})
