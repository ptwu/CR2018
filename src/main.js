var {Component} = React;

var provider = new firebase.auth.GoogleAuthProvider();
var user = null;

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

class GridSystem extends Component {
    render() {
        return (
            <div className="pure-g grid-example">
                <div className="pure-u-1 ghost-wrap">
                    <div className="pure-g-r">
                        <div className="pure-u-1-3">
                        <div id="grid_left_box" className="boxy">
                            
                        </div>
                        </div>
                        <div className="pure-u-1-3">
                        <div id="grid_middle_box" className="boxy">
                            
                        </div>
                        </div>
                        <div className="pure-u-1-3">
                        <div id="grid_right_box" className="boxy">
                            
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



class GoogleLogin extends Component {

    googleSignIn() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            user = result.user;
            
            if(!user.email.endsWith("@wwprsd.org")) {
                
                toast("times", "red", "You must sign in with your school (wwprsd.org) Google account.");
                user = null;

                firebase.auth().signOut().then(function() {
                    console.log("Signed out of non-wwprsd.org account successfully");
                }).catch(function(error) {
                    console.log("Failed to sign out of non-wwprsd.org account -> " + error);
                });

                return;
            }
            console.log(user.email);
            toast("check", "green", "Success! Logged in as " + user.email);

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
            <div className="classreveal_site_content is-center" id="content">
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
            <div className="classreveal_site_content is-center" id="content">
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

class App extends Component {
    render() {
        return (
            <div>
                <div id="header">
                    <Header/>
                </div>

                <GoogleLogin/>

                <PrivacyDisclaimer/>
                
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
