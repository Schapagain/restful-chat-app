import React from 'react';
import {UsernameInput,PasswordInput,FirstnameInput,LastnameInput,ErrorLabel,Button} from './FormComponents';
const RegisterPanel = props => {
    return (
        <form id = "register-panel" onSubmit={props.handleRegister}>
            <h1>Chat App</h1>
            <FirstnameInput onChange={props.handleFirstnameChange} value={props.firstname}/>
            <LastnameInput onChange={props.handleLastnameChange} value={props.lastname}/>
            <UsernameInput onChange={props.handleUsernameChange} value={props.username}/>
            <PasswordInput onChange={props.handlePasswordChange} value={props.password}/>
            <ErrorLabel errorText={props.error}/>
            <Button buttonId="register" buttonText="Register"/>
            <label className="link" id="show-login" onClick={props.handleViewChange}>Already a user? Login here.</label>
        </form>
    );
}

export default RegisterPanel;