import Gun from "gun";
import "gun/sea";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home2 from "./components/Home2";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";
import BallByBallData from "./components/BallByBallData";
import 'gun/lib/radix'
import 'gun/lib/open'
import 'gun/lib/radisk'
import 'gun/lib/store'
import {RindexedDB} from 'gun/lib/rindexed' //needed
import { useEffect, useState } from "react";


//leaderboard --> smart contract --> all teams

let opt = {}
opt.store = RindexedDB
opt.localStorage = false;
opt.peers = ["http://test-appsasdas.herokuapp.com/gun"];

const gun = Gun(opt);

let server_pub_key = 'utLjiHOSog4U4F9G-psxoK8Ig96Z-6VbhkZorzUDwO0.OOcqNihSIyC86qOcTNpNfY7bPqXBs92Pfm-Jl5CLO3s'
//secret key used as salt for encryption
const salt = "secretKey";
const user = gun.user().recall({ sessionStorage: true });

function timeDifference(date1,date2) {
    var difference = date1 - date2;

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

    let outputString = ''

    if(daysDifference > 0){
      outputString += daysDifference + 'd ' + hoursDifference + 'h ' + minutesDifference + 'm ' + secondsDifference + 's'
    }else if (hoursDifference > 0){
      outputString += hoursDifference + 'h ' + minutesDifference + 'm ' + secondsDifference + 's'
    }else if (minutesDifference > 0){
      outputString += minutesDifference + 'm ' + secondsDifference + 's'
    }else if(secondsDifference > 0){
      outputString += secondsDifference + 's'
    }

    return outputString
}


function App() {
  const [tournaments,setTournaments] = useState([])
  const [matches,setMatches] = useState([])
  const [contests,setContests] = useState([])
  const [teams,setTeams] = useState([])
  const [score,setScore] = useState({})
  const [wicketKeepers,setWicketKeepers] = useState([])
  const [allRounders,setAllRounders] = useState([])
  const [batsmen,setBatsmen] = useState([])
  const [bowlers,setBowlers] = useState([])
  const [playingPlayers,setPlayingPlayers] = useState([])

  const [tournamentKey, setTournamentKey] = useState('eng_vs_wi_tour_of_eng_3')
  const [matchKey, setMatchKey] = useState('eng_vs_wi_5')

  useEffect(()=>{
    //get all tournaments
    gun.user(server_pub_key).get('tournaments').map().once((d)=>{
      setTournaments((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    //get all matches of a tournmnet
    console.log(tournamentKey,matchKey)
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').map().once((d)=>{
      console.log(timeDifference(new Date().getTime(),1647193729))
      setMatches((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    //get all contests of a match of a tournmnet
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('contests').map().once((d)=>{
      setContests((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    //get all meta data of one match 
    //get playing teams
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('playing_teams').map().once((d)=>{
      setTeams((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    //get match score
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('score').on((d)=>{
      setScore(d)
    })

    //get all players(playing or not) of a match of a tournamnet
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('total_players').get('wicket_keepers').map().once((d)=>{
      setWicketKeepers((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('total_players').get('all_rounders').map().once((d)=>{
      setAllRounders((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('total_players').get('batsmen').map().once((d)=>{
      setBatsmen((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('total_players').get('bowlers').map().once((d)=>{
      setBowlers((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })

    //set playing players
    gun.user(server_pub_key).get('tournaments').get(tournamentKey).get('matches').get(matchKey).get('playing_players').map().on((d)=>{
      setPlayingPlayers((prev)=>{
        if(d.key === undefined || prev.find((item)=>item.key == d.key)){
          return [...prev]
        }
        return [...prev,d]
      })
    })
    
    // gun.user(server_pub_key).get('tournaments').get('eng_vs_wi_tour_of_eng_2').get('matches').get('eng_vs_wi_4').get('playing_players').map()
    // .on((player)=>{
    //   console.log(player)
    //   setPlayers((prev)=>{
    //     if(prev.find(item=>item.key == player.key)){
    //       return [...prev]
    //     }else{
    //       return [...prev,player]
    //     }
    //   })
    // })

  },[]) 
  
  // const handleCLick = ()=>{
  //   gun.get("application").get("user_teams2").set({team:999,name:'team'+999},(ack)=>console.log(ack.ok));
  // }

  return(
    <>
      <h1>Tournaments</h1>
      {
        tournaments.map((t,i)=>{
          return <p key={i}><strong>{t.key}</strong> - {t.name}</p>
        })
      }
      <h1>Matches</h1>
      {
        matches.map((m,i)=>{
          return <p key={i}><strong>{m.key}</strong> - {m.name}</p>
        })
      }
      <h1>Contests</h1>
      {
        contests.map((c,i)=>{
          return <p key={i}><strong>{c.key}</strong> - {c.max_teams}</p>
        })
      }

      <h1>Teams playing actual match</h1>
      {
        teams.map((t,i)=>{
          return <p key={i}><strong>{t.key}</strong> - {t.long_name}</p>
        })
      }

      <h1>Score</h1>
      {
        score && (<>
          <p><strong>{score.a_key}</strong> - {score.a_score}</p>
          <p><strong>{score.b_key}</strong> - {score.b_score}</p>
        </>)
      }

      <h1>All Players</h1>

      <h3>Wicket Keepers</h3>
      {
        wicketKeepers.map((wk,i)=>{
          return <p key={i}><strong>{wk.key}</strong> - {wk.name}</p>
        })
      }
      <h3>All Rounders</h3>
      {
        allRounders.map((ar,i)=>{
          return <p key={i}><strong>{ar.key}</strong> - {ar.name}</p>
        })
      }
      <h3>Batsmen</h3>
      {
        batsmen.map((ba,i)=>{
          return <p key={i}><strong>{ba.key}</strong> - {ba.name}</p>
        })
      }
      <h3>Bowlers</h3>
      {
        bowlers.map((bo,i)=>{
          return <p key={i}><strong>{bo.key}</strong> - {bo.name}</p>
        })
      }

      <h3>Playing Players</h3>
      {
        playingPlayers.map((p,i)=>{
          return <p key={i}><strong>{p.name}</strong> - {p.points}</p>
        })
      }
    </>
  )
}

export default App;
