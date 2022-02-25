export enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

export interface NoneAnimation {
  type: 'none';
}

export interface RainbowAnimation {
  type: 'rainbow';
  interval: number;
  saturation: number;
  value: number;
  fps: number;
  direction: Direction;
}

export interface StaticColorAnimation {
  type: 'static_color';
  // ...
}
export interface BreathAnimation {
  type: 'breath';
  // ...
}
export interface WaterdropAnimation {
  type: 'waterdrop';
  // ...
}

export type BackgroundAnimation = NoneAnimation | RainbowAnimation;
