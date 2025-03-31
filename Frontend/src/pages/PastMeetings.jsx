import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MasterListItem from "../components/MasterListItem";
import UserDrawer from "../components/ParticipantsList";
import { BASE_URL } from "../utils/Properties";

const Past = () => {
  const { events } = useOutletContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [eventStatuses, setEventStatuses] = useState({});

  // Fetch token from localStorage
  const token = localStorage.getItem("token");

  const handleOpenDrawer = (participants) => {
    if (!Array.isArray(participants) || participants.length === 0) return;
  
    const users = participants.map((p, index) => ({
      id: p?.user?._id || `unknown-${index}`,
      name: `${p?.user?.firstname || 'User'} ${p?.user?.lastname || ''}`.trim(),
      avatar: p?.user?.avatar || `https://randomuser.me/api/portraits/men/${index % 100}.jpg`,
    }));
  
    setSelectedUsers(users);
    setIsDrawerOpen(true);
  };

  // Handle API request for Accept/Reject
  const handleResponse = async (eventId, response) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/event/respond`,
        { eventId, response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state to show the response without requiring page refresh
      setEventStatuses(prev => ({
        ...prev,
        [eventId]: response
      }));

      toast.success(`Event ${response}ed successfully!`);
      console.log(res.data);
    } catch (error) {
      console.error("Error responding to event:", error);
      toast.error(`Failed to ${response} event. Please try again.`);
    }
  };
  
  return (
    <div>
      {events.past.length > 0 ? (
        events.past.map((event) => {
          const currentUserFirstName = event.user.firstname;
          
          // Check if the current user's first name is in participants list
          const isUserInParticipants = event.participants.some(
            (p) => p.user?.firstname === currentUserFirstName
          );

          // Get local status if available
          const localStatus = eventStatuses[event._id];
          
          // Create buttons based on current status
          let buttons = [];
          
          // If we have a local status from user interaction in this session
          if (localStatus) {
            buttons.push({ 
              type: localStatus,
              text: localStatus === "accept" ? "Accepted" : "Rejected"
            });
          } 
          // If event has a defined buttonStatus other than pending
          else if (event.buttonStatus && event.buttonStatus !== "pending") {
            buttons.push({ 
              type: event.buttonStatus,
              text: event.buttonStatus === "accepted" ? "Accepted" : "Rejected"
            });
          } 
          // If buttonStatus is pending or not defined, show accept/reject buttons
          else {
            buttons = [
              {
                type: "reject",
                onClick: () => handleResponse(event._id, "reject"),
              },
              {
                type: "accept",
                onClick: () => handleResponse(event._id, "accept"),
              },
            ];
          }

          return ( 
            <MasterListItem
              key={event._id}
              date={new Date(event.date).toDateString()}
              time={`${event.timeStart} - ${event.timeEnd}`}
              title={event.eventTopic}
              subtitle={`Hosted by ${event.hostName}`}
              buttons={buttons}
              participantCount={
                (localStatus === "accept" || event.buttonStatus === "accepted") 
                  ? event.participants?.length || 0 
                  : false
              }
              onParticipantClick={() => {
                handleOpenDrawer(event.participants);
              }}
            />
          );
        })
      ) : (
        <p>No past events</p>
      )}

      <UserDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        users={selectedUsers.length > 0 ? selectedUsers : []} 
      />
    </div>
  );
};

export default Past;