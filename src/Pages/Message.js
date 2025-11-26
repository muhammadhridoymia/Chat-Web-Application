import React from "react";
import "./Styles/Home.css";
import alice from "../Photos/man2.webp"
import videoCallIcon from "../Photos/videoCall.avif"
import phoneCallIcon from "../Photos/callLogo.png"
import Imgadd from "../Photos/ImgAdd.jpg"
import VoiceIcon from "../Photos/voiceAdd.webp"



export default function Message() {  return (
    <div className='three'>
            {/* Header */}
    <div className='chat-header'>
        <img src={alice} alt={""} className='chat-user-pic' />
        Chat with Alice <p className='online-now'>Online now</p>
        <img src={videoCallIcon} alt={""} className='chat-icon' />
        <img src={phoneCallIcon} alt={""} className='chat-icon' />
    </div>

    {/* Messages area */}
    <div className='chat-body'>
        <div className='message-r'>Hello Alice!</div>
        <div className='message-s'>Hi Hridoy, how are you?</div>
        <div className='message-r'>I'm good. Working on a project.</div>
        <div className='message-s'>Nice! I'm coding my app.</div>
        <div className='message-r'>Hello Alice!</div>
        <div className='message-s'>Hi Hridoy, how are you?</div>
        <div className='message-r'>I'm good. Working on a project.</div>
        <div className='message-s'>Nice! I'm coding my app.</div>
        <div className='message-r'>Hello Alice!</div>
        <div className='message-s'>Hi Hridoy, how are you?</div>
        <div className='message-r'>I'm good. Working on a project.</div>
        <div className='message-s'>Nice! I'm coding my app.</div>
        <div className='message-r'>Hello Alice!</div>
        <div className='message-s'>Hi Hridoy, how are you?</div>
        <div className='message-r'>I'm good. Working on a project.</div>
        <div className='message-s'>Nice! I'm coding my app.</div>
        <div className='message-r'>Hello Alice!</div>
        <div className='message-s'>Hi Hridoy, how are you?</div>
        <div className='message-r'>I'm good. Working on a project.</div>
        <div className='message-s'>Nice! I'm coding my app.</div>
    </div>

    {/* Input area */}
    <div className='chat-input'>
        <img src={Imgadd} alt={""} className='chat-icon' />
        <img src={VoiceIcon} alt={""} className='chat-icon' />
        <input type='text' placeholder='Type a message...' />
        <button>Send</button>
    </div>
        </div>
  );
}