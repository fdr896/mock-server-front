import React, { useEffect, useState} from 'react';

import { Button } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

import { DynamicRoutesManager } from './managers/dynamic_routes_manager';

function DynamicRoutes(props) {
    let manager = new DynamicRoutesManager();

    const mandatoryCodePrefix = 'def func(';

    const [routes, setRoutes] = useState([]);

    const [curRoute, setCurRoute] = useState('');
    const [curCode, setCurCode] = useState(mandatoryCodePrefix);
    
    const [curArgs, setCurArgs] = useState('{}');
    const [curLaunchingRoute, setCurLaunchingRoute] = useState('');
    const [showArgsDialog, setShowArgsDialog] = useState(false);

    const [curUpdatingRoute, setCurUpdatingRoute] = useState('');
    const [curUpdatingCode, setCurUpdatingCode] = useState(mandatoryCodePrefix);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [failedInputCode, setFailedInputCode] = useState(false);

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

    const getRouteCode = (route) => {
      manager.GetRouteCode(route,
        (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurUpdatingCode(data)
              break
            default:
              alert(JSON.stringify({
                message: `Your request seems wrong for route: ${route} bla`,
                status: status,
                error: data.error,
              }));
          }
        },
        (error) => {
          alert(JSON.stringify({
            message: 'Failed to update routes',
            error: error,
          }));
        },
      )
    }

    const addRoute = (route, code) => {
        manager.AddRoute({
          path: route,
          code: code,
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurRoute('');
              setCurCode(mandatoryCodePrefix);

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

    const updateRoute = (route, code) => {
      manager.UpdateRoute({
        path: route,
        code: code,
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

    const launchRouteCode = (route, args) => {
      manager.doPost(route, args)
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
                <label htmlFor='code-text'>Code:</label>
                <br/>
                <Editor
                    id='code-text'
                    value={curCode}
                    highlight={code => highlight(code, languages.python)}
                    style={{resize: 'none', backgroundColor: '#dbdbdb', width: '300px', height: '300px'}}
                    onValueChange={(newCurCode) => {
                      setCurCode(() => newCurCode.length >= mandatoryCodePrefix.length ? newCurCode : mandatoryCodePrefix);
                      setFailedInput(false);
                    }}
                />
               </div>
               <Button
                variant='contained'
                style={{backgroundColor: !failedInput ? 'blue' : 'red'}}
                onClick={() => {
                  const validRoute = (curRoute !== '' && curRoute !== '/');
                  if (!validRoute) {
                    setFailedInput(true);
                    return;
                  }

                  const codeLines = curCode.split(/\r?\n/);
                  const validCode = (
                    codeLines.length > 1 &&
                    codeLines[0].endsWith('):') &&
                    codeLines[1].length > 0
                  );
                  if (!validCode) {
                    setFailedInput(true);
                    return;
                  }

                  addRoute(curRoute, curCode);
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
                    onClick={() => {
                      setCurLaunchingRoute(route);
                      setShowArgsDialog(true);
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
            <label htmlFor='updating-code'><b>New code:</b></label><br/>
            <textarea
              id='updating-code'
              value={curUpdatingCode}
              style={{resize: 'none', backgroundColor: '#dbdbdb', height: '70px', width: '300px'}}
              onChange={(e) => {
                const newCurCode = e.target.value;

                if (newCurCode.length >= mandatoryCodePrefix.length) {
                  setFailedInputCode(false);
                  setCurUpdatingCode(newCurCode);
                }
              }}
            >
              {showUpdateDialog ? getRouteCode(curUpdatingRoute) : mandatoryCodePrefix}
            </textarea>
          </div>
          <Button
            variant='outlined'
            style={{backgroundColor: !failedInputCode ? 'blue' : 'red'}}
            onClick={() => {
              const codeLines = curUpdatingCode.split(/\r?\n/);
              const validCode = (
                codeLines.length > 1 &&
                codeLines[0].endsWith('):') &&
                codeLines[1].length > 0
              );
              if (!validCode) {
                setFailedInputCode(true);
                return;
              }

              setShowUpdateDialog(false);
              updateRoute(curUpdatingRoute, curUpdatingCode);
              setCurUpdatingCode(mandatoryCodePrefix);
            }}
          >Update</Button>
          <Button variant='outlined'
            onClick={() => {
              setShowUpdateDialog(false);
              setCurUpdatingCode(mandatoryCodePrefix);
            }}
          >
          Discard</Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showArgsDialog}
      >
        <DialogTitle>Send args to route</DialogTitle>
        <DialogContent>
          <div style={{marginBottom: '1em'}}>
            <label htmlFor='code-args'><b>Args (json):</b></label><br/>
            <textarea
              id='code-args'
              value={curArgs}
              style={{resize: 'none', backgroundColor: '#dbdbdb', height: '70px', width: '300px'}}
              onChange={({target}) => {
                  setFailedInputCode(false);
                  setCurArgs(target.value);
              }}
            ></textarea>
          </div>
          <Button
            variant='outlined'
            style={{backgroundColor: !failedInputCode ? 'blue' : 'red'}}
            onClick={() => {
              try {
                JSON.parse(curArgs);
              } catch (error) {
                alert(`Invalid args format: ${error.message.slice(12)}`);
                return;
              }

              setShowArgsDialog(false);
              launchRouteCode(curLaunchingRoute, curArgs);
              setCurLaunchingRoute('');
              setCurArgs('{}');
            }}
          >Send</Button>
          <Button variant='outlined'
            onClick={() => {
              setShowArgsDialog(false);
              setCurLaunchingRoute('');
              setCurArgs('{}');
            }}
          >
          Discard</Button>
        </DialogContent>
      </Dialog>
    </div>
    );
}

export default DynamicRoutes;
