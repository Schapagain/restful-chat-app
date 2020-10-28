import React from 'react';
import {UsernameInput,PasswordInput,ErrorLabel,Button} from './FormComponents';
const LoginPanel = props => {
    return (
        <form id = "login-panel" onSubmit={props.handleLogin}>
            <h1>Chat App</h1>
            <UsernameInput onChange={props.handleUsernameChange} value={props.username}/>
            <PasswordInput onChange={props.handlePasswordChange} value={props.password}/>
            <ErrorLabel errorText={props.error}/>
            <Button buttonId="login" buttonText="Login"/>
            <label className="link" id="show-register" onClick={props.handleViewChange} href="">Not a user? Register here.</label>
        </form>
    );
  }

  export default LoginPanel;