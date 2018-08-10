import React from 'react'
import logo from '../../public/images/logo.svg'
import BottomNav from '../../components/BottomNav'
import './home.css'

const Home = () => (
  <div>
    <div className="home__logo--container">
      <img src={logo} alt="logo" />
      <span className="home__logo--text">First Forever </span>
    </div>
    <div className="home__slogan--container">
      <h1 className="home__slogan--title">最初即永恒</h1>
      <p className="home__slogan--text">
        人生有很多的第一次，如第一次恋爱，第一次找到工作，第一次领到工资等等，但是随着时间的流逝，还来不及回味就已经过去，如果有一个地方能让你存下这一刻的时光，永恒流传，你愿意留下你的时光吗？
      </p>
    </div>
    <BottomNav active={'home'} />
  </div>
)

export default Home
