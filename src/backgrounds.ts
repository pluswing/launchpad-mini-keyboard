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

export const noneAnimation = (): BackgroundAnimation => ({ type: 'none' });

export const defaultAnimationData = (type: string): BackgroundAnimation => {
  if (type == 'none') {
    return noneAnimation();
  }
  if (type == 'rainbow') {
    return {
      type: 'rainbow',
      interval: 20,
      saturation: 1,
      value: 1,
      fps: 10,
      direction: Direction.LEFT,
    };
  }
  // FIXME
  return noneAnimation();
};
