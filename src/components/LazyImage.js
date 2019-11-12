import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { placeholder } from "@babel/types";

const LazyImage = ({ alt, width, height, src, placeholderSrc, className }) => (
  <LazyLoadImage
    alt={alt}
    height={height}
    src={src} // use normal <img> attributes as props
    width={width}
    effect="blur"
    placeholderSrc={placeholderSrc}
    className={className}
  />
);

export default LazyImage;
