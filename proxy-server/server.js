const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.DASHSCOPE_API_KEY;

// 检查必要的环境变量
if (!API_KEY) {
  console.error('❌ 错误: 未找到DASHSCOPE_API_KEY环境变量');
  console.log('请创建.env文件并设置DASHSCOPE_API_KEY');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// 通用API代理函数
const makeAPIRequest = async (url, data, headers = {}) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Request failed:', error.message);
    throw error;
  }
};

// 文本转语音API
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    
    const data = {
      model: 'qwen3-tts-flash',
      input: {
        text,
        voice,
        language_type: 'Chinese',
      },
    };

    const result = await makeAPIRequest(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      data
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 图生图API
app.post('/api/image-generation', async (req, res) => {
  try {
    const { characterImage, prompt } = req.body;
    
    const data = {
      model: 'qwen-image-edit',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { image: characterImage },
              { text: prompt },
            ],
          },
        ],
      },
      parameters: {
        negative_prompt: '',
        watermark: false,
      },
    };

    const result = await makeAPIRequest(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      data
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ASR音频转字幕API - 启动任务
app.post('/api/asr/start', async (req, res) => {
  try {
    const { audioUrl } = req.body;
    
    const data = {
      model: 'paraformer-v2',
      input: {
        file_urls: [audioUrl],
      },
      parameters: {
        channel_id: [0],
        language_hints: ['zh'],
        timestamp_alignment_enabled: true,
      },
    };

    const result = await makeAPIRequest(
      'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription',
      data,
      { 'X-DashScope-Async': 'enable' }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ASR任务状态查询
app.get('/api/asr/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const response = await axios.get(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取转录文件内容
app.get('/api/transcription', async (req, res) => {
  try {
    const { url } = req.query;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});