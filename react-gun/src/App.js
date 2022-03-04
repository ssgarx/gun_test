import "./App.css";
import Gun, { SEA } from "gun";
import "gun/sea";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import TestMessage from "./TestMessage";
import Leaderboard from "./Leaderboard";

const gun = Gun({
  peers: ["http:localhost:1000/gun"], // Put the relay node that you want here
});

//secret key used as salt for encryption
const salt = 'secretKey' 

const user = gun.user().recall({sessionStorage: true})

function App() {
  const [totalTeams, setTotalTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [selected, setSelected] = useState(false);
  const [leaderboardTeams,setLeaderboardTeams] = useState([])

  useEffect(() => {
    function showUserTeam(){
        user.get('teams').map().once(async (n,id)=>{
        var p = []
        user.get('teams').get(id).get('players').map().once((a,i)=>{
          if(a){
            setSelected(true)
            p.push(a)
            console.log("after")
          }
        })
        setUserTeams((prev)=>[...prev,{name : n?.name,players : p,points : n?.points}])
      })
    }
    if(user.is){
      showUserTeam()
      alert('you are already logged in')
    }else{
      console.log("Not logged in")
    }

    //subscribing to application document in gun db
    gun.get('application').get('user_teams').map().once(async (data,sole)=>{
      console.log(data)
      setTotalTeams((prev)=>[...prev,data?.name])
    })

    gun.get('application').get('user_teams').map().once((_,i)=>{
      gun.get(i).get('players').map().on((p,pi)=>{
        // gun.get(pi).put({points:0})
        console.log(p)
      })
    })

    gun.get('application').get('leaderboard').map().once((l,lid)=>{
      console.log(l,lid)
      setLeaderboardTeams((prev)=>[...prev,l])
    },{wait:0})
  }, []);

  const handleClick = ()=>{
    //increase p1 and p3 points by 5 points
    user.get('teams').map().once((t,tid)=>{
      let actual_team_points = t.points
      gun.get(tid).get('players').map().once((p,pid)=>{
        console.log('team points before update : ',actual_team_points)
        let updated_team_points = 0
        if(p.id === 'p1' || p.id === 'p2'){
          let mul = 1
          if(p.captain){
            mul = 2
          }
          let actual_points = parseInt(p.points)
          //update player points
          let updated_points = actual_points + (5 * mul)
          gun.get(pid).put({points:updated_points})
          //update team points
          updated_team_points = actual_team_points + (5 * mul)
          gun.get(tid).put({points:updated_team_points})
          console.log('team points after update : ',updated_team_points)
          actual_team_points = updated_team_points
          //update leaderboard points
          gun.get('application').get('leaderboard').map().once((l,lid)=>{
            if(l.team === t?.id){
              gun.get(lid).put({points:updated_team_points})
            }
          })

        }
      })
    })
  }

  return (
    <div className="App" style={{display:'flex'}}>
      <div style={{flex:1}}>
        <button onClick={handleClick}>Fetch ball data</button>
        {/* g-->gun   u-->gun.user()    k-->salt key for encryption and decryption */}
        <Login g={gun} u={user} k={salt} user_teams={userTeams} />
        <Register g={gun} u={user} k={salt} />
        {
          ! selected ? <TestMessage g={gun} u={user} k={salt} setSelected={setSelected} /> : null
        }
        
        {
          totalTeams.length > 0
          ? 
            <h3>Total Teams</h3>
          :
            null
        }
        <div>
          {
            totalTeams?.map((item,id)=>{
                return <p key={id}>{item}</p>
            })
          }
        </div>
      </div>
      <div>
        <Leaderboard g={gun} u={user} k={salt} teams={leaderboardTeams} />
      </div>

    </div>
  );
}

export default App;
