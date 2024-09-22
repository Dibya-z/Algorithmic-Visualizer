
export default function ArrayContainer({ array }){
    
    return (
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
    )
}