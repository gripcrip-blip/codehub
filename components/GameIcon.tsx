import type { Game } from "@/lib/types";

const sizeClass = {
  sm: "size-[18px]",
  md: "size-5",
  lg: "size-10",
};

type GameIconProps = {
  game: Game;
  size?: keyof typeof sizeClass;
};

export function GameIcon({ game, size = "md" }: GameIconProps) {
  if (!game.icon) return null;

  if (game.icon.startsWith("/")) {
    return (
      <img
        src={game.icon}
        alt=""
        width={40}
        height={40}
        className={`shrink-0 object-contain ${sizeClass[size]}`}
        aria-hidden
      />
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${sizeClass[size]}`} aria-hidden>
      {game.icon}
    </span>
  );
}
