import {
  BackgroundAnimation,
  BreathAnimation,
  defaultAnimationData,
  Direction,
  NoneAnimation,
  RainbowAnimation,
  StaticColorAnimation,
  WaterdropAnimation,
} from '../backgrounds';

type Field = [string, number, number, number, (e: any) => void];

interface Props {
  bgAnim: BackgroundAnimation;
  onChange: (bgAnim: BackgroundAnimation) => void;
}

export const BackgroundEditor = ({ bgAnim, onChange }: Props): JSX.Element => {
  const changeBgAnimationType = (e: any) => {
    const type = e.target.value;
    onChange(defaultAnimationData(type));
  };
  return (
    <>
      <div className="flex flex-wrap m-2">
        <select
          id="bgAnimationType"
          className="w-full p-3"
          value={bgAnim.type}
          onChange={changeBgAnimationType}
        >
          <option value="none">None</option>
          <option value="rainbow">Rainbow</option>
          <option value="static_color">Static</option>
          <option value="breath">Breath</option>
          <option value="waterdrop">Water drop</option>
        </select>
      </div>
      {_backgroundEditor(bgAnim, onChange)}
    </>
  );
};

export const _backgroundEditor = (
  bgAnim: BackgroundAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
): JSX.Element => {
  switch (bgAnim.type) {
    case 'none':
      return noneEditor(bgAnim);
    case 'rainbow':
      return rainbowEditor(bgAnim, onChange);
    case 'static_color':
      return staticColorEditor(bgAnim, onChange);
    case 'breath':
      return breathEditor(bgAnim, onChange);
    case 'waterdrop':
      return waterdropEditor(bgAnim, onChange);
  }
};

const noneEditor = (_: NoneAnimation) => {
  return <div className="flex flex-wrap m-2"></div>;
};

const rainbowEditor = (
  anim: RainbowAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  const fields: Field[] = [
    [
      'Speed',
      anim.interval,
      1,
      60,
      changeAnimParam(onChange, anim, 'interval'),
    ],
    [
      'Saturation',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'Brightness',
      anim.value * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'value', 100),
    ],
  ];

  return (
    <div className="flex flex-wrap m-2">
      {fields.map((f) => slider(...f))}
      <select
        id="directionType"
        className="w-full p-3"
        value={anim.direction}
        onChange={changeAnimParam(onChange, anim, 'direction')}
      >
        <option value={Direction.LEFT}>Right to left</option>
        <option value={Direction.RIGHT}>Left to right</option>
        <option value={Direction.UP}>Bottom to up</option>
        <option value={Direction.DOWN}>Up to bottom</option>
      </select>
    </div>
  );
};

const staticColorEditor = (
  anim: StaticColorAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  const fields: Field[] = [
    ['Hue', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'Saturation',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'Brightness',
      anim.value * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'value', 100),
    ],
  ];
  return (
    <div className="flex flex-wrap m-2">{fields.map((f) => slider(...f))}</div>
  );
};

const breathEditor = (
  anim: BreathAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  const onChangeLocal = (bgAnim: BackgroundAnimation) => {
    if (bgAnim.type != 'breath') return;
    const minValue = Math.min(bgAnim.min_value, bgAnim.max_value);
    const maxValue = Math.max(bgAnim.min_value, bgAnim.max_value);
    bgAnim.min_value = minValue;
    bgAnim.max_value = maxValue;
    onChange(bgAnim);
  };
  const fields: Field[] = [
    ['Speed', anim.speed, 1, 10, changeAnimParam(onChange, anim, 'speed')],
    ['Hue', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'Saturation',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'Brightness(min)',
      anim.min_value * 100,
      1,
      100,
      changeAnimParam(onChangeLocal, anim, 'min_value', 100),
    ],
    [
      'Brightness(max)',
      anim.max_value * 100,
      1,
      100,
      changeAnimParam(onChangeLocal, anim, 'max_value', 100),
    ],
  ];
  return (
    <div className="flex flex-wrap m-2">
      {fields.map((f) => slider(...f))}
      <div className="flex flex-wrap w-full pt-3 pb-3">
        <label
          className="pr-3 text-gray-200 w-24 text-xs"
          htmlFor="breath_random"
        >
          Random color
        </label>
        <input
          id="breath_random"
          type="checkbox"
          checked={anim.random}
          onChange={(e) => {
            const v = e.target.checked;
            const newAnim = { ...anim, random: v };
            onChange(newAnim);
          }}
        />
      </div>
    </div>
  );
};

const waterdropEditor = (
  anim: WaterdropAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  const fields: Field[] = [
    ['Time left', anim.time, 1, 20, changeAnimParam(onChange, anim, 'time')],
    ['Size', anim.size, 1, 4, changeAnimParam(onChange, anim, 'size')],
    ['hue', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'Saturation',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'Brightness',
      anim.value * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'value', 100),
    ],
  ];
  return (
    <div className="flex flex-wrap m-2">
      {fields.map((f) => slider(...f))}
      <div className="flex flex-wrap w-full pt-3 pb-3">
        <label
          className="pr-3 text-gray-200 w-24 text-xs"
          htmlFor="breath_random"
        >
          Random color
        </label>
        <input
          id="breath_random"
          type="checkbox"
          checked={anim.random}
          onChange={(e) => {
            const v = e.target.checked;
            const newAnim = { ...anim, random: v };
            onChange(newAnim);
          }}
        />
      </div>
    </div>
  );
};

const changeAnimParam = (
  onChange: (bgAnim: BackgroundAnimation) => void,
  anim: BackgroundAnimation,
  key: string,
  div = 1
) => {
  return (e: any) => {
    const newValue = parseInt(e.target.value, 10) / div;
    const newAnim = { ...anim, [key]: newValue };
    onChange(newAnim);
  };
};

const slider = (
  name: string,
  value: number,
  min: number,
  max: number,
  onChange: (e: any) => void
) => {
  return (
    <div className="flex flex-wrap w-full pt-3 pb-3">
      <label className="pr-3 text-gray-200 w-24 text-xs">{name}</label>
      <input
        className="flex-grow"
        type="range"
        value={value}
        min={min}
        max={max}
        step="1"
        onInput={onChange}
      />
    </div>
  );
};
