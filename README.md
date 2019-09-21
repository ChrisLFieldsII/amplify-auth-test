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

[video](https://drive.google.com/file/d/1-CUNuEOtsuKdPhyNOnGkidy9QZ-UB1-q/view?usp=sharing)
