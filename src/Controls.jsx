
const Controls = ({
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    maxBars,
    setMaxBars,
    generateRandomArray,
    startSorting,
    isSorting
}) => {
    const handleMaxBarsChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= 20) {
          setMaxBars(value);
        }
      };

    return (
        <div className="controls">
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
          </select>
          <div className="speed-control">
            <label htmlFor="speed">Speed:</label>
            <input
              type="range"
              id="speed"
              min="5"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isSorting}
            />
          </div>
          <div className="max-bars-control">
            <label htmlFor="maxBars">N:</label>
            <input
              type="number"
              id="maxBars"
              min="1"
              max="20"
              value={maxBars}
              onChange={handleMaxBarsChange}
              disabled={isSorting}
            />
          </div>
          <button onClick={generateRandomArray} disabled={isSorting}>Generate New Array</button>
          <button onClick={startSorting} disabled={isSorting}>Start Sorting</button>
        </div>
      )
};
export default Controls;