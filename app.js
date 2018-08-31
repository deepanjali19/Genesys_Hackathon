(function () {

	function login () {
    
		const redirectUri = encodeURIComponent(window.location.href);
   
		window.location = 'https://login.mypurecloud.com/oauth/authorize' +
                '?response_type=token' +
                '&client_id=6b9f791c-86ef-4f7a-af85-3f3520dd0975' +
                '&redirect_uri=' + redirectUri;
	}

	const loginButton = document.getElementById('login');

	const params = {};
  
	let authToken;

	if (window.location.hash && window.location.hash.length > 1) {
    
		const hashParams = window.location.hash.substr(1).split('&');

		hashParams.forEach(param => {
			
			const [key, value] = param.split('=');
			
			params[key] = value;
		});
	}

	if (params.access_token) {
		authToken = params.access_token;
    
		loginButton.remove();
	} else {
		
		login();
    
		loginButton.addEventListener('click', login);
    
		return;
	}

	function fetchData() {
    
		const headers = new window.Headers();
    
		headers.set('Authorization', `bearer ${authToken}`);
    
		return window.fetch('https://api.mypurecloud.com/api/v2/conversations/chats', { headers })

		.then(r => r.json())
      
		.then(result => {
			
		console.log(result);
			
// retrieving all the user information from PureCloud chat
        
		let name=result.entities[0].participants[0].name;		
		document.getElementById('header').innerText = 'You are chatting with ' + name;
		
		let fname=result.entities[0].participants[0].attributes['context.firstName'];		
		document.getElementById('fname_').innerText = fname;
		
		let lname=result.entities[0].participants[0].attributes['context.lastName'];		
		document.getElementById('lname_').innerText = lname;
	
		let street=result.entities[0].participants[0].attributes['context.addressStreet'];		
		document.getElementById('street_').innerText = street;
		
		let city=result.entities[0].participants[0].attributes['context.addressCity'];		
		document.getElementById('city_').innerText = city;
	
		let prov=result.entities[0].participants[0].attributes['context.addressState'];		
		document.getElementById('prov_').innerText = prov;
		
		let postal=result.entities[0].participants[0].attributes['context.addressPostalCode'];		
		document.getElementById('postal_').innerText = postal;
		
		let phone=result.entities[0].participants[0].attributes['context.phoneNumber'];		
		document.getElementById('phone_').innerText = phone;
		
// Initialize Firebase

		var config = {
			apiKey: "AIzaSyCUXmugN_8gCeY6N51O80CQfXa06SdncmE",
			authDomain: "weekendready-b0d2b.firebaseapp.com",
			databaseURL: "https://weekendready-b0d2b.firebaseio.com",
			projectId: "weekendready-b0d2b",
			storageBucket: "weekendready-b0d2b.appspot.com",
			messagingSenderId: "973658596563"
		};
		
		firebase.initializeApp(config);
		
		console.log(firebase);
		
		database = firebase.database();
        
		var ref = database.ref('Users');
		
		ref.on('value', function (data) {
			
			const users = data.val();
			
			console.log('got users', users);
			
			const match = users.find(u => u.num == phone);
			
			if (match) {
				
// if phone number matches, retrieving product information from Firebase

				let pname=match.Product.pName;	
				document.getElementById('pname_').innerText = pname;
		
				let purdate=match.Product.purDate;
				document.getElementById('purdate_').innerText = purdate;
				
				let warexp=match.Product.warrantyExp;
				document.getElementById('warexp_').innerText = warexp;
				
				let warper=match.Product.warrantyPer;
				document.getElementById('warper_').innerText = warper;	
			}
		})
      });
	}
	 
	fetchData();
	
})();
