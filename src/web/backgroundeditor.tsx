import {
  BackgroundAnimation,
  BreathAnimation,
  Direction,
  NoneAnimation,
  RainbowAnimation,
  StaticColorAnimation,
  WaterdropAnimation,
} from '../backgrounds';

type Field = [string, number, number, number, (e: any) => void];

export const backgroundEditor = (
  bgAnim: BackgroundAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  if (bgAnim.type == 'none') {
    return noneEditor(bgAnim);
  }
  if (bgAnim.type == 'rainbow') {
    return rainbowEditor(bgAnim, onChange);
  }
  if (bgAnim.type == 'static_color') {
    return staticColorEditor(bgAnim, onChange);
  }
  if (bgAnim.type == 'breath') {
    return breathEditor(bgAnim, onChange);
  }
  if (bgAnim.type == 'waterdrop') {
    return waterdropEditor(bgAnim, onChange);
  }
  return;
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
      'INTERVAL',
      anim.interval,
      1,
      60,
      changeAnimParam(onChange, anim, 'interval'),
    ],
    [
      'SATURATION',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'VALUE',
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
        <option value={Direction.LEFT}>右から左</option>
        <option value={Direction.RIGHT}>左から右</option>
        <option value={Direction.UP}>下から上</option>
        <option value={Direction.DOWN}>上から下</option>
      </select>
    </div>
  );
};

const staticColorEditor = (
  anim: StaticColorAnimation,
  onChange: (bgAnim: BackgroundAnimation) => void
) => {
  const fields: Field[] = [
    ['HUE', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'SATURATION',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'VALUE',
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
  const fields: Field[] = [
    ['SPEED', anim.speed, 1, 10, changeAnimParam(onChange, anim, 'speed')],
    ['HUE', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'SATURATION',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'MIN_VALUE',
      anim.min_value * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'min_value', 100),
    ],
    [
      'MAX_VALUE',
      anim.max_value * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'max_value', 100),
    ], // TODO min < maxに必ずなるように制御
  ];
  return (
    <div className="flex flex-wrap m-2">
      {fields.map((f) => slider(...f))}
      <div className="flex flex-wrap w-full pt-3 pb-3">
        <label className="pr-3 text-gray-200 w-24" htmlFor="breath_random">
          RANDOM
        </label>
        <input
          className="m-2"
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
    ['TIME', anim.time, 1, 20, changeAnimParam(onChange, anim, 'time')],
    ['SIZE', anim.size, 1, 4, changeAnimParam(onChange, anim, 'size')],
    ['HUE', anim.hue, 0, 359, changeAnimParam(onChange, anim, 'hue')],
    [
      'SATURATION',
      anim.saturation * 100,
      1,
      100,
      changeAnimParam(onChange, anim, 'saturation', 100),
    ],
    [
      'VALUE',
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
        <label className="pr-3 text-gray-200 w-24" htmlFor="breath_random">
          RANDOM
        </label>
        <input
          className="m-2"
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
      <label className="pr-3 text-gray-200 w-24">{name}</label>
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
