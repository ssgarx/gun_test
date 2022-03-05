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
    const [match,setMatch] = useState(1)
    const [balls,setBalls] = useState([])

    //subscribe for ball by ball data
    useEffect(()=>{
        g.get('#match' + match).map().once((data)=>{
            const d = JSON.parse(data)
            setBalls((prev)=>[...prev,d])
        })

    },[])

    //put ball by ball data in frozen space
    const clickHandler = async (index)=>{
        const data = (JSON.stringify(balls_data[index]))
        var hash = await SEA.work(balls_data[index], null, null, {name: "SHA-256"});
        g.get('#match' + match).get(hash).put(data)
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