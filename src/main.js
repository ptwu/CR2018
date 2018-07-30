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

class App extends Component {
  render(){
    return (
      <div>
          <Header/>
      </div>
    );
  }
};

ReactDOM.render(<App/>,
    document.getElementById('container')
);