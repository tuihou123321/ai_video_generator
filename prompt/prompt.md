# 需求说明
请根据我提供的视频截图，生成一个完全模仿其视觉效果的单页HTML视频网站。网站需具备以下功能和元素：

## 页面核心元素
1.  **背景和顶部文字：** * **背景图片：** 使用提供的红色渐变背景图片。
    * **背景固定文字：** 在页面中心，以半透明、模糊的大字显示“反叛心理”四个字。
    * **顶部左侧文案：** 在页面顶部左上角，显示“反内耗 | 反脆弱 | 反玻璃心”。
    * **顶部右侧文案：** 在页面顶部右上角，显示“咱不负责安慰 | 咱只提供真相”。

2.  **音频与字幕：**
    * **背景音乐：** 使用提供的背景音乐URL，实现循环播放，音量调整为原始音量的1.2倍（即`volume=0.2`）。
    * **视频声音：** 使用提供的视频声音URL，与字幕和卡通图片同步播放。
    * **字幕同步显示：** 根据提供的字幕JSON文件，在页面底部中心动态显示字幕文字。

3.  **核心动画效果：**
    * **卡通图片动效：** 根据提供的卡通素材URL和对应的时间戳，当卡通图片出现时，从占据页面高度的**70%**大小开始，在短时间内平滑缩小至占据页面高度的**50%**，并在此位置稳定显示。

## 素材文档
* **视频声音：** `http://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/3a/20250925/ffcf3aa4/dbd1f65f-285d-47ad-a309-f78c18773833.wav`
* **背景音乐：** `https://static-1304373274.cos.ap-shanghai.myqcloud.com/mixkit-driving-ambition-32.mp3`
* **背景图片：** `https://gd-hbimg.huaban.com/8349abd3408d527bb239e52e739c2ef799154fab1a0a2-XyLFzb`
* **视频字幕：**
    ```json
    [
      { "text": "听好了", "start": 0.04, "end": 0.73 },
      { "text": "从今儿起", "start": 0.73, "end": 1.46 },
      { "text": "别再把自己当软柿子捏", "start": 1.64, "end": 3.56 },
      { "text": "学着用狠角色的路子火", "start": 3.76, "end": 5.61 }
    ]
    ```
* **卡通素材：**
    ```json
    [
      { "image_url": "[https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fa/20250925/6296b724/85d2a2a7-5b61-4e34-bc8c-92a56e2b1e3d-1.png](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fa/20250925/6296b724/85d2a2a7-5b61-4e34-bc8c-92a56e2b1e3d-1.png)", "associated_text": "听好了，从今儿起，别再把自己当软柿子捏", "start_time": 0.04 },
      { "image_url": "[https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fb/20250925/6296b724/6278ed2c-cae4-4729-b8cf-0dc3d3adee12-1.png](https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fb/20250925/6296b724/6278ed2c-cae4-4729-b8cf-0dc3d3adee12-1.png)", "associated_text": "学着用狠角色的路子火", "start_time": 3.76 }
    ]
    ```