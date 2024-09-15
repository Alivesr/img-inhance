<template>
  <div class="container">
    <!-- 左侧上传和图片列表 -->
    <div class="upload-section">
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :before-upload="handleUpload"
        :on-preview="handlePreview"
        list-type="picture"
        multiple
      >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>

    </div>

    <!-- 右侧图片查看区域 -->
    <div class="image-preview">
      <img v-if="selectedImage" :src="selectedImage" alt="Preview" class="full-image" />
      <p v-else>Select an image to preview</p>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
const fileList = ref<UploadUserFile[]>([])  // 文件列表
const selectedImage = ref<string | null>(null)  // 当前选中的图片

// 处理文件上传逻辑
const handleUpload = (rawFile: File) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    const url = event.target?.result as string
    fileList.value.push({
      name: rawFile.name,
      url,
    })
  }
  reader.readAsDataURL(rawFile)
  return false // 阻止默认上传行为
}

// 点击图片进行预览
const viewImage = (url: string) => {
  selectedImage.value = url
}

// 预览图片
const handlePreview = (file: UploadUserFile) => {
  selectedImage.value = file.url || null
}
</script>
<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.upload-section {
  width: 500px; /* 左侧上传和图片列表的宽度 */
}

.image-list {
  width: 70px;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}

.image-list li {
  margin: 10px;
  cursor: pointer;
}

.thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 2px solid #ddd;
  transition: transform 0.3s;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.image-preview {
  width: 50%; /* 右侧图片查看区域的宽度 */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  padding: 20px;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>