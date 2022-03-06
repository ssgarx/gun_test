import React, { useState , useRef} from "react";
import { useEffect } from "react";
import Leaderboard from "../Leaderboard";
import TestMessage from "../TestMessage";
import BallByBallData from "./BallByBallData";
require('gun/lib/open')

function Home({ g, u, k }) {
  const [userTeams, setUserTeams] = useState([]);
  const [selected, setSelected] = useState(false);
  const [totalTeams, setTotalTeams] = useState([]);
  const [leaderboardTeams, setLeaderboardTeams] = useState([]);

  useEffect(() => {
    //subscribe for leaderboard update  
    g.get('application').get('leaderboard').map().on((l,lid)=>{
      setLeaderboardTeams((prev)=>{
        // return [...new Set([...prev,l])]
        if(prev.find((i)=>i.team == l.team)){
          return [...prev]
        }
        return [...prev,l]
      })
    })

    //subscribe for user team update along with their players update
    const getTeams = async () => {
      let temp = [];
      u
        .get("teams")
        .map()
        .on(async (n, id) => {
          //console.log(n)
          if(n){
            setSelected(true)
          }
          setUserTeams([])
            let temp_ids = new Set()
            u
              .get('teams')
              .get(id)
              .get("players")
              .map()
              .on((player, id) => {
                //console.log(player)
                if(!temp_ids.has(id)){
                  temp_ids.add(id)
                  temp.push({
                    id: id,
                    name: player.name,
                    points: player.points,
                  });
                }
              });
            setUserTeams((prev)=>[...prev,{players:Array.from(temp),name:n?.name,points:n?.points}]);
            temp = [];
        });
    }
    getTeams();
    
    //subscribe for new team added and set the totalTeams in UI
    g
      .get("application")
      .get("user_teams") //all teams are registered in this document
      .map()
      .on((data, sole) => {
        setTotalTeams((prev)=>{
        // return [...new Set([...prev,l])]
        if(prev.find((i)=>i.id == data.id)){
          return [...prev]
        }
        return [...prev,data]
      })
      });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const handleClick = async () => {
    let temp = []
    const m = g.get('test').set(totalTeams.length)

    //increase plaer points by 5 and 10 if he is a captain
    u.get("teams")
      .map()
      .once((t, tid) => {
        let actual_team_points = t.points;
        g.get(tid)
          .get("players")
          .map()
          .once((p, pid) => {
            let updated_team_points = 0;
            if (p.id === "p1" || p.id === "p2" || p.id === "p3" || p.id === "p4") {
              let mul = 1;
              if (p.captain) {
                mul = 2;
              }
              let actual_points = parseInt(p.points);
              //update player points
              let updated_points = actual_points + 5 * mul;
              g.get(pid).put({ points: updated_points });
              //update team points
              updated_team_points = actual_team_points + 5 * mul;
              g.get(tid).put({ points: updated_team_points });
              actual_team_points = updated_team_points;
              //update leaderboard points
              g.get("application")
                .get("leaderboard")
                .map()
                .once((l, lid) => {
                  if (l.team === t?.id) {
                    g.get(lid).put({ points: updated_team_points })
                  }
                });
            }
          });
      });
  };
  return (
    <>
      <BallByBallData g={g} u={u} k={k} />

      {/* <button onClick={handleClick}>Fetch ball data</button> */}
      <hr
        style={{
          width: "50%",
        }}
      />
      {!selected ? (
        <TestMessage g={g} u={u} k={k} setSelected={setSelected} />
      ) : null} 
      <div>
        {totalTeams?.map((item, id) => {
          return <p key={id}>{item?.name} - {item?.points}</p>;
        })}
      </div>
      <hr
        style={{
          width: "50%",
        }}
      />
      {userTeams?.length && <h3>Your teams: {userTeams?.length}</h3>}
      <div>
        {userTeams?.map((item, id) => {
          return (
            <div key={id}>
              <p>
                {item.name} - {item.points} points
              </p>
              {item?.players.map((i,idx)=>{
                return (
                  <span key={idx}>{i?.name} - {i?.points} </span>
                )
              })}
            </div>
          );
        })}
      </div>
      <hr
        style={{
          width: "50%",
        }}
      />
      <Leaderboard
        g={g}
        u={u}
        k={k}
        teams={leaderboardTeams}
        setLeaderboardTeams={setLeaderboardTeams}
      /> 
    </>
  );
}

export default Home;
