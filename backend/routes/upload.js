// routes/upload.js
const express = require('express');
const multer = require('multer');
const { distributeTasks } = require('../controllers/uploadController');
const Lead = require('../models/Lead');

const router = express.Router();


const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowedExt = ['.csv', '.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLS, XLSX files are allowed'));
  }
};

const upload = multer({ dest: 'uploads/', fileFilter });

// Route to upload CSV and distribute tasks
router.post('/', upload.single('csvFile'), distributeTasks);

router.get('/leads/:agentId', async (req, res) => {
  try {
    const leads = await Lead.find({ agent: req.params.agentId });  // changed assignedTo to agent
    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leads for agent' });
  }
});


module.exports = router;
