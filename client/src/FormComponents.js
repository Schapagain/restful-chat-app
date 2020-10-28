
import React from 'react';
import './FormComponents.css';

const UsernameInput = props => {
    return (
      <input 
        onChange = {props.onChange}
        id="username" 
        placeholder="Enter Username" 
        type="text" 
        value={props.value}
        required/>
    );
}
  
const PasswordInput = props => {
    return (
        <input 
        onChange = {props.onChange}
        id="password" 
        placeholder="Enter Password" 
        type="password"
        value={props.value} 
        required/>
    );
}
const FirstnameInput = props => {
    return (
        <input 
        onChange = {props.onChange}
        id="firstname" 
        placeholder="Enter first name" 
        type="text"
        value={props.value} 
        required/>
    );
}
const LastnameInput = props => {
    return (
        <input 
        onChange = {props.onChange}
        id="lastname" 
        placeholder="Enter last name" 
        type="text"
        value={props.value} 
        required/>
    );
}

const ErrorLabel = props => {
    return(
      <label id="error">{props.errorText}</label>
    )
}
  
const Button = props => {
    return(
        <button id={props.buttonId}>{props.buttonText}</button>
    );
}

export {UsernameInput,PasswordInput,FirstnameInput,LastnameInput,ErrorLabel,Button};