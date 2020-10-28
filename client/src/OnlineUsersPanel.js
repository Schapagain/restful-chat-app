
import React from 'react';
import './OnlineUsersPanel.css';


const OnlineUser = props => {
    let user = {}
    user = {firstname: props.user.firstname,lastname: props.user.lastname,username:props.user.username};
    return(
        <button onClick={props.handleClick} value={JSON.stringify(user)} className="link online-user">{props.user.firstname} {props.user.lastname}</button>
    );
}

class OnlineUsersPanel extends React.Component {
    constructor (props){
        super(props)
        this.state = {
            onlineUsers: {}
    }

    // Update state when a user logs in/out
    this.props.socket.on('online-update',result => {
        if (result.online){
            let user = {};
            user[result.user.username] = result.user;
            this.setState({
                onlineUsers: {...this.state.onlineUsers,...user}
            })
        }else{
            let temp = this.state.onlineUsers;
            delete temp[result.username];
            this.setState({
                onlineUsers: temp,
            })
        }
    })
}

componentDidMount () {
    this.props.socket.emit('get-user-onload',this.props.token)

    // Initial online users state
    this.props.socket.on('get-online-users-success',onlineUsers=>{
        this.setState({
            onlineUsers: {...onlineUsers}
        })
    })
}

render(){
    const users = this.state.onlineUsers;
    return(
        <div id="online-panel">
            <h1>Online Users</h1>
            {Object.keys(users).map(username => <OnlineUser handleClick = {this.props.handleClick} user={users[username]}/>)}
        </div>
    );
}
}

export default OnlineUsersPanel;

