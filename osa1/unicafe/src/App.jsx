import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral= () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <Header/>
      <Button
        handleClick={increaseGood}
        text='good'
        />
       <Button
        handleClick={increaseNeutral}
        text='neutral'
        />
       <Button
        handleClick={increaseBad}
        text='bad'
        />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}
const Header = () => {
  return (
    <div>
      <h1> give feedback</h1>
    </div>
  );
};
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral +bad
  const average = (good-bad)/total
  const positive =(good/total) *100
  if (total === 0) {
    return (
      <div>
        <h1> statistics</h1>
        No feedback given
      </div>
    )
  }
  return (
    <div><h1> statistics</h1>
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={total} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={`${positive}%`} />
      </tbody>
    </table>
    </div>
  );
};

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  );
};

export default App