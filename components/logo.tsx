import Image from "next/image";

const INTRINSIC_WIDTH = 243;
const INTRINSIC_HEIGHT = 106;

export function Logo({ height = 34 }: { height?: number }) {
  const width = Math.round((height * INTRINSIC_WIDTH) / INTRINSIC_HEIGHT);
  return (
    <Image
      src="/logo-wordmark-full.png"
      alt="Software Lantern"
      width={width}
      height={height}
      className="select-none"
    />
  );
}
