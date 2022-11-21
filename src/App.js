import './App.css';
import { useEffect , useState } from 'react';
import { axios } from 'axios';



function App(){
  const CLIENT_ID = "4c2ef29efafa450786a384f696bbd637"
  const REDIRECT_URI ="http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token,setToken] = useState("") 
  const [searchKey, setSearchKey] = useState("")
  
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash=""
      window.localStorage.setItem("token",token)
      setToken(token)
    }
  },[])
  
  const logout = () =>{
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtist = (e) =>{
    
  }

  return (
    <div className="App">
      <h1> Spotify React App</h1>
      {!token ? 
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}> Login into Spotify</a>
      : <button onClick={logout}>Logout</button>
      }

      {token ? 
        <form onSubmit={searchArtist}>
          <input type="text" onChange={e=>setSearchKey(e.target.value)}/>
          <button type="submit">Search</button>
        </form>  
        : <h2>Please Log in</h2>
      }
  </div>
  );
  }
  

export default App;
