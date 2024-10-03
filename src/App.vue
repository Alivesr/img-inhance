<template>
  <div class="container">
    <!-- 左侧上传和图片列表 -->
    <div class="upload-section">
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :before-upload="handleUpload"
        list-type="picture"
        multiple
      >
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            仅支持jpg/png 格式 大小不能超过500kb
          </div>
        </template>


        <!-- 自定义文件列表 -->

        <template #file="slotProps">
          <div 
            class="custom-file-item" 
            :class="{ active: selectedImage === slotProps.file.url }"
            @click="handlePreview(slotProps.file)"
          >
            <el-image  :src="slotProps.file.url"  class="thumbnail" alt="缩略图" />
              <span class="file-name">{{ slotProps.file.name }}</span>
          </div>
          <el-icon size="20" class="cls-btn" @click="removeFile(slotProps.file)">
            <el-icon-close />
          </el-icon>
        </template>

      </el-upload>
    </div>

    <!-- 右侧图片查看区域 -->

    <div class="image-preview-container">
      <div class="image-preview-box">
        <!-- 处理前 -->
        <div class="image-preview">
          <div class="title">处理前</div>
          <el-image v-if="selectedImage" :src="selectedImage" alt="预览" class="full-image" @click="openImageDialog" />
          <p v-else>选择图片进行预览</p>
        </div>


        <!-- 处理后 -->

        <div class="image-preview">
          <div class="title">处理后</div>
          <img v-if="processedImage" alt="预览" :src="processedImage" class="full-image"  @click="openProcessedImageDialog"/>
          <p v-else>选择图片进行预览</p>
        </div>

      </div>

      <div class="function">
        <el-button class="btn" type="success" @click="enlargeImageHandler">gamma</el-button>
        <el-button class="btn" type="success" @click="equalImageHandler">equal</el-button>
        <el-button class="btn" type="success" @click="processImages">去雾</el-button>
        <el-button class="btn" type="success" @click="previewbtn">预览</el-button>
        <el-button class="btn" type="success" @click="clearUploads">清空</el-button>

        <el-button class="btn" type="success" @click="handleRestoreOriginalImage">恢复</el-button>
        <el-button class="btn" type="danger" @click="downloadImage">下载</el-button>
      </div>

    </div>

    <!-- 点击放大图片弹窗 -->
    <div>
      <el-dialog v-model="imageDialogVisible" width="60%" :append-to-body="true">
        <img :src="selectedImage" alt="放大图片" class="enlarged-image" />
      </el-dialog>
    </div>
    <div>
      <el-dialog custom-class="details_class" v-model="processedImageDialogVisible" width="60%" :append-to-body="true">
        <img :src="processedImage" alt="放大图片" class="enlarged-image" />
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { uploadImage, enlargeImage, equalImage,restoreOriginalImage} from './apis/index'; // 引入封装的API
import axios from 'axios';


const fileList = ref([]); // 文件列表
const selectedImage = ref(null); // 当前选中的图片
const imageDialogVisible = ref(false); // 控制图片弹窗的显示
const processedImageDialogVisible = ref(false);
const processedImage = ref(null); // 处理后的图片 URL
const originalImage = ref(null);
const downloadIamge = ref(null);
import { ElMessage } from 'element-plus'
// 处理文件上传逻辑

const clearUploads = async () => {
  try {
    await axios.delete('http://localhost:5000/clear_uploads');
    console.log('上传路径中的图片已清空');
  } catch (error) {
    console.error('清空上传路径失败', error);
  }
};

const handleUpload = async (rawFile) => {
  try {
    const response = await uploadImage(rawFile); 
    console.log(response,'res')// 使用抽离的 API
    fileList.value.push({
      name: rawFile.name,
      url: response.data.url, // 从 API 响应中获取图片的 URL
    });
  } catch (error) {
    console.error('上传失败', error);
  }

  return false; // 阻止默认上传行为
};

// 点击图片进行预览
const handlePreview = (file) => {
  console.log(file)
  selectedImage.value = file.url || null;
  originalImage.value = file.url || null
};

// 打开放大图片的弹窗
const openImageDialog = () => {
  if (selectedImage.value) {
    imageDialogVisible.value = true;
  } else {
    console.error('没有可放大的图片');
  }
};

const openProcessedImageDialog = () => {
  if (processedImage.value) {
    processedImageDialogVisible.value = true;
  }
};

// 删除图片
const removeFile = (file) => {
  fileList.value = fileList.value.filter(f => f.url !== file.url);

  if (selectedImage.value === file.url) {
    selectedImage.value = null;
  }
};

// 监听 fileList 的变化，当列表为空时清空预览图片
watch(fileList, (newList) => {
  if (newList.length === 0) {
    selectedImage.value = null;
  }
});

// 增强图片
const enlargeImageHandler = async () => {
  if (!selectedImage.value) {
    console.error('没有可放大的图片');
    return;
  }

  const filename = selectedImage.value.split('/').pop();

  try {
    const response = await enlargeImage(filename); // 调用封装的增强 API
    const blob = response.data;
    
    // 创建一个 URL 以显示增强后的图片
    const processedImageUrl = URL.createObjectURL(blob);
    
    // 将增强后的图片显示在右侧
    processedImage.value = processedImageUrl;
    downloadIamge.value =processedImage.value
  } catch (error) {
    console.error('增强图片失败', error);
  }
};

const equalImageHandler = async () => {
  if (!selectedImage.value) {
    console.error('没有可放大的图片');
    return;
  }

  const filename = selectedImage.value.split('/').pop();

  try {
    const response = await equalImage(filename); // 调用封装的增强 API
    const blob = response.data;

    // 创建一个 URL 以显示增强后的图片
    const processedImageUrl = URL.createObjectURL(blob);

    // 将增强后的图片显示在右侧
    processedImage.value = processedImageUrl;
    downloadIamge.value =processedImage.value
  } catch (error) {
    console.error('增强图片失败', error);
  }
};


// 恢复原图
const handleRestoreOriginalImage = async () => {
  if (!originalImage.value) {
    console.error('没有可恢复的原图');
    return;
  }

  const filename = originalImage.value.split('/').pop();

  try {
    const blob = await restoreOriginalImage(filename); // 调用 API 函数
    if (!(blob instanceof Blob)) {
      throw new Error('返回的数据不是 Blob 对象');
    }
    
    processedImage.value = URL.createObjectURL(blob); // 创建 Blob URL
    downloadIamge.value = processedImage.value; // 设置下载链接为 Blob URL
  } catch (error) {
    console.error('恢复原图失败', error);
  }
};
const processImages = async () => {
  try {
    const response = await axios.post('http://localhost:5000/process_images');
    const downloadLinks = response.data.download_links;

    
     ElMessage({
      message: '所有图片处理完成！',
      type: 'success',
    });

    console.log('处理完成:', response.data.message);
    console.log('下载链接:', downloadLinks);
  } catch (error) {
    console.error('处理图片失败:', error.response.data.error);
  }
};
const previewbtn = async () => {
  if (!selectedImage.value) {
    console.error('没有可预览的图片');
    return;
  }

  
  const filename = selectedImage.value.split('/').pop(); // 获取文件名
  const baseName = filename.split('.').slice(0, -1).join('.'); // 获取不带后缀的文件名
  const extension = filename.split('.').pop(); // 获取后缀
  const newFilename = `${baseName}_processed.${extension}`; // 在后缀前添加内容 // 获取当前选中图片的文件名

   try {
    // 调用后端接口获取处理后的图片
    const response = await axios.get(`http://localhost:5000/result/${newFilename}`, {
      responseType: 'arraybuffer', // 指定返回数据类型为 ArrayBuffer
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'image/png' }); // 创建 Blob 对象
      processedImage.value = URL.createObjectURL(blob); 
      downloadIamge.value =processedImage.value// 创建 URL 以显示图像
    } else {
      console.error('无法获取处理后的图片:', response.statusText);
    }
  } catch (error) {
    console.error('获取处理后的图片失败', error);
  }
};

// 下载图片
const downloadImage = () => {
  if (!processedImage.value) {
    console.error('没有可下载的处理后图片');
    return;
  }

  // 创建一个临时的 a 标签用于下载
  const link = document.createElement('a');
  link.href = downloadIamge.value; // 设置 href 为处理后的图片 URL
  link.download = 'processed-image.jpg'; // 设置下载的文件名
  link.click(); // 模拟点击触发下载
};
</script>









<style>
.container {
  height: 95vh;
  width: 95vw;
  display: flex;
  justify-content: space-between;
}


.upload-section {
  width: 350px;
  max-height: 90vh;
  overflow-y: scroll;
}

.custom-file-item {
  width: 330px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;

}
/* 预览弹窗 */


.thumbnail {
  width: 110px;
  max-height: 100px;
   /* 固定高度 */
  object-fit: contain; /* 保持图片比例且完整显示 */
  border-radius: 5px;
}
.cls-btn{
  cursor: pointer;
}

.file-name {
  text-align: left;
  margin-left: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
   /* 限制文件名显示的最大宽度 */
}
.active {
  border: 1px solid #409EFF; /* 设置高亮边框 */
  border-radius: 5px;
  background-color: #ffffff; /* 设置高亮背景颜色 */
}
.image-preview-container {
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 90vh; /* 保持固定高度 */
   /* 让容器根据可用空间进行伸展 */
}
.image-preview-box {
  display: flex;
  width: 100%; 
  height: 700px;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.function{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.btn{
  max-width: 100px;
}
.title {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  top: 15px;
}

.image-preview {
  height: 80%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid #dadada;
}

.image-preview:first-of-type {
  margin-right: 25px;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.details_class .el-dialog__body{
  display: flex;
  justify-content: center;
}

.enlarged-image {
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>