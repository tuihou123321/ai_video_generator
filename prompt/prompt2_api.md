# 页面中需要使用到的相关接口
## 1. 文本转语音模型（通义千问的语音合成模型，适合中文）

Curl 入参
curl -X POST 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \
-H "Authorization: Bearer sk-11faff6c49a7436b9a6a0431c886a85b" \
-H 'Content-Type: application/json' \
-d '{
    "model": "qwen3-tts-flash",
    "input": {
        "text": "听好了，从今儿起，别再把自己当软柿子捏，学着用狠角色的路子火。",
        "voice": "Ethan",
        "language_type": "Chinese"
    }
}'

输出：
{"output":{"audio":{"data":"","expires_at":1758815691,"id":"audio_f267cd97-5573-4be7-a7be-d1d86300e5f1","url":"http://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/37/20250924/ffcf3aa4/b594d4b9-d8e8-4853-8e49-c9365f28ad6a.wav?Expires=1758815691&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=37Zo1PS9sgcGWK1v2gOGL0jJCOg%3D"},"finish_reason":"stop"},"usage":{"characters":195},"request_id":"f267cd97-5573-4be7-a7be-d1d86300e5f1"}  

## 2. 图生图（适合保持猫腻的一致性）
curl --location 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer sk-11faff6c49a7436b9a6a0431c886a85b" \
--data '{
    "model": "qwen-image-edit",
    "input": {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "image": "https://cdnv2.ruguoapp.com/Fqrfh4Ix879kG9SgXtm9R9zk-uTiv3.png?imageMogr2/auto-orient/thumbnail/400x2000%3E"
                    },
                    {
                        "text": "一个极简的扁平矢量插画，描绘了一只可爱的白色猫咪，它手持一把青色的步枪，枪口射出一颗子弹并冒着一缕烟。猫咪头部后面有一个白色的靶心符号。猫咪应该是画面的中心焦点。透明背景，png。"
                    }
                ]
            }
        ]
    },
    "parameters": {
        "negative_prompt": "",
        "watermark": false
    }
}'
出参：
{
    "output": {
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "content": [
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/7d/fa/20250925/6296b724/85d2a2a7-5b61-4e34-bc8c-92a56e2b1e3d-1.png?Expires=1759337977&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=Mntk4gQLIVl%2FcsQi%2BDfNOLxm6HA%3D"
                        }
                    ],
                    "role": "assistant"
                }
            }
        ]
    },
    "usage": {
        "height": 1080,
        "image_count": 1,
        "width": 1080
    },
    "request_id": "4283a004-c3da-4144-a83b-77c7e16e63c2"
}

## 3. 音频转字幕asr文件
第一步：音频生成字幕，只会输出一个任务id
输入：
curl --location 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription' \
  --header "Authorization: Bearer sk-11faff6c49a7436b9a6a0431c886a85b" \
  --header "Content-Type: application/json" \
  --header "X-DashScope-Async: enable" \
  --data '{
    "model": "paraformer-v2",
    "input": {
      "file_urls": [
        "http://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/3a/20250925/ffcf3aa4/dbd1f65f-285d-47ad-a309-f78c18773833.wav?Expires=1758820629&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=tet79l2fcem2iz65sah8%2FWdUEiw%3D"
      ]
    },
    "parameters": {
      "channel_id": [0],
      "language_hints": ["zh"],    # 可选，如果确定为中文
      "timestamp_alignment_enabled": true   # 如果需要生成带时间戳的字幕建议加上
    }
  }'



输出
{
    "request_id": "548e2a04-0a9f-485a-a513-54b07bb8604c",
    "output": {
        "task_id": "68ca5d10-7c49-4abe-9550-4763105f8316",
        "task_status": "PENDING"
    }
}

第二步：查询上面的任务id
输入
curl --location "https://dashscope.aliyuncs.com/api/v1/tasks/68ca5d10-7c49-4abe-9550-4763105f8316" \
  --header "Authorization: Bearer sk-11faff6c49a7436b9a6a0431c886a85b"

输出(下面的transcription_url 就是返回的字幕文件)：
{
    "request_id": "3c829d37-1751-4acf-8d3e-444837d96534",
    "output": {
        "task_id": "68ca5d10-7c49-4abe-9550-4763105f8316",
        "task_status": "SUCCEEDED",
        "submit_time": "2025-09-25 01:37:36.380",
        "scheduled_time": "2025-09-25 01:37:36.509",
        "end_time": "2025-09-25 01:37:38.450",
        "results": [
            {
                "file_url": "http://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/3a/20250925/ffcf3aa4/dbd1f65f-285d-47ad-a309-f78c18773833.wav?Expires=1758820629&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=tet79l2fcem2iz65sah8%2FWdUEiw%3D",
                "transcription_url": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/prod/paraformer-v2/20250925/01%3A37/b0b273dc-6860-4b83-96f6-b179e267fe85-1.json?Expires=1758821858&OSSAccessKeyId=LTAI5tQZd8AEcZX6KZV4G8qL&Signature=GtUYhLNwEyO62u2FJomTVC1u0jA%3D",
                "subtask_status": "SUCCEEDED"
            }
        ],
        "task_metrics": {
            "TOTAL": 1,
            "SUCCEEDED": 1,
            "FAILED": 0
        }
    },
    "usage": {
        "duration": 6
    }
}

transcription_url 字段中的字幕文件格式为：
{"file_url":"http://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/3a/20250925/ffcf3aa4/dbd1f65f-285d-47ad-a309-f78c18773833.wav?Expires=1758820629&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=tet79l2fcem2iz65sah8%2FWdUEiw%3D","properties":{"audio_format":"pcm_s16le","channels":[0],"original_sampling_rate":24000,"original_duration_in_milliseconds":5680},"transcripts":[{"channel_id":0,"content_duration_in_milliseconds":5570,"text":"听好了，从今儿起，别再把自己当软柿子捏，学着用狠角色的路子火。","sentences":[{"begin_time":40,"end_time":5610,"text":"听好了，从今儿起，别再把自己当软柿子捏，学着用狠角色的路子火。","sentence_id":1,"words":[{"begin_time":40,"end_time":180,"text":"听","punctuation":""},{"begin_time":180,"end_time":330,"text":"好","punctuation":""},{"begin_time":330,"end_time":730,"text":"了","punctuation":"，"},{"begin_time":730,"end_time":970,"text":"从","punctuation":""},{"begin_time":970,"end_time":1100,"text":"今","punctuation":""},{"begin_time":1100,"end_time":1170,"text":"儿","punctuation":""},{"begin_time":1170,"end_time":1460,"text":"起","punctuation":"，"},{"begin_time":1640,"end_time":1930,"text":"别","punctuation":""},{"begin_time":1930,"end_time":2070,"text":"再","punctuation":""},{"begin_time":2070,"end_time":2230,"text":"把","punctuation":""},{"begin_time":2230,"end_time":2390,"text":"自","punctuation":""},{"begin_time":2390,"end_time":2510,"text":"己","punctuation":""},{"begin_time":2510,"end_time":2660,"text":"当","punctuation":""},{"begin_time":2660,"end_time":2860,"text":"软","punctuation":""},{"begin_time":2860,"end_time":3090,"text":"柿","punctuation":""},{"begin_time":3090,"end_time":3200,"text":"子","punctuation":""},{"begin_time":3200,"end_time":3560,"text":"捏","punctuation":"，"},{"begin_time":3760,"end_time":4080,"text":"学","punctuation":""},{"begin_time":4080,"end_time":4190,"text":"着","punctuation":""},{"begin_time":4190,"end_time":4370,"text":"用","punctuation":""},{"begin_time":4370,"end_time":4570,"text":"狠","punctuation":""},{"begin_time":4570,"end_time":4780,"text":"角","punctuation":""},{"begin_time":4780,"end_time":4900,"text":"色","punctuation":""},{"begin_time":4900,"end_time":5000,"text":"的","punctuation":""},{"begin_time":5000,"end_time":5150,"text":"路","punctuation":""},{"begin_time":5150,"end_time":5250,"text":"子","punctuation":""},{"begin_time":5250,"end_time":5610,"text":"火","punctuation":"。"}]}]}]}

