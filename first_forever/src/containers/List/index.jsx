import React from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
require('./list.css')

const Record = ({ time, text }) => {
  const _time = new Date(+time)
  return (
    <div className="list__record--container">
      <span>{`${_time.getFullYear()} ${_time.getHours()}:${_time.getMinutes()}`}</span>
      <Link to={`/show/${time}`}>
        <div>{text}</div>
      </Link>
    </div>
  )
}

class List extends React.Component {
  state = {
    times: [],
    texts: [],
  }
  componentDidMount() {
    simpleStoreContract.methods
      .getList()
      .call()
      .then(times => {
        this.setState({ times })
        return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call()))
      })
      .then(texts => {
        this.setState({ texts })
      })
      .catch(console.error)
  }
  render() {
    const { times, texts } = this.state
    return (
      <div className="list__record--page">
        {times.map((time, idx) => <Record time={time} text={texts[idx]} key={time} />)}
        <BottomNav active={'list'} />
      </div>
    )
  }
}
export default List
