import './App.css';
import  'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect} from 'react';


const CLIENT_ID ="4c2ef29efafa450786a384f696bbd637" 
const CLIENT_SECRET ="775f33f8f70e4e4a983dadc29fa6af0d"


function App(){
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])
  /* A wy to make the function run only once once you start the react application good for setting up an API call*/
  useEffect(()=>{
    /*API Access Token where in order to get this access token you have to make a specific request to the api
    to get a token for a certain client to use 
    this is the initial url that we need to intereact with to get a access token
     why do we need API ?? to make search to make API call
     the authParameter we will pass it to fetch to tell it what exactly we want it to do*/
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'//this is what spotify access us to pass in order get out access to our token
      },
      body: 'grant_type=client_credentials&client_id='+ CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token',authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token)) 
  },[])
  
  /*
  Search
  this function needs to be async because inside this statement we are going to have a lot of fetch statement 
  and at each fetch statement we kind want wait its turn 
  */
  async function search(){
    console.log('Search for ' + searchInput)
    // in spotify they always emphasize about artist id 
    //?get request using search to get the artist id
    //* it is outlined in spotify documentation that u need to use get method 
    var searchParameter = {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization' :'Bearer ' + accessToken
      }
    }
    //* so if we want to add variable to my request,(the link in fetch we start with a question mark meaning starting with the URL variable  )
    //the q stands for query which is our search for a certain artist
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput +'&type=artist', searchParameter)
    // here we are going to get a block of data from our fetch , to see we will console log and with each fetch there is a .then
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id})

    console.log('artist id is' + artistID);
    // and now we will do another get request with the artist id to grab all the albums
    
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameter)
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      setAlbums(data.items);
    })

    var returnedSongs = await fetch('https://api.spotify.com/v1/artists/' + artistID )
  }

  console.log(albums)
  return (
    <div className="App">
      <Container>
        <InputGroup
          className="mb-3"
          size="lg"
        >
          <FormControl
            placeholder = "Search For Artists"
            type = "input"
            onKeyPress = {e =>{
              if (e.key == "Enter"){
                search();
              }
            }}
            onChange = { e => setSearchInput(e.target.value)}
          />
          <Button onClick={ search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
      <Row className = "mx-2 row row-cols-4">
        {albums.map((album, i ) => {
        console.log(albums)
        return(
          <Card>
          <Card.Img src={album.images[0].url}/>
          <Card.Body>
            <Card.Title>{album.name}</Card.Title>
          </Card.Body>
        </Card>
        )
        })}
      </Row>
      </Container>
  </div>
  );
  }
  

export default App;
