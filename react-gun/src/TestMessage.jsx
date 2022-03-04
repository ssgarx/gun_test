import React, { useState } from "react";

const static_teams = [
  {
    id: "t1",
    name: "team1",
  },
  {
    id: "t2",
    name: "team2",
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
];

function TestMessage({
  g,
  u,
  k,
  setSelected,
  setLeaderboardTeams,
  getLeaderboard,
}) {
  const handleSubmit = async (team_index) => {
    if (u.is === undefined) {
      alert("Please login");
    }

    u.once((a) => {
      const msg = u
        .get("teams")
        .set({ ...static_teams[team_index], points: 0, user_name: a?.alias });
      if (team_index == 0) {
        msg.get("players").set(players[0]);
        msg.get("players").set(players[1]);
      } else {
        msg.get("players").set(players[2]);
        msg.get("players").set(players[3]);
      }
      g.get("application").get("user_teams").set(msg);
      setSelected(true);
      g.get("application").get("leaderboard").set({
        user: a?.alias,
        team: static_teams[team_index].id,
        points: 0,
        validations: 0,
      });
      g.get("application").get("user_teams").map().once(console.log);
    });
    setLeaderboardTeams([]);
    getLeaderboard();
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h3>Register Team name</h3>

      <button onClick={() => handleSubmit(0)}>Select team 1</button>
      <button onClick={() => handleSubmit(1)}>Select team 2</button>
    </div>
  );
}

export default TestMessage;
