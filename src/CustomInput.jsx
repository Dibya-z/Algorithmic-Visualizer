import { useState } from "react"

export default function({ setArray, isSorting, errorMessage, setErrorMessage }){
    const [customInput, setCustomInput] = useState('');
    
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
    return (
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
    )
}