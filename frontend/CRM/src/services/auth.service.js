import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.token || response.data.accessToken) {
          // Ensure both token and accessToken are available for consistency
          const token = response.data.token || response.data.accessToken;
          response.data.token = token;
          response.data.accessToken = token;
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('User data saved to localStorage:', response.data);
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, password) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Retrieved user from localStorage:', user);
        return user;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated and token is valid
  isAuthenticated() {
    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    // Check if we have a token
    const token = user.token || user.accessToken;
    if (!token) {
      return false;
    }

    // Check if token is expired (optional - implement JWT decode if needed)
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (tokenPayload.exp < currentTime) {
        console.log('Token expired');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  // Auto-login using stored token
  autoLogin() {
    return new Promise((resolve) => {
      const user = this.getCurrentUser();
      if (user && this.isAuthenticated()) {
        console.log('Auto-login successful with stored token');
        resolve(user);
      } else {
        console.log('Auto-login failed - no valid token');
        resolve(null);
      }
    });
  }

  // Verify token with backend (optional)
  verifyToken() {
    const user = this.getCurrentUser();
    const token = user?.token || user?.accessToken;
    if (!user || !token) {
      return Promise.reject('No token found');
    }

    return axios.get(API_URL + 'verify', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(response => {
      return response.data;
    }).catch(error => {
      console.error('Token verification failed:', error);
      this.logout();
      throw error;
    });
  }
}

export default new AuthService();
