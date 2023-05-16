import React, { useEffect, useState} from 'react';

import { Button } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import { PoolBrokersManager } from './managers/pool_brokers_manager';

function KafkaBrokers(props) {
    let manager = new PoolBrokersManager();

    let closeImg = {cursor:'pointer', float:'right', marginTop: '5px', width: '20px'};

    const [pools, setPools] = useState([]);

    const [curPoolName, setCurPoolName] = useState('');
    const [curTopicName, setCurTopicName] = useState('');
    
    const [curReadMsgs, setCurReadMsgs] = useState([]);
    const [curWriteMsgs, setCurWriteMsgs] = useState([]);

    const [curMsgsPool, setCurMsgsPool] = useState('');
    const [showMsgsDialog, setShowMsgsDialog] = useState(false);

    const [curMsgs, setCurMsgs] = useState('');
    const [showWriteMsgsDialog, setShowWriteMsgsDialog] = useState(false);

    const [failedInput, setFailedInput] = useState(false);

    const updatePools = () => {
      manager.List(
        (status, data) => {
          switch (status) {
            case 200:
              setPools(
                data.pools.filter((pool) => {
                    return pool.broker === 'kafka';
                })
              );
              console.debug('Pools updated!');
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
          message: 'Failed to update pools',
          error: error,
        }));
      });
    }
    useEffect(() => {
      updatePools();
    }, []);

    const getPoolConfig = (poolName) => {
      manager.GetConfig(poolName,
        (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              alert(JSON.stringify(data));
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
            message: 'Failed to get config',
            error: error,
          }));
        },
      )
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
      manager.ScheduleWrite({
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

    const addPool = (poolName, topicName) => {
        manager.AddPool({
          pool_name: poolName,
          topic_name: topicName,
          broker: "kafka"
        }, (status, data) => {
          switch (status) {
            case 200:
              console.log(JSON.stringify({
                message: data,
                status: 200,
              }));
              setCurPoolName('');
              setCurTopicName('');

              updatePools();
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

    const deletePool = (poolName) => {
      manager.DeletePool(poolName,
      (status, data) => {
        switch (status) {
          case 204:
            console.log(JSON.stringify({
              message: data,
              status: 204,
            }));
            updatePools();
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
          <p><b>Type message pool that you want to mock:</b></p>
        </div>

        <div>
             <>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='pool-name-add'>Pool name:</label>
                <input
                    id='pool-name-add'
                    value={curPoolName}
                    onChange={(e) => {
                      setFailedInput(false);

                      const newPoolName = e.target.value;

                      setCurPoolName(newPoolName);
                    }}
                />
               </div>
               <div style={{marginBottom: '1em'}}>
                <label htmlFor='topic-name-add'>Topic name:</label>
                <input
                    id='topic-name-add'
                    value={curTopicName}
                    onChange={(e) => {
                      setFailedInput(false);

                      const newTopicName = e.target.value;

                      setCurTopicName(newTopicName);
                    }}
                />
               </div>

               <Button
                variant='contained'
                style={{backgroundColor: !failedInput ? 'blue' : 'red'}}
                onClick={() => {
                  if (curPoolName.length === 0 || curTopicName.length === 0) {
                    setFailedInput(true);
                    return;
                  }

                  addPool(curPoolName, curTopicName);
                }}>Add pool!</Button>
             </>
        </div>
      </div>

      <div className='same-row'>
        <h3>Your pools!</h3>
        <ul>
            {pools.map((pool, index) => {
               return (
                <li key={`kafka_pool_${index}`}>
                  <div
                    style={{marginRight: '2em'}}
                    className='not-clickable'
                  >
                    name: {pool.pool_name}, topic: {pool.topic_name}
                  </div>
                  <Button
                    variant='outlined'
                    style={{marginRight: '1em'}}
                    onClick={() => deletePool(pool.pool_name)}
                  >Delete</Button>
                  <Button variant='outlined' onClick={() => {
                    getPoolConfig(pool.pool_name);
                  }}
                  >Get Config</Button>
                  <Button
                    variant='outlined'
                    style={{marginRight: '1em'}}
                    onClick={() => {
                      setCurMsgsPool(pool.pool_name);
                      updateReadMsgs(pool.pool_name);
                      updateWriteMsgs(pool.pool_name);
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
          Pool {curMsgsPool} messages
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
                    updateWriteMsgs(curMsgsPool);
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
                                    <li key={`kafka_write_msg_${index}`}>
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
                    updateReadMsgs(curMsgsPool);
                  }}
                >
                Refresh</Button>
                <Button
                  variant='outlined'
                  onClick={() => {
                    scheduleRead(curMsgsPool);
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
                                    <li key={`kafka_read_msg_${index}`}>
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
              scheduleWrite(curMsgsPool, messages);
              setCurMsgs('');
            }}
          >Send</Button>
        </DialogContent>
      </Dialog>
    </div>
    );
}

export default KafkaBrokers;
