import { useState, useEffect } from 'react'
import './index.css'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const sampleText = `The quick brown fox jumps over the lazy dog. Practice makes perfect, and typing is fun and easy. Keep calm and type on, because fast fingers win the race. Accuracy is more important than speed, and consistent typing helps build muscle memory. Stay focused, avoid distractions, and always strive to improve your skills. With regular practice, you will notice your typing speed and accuracy increase over time. Remember, every expert was once a beginner, so keep typing and enjoy the journey!`

  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkmode') === 'true')

  useEffect(() => {
    let timer = null
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    if (!isActive || timeLeft === 0) {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  useEffect(() => {
    if (userInput.length === 1 && startTime === null) {
      setStartTime(Date.now())
      setIsActive(true)
    }

    if (userInput === sampleText && isActive) {
      setIsActive(false)
    }

    let timeElapsed = 0
    if (startTime) {
      if (userInput === sampleText) {
        timeElapsed = (Date.now() - startTime) / 60000
      } else {
        timeElapsed = (60 - timeLeft) / 60
      }
    }

    const wordsTyped = userInput.trim().split(" ").length
    const wpmCalc = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
    const correctChars = userInput.split("").filter((char, i) => char === sampleText[i]).length
    const accCalc = Math.round((correctChars / sampleText.length) * 100 || 100)
    setAccuracy(accCalc)
    setWpm(wpmCalc)
  }, [userInput, sampleText, startTime, timeLeft, isActive])

  const restartTest = () => {
    setUserInput('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setTimeLeft(60)
    setIsActive(false)
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkmode', !prev)
      return !prev
    })
  }

  const renderColoredText = () => {
    return sampleText.split('').map((char, idx) => {
      let color = ''
      if (userInput.length > idx) {
        color = userInput[idx] === char ? 'text-success' : 'text-danger'
      }
      return (
        <span key={idx} className={color}>{char}</span>
      )
    })
  }

  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-center flex-grow-1 m-0">Typing Tool</h1>
          <button onClick={toggleDarkMode} className="btn btn-secondary ms-3">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div
          className="mb-4 p-3 rounded border"
          style={{
            fontFamily: 'monospace',
            fontSize: '1.15rem',
            background: darkMode ? '#23272b' : '#f8f9fa',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          {renderColoredText()}
        </div>

        <textarea
          className="form-control mb-4"
          rows="4"
          placeholder="Start typing here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={timeLeft === 0}
          style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}
        />

        <div className="row text-center mb-4">
          <div className="col">
            <h5>WPM</h5>
            <p className="fs-4">{wpm}</p>
          </div>
          <div className="col">
            <h5>Accuracy</h5>
            <p className="fs-4">{accuracy}%</p>
          </div>
          <div className="col">
            <h5>Time Left</h5>
            <p className="fs-4">{timeLeft}</p>
          </div>
        </div>

        <div className="text-center">
          <button onClick={restartTest} className="btn btn-danger">Restart</button>
        </div>
      </div>
    </div>
  )
}

export default App
