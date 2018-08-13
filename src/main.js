//TODO: REPLACE DOCUMENT.GETELEMENTBYID AND ELEMENT 
//MANIPULATION STUFF WITH JQUERY

var {Component} = React;

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
 });

var firebaseUser = null;
var activePage = "";
var loadedClasses = false;

function checkInvalidAccount() {
    var user = firebase.auth().currentUser;

    if(!user.email.endsWith("@wwprsd.org")) {
        
        console.log('email: ' + user.email);
                
        toast("times", "red", "You must sign in with your school (wwprsd.org) Google account.");
        firebaseUser = null;

        firebase.auth().signOut().then(function() {
            console.log("Signed out of non-wwprsd.org account successfully");
        }).catch(function(error) {
            console.log("Failed to sign out of non-wwprsd.org account -> " + error);
        });

        setTimeout(
            function() {    
                location.reload();
            },
            2000
        );

        return true;
    }
    return false;
}

function toNameFormat(str) {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/[^a-zA-Z]+/g, "");
    
    return str.charAt(0).toUpperCase() + str.slice(1);
}

class Header extends Component {
    render() {
        return(
            <div className="header">
                <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                    <a className="pure-menu-heading" href="">ClassReveal</a>
            
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item pure-menu-selected"><a href="#" className="pure-menu-link">Home</a></li>
                    </ul>
                </div>
            </div> 
        );
    }
}

class Splash extends Component {
    render() {
        return (
            <div className="splash-container">
                <div className="splash">
                    <h1 className="splash-head">Big Bold Text</h1>
                    <p className="splash-subhead">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </p>
                    <p>
                        <a href="http://purecss.io" className="pure-button pure-button-primary">Get Started</a>
                    </p>
                </div>
            </div>
        )
    }
}

class GoogleLogin extends Component {

    googleSignIn() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            firebaseUser = result.user;
            
            if(checkInvalidAccount()) {
                return;
            }

            console.log(firebaseUser.email);
            toast("check", "green", "Success! Logged in as " + firebaseUser.email);

        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }    

    render() {
        return (
            <div className="classreveal_site_content is-center" id="google_signindiv">
                <h2 className="content-head">Sign in with Google</h2>
                <h4 className="content-head">You must use your wwprsd.org account</h4>
                <button className="content-head" onClick={this.googleSignIn}><img src="img/google_signin/normal.png"/></button>    
            </div>
        );
    }
}

class PrivacyDisclaimer extends Component {
    render() {
        return (
            <div className="classreveal_site_content is-center" id="privacydisclaimerdiv">
                <p className="content-head">By using ClassReveal, you acknowledge that <br/>anyone with a wwprsd.org Google account can see which classes you are in.</p>
                <p className="content-head">We do not support non WW-P schools because of security issues.<br/> This year, we are required to verify that ClassReveal users are actual students, <br/> which is why you have to sign in using Google. We cannot verify students <br/> from other school districts, so we're limited to WW-P. Sorry for the inconvenience.</p>

            </div>
        );
    }
}

class ToastNotification extends Component {
    render() {
        return (
            <div id="toast">
                <div id="toast_img_holder"><i id="toast_img_icon" className="fa"></i></div>
                <div id="toast_desc"></div>
            </div>
        );
    }
}

class MainNavBar extends Component {

    signOut() {

        document.getElementById('navbar_signout').style.backgroundColor = "#e53935";

        toast("sign-out-alt", "gray", "Attempting to sign out...");

        setTimeout(
            function() { 
                firebase.auth().signOut().then(function() {      
                    location.reload();
                }).catch(function(error) {
                    toast("times", "red", "Failed to sign out");
                });
            },
            1000
        );
        
    }

    openEditClasses() {
        if(activePage !== "edit") {

            document.getElementById('navbaroption_' + activePage).className = "pure-u-1 pure-u-md-1-3 is-center navbar_option";
            document.getElementById('navbaroption_edit').className = "pure-u-1 pure-u-md-1-3 is-center navbar_option navbar_option_selected";
            
            ReactDOM.render(<PageEditClasses/>, document.getElementById('classreveal_mainapp_content'));

            loadClasses();

            activePage = "edit";

        }
    }

    openViewClassmates() {
        if(activePage !== "view") {
        
            document.getElementById('navbaroption_' + activePage).className = "pure-u-1 pure-u-md-1-3 is-center navbar_option";
            document.getElementById('navbaroption_view').className = "pure-u-1 pure-u-md-1-3 is-center navbar_option navbar_option_selected";

            ReactDOM.render(<PageViewClassmates/>, document.getElementById('classreveal_mainapp_content'));
            activePage = "view";
        }
    }

    render() {
        return (
            <div id="classreveal_navbar">
                <div className="pure-g navbar_container">
                    <div id="navbaroption_edit" className="pure-u-1 pure-u-md-1-3 is-center navbar_option" onClick={this.openEditClasses}>
                        <div>
                            <h2><i className="fa fa-clipboard-list"></i> Set My Classes</h2>


                        </div>
                    </div>
                    <div id="navbaroption_view" className="pure-u-1 pure-u-md-1-3 is-center navbar_option navbar_option_selected" onClick={this.openViewClassmates}>
                        <div>
                            <h2><i className="fa fa-users"></i> View Classmates</h2>

                            
                        </div>
                    </div>
                    <div id="navbar_signout" className="pure-u-1 pure-u-md-1-3 is-center navbar_option" onClick={this.signOut}>
                        <div>
                            <h2><i className="fa fa-sign-out-alt"></i> Logout</h2>

                        </div>
                    </div>
                    
                    
                </div>
            </div>
        );
    }
}

class PageViewClassmates extends Component {
    render() {
        return (
            <div className="page_base">
                <h1>VIEW CLASSMATES PAGE: PLACEHOLDER</h1>

                
                      
            </div>
        );
    }
}

class PageEditClasses extends Component {

    saveChanges() {
        var teachers = [];
        var school = document.getElementById('select_school').value;

        for(var i = 1; i <= 8; i++) {
            var firstNameBox = document.getElementById('pd' + i + '_firstname');
            var lastNameBox = document.getElementById('pd' + i + '_lastname');

            var firstName = toNameFormat(firstNameBox.value);
            var lastName = toNameFormat(lastNameBox.value);

            //replace non-alphabetic characters entered in the box so they can see
            firstNameBox.value = firstName;
            lastNameBox.value = lastName;

            teachers.push({pd: i, fn: firstName, ln: lastName});   

        }

        console.log(teachers);

        var user = firebase.auth().currentUser;
        firebase.database().ref('userProfile/' + user.uid).set(
            {
                schoolName: school,
                classes: teachers
            },
            function(error) {
                if (error) {
                  toast("times", "red", "Couldn't write to database: " + error);
                } else {
                  toast("check", "green", "Updated successfully")
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

    clearForm() {

        console.log("did it even work");

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

            document.getElementById('pd' + i + '_firstname').value = "";
            document.getElementById('pd' + i + '_lastname').value = "";

            document.getElementById('pd' + i + '_changebutton').disabled = true;
        }
    }

    changeTeacher(num) {

    }

    render() {
        return (
            <div className="page_base">
                
                <div className="pure-g">
                
                    <div className="pure-u-1 pure-u-md-1-2">
                        <h3 id="editclassheader">Use first name 'Study' and last name 'Hall' for study hall
                            
                        </h3>

                        

                        <div className="pure-form pure-form-stacked editclassform">
                            <div className="pure-g">

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>School</label>
                                    <button id="clearformbutton" className="pure-button pure-button-active button_clear invisible" onClick={this.clearForm}>Change School</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-2 editcolumn">
                                    <select id="select_school">
                                        <option value="school_south">HS South</option>
                                        <option value="school_north">HS North</option>
                                    </select>
                                </div>
                               
                                
                                <br/>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 1 Teacher</label>
                                    <button id="pd1_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(1)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd1_firstname">First Name</label>
                                    <input id="pd1_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd1_lastname">Last Name</label>
                                    <input id="pd1_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 2 Teacher</label>
                                    <button id="pd2_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(2)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd2_firstname">First Name</label>
                                    <input id="pd2_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd2_lastname">Last Name</label>
                                    <input id="pd2_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 3 Teacher</label>
                                    <button id="pd3_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(3)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd3_firstname">First Name</label>
                                    <input id="pd3_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd3_lastname">Last Name</label>
                                    <input id="pd3_lastname" className="pure-u-23-24" type="text"/>
                                </div>



                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 4 Teacher</label>
                                    <button id="pd4_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(4)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd4_firstname">First Name</label>
                                    <input id="pd4_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd4_lastname">Last Name</label>
                                    <input id="pd4_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 5 Teacher</label>
                                    <button id="pd5_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(5)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd5_firstname">First Name</label>
                                    <input id="pd5_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd5_lastname">Last Name</label>
                                    <input id="pd5_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 6 Teacher</label>
                                    <button id="pd6_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(6)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd6_firstname">First Name</label>
                                    <input id="pd6_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd6_lastname">Last Name</label>
                                    <input id="pd6_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 7 Teacher</label>
                                    <button id="pd7_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(7)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd7_firstname">First Name</label>
                                    <input id="pd7_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd7_lastname">Last Name</label>
                                    <input id="pd7_lastname" className="pure-u-23-24" type="text"/>
                                </div>


                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label>Period 8 Teacher</label>
                                    <button id="pd8_changebutton" className="pure-button pure-button-active button_delete invisible" onClick={() => this.changeTeacher(8)}>Change</button>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd8_firstname">First Name</label>
                                    <input id="pd8_firstname" className="pure-u-23-24" type="text"/>
                                </div>

                                <div className="pure-u-1 pure-u-md-1-3 editcolumn">
                                    <label htmlFor="pd8_lastname">Last Name</label>
                                    <input id="pd8_lastname" className="pure-u-23-24" type="text"/>
                                </div>

                                <button onClick={this.saveChanges} className="pure-button pure-button-primary">Save Changes</button>

                            </div>    
                        
                        </div>
                    </div>

                    <div className="pure-u-1 pure-u-md-1-2">
                        <h3>For convenience, you can access Genesis right here. We don't <a target="_blank" href="https://en.wikipedia.org/wiki/Same-origin_policy">(&amp; can't)</a> access your password.</h3>
                        <iframe id="genesisembed" src="https://students.ww-p.org"></iframe>
                    </div>
                </div>
            </div>
        );
    }
}

class MainApp extends Component {
    render() {
        return (
            <div id="classreveal_mainapp">
                
                <MainNavBar/>

                <div id="classreveal_mainapp_content">

                </div>

            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div>
                <div id="header">
                    <Header/>
                </div>

                <GoogleLogin/>

                <PrivacyDisclaimer/>

                <div id="classreveal_main"></div>
                
                <ToastNotification/>

                <div className="footer l-box is-center">
                   footer
                </div>

                
            </div>
        )
    }
}

function toast(icon, color, message) {
    var toastDiv = document.getElementById("toast")

    document.getElementById("toast_img_icon").className = "fa fa-" + icon;
    document.getElementById("toast_desc").innerHTML = message;

    toastDiv.className = "toast-" + color + " show";
    
    setTimeout(
        function() 
        { 
            toastDiv.className = "";
        }, 
        5000
    );
}

ReactDOM.render(<App/>, document.getElementById('container'));

function loadClasses() {
    var user = firebase.auth().currentUser;

    firebase.database().ref('/userProfile/' + user.uid).once('value').then(function(snapshot) {
        
        if(snapshot !== null) {
            var snapshotVal = snapshot.val();
    
            document.getElementById('select_school').value = snapshotVal.schoolName;
            document.getElementById('select_school').disabled = true;

            document.getElementById('clearformbutton').className = "pure-button pure-button-active button_clear";
        
            var periods = snapshotVal.classes;
        
            for(var i = 0; i < periods.length; i++) {
                var period = periods[i];
                    
                document.getElementById('pd' + period.pd + '_firstname').value = period.fn;
                document.getElementById('pd' + period.pd + '_lastname').value = period.ln;

                document.getElementById('pd' + period.pd + '_firstname').disabled = true;
                document.getElementById('pd' + period.pd + '_lastname').disabled = true;

                document.getElementById('pd' + period.pd + '_changebutton').className = "pure-button pure-button-active button_delete";
            }

            document.getElementById('editclassheader').innerHTML += "<br/>Warning: Changing your school will clear your saved schedule";
    
            toast("check", "green", "Loaded class data from database");

        }
            
    });
}

//Initialization: Showing login button (or not)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("Already signed in as " + user.email + "... removing sign in div");
        var signInDiv = document.getElementById("google_signindiv");
        signInDiv.parentNode.removeChild(signInDiv);

        var privacyDiv = document.getElementById("privacydisclaimerdiv");
        privacyDiv.parentNode.removeChild(privacyDiv);

        if(checkInvalidAccount()) {
            return;
        }

        toast("check", "green", "Signed in as " + user.email);

        firebaseUser = user;

        activePage = "view";

        ReactDOM.render(<MainApp/>, document.getElementById('classreveal_main'));
        ReactDOM.render(<PageViewClassmates/>, document.getElementById('classreveal_mainapp_content'));
        
    } else {
        console.log("Not signed in yet. Allowing sign in div to show");
    }
});