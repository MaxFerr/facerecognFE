import React from 'react';

class Signin extends React.Component {
	constructor(props){
		super(props);
		this.state={
			signinEmail:'',
			signinPassword:''

		}
	}
onEmailChange =(event)=>{
	this.setState({signinEmail:event.target.value})
}
onPasswordChange =(event)=>{
	this.setState({signinPassword:event.target.value})
}
onSubmitSignin=()=>{
	//sending user's data to the BE
	fetch('https://murmuring-escarpment-97453.herokuapp.com/signin',{
		method:'post',
		headers:{'Content-Type':'application/json'},
		body:JSON.stringify({
			email:this.state.signinEmail,
			password:this.state.signinPassword
		})
	})
	.then(response=>{
		return response.json()
	})
	.then(user=>{
		if(user.id){
			//if we get an id we change the route and change the user state
			this.props.loadUser(user);
			this.props.onRouteChange('home');
		}
	})
	
}

		render(){
			return (
	<div >
		<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-50-l mw6 center shadow-5">
			<main className="pa4 black-80 br3  mt3">
			  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f2 pa1 fw6 ph0 mh0">Sign In</legend>
				    <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        type="email" name="email-address"  
				        id="email-address"
				        onChange={this.onEmailChange}
				        />
				    </div>
				      <div className="mv3">
				        	<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        	<input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange={this.onPasswordChange}
				        	/>
				    </div>
				      	</fieldset>
				    <div className="">
				      <input 
				      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      type="submit" 
				      value="Sign in" 
				      onClick={this.onSubmitSignin}	
				      />
				    </div>
					   <div className="lh-copy mt3">
					     <p className="f6 underline link dim black db pointer" onClick={()=>this.props.onRouteChange('register')}>Register</p>
					      
				  </div>
			  </div>
			</main>
		</article>
	</div>
			
		);
	}
}

	
export default Signin;