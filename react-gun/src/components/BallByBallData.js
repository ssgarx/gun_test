import { SEA } from 'gun'
import React, { useState } from 'react'
import { useEffect } from 'react'

let balls_data = [
    {
        "runs":1,
        "is_six" : false,
        "is_four" : false,
        "is_wicket" : false,
        "ball":"0-1",
    },
    {
        "runs":6,
        "is_six" : true,
        "is_four" : false,
        "is_wicket" : false,
        "ball":"0-2",
    },
    {
        "runs":2,
        "is_six" : false,
        "is_four" : false,
        "is_wicket" : false,
        "ball":"0-3",
    },
    {
        "runs":0,
        "is_six" : false,
        "is_four" : false,
        "is_wicket" : true,
        "ball":"0-4",
    },
    {
        "runs":4,
        "is_six" : false,
        "is_four" : true,
        "is_wicket" : false,
        "ball":"0-5",
    },
    {
        "runs":6,
        "is_six" : true,
        "is_four" : false,
        "is_wicket" : false,
        "ball":"0-6",
    }
]

function BallByBallData({g,u,k}) {
    const [match,setMatch] = useState(3)
    const [balls,setBalls] = useState([])

    //subscribe for ball by ball data
    useEffect(()=>{
        g.get('#match' + match).map().on((data)=>{
            const d = JSON.parse(data)
            setBalls((prev)=>{
                if(prev.find((i)=>i.ball == d.ball)){
                    return [...prev]
                }
                return [...prev,d]
            })
        })

    },[])

    //put ball by ball data in frozen space
    const clickHandler = async (index)=>{
        const data = (JSON.stringify(balls_data[index]))
        var hash = await SEA.work(balls_data[index], null, null, {name: "SHA-256"});
        g.get('#match' + match).get(hash).put(data)

        switch(index){
            default:
            console.log("first")
                //increase team points by 5 points and 10 if he is a captain
                let sum = 0
                u.get('teams').map().get('players').map().once((p,pid)=>{
                    console.log(p)
                    let mul = 1
                    if(p.captain){
                        mul = 2
                    }
                    sum+=mul*5
                    let actual_points = p.points
                    let updated_points = actual_points + mul*5
                    g.get(pid).get('points').put(updated_points,(ack)=>{
                        if(ack.ok){
                            u.get('teams').map().once((t,tid)=>{
                                let actual_team_points = t.points
                                let updated_team_points = actual_team_points + sum;
                                g.get(tid).get('points').put(updated_team_points,(ack)=>{
                                    if(ack.ok){
                                        g.get('application').get('leaderboard').map().once((l,lid)=>{
                                            if(l.team == t.id){
                                                g.get(lid).put({ points: updated_team_points })
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    })
                })

                break
        }
    }

    return (
        <div>
            <button onClick={()=>clickHandler(0)}>BALL 1</button>
            <button onClick={()=>clickHandler(1)}>BALL 2</button>
            <button onClick={()=>clickHandler(2)}>BALL 3</button>
            <button onClick={()=>clickHandler(3)}>BALL 4</button>
            <button onClick={()=>clickHandler(4)}>BALL 5</button>
            <button onClick={()=>clickHandler(5)}>BALL 6</button>

            <div>
                {
                    balls?.map((item,index)=>{
                        return (
                            <div key={index}>
                                    BALL : {item?.ball} &emsp;
                                    RUNS : {item?.runs} &emsp;
                                    Six : {item?.is_six ? 'yes' : 'no'} &emsp;
                                    Four : {item?.is_four ? 'yes' : 'no'} &emsp;
                                    WICKET : {item?.is_wicket ? 'yes' : 'no'} &emsp;   
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BallByBallData