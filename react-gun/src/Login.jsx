import { SEA } from 'gun'
import React, { useState } from 'react'

function Login({g,u,k}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [teams, setTeams] = useState([])

    const handleClick = ()=>{
        u.auth(userName,password,(ack)=>{
            if(ack.err){
                return alert(ack.err)
            }
            alert('logged in success')
            u.get('messages').map().once(async (n)=>{
                const teamName = await SEA.decrypt(n?.message,k)
                setTeams((prev)=>[...prev,teamName])
            })
        })
    }

    return (
        <div>
            {
                teams.length > 0
                ? 
                    <h3>Your teams</h3>
                :
                    null
            }
            <div>
                {
                    teams?.map((item,id)=>{
                        return <p key={id}>{item}</p>
                    })
                }
            </div>
            <h1>
                Login
            </h1>
            <input type="text"  placeholder="Username" value={userName} onChange={(e)=>setUserName(e.target.value)} /><br/>
            <input type="password" placeholder="Password"  value={password} onChange={(e)=>setPassword(e.target.value)} /><br/>
            <button onClick={handleClick}>Login</button>
        </div>
    )
}

export default Login