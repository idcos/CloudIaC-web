import React, { useState, useEffect } from 'react';
import { useEventSource } from "utils/hooks";
import AnsiCoderCard from "components/coder/ansi-coder-card";

export default ({ id, orgId, projectId }) => {

  const [ taskLog, setTaskLog ] = useState([]);
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    fetchSse();
  }, []);

  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  const fetchSse = () => {
    evtSourceInit(
      {
        onmessage: (data) => {
          setTaskLog((prevLog) => [ ...prevLog, data ]);
        }
      },
      {
        url: `/api/v1/tasks/${id}/log/sse`,
        options: 
        { 
          withCredentials: true,
          headers: {
            'IaC-Org-Id': orgId,
            'IaC-Project-Id': projectId,
            'Authorization': window.localStorage.getItem('accessToken')
          }
        }
      }
    );
  };

  return (
    <AnsiCoderCard  
      value={taskLog} 
      style={{ height: '100%' }}
    />
  );
}