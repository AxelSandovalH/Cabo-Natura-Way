interface AgaveLogoProps {
  size?: number;
  className?: string;
}

export default function AgaveLogo({ size = 38, className = "" }: AgaveLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="19" cy="19" r="18" fill="#2D5016" />
      {/* Central agave leaf */}
      <path
        d="M19 29 Q14.5 21 12.5 11 Q16 15 19 19 Q22 15 25.5 11 Q24 21 19 29Z"
        fill="#FAFAF7"
        opacity="0.92"
      />
      {/* Left leaf */}
      <path
        d="M19 29 Q11 23 8 15 Q13.5 19 19 19 Q18.5 15 21.5 9 Q19.5 21 19 29Z"
        fill="#FAFAF7"
        opacity="0.42"
      />
      {/* Right leaf */}
      <path
        d="M19 29 Q27 23 30 15 Q24.5 19 19 19 Q19.5 15 16.5 9 Q18.5 21 19 29Z"
        fill="#FAFAF7"
        opacity="0.42"
      />
      {/* Center dot */}
      <circle cx="19" cy="19" r="2.2" fill="#E8A838" />
    </svg>
  );
}
