import React, { useState } from 'react'

function Login({g,u,k}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const handleClick = ()=>{
        u.create(userName,password,(ack)=>{
            if(ack.err){
                return alert(ack.err)
            }
            alert("user created")
        })
    }

    return (
        <div>
            <h1>
                Register
            </h1>
            <input type="text"  placeholder="Username" value={userName} onChange={(e)=>setUserName(e.target.value)} /><br/>
            <input type="password" placeholder="Password"  value={password} onChange={(e)=>setPassword(e.target.value)} /><br/>
            <button onClick={handleClick}>Create User</button>
        </div>
    )
}

export default Login