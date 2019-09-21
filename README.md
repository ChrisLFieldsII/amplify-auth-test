# Project

Created with `react-native init`

# Setup

- Clone repo
- install modules with `yarn install` or `npm install`
- `cd ios` and then `pod install`
- run on your device/simulator ([docs](https://facebook.github.io/react-native/docs/getting-started))

# Description

Example repo for an issue within the AWS Amplify library, specifically `aws-amplify-react-native` where using the drop-in `withAuthenticator` HOC and a custom Sign Out button that calls `Auth.signOut()` fails to change the Authenticators `authState` causing the User to appear as if they are still signed in.

# Video of the Problem in Question

The video shows Signing in using the `withAuthenticator` HOC and Signing out with a custom button and `Auth.signOut()`.
After clicking the Logout button the User still sees the screens as if they are signed in.
On an app reload, it is detected that the User has been logged out finally.

[Click here for Video](https://drive.google.com/file/d/1-CUNuEOtsuKdPhyNOnGkidy9QZ-UB1-q/view?usp=sharing)

# Possible Solutions

- (BEST IMO) onHubCapsule in the Authenticator listens especially for the `signOut` payload to set the `authState`

```
onHubCapsule(capsule) {
    const {channel, payload, source} = capsule;
    if (channel === 'auth') {
      // calling Auth.signOut() automatically dispatches Hub payload to Auth channel with signOut event
      if (payload.event === 'signOut') {
        // due this to circumvent isMounted checks in checkUser() as signOut is a case we want Authenticator
        // to take over even though it isnt mounted
        this.setState({authState: 'signIn', authData: null, error: null});
        if (this.props.onStateChange) {
          this.props.onStateChange('signIn', null);
        }
      }
    } else {
      this.checkUser(payload);
    }
  }
```

- allow developers to `Hub.dispatch()` and directly set the `authState` if needed
