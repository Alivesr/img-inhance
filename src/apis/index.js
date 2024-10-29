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
  return apiClient.get(`/histogram_equalization/${encodeURIComponent(filename)}`, {
    responseType: 'blob', // 确保返回的是 Blob 类型的数据
  });
};


// 恢复原图
// export const restoreOriginalImage = async (filename) => {
//   try {
//     const response = await apiClient.post(`/restore`, {
//       filename: filename,
//       responseType: 'blob', // 确保以 Blob 类型接收数据
//     });
//     console.log("请求的 URL:", response);
//     return response.data; // 返回 Blob 数据
    
//   } catch (error) {
//     console.error('API 请求失败', error);
//     throw error; // 抛出错误以便调用者处理
//   }
// };
export const restoreOriginalImage = async (filename) => {
  try {
    const response = await apiClient.post(`/restore`, {
      filename: filename,
    }, {
      responseType: 'blob', // 确保以 Blob 类型接收数据
    });
    console.log("请求的 URL:", response.config.url); // 打印请求的 URL
    return response; // 返回整个响应
  } catch (error) {
    console.error('API 请求失败', error);
    throw error; // 抛出错误以便调用者处理
  }
};
export const process_imagesAPI = (filename) => {
  return apiClient.post(`/process_images/${filename}`, {}, {
    responseType: 'blob', // 确保返回的是 Blob 类型的数据
  });
};


