



import React, { useState, useEffect, useRef } from 'react';
import { X, Check, X as XIcon, Trash2, Ban } from 'lucide-react';
import '../styles/ParticipationList.css';




const UserDrawer = ({
  isOpen,
  onClose,
  users,
  onAccept,
  onReject,
  onDelete,
  showActions = true,
}) => {
  const [localUsers, setLocalUsers] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef(null);
  // const { toast } = useToast();

  useEffect(() => {
    setLocalUsers(users.map(user => ({ ...user, selected: false })));
  }, [users]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target) && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const toggleUserSelection = (userId) => {
    setLocalUsers(
      localUsers.map((user) =>
        user.id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const handleAccept = () => {
    const selectedUsers = localUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      // toast({
      //   title: "No participants selected",
      //   description: "Please select at least one participant",
      //   variant: "destructive",
      // });
      return;
    }
    onAccept?.(selectedUsers);
    // toast({
    //   title: "Participants accepted",
    //   description: `${selectedUsers.length} participants have been accepted`,
    // });
    handleClose();
  };

  const handleReject = () => {
    const selectedUsers = localUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      // toast({
      //   title: "No participants selected",
      //   description: "Please select at least one participant",
      //   variant: "destructive",
      // });
      return;
    }
    onReject?.(selectedUsers);
    // toast({
    //   title: "Participants rejected",
    //   description: `${selectedUsers.length} participants have been rejected`,
    //   variant: "destructive",
    // });
    handleClose();
  };

  const handleDelete = () => {
    const selectedUsers = localUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      // toast({
      //   title: "No participants selected",
      //   description: "Please select at least one participant",
      //   variant: "destructive",
      // });
      return;
    }
    
    selectedUsers.forEach(user => {
      onDelete?.(user.id);
    });
    
    // toast({
    //   title: "Participants removed",
    //   description: `${selectedUsers.length} participants have been removed`,
    // });
  };

  if (!isOpen && !isClosing) return null;

  const selectedCount = localUsers.filter(user => user.selected).length;

  return (
    <div className={`drawer-overlay ${isClosing ? 'closing' : ''}`}>
      <div ref={drawerRef} className={`drawer ${isClosing ? 'closing' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title-section">
            <div className="drawer-title">
              Participant <span className="participant-count">{localUsers.length}</span>
            </div>
          </div>
          
          <div className="header-actions">
            {showActions && selectedCount > 0 && (
              <>
                {onDelete && (
                  <button 
                    className="delete-button" 
                    onClick={handleDelete}
                    aria-label="Delete selected users"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                {onReject && (
                  <button className="action-button reject-button" onClick={handleReject}>
                    <Ban size={14} /> 
                    {/* {selectedCount > 0 && selectedCount} */}
                    Reject
                  </button>
                )}
                
                {onAccept && (
                  <button className="action-button accept-button" onClick={handleAccept}>
                    <Check size={14} /> 
                    {/* {selectedCount > 0 && selectedCount} */}
                    Accept
                  </button>
                )}
              </>
            )}
            
            <button className="drawer-close" onClick={handleClose} aria-label="Close drawer">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="drawer-content">
          <ul className="user-list">
            {localUsers.map((user) => (
              <li key={user.id} className="user-item">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="user-details">
                  <h3 className="user-name">{user.name}</h3>
                </div>
                <div className="user-actions">
                  <label className="user-checkbox">
                    <input
                      type="checkbox"
                      checked={user.selected}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDrawer;
