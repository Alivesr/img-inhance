<template>
  <div class="container">
    <!-- 左侧上传和图片列表 -->
    <div class="upload-section">
      <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :before-upload="handleUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"  
        list-type="picture"
        multiple
      >
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            仅支持jpg/png 格式 大小不能超过500kb
          </div>
        </template>
      </el-upload>
    </div>

    <!-- 右侧图片查看区域 -->
  
        <div class="image-preview-box">
          <!-- 处理前 -->
          <div class="image-preview">
            <div class="title">处理前</div> <!-- 添加标题 -->
            <img v-if="selectedImage" :src="selectedImage" alt="Preview" class="full-image" />
            <p v-else>选择图片进行预览</p>
          </div>

          <!-- 处理后 -->
          <div class="image-preview">
            <div class="title">处理后</div> <!-- 添加标题 -->
            <img v-if="0" alt="Preview" class="full-image" />
            <p v-else>选择图片进行预览</p>
          </div>
        </div>

    
  </div>
</template>


<script setup>
import { ref } from 'vue'

const fileList = ref([])  // 文件列表
const selectedImage = ref(null)  // 当前选中的图片

// 处理文件上传逻辑
const handleUpload = (rawFile) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    const url = event.target?.result
    fileList.value.push({
      name: rawFile.name,
      url,
    })
  }
  reader.readAsDataURL(rawFile)
  return false // 阻止默认上传行为
}

// 点击图片进行预览
const viewImage = (url) => {
  selectedImage.value = url
}

// 预览图片
const handlePreview = (file) => {
  selectedImage.value = file.url || null
}

// 删除图片时清空右侧预览区
const handleRemove = (file, fileList) => {
  // 如果删除的图片是当前预览的图片，清空预览区
  if (selectedImage.value === file.url) {
    selectedImage.value = null
  }
}
</script>



<style scoped>
.container {
  height: 95vh;
  width: 95vw;
  display: flex;
  justify-content: space-between;
}

.upload-section {
  width: 25%; /* 左侧上传和图片列表的宽度 */ /* 左侧上传和图片列表的宽度 */
  max-height: 90vh; /* 限制高度 */
  overflow-y: auto; 
}
:deep(.el-upload-list__item-thumbnail) {
  width: 120px;  /* 设置缩略图的宽度 */

}
.image-preview-box{
  display: flex;
  width: 65%; 
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.title {
  position:absolute;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  top: 15px;
}
.image-preview {
  height: 80%;
  flex:1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid #dadada;
  
}
.image-preview:first-of-type{
  margin-right: 25px;
}
.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

</style>