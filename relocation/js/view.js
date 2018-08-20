var classmateHTML = "<li class='collection-item avatar'><img src='img/person.png' alt='Person' class='circle'><span class='title'>Title</span></li>";

function schoolDBNameToReal(dbName) {
    if(dbName === "school_south") {
        return "HS South";
    } else if(dbName === "school_north") {
        return "HS North";
    }
}

function loadPeriods() {
    var user = firebase.auth().currentUser;

    firebase.database().ref('/userProfile/' + user.uid).once('value').then(function(snapshot) {
        
        if(snapshot !== null) {
            var snapshotVal = snapshot.val();
    
            var schoolName = snapshotVal.schoolName;

            document.getElementById('schoolindicator').innerHTML += schoolDBNameToReal(schoolName);

            var periods = snapshotVal.classes;
        
            for(var i = 1; i <= 8; i++) {
                var period = periods[i-1];
                
                var teacherName = period.fn + " " + period.ln;
                var teacherNameDB = period.fn + "_" + period.ln;

                document.getElementById("className" + period.pd).innerHTML = teacherName;

                var classRef = firebase.database().ref('schoolData/' + schoolName + '/teachers/' + teacherNameDB + '/pd' + period.pd + '/');
                
                classRef.once('value').then(function(snap) {

                    var actualPd = snap.key.replace("pd", "");

                    snap.forEach(function(child) { 
                        var name = child.val().name; 
                        var classmateHTML = "<li class='collection-item avatar'><img src='img/person.png' alt='Person' class='circle'><span class='title'>" + name + "</span><p>Grade " + child.val().grade + "</p>" + "</li>";

                        document.getElementById('period' + actualPd).innerHTML += classmateHTML;
                    });

                });

                
            }

            toast("check", "green", "Loaded class data from database");

        }
            
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        loadPeriods();
    } 
});