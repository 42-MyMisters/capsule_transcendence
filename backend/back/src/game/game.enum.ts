export const enum Direction {
  NONE = 0, // => hmm...
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4
}

export const enum Hit {
  PADDLE = 1,
  WALL = 0,
}

export const enum GameStatus {
  COUNTDOWN = 0,
  RUNNING = 1,
  FINISHED = 2,
}

export const enum GameMode {
  DEFAULT = 0,
}

export enum GameType {
  PUBLIC = 0,
  PRIVATE = 1
}
