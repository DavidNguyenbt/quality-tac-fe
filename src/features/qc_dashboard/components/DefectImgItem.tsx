import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Box, Grid, Tooltip, IconButton, Typography } from '@mui/material';
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { renderContent } from './Content';
import LazyImage from '@/features/shared/components/LazyImage';

interface DefectData {
    DefectName: string;
    PickLink: string;
    ImgSrc: string;
}

interface DefectImgProps {
    datalist: DefectData[];
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const DefectImgItem: React.FC<DefectImgProps> = ({ datalist }) => {

    // Lightbox state
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    // Zoom & Drag state
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const openLightbox = (name: string, img: string) => {
        setSelectedImg(img);
        setSelectedName(name);

        // reset zoom & drag
        setScale(1);
        setPos({ x: 0, y: 0 });

        setOpen(true);
    };

    const closeLightbox = () => {
        setOpen(false);
        setSelectedImg(null);
    };

    return (
        <>
            {datalist?.map((e, index) => (
                <Grid item xs={12} md={2.4} key={index}>
                    <Item
                        sx={{
                            mb: 1,
                            overflow: 'hidden',
                            backgroundColor: (theme) => theme.color.background.o1,
                            height: '50px'
                        }}
                    >
                        <Tooltip title={e.DefectName}>
                            <Typography
                                align="center"
                                sx={{
                                    color: (theme) => theme.color.text.o1,
                                    textTransform: 'uppercase',
                                    fontSize: '13px'
                                }}
                            >
                                {renderContent(e.DefectName)}
                            </Typography>
                        </Tooltip>
                    </Item>
                    {e.ImgSrc !== '' && (
                        <Item sx={{ backgroundColor: (theme) => theme.color.background.o1 }}>
                            <LazyImage
                                src={e.ImgSrc}
                                height={200}
                                onClick={() => openLightbox(e.DefectName, e.ImgSrc)}
                            />
                            <Typography sx={{ color: (theme) => theme.color.text.o1 }}>{e.DefectName}</Typography>
                        </Item>
                    )}
                </Grid>
            ))}

            {/* LIGHTBOX với zoom + drag */}
            {open && (
                <Box
                    onClick={closeLightbox}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        cursor: "zoom-out",
                        overflow: "hidden",
                    }}
                >
                    {/* Nút Close */}
                    <IconButton
                        onClick={closeLightbox}
                        sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            color: "#fff",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Ảnh Zoom */}
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            cursor: "grab",
                            userSelect: "none",
                        }}
                    >
                        <img
                            src={selectedImg ?? ""}
                            alt={selectedName ?? ""}
                            style={{
                                transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
                                transition: isDragging ? "none" : "transform 0.15s ease-out",
                                maxWidth: "100vw",
                                maxHeight: "100vh",
                                objectFit: "contain",
                                cursor: scale > 1 ? "grab" : "zoom-in",
                            }}
                            onWheel={(e) => {
                                e.preventDefault();
                                let newScale = scale + (e.deltaY * -0.001);
                                newScale = Math.min(Math.max(newScale, 1), 5);
                                setScale(newScale);
                            }}
                            onMouseDown={(e) => {
                                setIsDragging(true);
                                setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
                            }}
                            onMouseMove={(e) => {
                                if (!isDragging) return;
                                setPos({
                                    x: e.clientX - dragStart.x,
                                    y: e.clientY - dragStart.y,
                                });
                            }}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => setIsDragging(false)}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default DefectImgItem;
