const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const zipLocal = require('zip-local');

const fs = require('fs');

fileslen = 0;
// directory path
const dir = '/Users/shanmuk/Documents/Stuff/scripts/file_uploader_prj/server/public';

app.use(cors());
app.use(express.static('public'));

createFolder()

function createFolder() {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log(`${dir} is created!`)
        }
    } catch (err) {
        console.error(err);
    };
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage}).array('file');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }

        zipFolder();
        
        return res.status(200).send(req.files)

        
    });
    
});

async function zipFolder() {
    if (! (await isDirEmpty()))
    {
        await zipLocal.sync.zip(dir).compress().save("archive.zip")

        console.log("zipped public folder")
        
    }
    deleteFolder()
}

function isDirEmpty() {
    return fs.promises.readdir(dir).then(files => {
            console.log("public folder empty?")
            return files.length === 0;
    });
}



app.listen(8000, () => {
    console.log('App is running on port 8000')
});

function deleteFolder()
{
    fs.rmSync(dir, { recursive: true, force: true })
    console.log("deleted public folder")
    createFolder()
}