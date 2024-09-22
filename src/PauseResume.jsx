
const PauseResume = ({ isSorting, isPaused, setIsPaused, pauseRef })=>{
    const handlePause = () => {
        pauseRef.current = true;
        setIsPaused(true);
    };
    const handleResume = () => {
        pauseRef.current = false;
        setIsPaused(false);
    };

    return (
        <div className="pause-resume-controls">
              <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
              <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        </div>
    )
}
export default PauseResume;