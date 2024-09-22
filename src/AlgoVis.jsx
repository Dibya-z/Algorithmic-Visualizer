import { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import ArrayContainer from './ArrayContainer';
import CustomInput from './CustomInput';
import PauseResume from './PauseResume';
import './AlgoVisualizer.css';


const AlgorithmVisualizer= () => {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(20);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [maxBars, setMaxBars] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const pauseRef =useRef(false);

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

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pauseableDelay = async () => {
    while (pauseRef.current) {
      await sleep(100);
    }
    await sleep(Math.max(10, 1000 - speed * 10));
  };

  const swap = async (arr, i, j) => {
    arr[i].state = 'swapping';
    arr[j].state = 'swapping';
    setArray([...arr]);
    await pauseableDelay();

    [arr[i], arr[j]] = [arr[j], arr[i]];
    setArray([...arr]);
    await pauseableDelay();

    arr[i].state = 'sorting';
    arr[j].state = 'sorting';
    setArray([...arr]);
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
          await swap(arr, j, j + 1);
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
        await swap(arr, i, minIdx);
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
        await swap(arr, j + 1, j);
        j = j - 1;
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
    
  <div className='Container'>
    <h1>Algorithm Visualizer</h1>
    <Controls
      algorithm={algorithm}
      setAlgorithm={setAlgorithm}
      speed={speed}
      setSpeed={setSpeed}
      maxBars={maxBars}
      setMaxBars={setMaxBars}
      generateRandomArray={generateRandomArray}
      startSorting={startSorting}
      isSorting={isSorting}
    />
    <PauseResume
      isSorting={isSorting}
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      pauseRef={pauseRef}
    />
    <ArrayContainer array={array} />
    <CustomInput
      setArray={setArray}
      isSorting={isSorting}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
    />
  </div>
    
  );
};

export default AlgorithmVisualizer;