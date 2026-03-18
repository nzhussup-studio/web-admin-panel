import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { floatingEmojisConfig as defaultConfig } from "../config/floatingEmojis";

type FloatingEmojisConfig = typeof defaultConfig;

interface EmojiData {
  id: number;
  emoji: string;
  size: number;
  duration: number;
  startX: number;
  startY: number;
  opacity: number;
}

const FloatingEmojis = ({
  config = defaultConfig,
}: {
  config?: FloatingEmojisConfig;
}) => {
  const [emojis, setEmojis] = useState<EmojiData[]>([]);

  useEffect(() => {
    const generateEmojis = () => {
      return Array.from({ length: config.count }, (_, index) => {
        const emoji =
          config.emojis[Math.floor(Math.random() * config.emojis.length)];
        const size =
          Math.random() * (config.sizeRange.max - config.sizeRange.min) +
          config.sizeRange.min;
        const duration =
          Math.random() *
            (config.durationRange.max - config.durationRange.min) +
          config.durationRange.min;
        const startX = Math.random() * 100; // Random starting position (%)
        const startY = Math.random() * 100;
        const opacity =
          Math.random() * (config.opacityRange.max - config.opacityRange.min) +
          config.opacityRange.min;

        return {
          id: index,
          emoji,
          size,
          duration,
          startX,
          startY,
          opacity,
        };
      });
    };

    setEmojis(generateEmojis());
  }, [config]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: config.zIndex,
      }}
    >
      {emojis.map((emojiData) => {
        const randomX1 = Math.random() * 300 - 150;
        const randomY1 = Math.random() * 300 - 150;
        const randomX2 = Math.random() * 300 - 150;
        const randomY2 = Math.random() * 300 - 150;
        const randomX3 = Math.random() * 300 - 150;
        const randomY3 = Math.random() * 300 - 150;

        return (
          <div
            key={emojiData.id}
            className='floating-emoji'
            style={{
              position: "absolute",
              left: `${emojiData.startX}%`,
              top: `${emojiData.startY}%`,
              fontSize: `${emojiData.size}px`,
              opacity: emojiData.opacity,
              "--delay": `${-Math.random() * 20}s`,
              "--random-x1": `${randomX1}px`,
              "--random-y1": `${randomY1}px`,
              "--random-x2": `${randomX2}px`,
              "--random-y2": `${randomY2}px`,
              "--random-x3": `${randomX3}px`,
              "--random-y3": `${randomY3}px`,
            } as CSSProperties}
          >
            {emojiData.emoji}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingEmojis;
