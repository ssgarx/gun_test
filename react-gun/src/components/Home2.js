import React, { useState , useRef} from "react";
import { useEffect } from "react";
import Leaderboard from "../Leaderboard";
import TestMessage from "../TestMessage";
require('gun/lib/open')


function Home2({ g, u, k }) {
    const [selected,setSelected] = useState(false)
    const [userTeams,setUserTeams] = useState([])
    const [allTeams,setAllTeams] = useState([])

    useEffect(async ()=>{
        if(u.is){
            let user_team_set = new Set()
            u.get('teams').map().once((team,team_id)=>{
                setUserTeams((prev)=>[...prev,team])
            })

            // u.get('teams').map().on((team,team_id)=>{
            //     console.log(team)
            // })
        }
            // console.log("first")
        let application = g.get('application')
        application.get('user_teams').map().on((team,team_id)=>{
            setAllTeams((prev)=>{
                if(prev && prev.find((i)=>i.id == team.id)){
                    return [...prev]
                }
                return [...prev,team]
            })
        })

        // application.get('user_teams').map().on((team,team_id)=>{
        //     console.log(team)
        // })

        // let player_temp_set = new Set()
        // application.get('user_teams').map().get('players').map().on((player,player_id)=>{
        //     if(! player_temp_set.has(player_id)){
        //         console.log(player)
        //     }
        //     player_temp_set.add(player_id)
        // })

        return ()=>{
            g.get('application').get('user_teams').map().off()
        }
    },[])

    const handleClick = ()=>{
        u.get('teams').map().get('players').map().once((player,player_id)=>{
            let random_points = Math.floor(Math.random() * 10)
            g.get(player_id).put({points:random_points},(ack)=>{
                console.log(player)
            })
        })

        u.get('teams').map().once((team,team_id)=>{
            let random_points = Math.floor(Math.random() * 100)
            g.get(team_id).put({points:random_points})
        })
    }
  return (
    <>
      <button onClick={handleClick}>Update player points</button>
      <hr
        style={{
          width: "50%",
        }}
      />

      <h3>All team</h3>    
      {
          allTeams.length && allTeams?.map((item,id)=>{
              return (
                  <>
                    <div key={id}>{item?.name} - {item?.points}</div>
                  </>
              )
          })
      }

    <h3>Your team</h3>    
      {
          userTeams.length && userTeams?.map((item,id)=>{
              return (
                  <>
                    <div key={id}>{item?.name} - {item?.points}</div>
                  </>
              )
          })
      }
      
    <TestMessage g={g} u={u} k={k} setSelected={setSelected} />
      
    </>
  );
}

export default Home2;