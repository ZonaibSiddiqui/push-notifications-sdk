function initPushwoosh()
{
	var pushNotification = window.plugins.pushNotification;
	
	//projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
	pushNotification.registerDevice({ projectid: "60756016005", appid : "4F0C807E51EC77.93591449" },
									function(status) {
										var pushToken = status;
										console.warn('push token: ' + pushToken);
									},
									function(status) {
									    console.warn(JSON.stringify(['failed to register ', status]));
									});

	document.addEventListener('push-notification', function(event) {
	                            var title = event.notification.title;
	                            var userData = event.notification.userdata;
	                            
	                            if(typeof(userData) != "undefined") {
									console.warn('user data: ' + JSON.stringify(userData));
								}
									
								navigator.notification.alert(title);
								
								pushNotification.stopGeoPushes();
							  });
 }

var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },

    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        initPushwoosh();

		var pushNotification = window.plugins.pushNotification;
		//optional: create local notification alert
		//pushNotification.clearLocalNotification();
		//pushNotification.createLocalNotification({"msg":"message", "seconds":30, "userData":"optional"});

        app.report('deviceready');
		
		pushNotification.setTags({deviceName:"hello", deviceId:10},
										function(status) {
											console.warn('setTags success');
										},
										function(status) {
											console.warn('setTags failed');
										});

		
		function geolocationSuccess(position) {
			pushNotification.sendLocation({lat:position.coords.latitude, lon:position.coords.longitude},
									 function(status) {
										  console.warn('sendLocation success');
									 },
									 function(status) {
										  console.warn('sendLocation failed');
									 });

		};
		
		// onError Callback receives a PositionError object
		//
		function geolocationError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}
		
		function getCurrentPosition() {
			navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
		}
		
		//greedy method to get user position every 3 second. works well for demo.
//		setInterval(getCurrentPosition, 3000);
		
		//this method just gives the position once
//		navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
		
		//this method should track the user position as per Phonegap docs.
//		navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });

		pushNotification.startGeoPushes();
    },
    report: function(id) {
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    }
};
