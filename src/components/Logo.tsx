import React from "react";
import { Heart, Eye } from "lucide-react";

// Reference image (you uploaded):
// sandbox:/mnt/data/WhatsApp Image 2025-11-21 at 17.32.02.jpeg
// The code below draws two stylized silhouettes whose raised hands form the top curves of a heart.

export default function Logo({
  size = "large",
  variant = "eye-heart",
}) {
  const large = size === "large";
  const containerW = large ? 320 : 128; // px
  const containerH = large ? 160 : 64;
  const heartSize = large ? 120 : 48;
  const eyeSize = large ? 48 : 18;

  // Colors (easy to tweak)
  const leftColor = "#4C1D95"; // purple
  const rightColor = "#DB2777"; // pink
  const heartColor = "#8B5CF6";

  if (variant === "couple") {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerW, height: containerH }}
        aria-label="Couple logo — hands form heart"
      >
        {/* Left person (male-ish silhouette) */}
        <svg
          viewBox="0 0 200 100"
          width={containerW / 2}
          height={containerH}
          className="z-10"
          role="img"
          aria-hidden="true"
        >
          {/* head */}
          <circle cx="60" cy="20" r="10" fill={leftColor} />

          {/* body */}
          <path
            d="M60 32 C58 50, 58 70, 60 84 L56 88 L72 88 L68 84 C70 70,70 50,68 32 Z"
            fill={leftColor}
          />

          {/* left arm (down) */}
          <path
            d="M52 36 C46 46,44 60,46 74"
            stroke={leftColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* right arm raised and forming half-heart curve */}
          <path
            d="M66 36 C86 18,110 12,120 28"
            stroke={leftColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* small detail for shoulder */}
          <path
            d="M66 36 C64 40,62 44,60 48"
            stroke={leftColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Heart formed by the two raised arms (overlay) */}
        <svg
          viewBox="0 0 200 100"
          width={heartSize}
          height={heartSize}
          className="absolute z-20 pointer-events-none"
          style={{ transform: "translateY(-8%)" }}
          aria-hidden="true"
        >
          {/* Top-left curve (matches left arm curve) */}
          <path
            d="M40 50 C40 28,68 18,84 34 C98 18,126 28,126 50 C126 76,100 88,84 96 C68 88,40 76,40 50 Z"
            fill={heartColor}
            opacity="0.98"
          />
        </svg>

        {/* Right person (female-ish silhouette) */}
        <svg
          viewBox="0 0 200 100"
          width={containerW / 2}
          height={containerH}
          className="z-10"
          role="img"
          aria-hidden="true"
          style={{ transform: "scaleX(-1)" }}
        >
          {/* head */}
          <circle cx="140" cy="20" r="10" fill={rightColor} />

          {/* body */}
          <path
            d="M140 32 C142 50,142 70,140 84 L144 88 L128 88 L132 84 C130 70,130 50,132 32 Z"
            fill={rightColor}
          />

          {/* right arm (down) */}
          <path
            d="M148 36 C154 46,156 60,154 74"
            stroke={rightColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* left arm raised and forming the other half-heart curve */}
          <path
            d="M134 36 C114 18,90 12,80 28"
            stroke={rightColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Center small eye inside heart for the eye-heart variant */}
        {variant === "couple" && (
          <div
            className="absolute z-30 flex items-center justify-center"
            style={{ transform: "translateY(-6%)" }}
          >
            <Eye
              className=""
              style={{
                width: eyeSize,
                height: eyeSize,
                strokeWidth: 2.5,
                color: "white",
              }}
            />
          </div>
        )}

        {/* Optional invisible img tag pointing to the uploaded reference (so your build/test can fetch it).
            The developer told me to include the uploaded path as the url of the file. */}
        <img
          src="sandbox:/mnt/data/WhatsApp Image 2025-11-21 at 17.32.02.jpeg"
          alt="reference: couple silhouette — hands as heart curves"
          style={{ display: "none" }}
        />
      </div>
    );
  }

  // Default single heart with centered eye
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: heartSize, height: heartSize }}
    >
      <Heart
        style={{
          width: heartSize,
          height: heartSize,
          color: heartColor,
        }}
      />
      <Eye
        className="absolute"
        style={{
          width: eyeSize,
          height: eyeSize,
          strokeWidth: 2.5,
          transform: "translateY(-4%)",
        }}
      />
    </div>
  );
}