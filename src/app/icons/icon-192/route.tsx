import { ImageResponse } from "next/og";
import { AppIconTemplate } from "@/lib/app-icon";

const size = { width: 192, height: 192 };

export async function GET() {
  return new ImageResponse(<AppIconTemplate size={size.width} />, { ...size });
}
