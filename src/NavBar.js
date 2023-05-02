import React from "react";

const AppModes = ['Static mocks', 'Dynamic mocks', 'Message queue'];

function NavBar(props) {
    return (
    <div {...props}>
      <h2>Available server modes:</h2>
      <ul>
        {AppModes.map((modeName, index) => {
            return <div key={index}>{modeName}</div>
        })}
      </ul>
    </div>
    );
}

export default NavBar;
