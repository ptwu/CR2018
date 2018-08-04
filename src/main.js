//TODO: REPLACE DOCUMENT.GETELEMENTBYID AND ELEMENT 
//MANIPULATION STUFF WITH JQUERY

var {Component} = React;

var provider = new firebase.auth.GoogleAuthProvider();
var firebaseUser = null;
var activePage = "";

function checkInvalidAccount() {
    var user = firebase.auth().currentUser;

    if(!user.email.endsWith("@wwprsd.org")) {
                
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
            
            ReactDOM.render(<PageEditClasses/>, document.getElementById('classreveal_mainapp_content'));
            activePage = "edit";
        }
    }

    openViewClassmates() {
        if(activePage !== "view") {
        
            ReactDOM.render(<PageViewClassmates/>, document.getElementById('classreveal_mainapp_content'));
            activePage = "view";
        }
    }

    render() {
        return (
            <div id="classreveal_navbar">
                <div className="pure-g navbar_container">
                    <div className="pure-u-1 pure-u-md-1-3 is-center navbar_option" onClick={this.openEditClasses}>
                        <div>
                            <h2><i className="fa fa-clipboard-list"></i> Set My Classes</h2>


                        </div>
                    </div>
                    <div className="pure-u-1 pure-u-md-1-3 is-center navbar_option navbar_option_selected" onClick={this.openViewClassmates}>
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
    render() {
        return (
            <div className="page_base">
                <h1>SET MY CLASSES PAGE: PLACEHOLDER</h1>
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