import React, { useState , useRef} from "react";
import { useEffect } from "react";
import Leaderboard from "../Leaderboard";
import TestMessage from "../TestMessage";
require('gun/lib/open')

function Home2({ g, u, k }) {
    const [selected,setSelected] = useState(false)
    const [userTeams,setUserTeams] = useState([])

    useEffect(()=>{
        if(u.is){
            console.log("first")
            u.get('teams').map().once((team,team_id)=>{
                console.log(team)
            })
        }
    })

    const handleClick = ()=>{
        console.log("first")
    }
  return (
    <>
      <button onClick={handleClick}>Fetch ball data</button>
      <hr
        style={{
          width: "50%",
        }}
      />
      
    <TestMessage g={g} u={u} k={k} setSelected={setSelected} />
      
    </>
  );
}

export default Home2;