import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Doris Chen's React App!</h1>
        <p>This is my first React Vite TypeScript project.</p>
        
        {/* Interactive Element 1: Counter Button */}
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        
        {/* Interactive Element 2: Name Input */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {name && <p>Hello, {name}!</p>}
        </div>
      </header>
    </div>
  )
}

export default App