// // // routes/upload.js
// // const express = require('express');
// // const multer = require('multer');
// // const { distributeTasks } = require('../controllers/uploadController');
// // const Lead = require('../models/Lead');

// // const router = express.Router();


// // const path = require('path');

// // const fileFilter = (req, file, cb) => {
// //   const allowedExt = ['.csv', '.xls', '.xlsx'];
// //   const ext = path.extname(file.originalname).toLowerCase();
// //   if (allowedExt.includes(ext)) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error('Only CSV, XLS, XLSX files are allowed'));
// //   }
// // };

// // const upload = multer({ dest: 'uploads/', fileFilter });

// // // Route to upload CSV and distribute tasks
// // router.post('/', upload.single('csvFile'), distributeTasks);

// // router.get('/leads/:agentId', async (req, res) => {
// //   try {
// //     const leads = await Lead.find({ agent: req.params.agentId });  // changed assignedTo to agent
// //     res.status(200).json({ leads });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Error fetching leads for agent' });
// //   }
// // });


// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const uploadController = require('../controllers/uploadController');

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter: only allow CSV
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.csv'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (!allowedTypes.includes(ext)) {
//     return cb(new Error('Only CSV files are allowed'));
//   }
//   cb(null, true);
// };

// // const upload = multer({ storage, fileFilter });
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const { distributeTasks } = require('../controllers/uploadController'); // ✅ Correct way

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedExt = ['.csv'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedExt.includes(ext)) cb(null, true);
//   else cb(new Error('Only CSV files are allowed'));
// };

// const upload = multer({ storage, fileFilter });

// router.post('/', upload.single('file'), distributeTasks); // ✅ Must pass function

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { distributeTasks } = require('../controllers/uploadController');
const authenticateToken = require('../middleware/verifyToken'); // ✅ Added

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExt = ['.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) cb(null, true);
  else cb(new Error('Only CSV files are allowed'));
};

const upload = multer({ storage, fileFilter });

// ✅ FIX: Added authenticateToken before upload.single
router.post('/', authenticateToken, upload.single('file'), distributeTasks);

module.exports = router;
