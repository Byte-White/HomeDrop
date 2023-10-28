const express = require('express');
const os = require('os');
const multer = require('multer');
const path = require('path'); // Import the 'path' module
const fs = require('fs');
const app = express();
const qrcode = require('qrcode-terminal');

const PORT = process.env.PORT || 5000; // Use the port you prefer

const ejs = require('ejs');



let settings;
//read settings.json
fs.readFile('settings.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  settings = JSON.parse(data);
  // Validate settings here
  if (!settings || !settings.file_settings || !settings.file_settings.maxfilesize || !settings.file_settings.maxfiles) {
    console.error('Invalid settings in settings.json');
    return;
  }

  // Configure multer for handling file uploads
  const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const upload = multer({
    storage,
    limits: { 
      fileSize: settings.file_settings.maxfilesize * 1024 * 1024,
      files: settings.file_settings.maxfiles
    }
    
  });

  // Middleware to parse JSON and handle CORS (if needed)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //let whitelist = [];
  
  // Custom middleware for logging IP addresses and requests
app.use((req, res, next) => {
  const clientIP = req.ip; // Get the client's IP address
  const method = req.method; // HTTP request method (GET, POST, etc.)
  const url = req.url; // Request URL
  
  // Log the IP address and request details
  console.log(`Client IP: ${clientIP} | Method: ${method} | URL: ${url}`);
  let answer='y';
  /*if(!whitelist.includes(clientIP))
  {
    answer = readline(`Allow user \'${clientIP}\'?(y/n)`).toLowerCase();
    if(answer==='y') whitelist.push(clientIP);
  }
  if(answer === 'y')*/ next(); // Continue processing the request
  //else res.sendStatus(500).send('Access denied.');
});

// Serve static files (React app)
app.use(express.static(path.join(__dirname, '../client/build')));
  
  //---------UPLOAD TO SERVER------------  
  app.post('/HomeDrop/', upload.array('fileInput', settings.file_settings.maxfiles), (req, res) => {
    // req.file contains the uploaded file(s) details
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Here, you can handle the uploaded file, e.g., move it to a different location, save its details to a database, etc.
    
    return res.status(200).json({ message: 'File(s) uploaded successfully.' });
  });
  

  //-------DOWNLOAD FROM SERVER---------
  app.get('/Download/', (req, res) => {
    /*OR
        app.get('/Download/', (req, res) => {
        const downloadFolderPath = path.join(__dirname, 'uploads');
        fs.readdir(downloadFolderPath, (err, files) => {
          if (err) {
            console.error('Error reading download folder:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          console.log("files:");
          console.log(files);
          res.json({ files }); // Send the list of files as JSON
        });
        });
    */
    const downloadFolderPath = path.join(__dirname, 'uploads');
    fs.readdir(downloadFolderPath, (err, files) => {
        if (err) {
            console.error('Error reading download folder:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        // Render the download.ejs template and pass the list of files
        res.render('download', { files });
    });
  });
  app.get('/Download/:filename',(req,res)=>{
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads/',filename);
    res.sendFile(filePath);
  });

  // Serve React app for any unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  
app.set('view engine', 'ejs'); // Set EJS as the view engine

// app.get('/download', (req, res) => {
//   // Read the list of files in the download folder
//   const downloadFolderPath = path.join(__dirname, 'uploads');
//   fs.readdir(downloadFolderPath, (err, files) => {
//     if (err) {
//       console.error('Error reading download folder:', err);
//       return res.status(500).send('Internal Server Error');
//     }
    
//     // Render the download page and pass the list of files
//     res.render('download', { files. });
//   });
// });

  
// Get the local IP address of the device
function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.includes('192.168')) {
        return iface.address;
      }
    }
  }

  return null;
}

const serverIPAddress = getLocalIPAddress();

  // Start the server
  app.listen(PORT,serverIPAddress, () => {
    console.log(`Server(${serverIPAddress}) is running on port ${PORT}`);
    if(settings.server.showqrcode && serverIPAddress != null)
    {
      const data = `http://${serverIPAddress}:${PORT}`; // Change this URL as needed

      // Generate and display the QR code in the console
      qrcode.generate(data, { small: true }, (qrCode) => {
        console.log(data);
        console.log(qrCode);
      });
    }
  });
});