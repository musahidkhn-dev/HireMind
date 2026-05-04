import React from 'react';
import { twMerge } from 'tailwind-merge';
import { getImageUrl } from '../../utils/helpers';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const Avatar = ({
  src,
  name,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl = React.useMemo(() => getImageUrl(src), [src]);

  return (
    <div
      className={twMerge(
        'relative flex items-center justify-center overflow-hidden rounded-full',
        sizes[size],
        (!src || imgError) && 'bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold',
        className
      )}
    >
      {src && !imgError ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => {
            console.log("Image load failed for URL:", imageUrl);
            setImgError(true);
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
