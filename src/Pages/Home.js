import React from 'react'
import '../Pages/Styles/Home.css'


export default function Home() {

const user =[
    {name: 'Alice', profilePic: 'alice.jpg'},
    {name: 'Bob', profilePic: 'bob.jpg'},
    {name: 'Charlie', profilePic: 'charlie.jpg'},   
    {name: 'Diana', profilePic: 'diana.jpg'},
    {name: 'Eve', profilePic: 'eve.jpg'},
    {name: 'Frank', profilePic: 'frank.jpg'},
    {name: 'Grace', profilePic: 'grace.jpg'},
    {name: 'Hridoy', profilePic: 'hridoy.jpg'},
    {name: 'Ivy', profilePic: 'ivy.jpg'}
]


  return (
    <div className='Home'>
        
        <div className='one'>
            <div className='logo'>FeedBack</div>
            <div className='profile-section'>
                <div className='profile'></div>
                <div className='name'>Hridoy</div>
            </div>
            <div className='Menu'>
                <div className='menu-btn'>Menu</div>
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
                        <div className='active-profile'></div>
                        <div className='active-name'>Alice</div>
                    </div>
                    
                </div>
            </div>
        </div>

        <div className='three'>

        </div>
    </div>
  )
}
