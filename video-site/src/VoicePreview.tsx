import React, { useState, useRef } from 'react';
import './VoicePreview.css';

interface VoicePreviewProps {
  onClose: () => void;
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

const VOICE_OPTIONS = [
  { name: 'Ethan', description: '男声 - 温和成熟' },
  { name: 'Stella', description: '女声 - 甜美清新' },
  { name: 'Luna', description: '女声 - 优雅知性' },
  { name: 'Aria', description: '女声 - 活泼可爱' },
  { name: 'Felix', description: '男声 - 磁性低沉' },
  { name: 'Emily', description: '女声 - 温柔亲切' },
  { name: 'Oliver', description: '男声 - 专业稳重' },
  { name: 'Sophia', description: '女声 - 自信大方' }
];

const SAMPLE_TEXT = "听好了，从今儿起，别再把自己当软柿子捏。学着用狠角色的路子火。";

const VoicePreview: React.FC<VoicePreviewProps> = ({ onClose, selectedVoice, onVoiceSelect }) => {
  const [currentVoice, setCurrentVoice] = useState(selectedVoice);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const generateVoiceSample = async (voice: string) => {
    if (isGenerating) return;
    
    setIsGenerating(voice);
    
    try {
      const response = await fetch('http://localhost:3001/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: SAMPLE_TEXT,
          voice: voice,
        }),
      });

      const result = await response.json();
      
      if (result.output?.audio?.url) {
        // 创建音频元素并播放
        const audio = new Audio(result.output.audio.url);
        audioRefs.current[voice] = audio;
        
        audio.addEventListener('loadeddata', () => {
          setIsGenerating(null);
          playVoice(voice);
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(null);
        });

        audio.addEventListener('error', () => {
          setIsGenerating(null);
          alert('音频生成失败，请重试');
        });
      }
    } catch (error) {
      console.error('生成音效失败:', error);
      setIsGenerating(null);
      alert('网络错误，请检查代理服务器是否启动');
    }
  };

  const playVoice = (voice: string) => {
    // 停止所有正在播放的音频
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[voice];
    if (audio) {
      setIsPlaying(voice);
      audio.play().catch(() => {
        setIsPlaying(null);
      });
    } else {
      generateVoiceSample(voice);
    }
  };

  const stopVoice = () => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setIsPlaying(null);
  };

  const handleSelectAndClose = () => {
    stopVoice();
    onVoiceSelect(currentVoice);
    onClose();
  };

  const handleClose = () => {
    stopVoice();
    onClose();
  };

  return (
    <div className="voice-preview-overlay">
      <div className="voice-preview-modal">
        <div className="voice-preview-header">
          <h2>声音试听</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="sample-text">
          <p>试听文本："{SAMPLE_TEXT}"</p>
        </div>

        <div className="voice-list">
          {VOICE_OPTIONS.map((voice) => (
            <div
              key={voice.name}
              className={`voice-item ${currentVoice === voice.name ? 'selected' : ''}`}
              onClick={() => setCurrentVoice(voice.name)}
            >
              <div className="voice-info">
                <h3>{voice.name}</h3>
                <p>{voice.description}</p>
              </div>
              
              <div className="voice-controls">
                <button
                  className="play-voice-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPlaying === voice.name) {
                      stopVoice();
                    } else {
                      playVoice(voice.name);
                    }
                  }}
                  disabled={isGenerating === voice.name}
                >
                  {isGenerating === voice.name ? (
                    <span className="loading">生成中...</span>
                  ) : isPlaying === voice.name ? (
                    '⏸️ 停止'
                  ) : (
                    '▶️ 试听'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="voice-preview-footer">
          <button className="cancel-btn" onClick={handleClose}>
            取消
          </button>
          <button className="confirm-btn" onClick={handleSelectAndClose}>
            选择 {currentVoice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoicePreview;