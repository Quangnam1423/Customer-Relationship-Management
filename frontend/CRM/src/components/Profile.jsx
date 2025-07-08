import React from 'react';
import AuthService from '../services/auth.service';

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {currentUser.username}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Roles:</strong> {currentUser.roles.join(', ')}</p>
    </div>
  );
};

export default Profile;
