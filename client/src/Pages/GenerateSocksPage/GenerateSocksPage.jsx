import React, { useState, useEffect } from 'react';
import { GenerateSocksApi } from '../../entities/generateSocks/GenerateSocksApi';
import './GenerateSocksPage.css';
import { FavouriteApi } from '../../entities/favourite/FavouriteApi';
import { BasketApi } from '../../entities/basket/BasketApi';
import { UserApi } from '../../entities/user/UserApi';
import Toast from '../../shared/ui/Toast';

export default function GenerateSocksPage() {
  const [options] = useState({
    colors: ['red', 'blue', 'pink'],
    patterns: ['stripes', 'dots', 'waves'],
    images: ['cat', 'cucumber', 'flower'],
  });

  const [design, setDesign] = useState({
    color: 'red',
    pattern: 'stripes',
    image: 'cat',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isUser, setIsUser] = useState(null);
  const [isSockId, setIsSockId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all([
          loadImage(`/assets/patterns/${design.pattern}.png`),
          loadImage(`/assets/images/${design.image}.png`),
          loadImage('/assets/sock-outline.png'),
        ]);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        setImagesLoaded(false);
      }
    };

    loadImages();
  }, [design.pattern, design.image]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => {
        console.error(`Failed to load image: ${src}`);
        reject(err);
      };
    });
  };

  const generatePreview = () => {
    if (!imagesLoaded) {
      alert('Изображения еще загружаются. Пожалуйста, подождите.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const imageElements = [];
      const positions = [
        // Оптимальные позиции для 4 рисунков
        { x: 43, y: 45, rotation: -10 }, // Левый верх
        { x: 60, y: 40, rotation: 10 }, // Правый верх
        { x: 40, y: 60, rotation: -15 }, // Левый низ
        { x: 55, y: 20, rotation: 10 }, // Правый низ
      ];

      positions.forEach((pos, i) => {
        imageElements.push(
          <img
            key={i}
            className="sock-image-layer"
            src={`/assets/images/${design.image}.png`}
            alt=""
            style={{
              width: '35px',
              height: '35px',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
            }}
            onError={(e) => {
              console.error('Error loading image:', e.target.src);
              e.target.style.display = 'none';
            }}
          />,
        );
      });

      setPreview(
        <div className="sock-preview-container">
          <div className="sock-mask-wrapper">
            <div className="sock-layers">
              <div
                className="sock-color-layer"
                style={{ backgroundColor: design.color }}
              />
              <div
                className="sock-pattern-layer"
                style={{
                  backgroundImage: `url(/assets/patterns/${design.pattern}.png)`,
                  backgroundSize: 'cover',
                }}
              />
              {imageElements}
            </div>
            <img
              className="sock-mask"
              src="/assets/sock-outline.png"
              alt=""
              onError={(e) => {
                console.error('Error loading sock outline:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>,
      );
      setIsGenerating(false);
    }, 300);
  };

  const handleSave = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      const [patternImg, imageImg, sockOutline] = await Promise.all([
        loadImage(`/assets/patterns/${design.pattern}.png`),
        loadImage(`/assets/images/${design.image}.png`),
        loadImage('/assets/sock-outline.png'),
      ]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.fillStyle = design.color;
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempCtx.globalCompositeOperation = 'multiply';
      tempCtx.drawImage(
        patternImg,
        0,
        0,
        patternImg.naturalWidth,
        patternImg.naturalHeight,
        0,
        0,
        tempCanvas.width / 0.78,
        tempCanvas.height / 0.763,
      );
      tempCtx.globalCompositeOperation = 'source-over';

      const positions = [
        { x: 40, y: 80.5, rotation: 5 },
        { x: 55, y: 26, rotation: 5 },
        { x: 43, y: 60, rotation: -10 },
        { x: 61, y: 54, rotation: 5 },
      ];

      positions.forEach((pos) => {
        const size = 24;
        const x = (pos.x / 100) * tempCanvas.width;
        const y = (pos.y / 100) * tempCanvas.height;

        tempCtx.save();
        tempCtx.translate(x, y);
        tempCtx.rotate((pos.rotation * Math.PI) / 180);
        tempCtx.drawImage(imageImg, -size / 2, -size / 2, size * 1.35, size * 0.96);
        tempCtx.restore();
      });

      ctx.drawImage(sockOutline, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(tempCanvas, 0, 0);

      const genImage = canvas.toDataURL('image/png');

      const newSock = await GenerateSocksApi.saveDesign({
        ...design,
        genImage,
      });

      const userM = await UserApi.getMe();
      setIsSockId(newSock.data.id);
      setIsUser(userM.data.data.id);

      console.log('Дизайн сохранен успешно!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении дизайна: ' + error.message);
    }
  };

  const addFav = async () => {
    try {
      const data = { userId: isUser, sockId: isSockId };
      await FavouriteApi.addFavourite(data);

      setToastMessage('Товар добавлен в избранное!');
      setShowToast(true);
    } catch (error) {
      console.log(error);

      setToastMessage('Ошибка при добавлении в избранное');
      setShowToast(true);
    }
  };

  const addBasket = async () => {
    try {
      const data = { userId: isUser, sockId: isSockId, price: 1000 };
      await BasketApi.addToBasket(data);

      setToastMessage('Товар добавлен в корзину!');
      setShowToast(true);
    } catch (error) {
      console.log(error);
      setToastMessage('Ошибка при добавлении в корзину');
      setShowToast(true);
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
            onChange={(e) => setDesign({ ...design, color: e.target.value })}
          >
            {options.colors.map((color) => (
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
            onChange={(e) => setDesign({ ...design, pattern: e.target.value })}
          >
            {options.patterns.map((pattern) => (
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
            onChange={(e) => setDesign({ ...design, image: e.target.value })}
          >
            {options.images.map((image) => (
              <option key={image} value={image}>
                {image.charAt(0).toUpperCase() + image.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button
          onClick={() => {
            generatePreview();
            handleSave();
          }}
          disabled={isGenerating || !imagesLoaded}
        >
          {isGenerating ? 'Генерация...' : 'Сгенерировать'}
        </button>
        <button onClick={addFav} disabled={!preview || isGenerating || !imagesLoaded}>
          ❤️
        </button>
        <button onClick={addBasket} disabled={!preview || isGenerating || !imagesLoaded}>
          🛒
        </button>
      </div>

      <div className="preview-section">
        <h3>Превью:</h3>
        <div className="preview-container">
          {preview || <p>Выберите параметры и нажмите "Сгенерировать"</p>}
        </div>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
//test