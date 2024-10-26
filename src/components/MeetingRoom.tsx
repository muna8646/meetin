import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, Settings, PhoneOff } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const MeetingRoom = () => {
  // Mock user data (in production, this would come from authentication)
  const userId = 'user-' + Math.random().toString(36).substr(2, 9);
  const userName = 'User ' + userId.slice(-4);
  const roomId = 'room-1'; // In production, this would come from URL or room creation

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Michael Ross', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 3, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ]);

  const { joinRoom, leaveRoom, updateStream } = useSocket(roomId, userId, userName);

  useEffect(() => {
    // Join the room when component mounts
    joinRoom();

    // Leave the room when component unmounts
    return () => {
      leaveRoom();
    };
  }, [joinRoom, leaveRoom]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    updateStream(roomId, userId, 'audio', !isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    updateStream(roomId, userId, 'video', !isVideoOn);
  };

  const handleEndCall = () => {
    leaveRoom();
    // In production, add navigation logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Virtual Meeting Room</h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Meeting Active
            </span>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
              Invite Others
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Video */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-4">
            <div className="aspect-video bg-gray-700 rounded-lg relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
                alt="Main speaker"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 px-3 py-1 rounded-lg">
                You (Host)
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">Participants</h2>
            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleMuteToggle}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button
                onClick={handleVideoToggle}
                className={`p-3 rounded-full ${
                  !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Share size={24} />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Users size={24} />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <MessageSquare size={24} />
              </button>
              <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                <Settings size={24} />
              </button>
            </div>
            <button 
              onClick={handleEndCall}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full flex items-center space-x-2"
            >
              <PhoneOff size={20} />
              <span>End Call</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetingRoom;