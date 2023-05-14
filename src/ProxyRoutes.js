import React, { useEffect, useState} from 'react';

import { Button, Input } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

import { ProxyRoutesManager } from './managers/proxy_routes_manager';

function ProxyRoutes(props) {
    let manager = new ProxyRoutesManager();

    const [routes, setRoutes] = useState([]);

    const [curRoute, setCurRoute] = useState('');
    const [curURL, setCurURL] = useState('');

    const [curUpdatingRoute, setCurUpdatingRoute] = useState('');
    const [curUpdatingURL, setCurUpdatingURL] = useState('');
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const [failedInput, setFailedInput] = useState(false);

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

    const addRoute = (route, url) => {
        manager.AddRoute({
          path: route,
          proxy_url: url,
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurRoute('');
              setCurURL('');

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

    const updateRoute = (route, url) => {
      manager.UpdateRoute({
        path: route,
        proxy_url: url,
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

    const proxyRoute = (route) => {
      manager.doPost(route, {})
      .then(({status, data}) => {
        switch (status) {
          case 200:
            alert(data)
            break;
          
          default:
            alert(data.error);
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
          <p><b>Type route that you want to proxy:</b></p>
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
                      setFailedInput(false);

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
                <label htmlFor='expected-add'>Proxy URL:</label>
                <input
                    id='expected-add'
                    value={curURL}
                    onChange={({target}) => {
                      setFailedInput(false);
                      setCurURL(target.value);
                    }}
                />
               </div>
               <Button
                variant='contained'
                style={{backgroundColor: !failedInput ? 'blue' : 'red'}}
                onClick={() => {
                  const validRoute = (curRoute !== '' && curRoute !== '/' && curURL.length > 0);
                  if (!validRoute) {
                    setFailedInput(true);
                    return;
                  }

                  addRoute(curRoute, curURL);
                }}>Add route!</Button>
             </>
        </div>
      </div>

      <div className='same-row'>
        <h3>Your routes!</h3>
        <ul>
            {routes.map((route, index) => {
               return (
                <li key={`proxy_route_${index}`}>
                  <div
                    style={{marginRight: '2em'}}
                    className='clickable'
                    onClick={() => {
                      proxyRoute(route);
                    }}
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
            <label htmlFor='updating-proxy-url'><b>New proxy url:</b></label>
            <Input
                id='updating-proxy-rul'
                value={curUpdatingURL}
                onChange={({target}) => setCurUpdatingURL(target.value)}
              ></Input>
          </div>
          <Button
            variant='outlined'
            onClick={() => {
              setShowUpdateDialog(false);
              updateRoute(curUpdatingRoute, curUpdatingURL);
              setCurUpdatingURL('');
            }}
          >Update</Button>
          <Button variant='outlined'
            onClick={() => {
              setShowUpdateDialog(false);
              setCurUpdatingURL('');
            }}
          >
          Discard</Button>
        </DialogContent>
      </Dialog>
    </div>
    );
}

export default ProxyRoutes;
