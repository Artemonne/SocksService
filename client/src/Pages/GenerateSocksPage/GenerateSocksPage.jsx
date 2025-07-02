import React, { useState } from 'react';
import { GenerateSocksApi } from '../../entities/generateSocks/GenerateSocksApi';
import './GenerateSocksPage.css';

export default function GenerateSocksPage() {
  const [options] = useState({
    colors: ['red', 'blue', 'green'],
    patterns: ['stripes', 'dots', 'waves'],
    images: ['cat', 'dog', 'flower']
  });

  const [design, setDesign] = useState({
    color: 'red',
    pattern: 'stripes',
    image: 'cat'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(null);

  const generatePreview = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setPreview(
        <div className="sock-preview">
          <div className="sock-outline-container">
            <div 
              className="sock-color-layer"
              style={{ backgroundColor: design.color }}
            ></div>
            <div 
              className="sock-pattern-layer"
              style={{ 
                backgroundImage: `url(/assets/patterns/${design.pattern}.png)`,
                backgroundSize: 'cover'
              }}
            ></div>
            <img
              className="sock-image-layer"
              src={`/assets/images/${design.image}.png`}
              alt=""
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
      );
      setIsGenerating(false);
    }, 300);
  };

  const handleSave = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 400;
      
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.crossOrigin = 'Anonymous';
        });
      };

      const [sockOutline, patternImg, imageImg] = await Promise.all([
        loadImage('/assets/sock-outline.png'),
        loadImage(`/assets/patterns/${design.pattern}.png`),
        loadImage(`/assets/images/${design.image}.png`)
      ]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCtx.fillStyle = design.color;
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(patternImg, 0, 0, tempCanvas.width, tempCanvas.height);
      
      const imgSize = 80;
      tempCtx.drawImage(
        imageImg, 
        tempCanvas.width/2 - imgSize/2, 
        tempCanvas.height/2 - imgSize/2, 
        imgSize, 
        imgSize
      );
      
      ctx.drawImage(sockOutline, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(tempCanvas, 0, 0);
      
      const genImage = canvas.toDataURL('image/png');
      
      await GenerateSocksApi.saveDesign({
        ...design,
        genImage
      });
      
      alert('Дизайн сохранен успешно!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении дизайна');
    }
  };

  return (
    <div className="generator-container">
      <h1>Генератор носков</h1>
      
      <div className="controls">
        <div className="control-group">
          <label>Цвет:</label>
          <select 
            value={design.color}
            onChange={(e) => setDesign({...design, color: e.target.value})}
          >
            {options.colors.map(color => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Узор:</label>
          <select 
            value={design.pattern}
            onChange={(e) => setDesign({...design, pattern: e.target.value})}
          >
            {options.patterns.map(pattern => (
              <option key={pattern} value={pattern}>
                {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Рисунок:</label>
          <select 
            value={design.image}
            onChange={(e) => setDesign({...design, image: e.target.value})}
          >
            {options.images.map(image => (
              <option key={image} value={image}>
                {image.charAt(0).toUpperCase() + image.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={generatePreview}
          disabled={isGenerating}
        >
          {isGenerating ? 'Генерация...' : 'Сгенерировать'}
        </button>
        <button 
          onClick={handleSave} 
          disabled={!preview || isGenerating}
        >
          Сохранить дизайн
        </button>
      </div>

      <div className="preview-section">
        <h3>Превью:</h3>
        <div className="preview-container">
          {preview || <p>Выберите параметры и нажмите "Сгенерировать"</p>}
        </div>
      </div>
    </div>
  );
}