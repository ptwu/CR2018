var {Component} = React;

class Header extends Component {
    render() {
        return(
            <div className="header">
                <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                    <a className="pure-menu-heading" href="">ClassReveal</a>
            
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item pure-menu-selected"><a href="#" className="pure-menu-link">Home</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Tour</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sign Up</a></li>
                    </ul>
                </div>
            </div> 
        );
    }
}

class Splash extends Component {
    render() {
        return (
            <div class="splash-container">
                <div class="splash">
                    <h1 class="splash-head">Big Bold Text</h1>
                    <p class="splash-subhead">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </p>
                    <p>
                        <a href="http://purecss.io" class="pure-button pure-button-primary">Get Started</a>
                    </p>
                </div>
            </div>
        )
    }
}

class GridSystem extends Component {
    render() {
        return (
            <div class="pure-g grid-example">
                <div class="pure-u-1 ghost-wrap">
                    <div class="pure-g-r">
                        <div class="pure-u-1-3">
                        <div id="grid_left_box" class="boxy">
                            
                        </div>
                        </div>
                        <div class="pure-u-1-3">
                        <div id="grid_middle_box" class="boxy">
                            
                        </div>
                        </div>
                        <div class="pure-u-1-3">
                        <div id="grid_right_box" class="boxy">
                            
                        </div>
                        </div>
                    </div>
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
                <div class="classreveal_site_content" id="content">
                    <h2 class="content-head is-center">Sign in with Google</h2>
                    <GridSystem/>
                </div>
                <div class="footer l-box is-center">
                   footer
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('container'));
