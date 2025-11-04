import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '530552883525-u99ph42meedfh2bpv9r5islcm3b0no4v.apps.googleusercontent.com',
});

export const signInWithGoogle = async () => {
  try {
    const userInfo = await GoogleSignin.signIn();
    const idToken = (await GoogleSignin.getTokens())?.idToken;

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);

    const user = userCredential.user;
    const token = await user.getIdToken();

    return {
      firebaseIdToken: token,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      },
    };
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
};

export const signOutFirebase = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error('Firebase sign-out error:', error);
  }
};
