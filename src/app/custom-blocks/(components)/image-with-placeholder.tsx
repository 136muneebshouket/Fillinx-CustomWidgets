"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import type { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "alt"> {
  placeholderImage?: string;
  placeholderProps?: Omit<ImageProps, "src" | "alt">;
  alt?: string;
  placeholderContent?: boolean;
  placeholderHeading?: string;
  placeholderDescription?: string;
  placeholderClassName?: string;
  quality?: number;
  width?: number;
  height?: number;
  unoptimized?: boolean;
}

export const ImageWithPlaceholder: React.FC<Props> = ({
  src,
  placeholderImage = "/image.svg",
  placeholderProps = {},
  alt = "",
  placeholderContent = false,
  placeholderHeading = "Display Image",
  placeholderDescription = "Upload your design here",
  placeholderClassName,
  quality,
  width = 200, // Default width to match your requirements
  height = 200, // Default height to match your requirements
  unoptimized = false, // Default is false

  ...rest
}) => {
  const [isError, setIsError] = useState(false);

  const source = useMemo(() => {
    if (!src) return "";

    if (typeof src === "string") {
      if (unoptimized && src.includes("cdn.shopify")) {
        const urlObj = new URL(src);
        urlObj.searchParams.set("width", String(width));
        // urlObj.searchParams.set('height', String(height))
        return urlObj.toString();
      }
      if (src.includes("cdn.shopify")) {
        const urlObj = new URL(src);
        return `${urlObj.origin}${urlObj.pathname}`;
      }
      if (src.startsWith("https")) {
        return src;
      }
    }
    return src;
  }, [src, unoptimized, width]);

  const commonProps = {
    ...rest,
    onError: () => setIsError(true),
    unoptimized,
    ...(rest.fill ? { layout: "fill" } : { width, height }),
  };

  return (
    <>
      {isError || !src ? (
        <div className={placeholderClassName}>
          <Image
            src={placeholderImage}
            width={20}
            height={20}
            className={placeholderProps.className}
            style={placeholderProps.style}
            {...placeholderProps}
            alt="placeholder"
          />
          {placeholderContent && (
            <div className="text-center mt-[8px]">
              <p className="text-[14px] text-primary">{placeholderHeading}</p>
              <p
                style={{
                  fontSize: "12px",
                }}
                className="mt-[3px] text-secondary-dark"
              >
                {placeholderDescription}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Image
          quality={quality ?? 100}
          sizes="100vw"
          src={source}
          alt={alt}
          {...(isError || !src
            ? {
                ...commonProps,
                height: 20,
                width: 20,
                fill: false,
                objectFit: "cover",
              }
            : commonProps)}
        />
      )}
    </>
  );
};
