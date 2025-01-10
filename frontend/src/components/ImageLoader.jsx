import React, { memo, useState, useEffect } from 'react';

const generateBlurHash = (width, height) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3C/filter%3E%3Cpath fill='%23333' filter='url(%23b)' d='M0 0h${width}v${height}H0z'/%3E%3C/svg%3E`;
};

const ImageLoader = memo(({ 
  src, 
  alt, 
  className, 
  onLoad,
  width = 400,
  height = 300,
  priority = false 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(generateBlurHash(width, height));
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = () => {
      const img = new Image();
      
      if (priority) {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => {
        if (isMounted) {
          setImageSrc(src);
          setLoaded(true);
          onLoad?.();
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          setError(true);
        }
      };

      img.src = src;

      if ('loading' in HTMLImageElement.prototype && !priority) {
        img.loading = 'lazy';
      }
    };

    if (!priority && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadImage();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      observer.observe(document.createElement('div'));
      return () => observer.disconnect();
    } else {
      loadImage();
    }

    return () => {
      isMounted = false;
    };
  }, [src, onLoad, priority]);

  if (error) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-60'
        }`}
        style={{
          objectFit: 'cover',
          background: `url(${generateBlurHash(width, height)})`,
          backgroundSize: 'cover'
        }}
      />
    </div>
  );
});

ImageLoader.displayName = 'ImageLoader';

export default ImageLoader;