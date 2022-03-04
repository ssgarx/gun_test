import React from 'react'

function Leaderboard({g,u,k,teams}) {
    console.log(teams)
    return (
        <div>
            <h4>Leaderboard</h4>
            <table border="1">
                <thead>
                    <th>User name</th>
                    <th>Team id</th>
                    <th>points</th>
                    <th>validations</th>
                </thead>
                {
                    teams?.sort((a,b)=>b.points-a.points).map((t,tid)=>{
                        return (
                            <tr key={tid}>
                                <td>{t?.user}</td>
                                <td>{t?.team}</td>
                                <td>{t?.points}</td>
                                <td>{t?.validations}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Leaderboard