import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { setUserLoading } from './actions'; // Import the action creator to set user loading state
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the authentication method

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLoading, setUserLoading] = useState(false); // Manually manage user loading state
  const dispatch = useDispatch(); // Initialize useDispatch hook to dispatch actions

  const handleSubmit = async () => {
    if (email && password) {
      // good to go
      try {
        setUserLoading(true); // Set user loading state to true
        await signInWithEmailAndPassword(auth, email, password); // Sign in with email and password
        setUserLoading(false); // Set user loading state to false after successful sign in
      } catch (e) {
        setUserLoading(false); // Set user loading state to false in case of error
        // Handle error
      }
    } else {
      // Show error
    }
  };

  // Render your component
}
