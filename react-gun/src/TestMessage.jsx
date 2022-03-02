import { SEA } from 'gun'
import React , { useState } from 'react'

function TestMessage({g,u,k}) {
    const [txt,setTxt] = useState('')

    const handleSubmit = async ()=>{
        if(u.is === undefined){
            alert("Please login")
        }
        const encryptedText = await SEA.encrypt(txt,k)

        const msg = u.get("messages").set({message:encryptedText})
        g.get('application').get('test').set(msg)
    }
    
    return (
        <div>
            <h1>Register Team name</h1>

            <input type="text" value={txt} onChange={(e)=>setTxt(e.target.value)} placeholder="team name" />
            <button onClick={handleSubmit}>Send</button> 
        </div>
    )
}

export default TestMessage