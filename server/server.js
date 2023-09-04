const express = require('express');
const os = require('os');
const multer = require('multer');
const path = require('path'); // Import the 'path' module
const fs = require('fs');
const app = express();
const qrcode = require('qrcode-terminal');

const PORT = process.env.PORT || 5000; // Use the port you prefer


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

  // Serve static files (React app)
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve React app for any unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  app.post('/HomeDrop/', upload.array('fileInput', settings.file_settings.maxfiles), (req, res) => {
    // req.file contains the uploaded file(s) details
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Here, you can handle the uploaded file, e.g., move it to a different location, save its details to a database, etc.

    return res.status(200).json({ message: 'File(s) uploaded successfully.' });
  });

  
// Get the local IP address of the device
function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
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