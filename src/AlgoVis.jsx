import { useState, useEffect, useRef } from 'react';
import './AlgoVisualizer.css';


const AlgorithmVisualizer= () => {
  const pauseRef =useRef(false);
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(20);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [maxBars, setMaxBars] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    generateRandomArray();
  }, [maxBars]);

  const generateRandomArray = () => {
    const newArray = [];
    for(let i = 0; i < maxBars; i++){
      const value = Math.floor((Math.random()*100)+1)
      newArray.push({
        value : value,
        state : 'unsorted'
      })
    }
    setArray(newArray);
    setErrorMessage('');
  }; 

  function handleCustomInput(){
    const newArray = customInput.split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num))
      .map(value => ({ value, state: 'unsorted'  }));
    if (newArray.length > 20) {
      setErrorMessage('Array size should not exceed 20');
    }
      else if(newArray.filter(item => item.value > 100).length >= 1){
      setErrorMessage('Bar value out of range, value shouldn\'t exceed 100');
    }
     else if (newArray.filter(item => item.value < 1).length >= 1) {
      setErrorMessage('Bar value out of range, value shouldn\'t be less than 1');
    }else if (newArray.length > 0) {
      setArray(newArray);
      setErrorMessage('');
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pauseableDelay = async () => {
    while (pauseRef.current) {
      await sleep(100);
    }
    await sleep(Math.max(10, 1000 - speed * 10));
  };

  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (pauseRef.current) await pauseableDelay();
        arr[j].state = 'sorting';
        arr[j + 1].state = 'sorting';
        setArray([...arr]);
        await pauseableDelay();

        if (arr[j].value > arr[j + 1].value) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await pauseableDelay();
        }

        arr[j].state = 'unsorted';
        arr[j + 1].state = 'unsorted';
      }
      arr[arr.length - 1 - i].state = 'sorted';
    }
    arr.forEach(item => item.state = 'sorted');
    setArray([...arr]);
  };

  const selectionSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      if (pauseRef.current) await pauseableDelay();
      let minIdx = i;
      arr[i].state = 'sorting';
      for (let j = i + 1; j < arr.length; j++) {
        if (pauseRef.current) await pauseableDelay();
        arr[j].state = 'sorting';
        setArray([...arr]);
        await pauseableDelay();

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].state = 'unsorted';
          minIdx = j;
        } else {
          arr[j].state = 'unsorted';
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      }
      arr[i].state = 'sorted';
      setArray([...arr]);
      await pauseableDelay();
    }
  };

  const insertionSort = async () => {
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      if (pauseRef.current) await pauseableDelay();
      let key = arr[i];
      let j = i - 1;
      arr[i].state = 'sorting';
      setArray([...arr]);
      await pauseableDelay();

      while (j >= 0 && arr[j].value > key.value) {
        if (pauseRef.current) await pauseableDelay();
        arr[j + 1] = arr[j];
        arr[j].state = 'sorting';
        j = j - 1;
        setArray([...arr]);
        await pauseableDelay();
        arr[j + 1].state = 'unsorted';
      }
      arr[j + 1] = key;
      for (let k = 0; k <= i; k++) {
        arr[k].state = 'sorted';
      }
      setArray([...arr]);
      await pauseableDelay();
    }
  };

  const startSorting = async () => {
    setIsSorting(true);
    pauseRef.current = false;
    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      default:
        break;
    }
    setIsSorting(false);
    pauseRef.current = false;
  };

  const handlePause = () => {
    pauseRef.current = true;
    setIsPaused(true);
  };

  const handleResume = () => {
    pauseRef.current = false;
    setIsPaused(false);
  };

  const handleMaxBarsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 20) {
      setMaxBars(value);
    }
  };

  return (
    
      <div className="container">
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
        <div className="pause-resume-controls">
              <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
              <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        </div>
        <div className="array-container">
          {array.map((item, index) => (
            <div 
              key={index} 
              className={`array-bar ${item.state}`}
              style={{
                height: `${(item.value / Math.max(...array.map(i => i.value))) * 100}%`,
              }}
            >
              <span className="bar-value">{item.value}</span>
              <span className="bar-index">{index}</span>
            </div>
          ))}
        </div>
        <div className="custom-input">
          <input
            type="text"
            placeholder="Enter comma-separated numbers (max 20, values 1-100)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isSorting}
          />
          <button onClick={handleCustomInput} disabled={isSorting}>Create Custom Array</button>
          {errorMessage && <span className="error-message">{errorMessage}</span>}
        </div>
      </div>
    
  );
};

export default AlgorithmVisualizer;