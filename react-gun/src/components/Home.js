import React, { useState } from "react";
import { useEffect } from "react";
import Leaderboard from "../Leaderboard";
import TestMessage from "../TestMessage";

function Home({ g, u, k }) {
  const [userTeams, setUserTeams] = useState([]);
  const [selected, setSelected] = useState(false);
  const [totalTeams, setTotalTeams] = useState([]);
  const [leaderboardTeams, setLeaderboardTeams] = useState([]);

  const getLeaderboard = async () => {
    g.get("application")
      .get("leaderboard")
      .map()
      .once(
        (l, lid) => {
          setLeaderboardTeams((prev) => [...prev, l]);
        },
        { wait: 0 }
      );
  };

  useEffect(() => {
    const getTeams = async () => {
      let temp = [];

      await u
        .get("teams")
        .map()
        .once(async (n, id) => {
          await u
            .get("teams")
            .get(id)
            .get("players")
            .map()
            .once((players, id) => {
              temp.push({
                id: id,
                name: players.name,
                points: players.points,
              });
            });

          //remove duplicates
          const unique = [...new Set(temp)];
          setUserTeams(unique);
          temp = [];
        });
      //subscribing to application document in gun db
      await g
        .get("application")
        .get("user_teams") //all teams are registered in this document
        .map()
        .once(async (data, sole) => {
          const unique = [...new Set([...totalTeams, data?.name])];
          setTotalTeams(unique);
        });

      await g
        .get("application")
        .get("user_teams")
        .map()
        .once((_, i) => {
          g.get(i)
            .get("players") //all players are registered in this document
            .map()
            .on((p, pi) => {
              // gun.get(pi).put({points:0})
            });
        });

      setLeaderboardTeams([]);
      getLeaderboard();
    };
    getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    //increase p1 and p3 points by 5 points
    u.get("teams")
      .map()
      .once((t, tid) => {
        let actual_team_points = t.points;
        g.get(tid)
          .get("players")
          .map()
          .once((p, pid) => {
            console.log("team points before update : ", actual_team_points);
            let updated_team_points = 0;
            if (p.id === "p1" || p.id === "p2") {
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
              console.log("team points after update : ", updated_team_points);
              actual_team_points = updated_team_points;
              //update leaderboard points
              g.get("application")
                .get("leaderboard")
                .map()
                .once((l, lid) => {
                  if (l.team === t?.id) {
                    g.get(lid).put({ points: updated_team_points });
                  }
                });
            }
          });
      });
    setLeaderboardTeams([]);
    getLeaderboard();
  };
  return (
    <>
      <button onClick={handleClick}>Fetch ball data</button>
      <hr
        style={{
          width: "50%",
        }}
      />
      {!selected ? (
        <TestMessage g={g} u={u} k={k} setSelected={setSelected} />
      ) : null}
      <hr
        style={{
          width: "50%",
        }}
      />
      {totalTeams.length && <h3>Total Teams:{totalTeams.length} </h3>}
      <div>
        {totalTeams?.map((item, id) => {
          return <p key={id}>{item}</p>;
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
        getLeaderboard={getLeaderboard}
      />
    </>
  );
}

export default Home;
