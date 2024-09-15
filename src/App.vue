<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :before-upload="handleUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    list-type="picture"
    multiple
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip >    <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

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
  return false // Prevent default upload behavior
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
  fileList.value = uploadFiles
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}
</script>