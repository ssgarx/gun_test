import React, { useState } from "react";
import { useEffect } from "react";

const static_teams = [
  {
    id: "t1",
    name: "team1",
  },
  {
    id: "t2",
    name: "team2",
  },
  {
    id: "t3",
    name: "team3",
  },
];

const players = [
  {
    id: "p1",
    name: "player1",
    role: "bat",
    points: 0,
    captain: true,
  },
  {
    id: "p2",
    name: "player2",
    role: "bowl",
    points: 0,
  },
  {
    id: "p3",
    name: "player3",
    role: "bat",
    points: 0,
    captain: true,
  },
  {
    id: "p4",
    name: "player4",
    role: "bowl",
    points: 0,
  },
  {
    id: "p5",
    name: "player5",
    role: "bat",
    points: 0,
    captain: true,
  },
  {
    id: "p6",
    name: "player6",
    role: "bowl",
    points: 0,
  },
  {
    id: "p7",
    name: "player7",
    role: "bat",
    points: 0,
    captain: true,
  },
  {
    id: "p8",
    name: "player8",
    role: "bowl",
    points: 0,
  },
];

function TestMessage({
  g,
  u,
  k,
  setSelected,
  setLeaderboardTeams,
  getLeaderboard,
}) {

  useEffect(()=>{
    if(u.is){
        u.get('teams').map().once((t,tid)=>{
          // console.log(t.players)
          g.get(tid).get('players').once((p,pid)=>{
            // console.log(p)
          })
        })
      }
    // console.log(u.is)
  },[])

  const handleSubmit = async (team_index) => {
    if (u.is === undefined) {
      alert("Please login");
    }else{
      setSelected(true)
    }

    const msg = u
      .get("teams")
      .set({ ...static_teams[team_index], points: 0 },(ack)=>{
        if(ack.ok === undefined){
          console.log('error creating team')
          return
        }else{
          if (team_index == 0) {
            msg.get("players").set(players[0]);
            msg.get("players").set(players[1]);
          } else if(team_index == 1) {
            msg.get("players").set(players[2]);
            msg.get("players").set(players[3]);
          }else{
            msg.get("players").set(players[4]);
            msg.get("players").set(players[5]);
            msg.get("players").set(players[6]);
            msg.get("players").set(players[7]);
          }
        }
        g.get("application").get("user_teams").set(msg);
        setSelected(true);

        g.get("application").get("leaderboard").set({
          team: static_teams[team_index].id,
          points: 0,
          validations: 0,
        });
      });
    // setLeaderboardTeams([]);
    // getLeaderboard();
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h3>Register Team</h3>

      <button onClick={() => handleSubmit(0)}>Select team 1</button>
      <button onClick={() => handleSubmit(1)}>Select team 2</button>
      <button onClick={() => handleSubmit(2)}>Select team 3</button>
    </div>
  );
}

export default TestMessage;
