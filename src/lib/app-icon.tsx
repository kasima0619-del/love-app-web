// PWA/ホーム画面アイコン生成用の共通テンプレート
// next/og の ImageResponse から呼び出して使用する

export function AppIconTemplate({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1c2340 0%, #f2467f 100%)",
        borderRadius: size * 0.18,
      }}
    >
      <span style={{ fontSize: size * 0.58, lineHeight: 1 }}>💗</span>
    </div>
  );
}
