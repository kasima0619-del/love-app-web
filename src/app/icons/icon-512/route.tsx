import { ImageResponse } from "next/og";
import { AppIconTemplate } from "@/lib/app-icon";

const size = { width: 512, height: 512 };

export async function GET() {
  return new ImageResponse(<AppIconTemplate size={size.width} />, { ...size });
}
