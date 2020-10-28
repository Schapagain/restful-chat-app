
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane,faPaperclip } from '@fortawesome/free-solid-svg-icons';
import './ChatPanel.css';

const MessageInput = props => {
    return (
      <input 
        onChange = {props.onChange}
        id="messageBox" 
        placeholder="What's on your mind?" 
        type="text"
        value={props.value} />
    );
  }

const ProfileBanner = props => {
    return(
          <div id="profile-banner">
            <div id="profile-picture">
              {/* <img src={props.profilepicture} alt="Profile"/> */}
            </div>
            <div id="profile-info">
              {props.firstname} {props.lastname}
            </div>
          </div>
    );
  }
  
const Message = props => {
    return (
        <div className={props.type}>
        <div className='meta-message'>{props.meta}</div>
        {props.message && <div>{props.message}</div>}
        {props.image && <img src={props.image} alt="chat message"/>}
        </div>
    );
}
  
class Messages extends React.Component {

constructor(props){
    super(props);
    this.messagesEndRef = React.createRef();
}

    componentDidMount () {
        this.scrollToBottom()
    }
    componentDidUpdate () {
        this.scrollToBottom()
    }
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    render () {
        const messages = this.props.messages;
        return (
        <div id="messages">
            {messages.map(msg => <Message type={msg.type} message={msg.message} image={msg.image} meta={msg.meta}/>)}
            <div ref={this.messagesEndRef} />
        </div>
        )
    }
}
  
  class ChatPanel extends React.Component {

    /*
    Expected props: 
    sender{username,token,firstname,lastname}, 
    receiver{username},
    */

    constructor(props){
        super(props)
        this.state = {
            message: "",
            messages: [],
        }

        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleSend = this.handleSend.bind(this);


        this.props.socket.on('chat-message',msg=>{
            this.setState({
            messages: this.state.messages.concat({...msg,type:'message other-message',meta:msg.firstname.concat(' ',getCurrentTime())})
            })
        })
  
        this.props.socket.on('broadcast-message',msg=>{
            this.setState({
            messages: this.state.messages.concat({...msg,type:'message broadcast-message',meta:msg.firstname.concat(' ',getCurrentTime())})
            })
        })

    }

    handleMessageChange = event => {
        this.setState({
          message: event.target.value
        })
    }

    handleSend = event => {
        event.preventDefault();
        if (this.state.message.trim() !== ""){
            this.props.socket.emit('chat-message',{message:this.state.message,userToken: this.props.token,firstname: this.props.firstname,receiver:this.props.currentChat.username});
            this.setState({
            messages: this.state.messages.concat({message: this.state.message,type:'message own-message',meta:getCurrentTime(),receiver:this.props.currentChat.username}),
            message:""
            });
        }
    }
    
    handleImageUpload = event => {
        const file = event.target.files[0];

        if (file){
            const f = new window.FileReader();

            f.onloadend = () => {
            const base64String = f.result;
            this.props.socket.emit('chat-message',{
                image: base64String,
                userToken: this.props.token,
                firstname: this.props.firstname,
                receiver: this.props.currentChat.username,
            });

            this.setState({
                messages: this.state.messages.concat({image: base64String, type:'message own-message',meta:getCurrentTime()})
            })
            event.target = null;
            }
            f.readAsDataURL(file);
        }
    }

    render(){
        return (
            <div id="chat-panel">
              <ProfileBanner firstname={this.props.currentChat.firstname} lastname={this.props.currentChat.lastname} profilepicture={this.props.currentChat.profilepicture}/>
              <Messages messages={this.state.messages}/>
              
              <form id="chat-form" onSubmit={this.handleSend}>
                  <MessageInput onChange={this.handleMessageChange} value={this.state.message} /> 
                  <label id="image-upload" htmlFor="image"><FontAwesomeIcon icon={faPaperclip} size="lg" color="black"/>
                      <input type="file" id="image" onChange={this.handleImageUpload} accept=".png, .jpg, .jpeg" />
                  </label>
                  <button id="send"><FontAwesomeIcon icon={faPaperPlane} size="lg"/></button>
              </form>
            </div>
        );
    } 
  }

  const getCurrentTime = () => new Date().toLocaleTimeString();
  export default ChatPanel;