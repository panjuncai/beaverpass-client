async function uploadFile(file) {
    // 获取预签名 URL
    const response = await fetch('/api/generate-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    });
    const { url } = await response.json();
  
    // 使用预签名 URL 上传文件
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
  
    if (uploadResponse.ok) {
      console.log("Upload successful!");
    } else {
      console.error("Upload failed.");
    }
  }
  