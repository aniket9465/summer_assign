import React, { Component } from 'react';
import './App.css';
import searchYouTube from 'youtube-api-search'
import YTSearch from 'youtube-api-search';
import Videoplayer from './videoplayer'
import ReactPlayer from 'react-player';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import './adminpage.css';
import VideoList from './video_list'
import Websocket from 'react-websocket';
class App extends Component {
  constructor(props)
  {
	  super(props);
	  var myData={
                         sessionid:getCookie('sessionid')
                        };
             fetch('http://localhost:8000/stream/getusername/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Accept": "application/json",
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(response => response.json() )
                    .then(json => {  console.log(json);
			    if(json['username']=="none")
			    {
				    window.location="http://localhost:8000/stream/home/"
			    }
                                  });
 
  }
  render() {
    return ( 
      <Router>
     <div>
      <Route exact path="/adminpage" component={adminpage}/>
      <Route exact path="/becomehost" component={becomehost}/>
      <Route exact path="/onlinehosts" component={onlinehosts} />
     </div> 
     </Router>  
    );
  }
}




function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}


class adminpage extends Component 
{      
	constructor(props)
	{
		super(props);
		this.state={
			users:[],
		};
		this.getusers=this.getusers.bind(this);
		this.getusers();
	}



	getusers()
	{
             var myData={
                         sessionid:getCookie('sessionid')
                        };
	     fetch('http://localhost:8000/stream/adminpageapi/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Accept": "application/json",
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(response => response.json() )
		    .then(json => { 
			            this.setState({users:json});
		                  });
	}
        
       deleteuser(uname,e)
       {
	       e.preventDefault();
	       alert(uname);
               var myData={
                         uname:uname
                        };

              fetch('http://localhost:8000/stream/deleteuserapi/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(
	                   response => { this.getusers() ;}
			 )
	            .then( json => {} );  

       }

       approveuser(uname,e)
       {
               e.preventDefault();
               alert(uname);
               var myData={
                         uname:uname
                        };

             fetch('http://localhost:8000/stream/approveuserapi/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(response => {this.getusers();})
		    .then(json => {});  

       }


	render()
	{
		var list1=(Object.values(this.state.users)).map(
				(varia) => {
				if(varia['is_active']==false)	
				return <button onClick={(e)=>this.approveuser(varia['username'],e)}> {varia['username']}</button>;
				}
					);
	       var list2=(Object.values(this.state.users)).map(
                                (varia)=>{
                                if(varia['is_active']!=false)   
                                return <button onClick={(e)=>this.deleteuser(varia['username'],e)}> {varia['username']}</button>;
                                }
                                        );	
		return(
		<div>
		<div className="divv">Welcome to admin page</div>
		<br/>
		<div id="sdiv" className="divv">
		<div className="divv">
		<p>Approve these users</p>
		{list1}
		</div>
		<br/>
		<div className="divv">
		<p>Delete these approved users </p>
                {list2}
		</div>
		</div>
		</div>
		);
	}


}


class becomehost extends Component
{
    constructor(props)
    {
	    super(props);
	    var tthis=this;
	    this.connection="none"
	    window.onbeforeunload=function(e){tthis.componentWillUnmount();};
            window.onunload=function(e){tthis.componentWillUnmount();};
            this.state={username:"none",selectedvideo:"none",playing:true,volume:0.8,played:0};
	    var myData={
                         sessionid:getCookie('sessionid')
                        };
             fetch('http://localhost:8000/stream/getusername/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Accept": "application/json",
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(response => response.json() )
                    .then(json => { 
                                    this.setState({username:json['username']});
                                  });
   
    }
    componentDidMount()
    {
	    var a=getCookie('sessionid');
     var myData={
                         sessionid:getCookie("sessionid")
                        };
     fetch('http://localhost:8000/stream/makehost/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Accept": "application/json",
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   );
 
    }
   componentWillUnmount()
    {
	    window.location.reload();
     var myData={        
                         sessionid:getCookie('sessionid')
                        };
      fetch('http://localhost:8000/stream/removehost/',
                             {
                                   method: "post",
                                   body: JSON.stringify(myData)
                              }
                   ).then();

    }
 
    render()
    {       var strr='ws://localhost:8000/stream/videoplayer/?'+this.state.username;
	    if(this.connection=="none" && this.state.username!="none"){
		    this.connection=new WebSocket(strr);
	   this.connection.onmessage=(data)=>{ var obj=JSON.parse(data['data']);this.setState({selectedvideo:obj['videoid'],playing:obj['playing'],
		                                volume:obj['volume'],played:obj['played']});
	                                };

	    }
	    var video;
	    if(this.state.selectedvideo=="none")
                        {       
                                video="";
                        }
                        else
                        {
				 video= <div><Videoplayer choice={this.state.username} videoid={this.state.selectedvideo} url={'https://youtube.com/watch?v='+this.state.selectedvideo} playing={this.state.playing} connection={this.connection} volume={this.state.volume} played={this.state.played}  /></div> ;

			}	
	    if(this.state.username=="none")
		    return (<div></div>);
	    return (
			    <div>
			    you are a host now . if you close this window you will no longer remain a host .
			    {video}
			    </div>
			    );
    }
}

class onlinehosts extends Component
{
	connection;
        constructor(props)
        {
                super(props);
		this.connection="none";
                this.state={
                        users:[],
			choice:"none",
			selectedvideo:"none",
			playing:true,
			volume:0.8,
			played:0,
                };
                this.getusers=this.getusers.bind(this);
		this.handledata=this.handledata.bind(this);
                this.getusers();
		this.handleclick=this.handleclick.bind(this);
		this.videoselection=this.videoselection.bind(this);
        }



        getusers()
        {
             var myData={
                         sessionid:getCookie('sessionid')
                        };
             fetch('http://localhost:8000/stream/onlineusersapi/',
                             {
                                   method: "post",
                                   credentials: "same-origin",
                                   headers: {
                                                 "X-CSRFToken": getCookie("csrftoken"),
                                                 "Accept": "application/json",
                                                 "Content-Type": "application/json"
                                            },
                                   body: JSON.stringify(myData)
                              }
                   ).then(response => response.json() )
                    .then(json => {
			            if(typeof json.find(item=>item.uname==this.state.choice)=='undefined')
				    {this.setState({users:json,choice:"none"});
				    }else{
					    this.setState({users:json});}
                                  });
        }
	
	handledata(data)
	{
		this.getusers();
	}
	handleclick(uname,e)
	{
		e.preventDefault();
		this.setState({choice:uname});
	}
	videoselection(videoid)
	{
		if(this.connection!="none")
		{this.connection.send(JSON.stringify({'videoid':videoid ,'playing':true,'volume':0.8,'played':0 ,'user':this.state.choice }));
		this.setState({selectedvideo:videoid,playing:true,played:0});}
	}
	render()
	{
                var list1=(Object.values(this.state.users)).map(
                                (varia) => {
                                return <button onClick={(e)=>{this.handleclick(varia['uname'],e)}}> {varia['uname']}</button>;
                                });
		var hdiv={ display:"none" };
		if(typeof this.state.users.find(item=> item.uname==this.state.choice) == 'undefined')
		{
			return (
				
				<div>
				<div style={hdiv} >
			        <Websocket url="ws://localhost:8000/stream/onlinehosts/" 
				onMessage={(data)=> {this.handledata(data)}}/>
				</div>
				{list1}
				</div>
				);
		}else
		{
			var video;
			if(this.state.selectedvideo=="none")
			{
				video="";
			}
			else
			{
				video= <div><Videoplayer choice={this.state.choice} videoid={this.state.selectedvideo} url={'https://youtube.com/v/'+this.state.selectedvideo} connection={this.connection} playing={this.state.playing} volume={this.state.volume} played={this.state.played}  /></div> ;
			}
			if(this.connection=="none"){
			this.connection=new WebSocket('ws://localhost:8000/stream/videoplayer/?'+this.state.choice);
			this.connection.onmessage=evt=>{
				var obj=JSON.parse(evt.data);
				console.log(obj);
			this.setState({selectedvideo:obj['videoid'],playing:obj['playing'],
			                            volume:obj['volume'],played:obj['played']})
			}
			}
			return (
					<div className="divv">
					<div style={hdiv} >
                                <Websocket url="ws://localhost:8000/stream/onlinehosts/"
                                onMessage={(data)=> {this.handledata(data)}}/>
                                </div>
			       <button onClick={(e)=>{e.preventDefault();this.setState({choice:"none"})}}>back</button>	
					connected to {this.state.choice}
					<br/><Youtubesearcher videoselection={this.videoselection}/>
					{video}
					</div>
			       );
		}
	}
}


class Youtubesearcher extends Component
{
	constructor(props)
	{
		super(props);
		this.state={
			videos:[]
		};
		this.onInputChange=this.onInputChange.bind(this);
		this.onInputChange("naruto");
	}
	onInputChange(strr)
        {
               searchYouTube({key:"AIzaSyC8Ga_Sq2z0eeTZPYDHZd5ii5RQxgmXOVM",term:strr},
                                (data)=> {this.setState({videos:data})}
                                );
        }
	render()
	{
		return (
		<div>
		<SearchBar onSearchTermChange={searchTerm => this.onInputChange(searchTerm)}/> 
		<VideoList videos={this.state.videos} onVideoSelect={userSelected=>{ console.log(userSelected); this.props.videoselection(userSelected['id']['videoId']);}}/>
		</div>
		 );
	}
 
}


class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.state = { term: '' };

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {
        this.setState({ term: event.target.value });
        this.props.onSearchTermChange(event.target.value);
    }

    render(){
        return (
            <div className="search-bar">
                <input                
                    value={this.state.term}
                    onChange={this.onInputChange} 
                />               
            </div>
        );        
    }

}


export default App;
