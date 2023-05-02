import React, { useEffect, useState } from 'react';

import { StaticRoutesManager } from './managers/static_routes_manager';

function StaticRoutes(props) {
    let manager = new StaticRoutesManager();

    const [curRoute, setCurRoute] = useState('');
    const [curExpResp, setCurExpResp] = useState('');

    const [routes, setRoutes] = useState([]);

    const updateRoutes = () => {
      manager.List(
        (status, data) => {
          if (status === 200) {
            setRoutes(data.endpoints);
            console.debug('Routes updated!');
          } else {
            alert(JSON.stringify({
              message: 'Your request seems wrong',
              status: status,
              error: data.error,
            }));
          }
      }, (error) => {
        alert(JSON.stringify({
          message: 'Failed to update routes',
          error: error,
        }));
      });
    }
    useEffect(() => {
      updateRoutes();
    }, []);

    const addRoute = () => {
        manager.AddRoute({
          path: curRoute,
          expected_response: curExpResp
        }, (status, data) => {
          if (status === 200) {
            console.log(JSON.stringify({
              message: data,
              status: 200,
            }));
            setCurRoute('');
            setCurExpResp('');

            updateRoutes();
          } else {
            alert(JSON.stringify({
              message: 'Your request seems wrong',
              status: status,
              error: data.error,
            }));
          }
        }, (error) => {
          alert(JSON.stringify({
            message: 'Failed to add route',
            error: error,
          }));
        })
    };

    const deleteRoute = (route) => {
      manager.DeleteRoute({
        path: route
      }, (status, data) => {
        if (status === 200) {
          console.log(JSON.stringify({
            message: data,
            status: 200,
          }));

          updateRoutes();
        }
      }, (error) => {
          alert(JSON.stringify({
            message: 'Failed to delete route',
            error: error,
          }));
      });
    };

    const getExpectedResponse = (route) => {
      manager.doGet(route)
      .then(({status, data}) => {
        if (status === 200) {
          alert(JSON.stringify({
            'Expected response': data,
          }));
        } else {
          alert(JSON.stringify({
            message: data,
          }));
        }
      })
      .catch((error) => {
        alert(JSON.stringify({
          'Server error': error,
        }));
      })
    }

    return (
    <div {...props}>
      <div className='same-row'>
        <div>
          <p>Type route that you want to mock</p>
        </div>

        <div>
             <>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='route-add'>Route:</label>
                <input
                    id='route-add'
                    value={curRoute}
                    onChange={({target}) => setCurRoute(target.value)}
                />
               </div>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='expected-add'>Expected response:</label>
                <input
                    id='expected-add'
                    value={curExpResp}
                    onChange={({target}) => setCurExpResp(target.value)}
                />
               </div>
               <button onClick={addRoute}>Add route!</button>
             </>
        </div>
      </div>

      <div className='same-row'>
        <h3>Your routes!</h3>
        <ul>
            {routes.map((route, index) => {
               return (
                <li key={`static_route_${index}`}>
                  <div
                    className='clickable'
                    onClick={() => getExpectedResponse(route)}
                  >
                    {route}
                  </div>
                  <button onClick={() => deleteRoute(route)}>Delete</button>
                </li>
               );
            })}
        </ul>
      </div>
    </div>
    );
}

export default StaticRoutes;
