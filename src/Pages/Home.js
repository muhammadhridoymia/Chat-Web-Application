import React from 'react'
import '../Pages/Styles/Home.css'
import photo from "../Photos/man1.avif"
import alice from "../Photos/man2.webp"
import bob from "../Photos/woman1.avif"
import charlie from "../Photos/woman2.webp"
import videoCallIcon from "../Photos/videoCall.avif"
import phoneCallIcon from "../Photos/callLogo.png"
import Imgadd from "../Photos/ImgAdd.jpg"
import VoiceIcon from "../Photos/voiceAdd.webp"


export default function Home() {

const user =[
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
    {name: 'Alice', profilePic: alice},
    {name: 'Bob', profilePic: bob},
    {name: 'Charlie', profilePic: charlie},   
    {name: 'Diana', profilePic: photo},
]


  return (
    <div className='Home'>
        
        <div className='one'>
            <div className='logo'>FeedBack</div>
            <div className='profile-section'>
                <div className='profile'> <img src={photo} alt={""} className='profile-pic' /></div>
                <div className='name'>Hridoy</div>
            </div>
            <div className='menu'>
                <div className='menu-btn'>menu</div>
                <button className='menu-btn'>Add New</button>
                <button className='menu-btn'>Create Group</button>
                <button className='menu-btn'>Join Group</button>
                <button className='menu-btn'>Change profile</button>
                <button className='menu-btn'>Delete Account</button>
                <button className='menu-btn'>Logout</button>
            </div>
        </div>

        <div className='two'>
            <div>
                <input type="text" placeholder='Search...' className='search-bar' />
                <div className='active'>
                    <div className='active-user'>
                        {user.map((usr, index) => (
                            <div key={index} className='user-item'>
                                <img src={usr.profilePic} alt={""} className='user-pic' />
                                <div className='user-name'>{usr.name}</div>
                                <div className='user-status'> online</div>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>

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
    </div>
  )
}
