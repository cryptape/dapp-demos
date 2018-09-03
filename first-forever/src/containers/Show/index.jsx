import React from 'react'
import nervos from '../../nervos'
import BottomNav from '../../components/BottomNav'
import { simpleStoreContract } from '../../simpleStore'
require('./show.css')

class Show extends React.Component {
  state = {
    time: 0,
    text: '',
    errorText: '',
  }

  componentDidMount() {
    const { time } = this.props.match.params
    if (time) {
      simpleStoreContract.methods
        .get(time)
        .call({
          from: nervos.appchain.accounts.wallet[0].address,
        })
        .then(text => {
          this.setState({ time, text })
        })
        .catch(error => this.setState({ errorText: JSON.stringify(error) }))
    } else {
      this.setState({ errorText: 'No Time Specified' })
    }
  }
  render() {
    const { time, text } = this.state
    const _time = new Date(+time)
    if (!time) {
      return <div style={{ textAlign: 'center' }}>正在加载您的回忆</div>
    }
    return (
      <div className="show__container">
        <span className="show__time">{_time.toLocaleString()}</span>
        <img src="https://picsum.photos/200/100?random" alt="rand_img" className="show__photo" />
        <div className="show__text">{text}</div>
        <BottomNav active={'list'} />
      </div>
    )
  }
}
export default Show
