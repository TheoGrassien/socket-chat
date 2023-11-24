import { useEffect } from 'react';

const Notification = ({ title, content, onClose }) => {
  useEffect(() => {
    setTimeout(onClose, 4000);
  }, []);

  return (
    <div className="notification">
      <div className="close" onClick={onClose}>
        Fermer
      </div>
      <strong>{title}</strong>
      <p>{content}</p>
    </div>
  );
};

export default Notification;
