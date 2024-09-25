const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 设置存储路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 图片上传接口
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    console.log(file);

    // 这里可以添加图片处理逻辑
    // 例如使用第三方库进行图片处理

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: file.filename,
      filePath: `/uploads/${file.filename}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});