import { useEffect, useState } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import "./App.css"
import Die from "./components/Die"

function App() {
  const [dice, setDice] = useState(allNewDice())

  const [tenzies, setTenzies] = useState(false)

  const [numClicks, setNumClicks] = useState(0)

  const [start, setStart] = useState(false)

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every((die) => die.value === firstValue)

    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false)
      setDice(allNewDice())
      setNumClicks(0)
      return
    }

    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.isHeld ? die : generateNewDie()
      })
    )
    setNumClicks(numClicks + 1)
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      })
    )
  }

  function play() {
    setStart(true)
  }

  const diceElements = dice.map((v) => <Die key={v.id} value={v} isHeld={v.isHeld} holdDice={() => holdDice(v.id)} />)

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      {start ? (
        <>
          <div className="dice-container">{diceElements}</div>
          <button className="roll-dice-btn" onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
          <div className="number-of-rolls">
            Number of Rolls: <strong>{numClicks}</strong>
          </div>
        </>
      ) : (
        <button className="play-btn" onClick={play}>
          play
        </button>
      )}
    </main>
  )
}

export default App
