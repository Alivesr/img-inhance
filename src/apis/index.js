import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // API的基础URL
  
});

// 上传图片 
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post('/upload', formData);
};

// 图片增强处理
export const enlargeImage = (filename) => {
  return apiClient.get(`/gamma/${encodeURIComponent(filename)}`, {
    responseType: 'blob', // 确保返回的是 Blob 类型的数据
  });
};

export const equalImage = (filename) => {
  return apiClient.get(`/equalize/${encodeURIComponent(filename)}`, {
    responseType: 'blob', // 确保返回的是 Blob 类型的数据
  });
};

export const restoreOriginalImage = async (filename) => {
  try {
    const response = await apiClient.get(`/restore/${encodeURIComponent(filename)}`, {
      responseType: 'blob', // 确保以 Blob 类型接收数据
    });
    const url = URL.createObjectURL(response.data);
    return url; // 返回图像的 URL
  } catch (error) {
    console.error('恢复原图失败', error);
    throw error; // 抛出错误以便调用者处理
  }
};

// export const restoreImage = (filename) => {
//   return apiClient.get(`/restore/${encodeURIComponent(filename)}`, {
//     responseType: 'blob', // 确保返回的是 Blob 类型的数据
//   });
// };
