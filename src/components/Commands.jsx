import { useEffect, useState } from 'react';
import { socket } from '@/utils/socket';

const Commands = () => {
  const [sounds, setSounds] = useState({});

  useEffect(() => {
    setSounds({
      tempete: new Audio('/assets/sounds/tempete.mp3'),
      arrah: new Audio('/assets/sounds/arrah.mp3'),
    });
  }, []);

  useEffect(() => {
    const onCommand = (command) => {
      switch (command) {
        case '/tempete':
          sounds.tempete.currentTime = 0;
          sounds.tempete.play();
          break;

        case '/arrah':
          sounds.arrah.currentTime = 0;
          sounds.arrah.play();
          break;

        default:
          break;
      }
    };

    socket.on('command', onCommand);

    return () => {
      socket.off('command', onCommand);
    };
  }, [sounds]);

  return <div></div>;
};

export default Commands;
