import React, { memo, useEffect } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { memoize } from 'lodash';

const generateBlurHash = memoize((width, height) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3C/filter%3E%3Cpath fill='%23333' filter='url(%23b)' d='M0 0h${width}v${height}H0z'/%3E%3C/svg%3E`;
});

const ImageLoader = memo(({
  src,
  alt,
  className,
  onLoad,
  width = 400,
  height = 300,
  priority = false
}) => {
  const { loaded, error, handleLoad, setError } = useImageLoader(onLoad);

  useEffect(() => {
    if (!priority) {
      const img = new Image();
      img.onload = handleLoad;
      img.onerror = () => setError(true);
      img.src = src;
      if ('loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
      }
    }
  }, [src, priority, handleLoad, setError]);

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
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-60'}`}
        style={{
          objectFit: 'cover',
          background: `url(${generateBlurHash(width, height)})`,
          backgroundSize: 'cover'
        }}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
      />
    </div>
  );
});

ImageLoader.displayName = 'ImageLoader';
export default ImageLoader;