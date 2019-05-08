import React, { Component } from 'react';
import './App.css';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Signin from '../components/Signin/Signin'
import Register from '../components/register/Register'



const particlesOptions={
 particles: {
    number: {
      value: 35,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: "img/github.svg",
        width: 100,
       height: 100
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 300,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: false,
     straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      
     resize: true
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 1
        }
      },
     bubble: {
        distance: 200,
        size: 35,
        duration: 2,
        opacity: 0.8,
        speed: 1
      },
      repulse: {
        distance: 100,
        duration: 0.2
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
}

const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state= initialState ;
  }

  loadUser=(data)=>{
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
      }})
  }

  claculateFaceLoacation=(data)=>{
    //using clarifai data to make a box around a face
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box; 
    const image= document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox=(box)=>{    
    this.setState({box:box});
  }


  onInputChange=(event)=>{
    this.setState({input:event.target.value})
  }

  onButtonSubmit=()=>{
    //sending the picture link to the BE to use clarifai api
    this.setState({imgUrl:this.state.input});
    fetch('https://murmuring-escarpment-97453.herokuapp.com/handleApiCall',{
          method:'post',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
          input: this.state.input
        })
      })
    .then(response=>response.json())
    .then(response=> {
    //if we get data from clarifai api we update the image count      
      if (response){
        fetch('https://murmuring-escarpment-97453.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(response=>response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
           
    }
    //using clarifai data to create a box around a face
      this.displayFaceBox(this.claculateFaceLoacation(response))
   })
     .catch(err=>console.log(err));
             
  }

  onRouteChange=(route)=>{
    if(route==='signin'){
      this.setState(initialState);
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
      this.setState({route:route});
    }

  render() {
    return (
      <div className="App">
      <Particles className='particles' params={particlesOptions} /> 
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>

      {this.state.route==='home'
      ?
      <div>
          <Logo/>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />      
          <FaceRecognition box={this.state.box} imgUrl={this.state.imgUrl}/>
      </div>
     :(
        this.state.route==='signin'
        ? <Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

      )
       }
     
      </div>
    );
  }
}

export default App;
