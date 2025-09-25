# 删除图片背景接口

入参
```
curl -H "X-Api-Key: rEz47pBVKLqBaycQJi8HL2oN" \
  -F "image_url=https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fb/20250925/6296b724/6278ed2c-cae4-4729-b8cf-0dc3d3adee12-1.png?Expires=1759342221&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=wFIPdNX9NBFm9vR2bfXfR1Kkvg4%3D" \
  -F "size=auto" \
  --output "result.png" \
  https://api.remove.bg/v1.0/removebg
  ```

出参
返回一个二进制数据流的图片