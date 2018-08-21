var previousClasses = [];
var previousSchool = "";

var teacherAutocomplete = [];

function manualEntry(num) {
    document.getElementById('autocomplete_' + num).style.display = 'none';
    document.getElementById('manualentry_' + num).style.display = 'block';

    document.getElementById('pd' + num + '_firstname').value = "";
    document.getElementById('pd' + num + '_lastname').value = "";
}

function loadAutocompleteList(schoolNameDB) {

    teacherAutocomplete = [];

    var teachers = firebase.database().ref('schoolData/' + schoolNameDB + '/teachers');
                
    teachers.once('value').then(function(snap) {
        snap.forEach(function(child) { 
            var name = child.key;
            var nameSplit = name.split("_");

            var firstName = nameSplit[0];
            var lastName = nameSplit[1];

            teacherAutocomplete.push(lastName + ", " + firstName);
            
        });

    });

    $(".teacheracinput").autocomplete(
        {
            source: teacherAutocomplete,
            select: function (event, ui) {
                var selected = ui.item.label;
                var period = this.id.charAt(2);

                var nameSplit = selected.split(", ");
                var firstName = nameSplit[1];
                var lastName = nameSplit[0];

                document.getElementById('pd' + period + '_firstname').value = firstName;
                document.getElementById('pd' + period + '_lastname').value = lastName;
            },
            change: function(event, ui) {
                if (ui.item == null) {
                    $(this).val("");
                    $(this).focus();
                }
            }
        }
    );
}

$(document).ready(function(){
    $("#select_school").change(function(){
    
        loadAutocompleteList($("#select_school").val());
    
    })
});

function loadClasses() {
    var user = firebase.auth().currentUser;

    firebase.database().ref('/userProfile/' + user.uid).once('value').then(function(snapshot) {
        
        if(snapshot !== null) {
            var snapshotVal = snapshot.val();

            if(snapshotVal == null) {
                loadAutocompleteList('school_south');
                document.getElementById('editclassheader').innerHTML += "<br><br>Start typing in your teacher's last name to use autocomplete. If you can't find them, press Add New to enter a new teacher manually";
                document.getElementById('clearformbutton').style.display = "none";
                return;
            }
    
            document.getElementById('select_school').value = snapshotVal.schoolName;

            previousSchool = snapshotVal.schoolName;

            document.getElementById('select_school').disabled = true;

            document.getElementById('clearformbutton').className = "btn red darken-2";

            $(".namelabel").css("visibility", "hidden");

            var periods = snapshotVal.classes;
        
            for(var i = 0; i < 8; i++) {
                var period = periods[i];
                
                if(period != null)
                {
                    document.getElementById('pd' + period.pd + '_firstname').value = period.fn;
                    document.getElementById('pd' + period.pd + '_lastname').value = period.ln;
    
                    document.getElementById('pd' + period.pd + '_firstname').disabled = true;
                    document.getElementById('pd' + period.pd + '_lastname').disabled = true;

                    document.getElementById('autocomplete_' + period.pd).style.display = 'none';
                    document.getElementById('manualentry_' + period.pd).style.display = 'block';

                    previousClasses.push(period);
                }
                
            }

            
            document.getElementById('editclassheader').innerHTML += "<br><br>To remove yourself from your classes or edit your schedule, press Edit Schedule.<br>WARNING: You must save changes after any edits, or your data will be deleted";
            toast("check", "green", "Loaded class data from database");
            
        }
            
    });
}

function toNameFormat(str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/[^a-zA-Z]+/g, "");
    
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveChanges() {
    var teachers = [];
    var school = document.getElementById('select_school').value;

    var user = firebase.auth().currentUser;

    var schoolDataUpdates = {};

    for(var i = 1; i <= 8; i++) {
        var firstNameBox = document.getElementById('pd' + i + '_firstname');
        var lastNameBox = document.getElementById('pd' + i + '_lastname');

        var firstName = toNameFormat(firstNameBox.value);
        var lastName = toNameFormat(lastNameBox.value);

        if(firstName == '' || lastName == '') {
            toast("times", "red", "You left the first/last name of at least one teacher blank.");
            return;
        }

        //replace non-alphabetic characters entered in the box so they can see
        firstNameBox.value = firstName;
        lastNameBox.value = lastName;

        teachers.push({pd: i, fn: firstName, ln: lastName});   

        var teacherRefStr = 'schoolData/' + school + '/teachers/' + firstName + '_' + lastName + '/pd' + i + '/';
        
        var userGrade = Number(user.email.slice(0,2)) * -1 + 31

        var newClassmateData = {
            name: user.displayName,
            grade: userGrade
        };

        schoolDataUpdates[teacherRefStr + user.uid] = newClassmateData;

    }

    firebase.database().ref().update(schoolDataUpdates);

    console.log(teachers);
    
    firebase.database().ref('userProfile/' + user.uid).set(
        {
            schoolName: school,
            classes: teachers
        },
        function(error) {
            if (error) {
              toast("times", "red", "Couldn't write to database: " + error);
            } else {
              toast("check", "green", "Updated successfully");
            }
        }
    );

    

    setTimeout(
        function() {
            location.reload();
        }, 
        1000
    );
    
}

function clearForm() {

    var user = firebase.auth().currentUser;

    var userProfileRef = firebase.database().ref('userProfile/' + user.uid);
    userProfileRef.remove().then(function() {
        console.log("Removed userProfile data")
    })
    .catch(function(error) {
        toast("times", "red", "Couldn't delete data. Try refreshing. " + error.message);
        return;
    });

    document.getElementById('select_school').disabled = false;

    document.getElementById('clearformbutton').disabled = true;

    for(var i = 1; i <= 8; i++) {

        document.getElementById('pd' + i + '_firstname').disabled = false;
        document.getElementById('pd' + i + '_lastname').disabled = false;

        // document.getElementById('autocomplete_' + i).style.display = 'block';
        // document.getElementById('manualentry_' + i).style.display = 'none';

        removeFromClass(i-1);

    }

    // loadAutocompleteList($("#select_school").val());
}

function removeFromClass(num) {

    var periodNum = num + 1;

    var previousTeacher = previousClasses[num];

    var previousTeacherName = previousTeacher.fn + "_" + previousTeacher.ln;

    var user = firebase.auth().currentUser;
    var school = previousSchool;

    //Remove the user from the class
    var userInClassRef = firebase.database().ref('schoolData/' + school + '/teachers/' + previousTeacherName + '/pd' + periodNum + '/' + user.uid);

    console.log(userInClassRef.toString());

    userInClassRef.remove().then(function() {
        console.log("Removed user from class");
    })
    .catch(function(error) {
        toast("times", "red", "Couldn't remove you from the class. " + error.message);
        return;
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        loadClasses();
    } 
});



