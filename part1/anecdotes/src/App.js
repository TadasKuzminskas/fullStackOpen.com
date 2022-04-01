import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)

  const [points, setPoints] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })

  const [largestValue, setLargestValue] = useState(0);

  const nextAnecdode = () => {
    let randomNumber = Math.floor((Math.random()*7));
    setSelected(randomNumber);
  }
  
  const voteAnecdote = () => {
    const copy = { ...points };
    copy[selected] += 1
    console.log(copy[selected])
    setPoints(copy);
    if (copy[selected] > points[largestValue]) {
       setLargestValue(selected)
    }
  }
  

  return (
    <div>
      <h1>Anecdote of the day</h1>
    <div>
      {anecdotes[selected]}
    </div>
    <div>has {points[selected]} votes</div>
    <button onClick={voteAnecdote}>vote</button>
    <button onClick={nextAnecdode}>next anectode</button>
    <div>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[largestValue]}</div>
    </div>
    </div>
  )
}

export default App