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
  direction: Direction;
}

export interface StaticColorAnimation {
  type: 'static_color';
  //
  // color (HSV)
  hue: number;
  saturation: number;
  value: number;
}
export interface BreathAnimation {
  type: 'breath';
  //
  // speed
  speed: number;
  // hue
  // saturation
  hue: number;
  saturation: number;
  // min_value
  // max_value
  min_value: number;
  max_value: number;
  // random
  random: boolean;
}
export interface WaterdropAnimation {
  type: 'waterdrop';
  //
  // time
  time: number;
  // size
  size: number;
  // color (HSV)
  hue: number;
  saturation: number;
  value: number;
  // random
  random: boolean;
}

export type BackgroundAnimation =
  | NoneAnimation
  | RainbowAnimation
  | StaticColorAnimation
  | BreathAnimation
  | WaterdropAnimation;

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
      direction: Direction.LEFT,
    };
  }
  if (type == 'static_color') {
    return {
      type: 'static_color',
      hue: 0,
      saturation: 1,
      value: 1,
    };
  }
  if (type == 'breath') {
    return {
      type: 'breath',
      speed: 10,
      hue: 0,
      saturation: 1,
      min_value: 0,
      max_value: 1,
      random: false,
    };
  }
  if (type == 'waterdrop') {
    return {
      type: 'waterdrop',
      time: 10,
      size: 3,
      hue: 0,
      saturation: 1,
      value: 1,
      random: false,
    };
  }
  // FIXME
  return noneAnimation();
};
