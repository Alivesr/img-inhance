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
            <img :src="slotProps.file.url"  class="thumbnail" alt="Thumbnail" />
              <span class="file-name" >{{ slotProps.file.name }}</span>
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
            <img v-if="selectedImage" :src="selectedImage" alt="Preview" class="full-image" />
            <p v-else>选择图片进行预览</p>
            
          </div>

          <!-- 处理后 -->
          <div class="image-preview">
            <div class="title">处理后</div>
            <img v-if="0" alt="Preview" class="full-image" />
            <p v-else>选择图片进行预览</p>
            
          </div>

        </div>
        <div class="function">
          <el-button  class ='btn' type="success">增强</el-button>
          <el-button  class ='btn' type="success">去雾</el-button>
          <el-button  class ='btn' type="danger">下载</el-button>
          
        </div>
          
     </div>
    
    
  </div>
  
</template>

<script setup>
import { ref, watch } from 'vue'

const fileList = ref([]) // 文件列表
const selectedImage = ref(null) // 当前选中的图片

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
const handlePreview = (file) => {
  selectedImage.value = file.url || null
}

// 删除图片
const removeFile = (file) => {
  // 更新文件列表
  fileList.value = fileList.value.filter(f => f.url !== file.url)

  // 如果删除的图片是当前预览的图片，清空预览区
  if (selectedImage.value === file.url) {
    selectedImage.value = null
  }
}

// 监听 fileList 的变化，当列表为空时清空预览图片
watch(fileList, (newList) => {
  if (newList.length === 0) {
    selectedImage.value = null
  }
})
</script>


<style scoped>
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
</style>
