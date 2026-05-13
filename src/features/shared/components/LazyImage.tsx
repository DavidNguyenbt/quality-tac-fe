import React, { useState } from 'react';
import { Skeleton } from '@mui/material';

interface LazyImageProps {
    src: string;
    alt?: string;
    height?: number | string;
    width?: number | string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, width = '100%', height = 200, style, onClick }) => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && (
                <Skeleton
                    variant="rectangular"
                    width={width}
                    height={height}
                    sx={{ borderRadius: '4px' }}
                />
            )}

            <img
                src={src}
                alt={alt}
                onLoad={() => setLoading(false)}
                style={{
                    display: loading ? 'none' : 'block',
                    width,
                    height,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    ...style
                }}
                onClick={onClick}
            />
        </>
    );
};

export default LazyImage;
