import { SEA } from 'gun'
import React, { useState } from 'react'
import { useEffect } from 'react'

function Login({g,u,k,user_teams}) {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [teams, setTeams] = useState([])
    
    useEffect(()=>{
        setTeams(user_teams)
    },[user_teams])

    const handleClick = ()=>{
        u.auth(userName,password,(ack)=>{
            if(ack.err){
                return alert(ack.err)
            }
            alert('logged in success')
            //subscribing to messaged document on user space
            u.get('teams').map().once(async (n)=>{
                // const teamName = await SEA.decrypt(n?.team,k)
                setTeams((prev)=>[...prev,n?.team])
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
                        return (
                            <div >
                                <h4>{item?.name} - {item?.points}</h4>
                                {
                                    item?.players.map((i,idx)=>{
                                        console.log(idx)
                                        return <span>{i?.id} - {i?.points} </span>
                                    })
                                }
                            </div>

                        )
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