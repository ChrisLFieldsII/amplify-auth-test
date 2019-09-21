import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import {withAuthenticator} from 'aws-amplify-react-native';
import Amplify, {Auth} from 'aws-amplify';

import DevMenuTrigger from './DevMenuTrigger';
import './.env';

Amplify.Logger.LOG_LEVEL = 'DEBUG';

const {
  AWS_IDENTITY_POOL_ID,
  AWS_USER_POOL_ID,
  AWS_USER_POOL_CLIENT_ID,
  AWS_REGION,
} = process.env;

Amplify.configure({
  Auth: {
    identityPoolId: AWS_IDENTITY_POOL_ID,
    region: AWS_REGION,
    userPoolId: AWS_USER_POOL_ID,
    userPoolWebClientId: AWS_USER_POOL_CLIENT_ID,
  },
});

function App() {
  function signOut() {
    Auth.signOut()
      .then(console.log)
      .catch(console.error);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <DevMenuTrigger>
        <Button title="Logout" onPress={signOut} />
        <Text>Content</Text>
      </DevMenuTrigger>
    </SafeAreaView>
  );
}

export default withAuthenticator(App, !true);
