import React from 'react'
import logo from '../../public/image/logo.png'
import TopNav from '../../components/TopNav/index';

const Home = () => (
    <div style={Styles.Content}>
        <TopNav/>
        <img alt={'Nervos'}
             src={logo}
             style={Styles.Logo}/>
    </div>
)

const Styles = {
    Content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    Logo: {
        width: 150,
        height: 150,
        marginTop: 40,
    }
}

export default Home