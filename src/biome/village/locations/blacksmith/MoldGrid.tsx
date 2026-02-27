import styled from "styled-components";

const GRID_SIZE = 9;
const CELL_SIZE = 22;

const Grid = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);
  grid-template-rows: repeat(${GRID_SIZE}, ${CELL_SIZE}px);
  gap: 1px;
  border: 1px solid #999;
  background-color: #999;
  height: fit-content;
`;

const Cell = styled.div<{ filled: boolean }>`
  background-color: ${(p) => (p.filled ? "#3a2a1a" : "#e8e0d0")};
  cursor: pointer;
`;

type Props = {
  grid: boolean[][];
  onChange: (grid: boolean[][]) => void;
};

const MoldGrid = ({ grid, onChange }: Props) => {
  const toggle = (r: number, c: number) =>
    onChange(grid.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? !cell : cell))));

  return (
    <Grid>
      {grid.map((row, r) =>
        row.map((filled, c) => (
          <Cell key={`${r}-${c}`} filled={filled} onClick={() => toggle(r, c)} />
        )),
      )}
    </Grid>
  );
};

export default MoldGrid;
