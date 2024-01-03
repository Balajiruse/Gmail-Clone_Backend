

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dg6wqmpyh', 
  api_key: '957587629139432', 
  api_secret: 'G8K6fWdJbjL0BoIocqmLQ_0aZ9Q' 
});

export async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file,{
    resource_type: "auto",
  });
  return res;
}