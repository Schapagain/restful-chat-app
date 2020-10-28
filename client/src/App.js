import React from 'react';
import './App.css';
import ChatPanel from './ChatPanel';
import LoginPanel from './LoginPanel';
import RegisterPanel from './RegisterPanel';
import OnlineUsersPanel from './OnlineUsersPanel';

import socketIOClient from "socket.io-client";
const serverAddress = 'http://localhost:3000';
const socket = socketIOClient(serverAddress);

class MainPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showLogin: true,
      showRegister: false,
      showChat: false,
      username: "",
      password: "",
      error: "",
      firstname:"",
      lastname:"",
      message:"",
      image:"",
      token:"",
      profilepicture:"",
      currentChat:"",
    }

    socket.on('get-user-response',response=>{
      if(response.success){
        this.setState({...response.user});
      }
    })

    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
    this.handleLastnameChange = this.handleLastnameChange.bind(this);
    this.handleOnlineUserClick = this.handleOnlineUserClick.bind(this);
  }
  
  handleOnlineUserClick = event => {
    this.setState({
      currentChat: JSON.parse(event.target.value)
    })
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleFirstnameChange(event) {
    this.setState({
      firstname: event.target.value
    });
  }

  handleLastnameChange(event) {
    this.setState({
      lastname: event.target.value
    });
  }

  handleViewChange = event => {
    this.setState({
      showLogin: event.target.id === "show-login",
      showRegister: event.target.id === "show-register",
      showChat: event.target.id === "show-chat",
      error:"",
    })
  }

  handleLogin = event => {
    event.preventDefault();
    const user = {username: this.state.username, password: this.state.password};
    socket.emit('login',user);
    socket.on('login-response',response => {
      console.log(response);
      if (response.success){
        console.log('Authentication successful');
        this.setState({token:response.token});
        this.handleViewChange({target:{id:'show-chat'}});
      }else{
        console.log('Unauthorized');
        this.setState({
          error: "Username or password incorrect"
        })
      }

    })
  }

  handleRegister = event => {
    event.preventDefault();
    const user = {
      username: this.state.username, 
      password: this.state.password, 
      firstname: this.state.firstname, 
      lastname: this.state.lastname
    };

    socket.emit('registration',user);
    socket.on('registration-response',response => {
      console.log('response:',response);
      if(response.success){
        this.handleViewChange({target:{id:"show-login"}});
        this.setState({
          error: "Registration successful. You may log in now"
        })
        
      }else{
        this.setState({
          error: response.error
        })
      }

    })  
  }

  render(){
    return (
      <div id="App-panel">
        {this.state.showLogin && <LoginPanel 
          username={this.state.username}
          password={this.state.password}
          error = {this.state.error}
          handleUsernameChange = {this.handleUsernameChange}
          handlePasswordChange = {this.handlePasswordChange}
          handleViewChange = {this.handleViewChange}
          handleLogin = {this.handleLogin}/>}
        {this.state.showRegister && <RegisterPanel 
            username={this.state.username}
            password={this.state.password}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            error = {this.state.error}
            handleFirstnameChange = {this.handleFirstnameChange}
            handleLastnameChange = {this.handleLastnameChange}
            handleUsernameChange = {this.handleUsernameChange}
            handlePasswordChange = {this.handlePasswordChange}
            handleViewChange = {this.handleViewChange}
            handleRegister = {this.handleRegister}/>}

        {this.state.showChat && this.state.currentChat && <ChatPanel
            username={this.state.username}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            profilepicture={this.state.profilepicture}
            token={this.state.token}
            socket={socket}
            currentChat={this.state.currentChat}/>}
            {this.state.showChat && <OnlineUsersPanel token={this.state.token} handleClick = {this.handleOnlineUserClick} socket={socket}/>}
      </div>
    )
  }
}


const App = props => {
  return (
    <div id="App">
      <MainPanel/>
    </div>
  );
}

export default App;
