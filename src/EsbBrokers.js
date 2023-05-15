import React, { useEffect, useState} from 'react';

import { Button } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

import { PoolBrokersManager } from './managers/pool_brokers_manager';
import { EsbBrokersManager } from './managers/esb_brokers_manager';

function EsbBrokers(props) {
    let manager = new PoolBrokersManager();
    let esbManager = new EsbBrokersManager();

    const mandatoryCodePrefix = 'def func(msgs):\n    ';

    let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

    const [records, setRecords] = useState([]);

    const [curPoolNameIn, setCurPoolNameIn] = useState('');
    const [curPoolNameOut, setCurPoolNameOut] = useState('');
    const [curCode, setCurCode] = useState(mandatoryCodePrefix);
    
    const [curReadMsgs, setCurReadMsgs] = useState([]);
    const [curWriteMsgs, setCurWriteMsgs] = useState([]);

    const [curMsgsPoolIn, setCurMsgsPoolIn] = useState('');
    const [curMsgsPoolOut, setCurMsgsPoolOut] = useState('');
    const [showMsgsDialog, setShowMsgsDialog] = useState(false);

    const [curMsgs, setCurMsgs] = useState('');
    const [showWriteMsgsDialog, setShowWriteMsgsDialog] = useState(false);

    const [failedInput, setFailedInput] = useState(false);

    const updateRecords = () => {
      esbManager.List(
        (status, data) => {
          switch (status) {
            case 200:
              setRecords(data.records);
              console.debug('Records updated!');
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
          message: 'Failed to update records',
          error: error,
        }));
      });
    }
    useEffect(() => {
        updateRecords();
    }, []);

    const getMapperCode = (poolName) => {
      esbManager.GetCode(poolName,
        (status, data) => {
          switch (status) {
            case 200:
              alert(data);
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
          message: 'Failed to get code',
          error: error,
        }));
      });
    }

    const updateReadMsgs = (poolName) => {
      manager.GetReadMessages(poolName,
        (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurReadMsgs(data.messages);
              break
            default:
              alert(JSON.stringify({
                message: `Your request seems wrong for pool: ${poolName}`,
                status: status,
                error: data.error,
              }));
          }
        },
        (error) => {
          alert(JSON.stringify({
            message: 'Failed to get read messages',
            error: error,
          }));
        },
      )
    }

    const updateWriteMsgs = (poolName) => {
      manager.GetWriteMessages(poolName,
        (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurWriteMsgs(data.messages);
              break
            default:
              alert(JSON.stringify({
                message: `Your request seems wrong for pool: ${poolName}`,
                status: status,
                error: data.error,
              }));
          }
        },
        (error) => {
          alert(JSON.stringify({
            message: 'Failed to get write messages',
            error: error,
          }));
        },
      )
    }

    const scheduleRead = (poolName) => {
      manager.ScheduleRead(poolName,
        (status, data) => {
          switch (status) {
            case 204:
              console.log(JSON.stringify({
                message: data,
                status: 204,
              }));
              break
            default:
              alert(JSON.stringify({
                message: `Your request seems wrong for pool: ${poolName}`,
                status: status,
                error: data.error,
              }));
          }
        },
        (error) => {
          alert(JSON.stringify({
            message: 'Failed to schedule read task',
            error: error,
          }));
        },
      )
    }

    const scheduleWrite = (poolName, messages) => {
      esbManager.ScheduleWrite({
        pool_name: poolName,
        messages: messages,
      },
        (status, data) => {
          switch (status) {
            case 204:
              console.log(JSON.stringify({
                message: data,
                status: 204,
              }));
              break
            default:
              alert(JSON.stringify({
                message: `Your request seems wrong for pool: ${poolName}`,
                status: status,
                error: data.error,
              }));
          }
        },
        (error) => {
          alert(JSON.stringify({
            message: 'Failed to schedule write task',
            error: error,
          }));
        },
      )
    }

    const addRecord = (poolNameIn, poolNameOut) => {
        esbManager.AddRecord({
          pool_name_in: poolNameIn,
          pool_name_out: poolNameOut,
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurPoolNameIn('');
              setCurPoolNameOut('');

              updateRecords();
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
            message: 'Failed to add pool',
            error: error,
          }));
        })
    };

    const addRecordWithMapper = (poolNameIn, poolNameOut, code) => {
        esbManager.AddRecord({
          pool_name_in: poolNameIn,
          pool_name_out: poolNameOut,
          code: code,
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurPoolNameIn('');
              setCurPoolNameOut('');
              setCurCode(mandatoryCodePrefix);

              updateRecords();
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
            message: 'Failed to add pool',
            error: error,
          }));
        })
    };

    const deleteRecord = (poolName) => {
      esbManager.DeleteRecord(poolName,
      (status, data) => {
        switch (status) {
          case 204:
            console.log(JSON.stringify({
              message: data,
              status: 204,
            }));
            updateRecords();
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
            message: 'Failed to delete pool',
            error: error,
          }));
      });
    };

    return (
    <div {...props}>
      <div className='same-row'>
        <div>
          <p><b>Connect existing message pools in ESB pair:</b></p>
        </div>

        <div>
             <>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='pool-name-in-add'>IN-Pool name:</label>
                <input
                    id='pool-name-in-add'
                    value={curPoolNameIn}
                    onChange={(e) => {
                      setFailedInput(false);

                      const newPoolName = e.target.value;

                      setCurPoolNameIn(newPoolName);
                    }}
                />
               </div>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='pool-name-out-add'>OUT-Pool name:</label>
                <input
                    id='pool-name-out-add'
                    value={curPoolNameOut}
                    onChange={(e) => {
                      setFailedInput(false);

                      const newPoolName = e.target.value;

                      setCurPoolNameOut(newPoolName);
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

               <div>
               <Button
                variant='contained'
                style={{backgroundColor: !failedInput ? 'blue' : 'red', marginBottom: '1em'}}
                onClick={() => {
                  if (curPoolNameIn.length === 0 || curPoolNameOut.length === 0) {
                    setFailedInput(true);
                    return;
                  }

                  addRecord(curPoolNameIn, curPoolNameOut);
                }}>Add ESB pair!</Button>
               </div>

               <div>
               <Button
                variant='contained'
                style={{backgroundColor: !failedInput ? 'blue' : 'red'}}
                onClick={() => {
                  if (curPoolNameIn.length === 0 || curPoolNameOut.length === 0 || curCode.length === mandatoryCodePrefix.length) {
                    setFailedInput(true);
                    return;
                  }

                  addRecordWithMapper(curPoolNameIn, curPoolNameOut, curCode);
                }}>Add ESB pair with mapper!</Button>
                </div>
             </>
        </div>
      </div>

      <div className='same-row'>
        <h3>Your ESB pairs!</h3>
        <ul>
            {records.map((record, index) => {
               return (
                <li key={`esb_record_${index}`}>
                  <div
                    style={{marginRight: '2em'}}
                    className='not-clickable'
                  >
                    {record.pool_name_in} ==&gt; {record.pool_name_out}
                  </div>
                  <Button
                    variant='outlined'
                    style={{marginRight: '1em'}}
                    onClick={() => deleteRecord(record.pool_name_in)}
                  >Delete</Button>
                  <Button variant='outlined' onClick={() => {
                    getMapperCode(record.pool_name_in);
                  }}
                  >Mapper code</Button>
                  <Button
                    variant='outlined'
                    style={{marginRight: '1em'}}
                    onClick={() => {
                      setCurMsgsPoolIn(record.pool_name_in);
                      setCurMsgsPoolOut(record.pool_name_out);
                      updateWriteMsgs(record.pool_name_in);
                      updateReadMsgs(record.pool_name_out);
                      setShowMsgsDialog(true);
                  }}
                  >Messages</Button>
                </li>
               );
            })}
        </ul>
      </div>

      <Dialog
        open={showMsgsDialog}
        fullScreen={true}
      >
        <DialogTitle>
          ESB pair ({curMsgsPoolIn} ==&gt; {curMsgsPoolOut}) messages
          <img
            src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png'
            style={closeImg}
            onClick={() => {
                setShowMsgsDialog(false);
            }}
          />
        </DialogTitle>
        <DialogContent>
            <div>
            <div
              style={{float: 'left'}}
            >
                <p>Write messages:</p>
                <Button
                  variant='outlined'
                  onClick={() => {
                    updateWriteMsgs(curMsgsPoolIn);
                  }}
                >
                Refresh</Button>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setShowWriteMsgsDialog(true);
                  }}
                >
                Send messages</Button>

                <div>
                    {
                        curWriteMsgs.length === 0
                        ? <p>No write messages yet</p>
                        :
                        <ul>
                            {curWriteMsgs.map((message, index) => {
                                return (
                                    <li key={`esb_write_msg_${index}`}>
                                    {message}
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </div>
            </div>

            <div
              style={{float: 'right'}}
            >
                <p>Read messages:</p>
                <Button
                  variant='outlined'
                  onClick={() => {
                    updateReadMsgs(curMsgsPoolOut);
                  }}
                >
                Refresh</Button>
                <Button
                  variant='outlined'
                  onClick={() => {
                    scheduleRead(curMsgsPoolOut);
                  }}
                >
                Schedule read task</Button>

                <div>
                    {
                        curReadMsgs.length === 0
                        ? <p>No read messages yet</p>
                        :
                        <ul>
                            {curReadMsgs.map((message, index) => {
                                return (
                                    <li key={`esb_read_msg_${index}`}>
                                    {message}
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </div>
            </div>
            </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showWriteMsgsDialog}
      >
        <DialogTitle>
          Send message to pool
          <img
            src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png'
            style={closeImg}
            onClick={() => {
                setCurMsgs('');
                setShowWriteMsgsDialog(false);
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{marginBottom: '1em'}}>
            <label htmlFor='write-msgs'><b>Place your messages (each newline is new message):</b></label><br/>
            <textarea
              id='write-msgs'
              value={curMsgs}
              style={{resize: 'none', backgroundColor: '#dbdbdb', height: '200px', width: '300px'}}
              onChange={({target}) => {
                setCurMsgs(target.value);
              }}
            ></textarea>
          </div>
          <Button
            variant='outlined'
            onClick={() => {
              setShowWriteMsgsDialog(false);
              const messages = curMsgs.split(/\r?\n/).filter((msg) => {
                return msg.length > 0;
              });
              console.debug(`sending messages: ${messages}`);
              scheduleWrite(curMsgsPoolIn, messages);
              setCurMsgs('');
            }}
          >Send</Button>
        </DialogContent>
      </Dialog>
    </div>
    );
}

export default EsbBrokers;
