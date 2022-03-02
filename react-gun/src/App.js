import "./App.css";
import Gun, { SEA } from "gun";
import "gun/sea";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import TestMessage from "./TestMessage";

const gun = Gun({
  peers: ["http:localhost:1000/gun"], // Put the relay node that you want here
});

const keyPairsForEncryptionAndDecryption = 'secretKey' 

const user = gun.user()

function App() {
  const [txt, setTxt] = useState();
  const [totalTeams, setTotalTeams] = useState([]);

  useEffect(() => {
    if(user.is){
      alert('you are already logged in')
    }else{
      console.log("Not logged in")
    }
    gun.get('application').get('test').map().once(async (data)=>{
      const teamName = await SEA.decrypt(data?.message,keyPairsForEncryptionAndDecryption)
      setTotalTeams((prev)=>[...prev,teamName])
    })
    // gun.get("text").once((node) => {
    //   // Retrieve the text value on startup
    //   // console.log(node);
    //   if (node === undefined) {
    //     gun.get("text").put({ text: "Write the text here" });
    //   } else {
    //     // console.log("Found Node");
    //     setTxt(node.text);
    //   }
    // });

    // gun.get("text").on((node) => {
    //   // Is called whenever text is updated
    //   console.log("Receiving Update");
    //   console.log(node);
    //   setTxt(node.text);
    // });
  }, []);

  // const updateText = (event) => {
  //   console.log("Updating Text");
  //   console.log(event.target.value);
  //   gun.get("text").put({ text: event.target.value }); // Edit the value in our db
  //   setTxt(event.target.value);
  // };

  return (
    <div className="App">
      {/* <h1>Collaborative Document With GunJS</h1>
      <textarea value={txt} onChange={updateText} /> */}

      <Login g={gun} u={user} k={keyPairsForEncryptionAndDecryption} />
      <Register g={gun} u={user} k={keyPairsForEncryptionAndDecryption} />
      <TestMessage g={gun} u={user} k={keyPairsForEncryptionAndDecryption} />

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
  );
}

export default App;
