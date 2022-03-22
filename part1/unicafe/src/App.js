import { useState } from 'react'

const Button = ({handleClick, name}) => <button onClick={handleClick}>{name}</button>

const StatisticLine =({text, value}) => {
  return <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
}

const Statistics = (props) => {
    if ((props.bad+props.good+props.neutral) === 0) {
      return <div>
        <h2>statistics</h2>
        <h3>No feedback given</h3>
        </div>
    } else {
    return <div>
      <h2>statistics</h2>
      <table>
        <tbody>
      <StatisticLine text="good" value={props.good}/>
      <StatisticLine text="neutral" value={props.neutral}/>
      <StatisticLine text="bad" value={props.bad}/>
      <StatisticLine text="all" value={props.all}/>
      <StatisticLine text="average" value={props.average}/>
      <StatisticLine text="positive" value={props.positive}/>
        </tbody>
      </table>
    </div>
    }
  }

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  //const [all, setAll] = useState(0);

  let average = (good-bad)/(bad+good+neutral);
  let positive = ((good*100)/(good+bad+neutral)) + '%';
  let all = good+bad+neutral;
  
  const giveFeedback = (feedback) => () => {
     if (feedback === 'good') {
      setGood(good+1)
    } else if (feedback === 'neutral') {
      setNeutral(neutral+1)
    } else if (feedback === 'bad') {
      setBad(bad+1)
    }
  } 

  return (
    <div>
      <h1>give feedback</h1>
      <Button name='good' position='good' handleClick={giveFeedback('good')}/>
      <Button name='neutral' position='neutral' handleClick={giveFeedback('neutral')}/>
      <Button name='bad' position='bad' handleClick={giveFeedback('bad')}/>
      <Statistics good={good} neutral={neutral} bad={bad} all ={all} average={average} positive={positive}/>
    </div>
  )
}

export default App