import React, { useEffect, useState } from 'react';

import { Button, Input } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { StaticRoutesManager } from './managers/static_routes_manager';

function StaticRoutes(props) {
    let manager = new StaticRoutesManager();

    const [curRoute, setCurRoute] = useState('');
    const [curExpResp, setCurExpResp] = useState('');

    const [routes, setRoutes] = useState([]);

    const [curUpdatingRoute, setCurUpdatingRoute] = useState('');
    const [curUpdatingResponse, setCurUpdatingResponse] = useState('');
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const [failedInputRoute, setFailedInputRoute] = useState(false);

    const updateRoutes = () => {
      manager.List(
        (status, data) => {
          switch (status) {
            case 200:
              setRoutes(data.endpoints);
              console.debug('Routes updated!');
              break;

            default:
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

    const addRoute = (route, response) => {
        manager.AddRoute({
          path: route,
          expected_response: response,
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurRoute('');
              setCurExpResp('');

              updateRoutes();
              break;

            default:
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

    const updateRoute = (route, response) => {
      manager.UpdateRoute({
        path: route,
        expected_response: response,
      }, (status, data) => {
        switch (status) {
          case 204:
            console.log(JSON.stringify({
              message: data,
              status: 200,
            }));
            updateRoutes();
            break;

          default:
            alert(JSON.stringify({
              message: 'Your request seems wrong',
              status: status,
              error: data.error,
            }));
        }
      }, (error) => {
          alert(JSON.stringify({
            message: 'Failed to update route',
            error: error,
          }));
      })
    };

    const deleteRoute = (route) => {
      manager.DeleteRoute({
        path: route
      }, (status, data) => {
        switch (status) {
          case 204:
            console.log(JSON.stringify({
              message: data,
              status: 200,
            }));
            updateRoutes();
            break;
          
          default:
            alert(JSON.stringify({
              message: 'Your request seems wrong',
              status: status,
              error: data.error,
            }));
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
        switch (status) {
          case 200:
            alert(data)
            break;
          
          default:
            alert(JSON.stringify({
              message: 'Your request seems wrong',
              status: status,
              error: data.error,
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
          <p><b>Type route that you want to mock:</b></p>
        </div>

        <div>
             <>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='route-add'>Route:</label>
                <input
                    id='route-add'
                    value={curRoute}
                    pattern='\/[A-Za-z0-9_]+'
                    onChange={(e) => {
                      setFailedInputRoute(false);

                      const newCurRoute = e.target.value;
                      const valid = e.target.validity.valid;

                      if (newCurRoute.length < curRoute.length) {
                        setCurRoute(newCurRoute);
                      } else if (curRoute.length === 0) {
                        setCurRoute(newCurRoute === '/' ? newCurRoute : curRoute);
                      } else {
                        setCurRoute(valid ? newCurRoute : curRoute);
                      }
                    }}
                />
               </div>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='expected-add'>Expected response:</label>
                <br/>
                <textarea
                    id='expected-add'
                    style={{resize: 'none', backgroundColor: '#dbdbdb', height: '70px', width: '300px'}}
                    value={curExpResp}
                    onChange={({target}) => {
                      setFailedInputRoute(false);
                      setCurExpResp(target.value);
                    }}
                />
               </div>
               <Button
                variant='contained'
                style={{backgroundColor: !failedInputRoute ? 'blue' : 'red'}}
                onClick={() => {
                  if (curRoute !== '' && curRoute !== '/' && curExpResp.length > 0) {
                    addRoute(curRoute, curExpResp);
                  } else {
                    setFailedInputRoute(true);
                  }
                }}>Add route!</Button>
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
                    style={{marginRight: '2em'}}
                    className='clickable'
                    onClick={() => getExpectedResponse(route)}
                  >
                    {route}
                  </div>
                  <Button
                    variant='outlined'
                    style={{marginRight: '1em'}}
                    onClick={() => deleteRoute(route)}
                  >Delete</Button>
                  <Button variant='outlined' onClick={() => {
                    setCurUpdatingRoute(route);
                    setShowUpdateDialog(true)}}
                  >Update response</Button>
                </li>
               );
            })}
        </ul>
      </div>

      <Dialog
        open={showUpdateDialog}
      >
        <DialogTitle>Update route response</DialogTitle>
        <DialogContent>
          <div style={{marginBottom: '1em'}}>
            <b>Route:</b> {curUpdatingRoute}
          </div>
          <div style={{marginBottom: '1em'}}>
            <label htmlFor='updating-route'><b>New response:</b> </label>
            <Input
              id='updating-route'
              value={curUpdatingResponse}
              onChange={({target}) => setCurUpdatingResponse(target.value)}
            ></Input>
          </div>
          <Button
            variant='outlined'
            onClick={() => {
              setShowUpdateDialog(false);
              updateRoute(curUpdatingRoute, curUpdatingResponse);
              setCurUpdatingResponse('');
            }}
          >Update</Button>
          <Button variant='outlined'
            onClick={() => {
              setShowUpdateDialog(false);
              setCurUpdatingResponse('');
            }}
          >
          Discard</Button>
        </DialogContent>
      </Dialog>
    </div>
    );
}

export default StaticRoutes;
