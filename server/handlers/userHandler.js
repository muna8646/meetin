export const userHandler = (io, socket, users) => {
  const updateUserStatus = ({ userId, status }) => {
    const user = users.get(userId);
    if (user) {
      user.status = status;
      // Broadcast status update to relevant rooms
      user.rooms?.forEach(roomId => {
        io.to(roomId).emit('user-status-changed', {
          userId,
          status
        });
      });
    }
  };

  const setUserProfile = ({ userId, profile }) => {
    const user = users.get(userId) || {};
    users.set(userId, {
      ...user,
      ...profile,
      socketId: socket.id
    });
  };

  // Handle user settings
  const updateUserSettings = ({ userId, settings }) => {
    const user = users.get(userId);
    if (user) {
      user.settings = {
        ...user.settings,
        ...settings
      };
      socket.emit('settings-updated', user.settings);
    }
  };

  // Register event handlers
  socket.on('update-status', updateUserStatus);
  socket.on('set-profile', setUserProfile);
  socket.on('update-settings', updateUserSettings);
};