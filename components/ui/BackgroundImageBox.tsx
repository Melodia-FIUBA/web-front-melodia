"use client";

import { Box, type BoxProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface BackgroundImageBoxProps extends BoxProps {
  imageUrl: string;
}

export default function BackgroundImageBox({ imageUrl, ...boxProps }: BackgroundImageBoxProps) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (!canceled) {
        setLoadedUrl(imageUrl);
      }
    };
    image.onerror = () => {
      if (!canceled) {
        setLoadedUrl(imageUrl);
      }
    };
    return () => {
      canceled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [imageUrl]);

  return (
    <Box
      {...boxProps}
      backgroundImage={loadedUrl === imageUrl ? `url(${imageUrl})` : undefined}
    />
  );
}
