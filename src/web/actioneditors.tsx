import { Edge, Mouse } from 'actions';

export const mouseEditor = (setMouseEdge: (e: any) => void, action: Mouse) => {
  return (
    <div className="flex flex-wrap m-2">
      <select
        className="w-full p-3"
        value={action.edge}
        onChange={setMouseEdge}
      >
        <option value={Edge.TOP_LEFT}>左上</option>
        <option value={Edge.TOP_RIGHT}>右上</option>
        <option value={Edge.BOTTOM_LEFT}>左下</option>
        <option value={Edge.BOTTOM_RIGHT}>右下</option>
      </select>
    </div>
  );
};
