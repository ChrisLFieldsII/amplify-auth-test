import React from 'react';
import {SafeAreaView, Text, Button} from 'react-native';
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

/* This is best case scenario as we can use the onStateChange 
    handler to change the authState and bypass Authenticator isMounted checks.
    However, in an ecosystem where we use so many 3rd party packages and those packages
    probably use a HOC there is a possibility props aren't passed down to whatever component
    might need access to onStateChange.
    ** 
    Ok there are hacky ways around this like getting the onStateChange prop
    in a comp you know has it before the props chain is broken and caching the ref
    in a Hub listener or more likely a global store
    **
*/
function LibraryThatPassesProps(props) {
  console.log(props);
  function signOut() {
    Auth.signOut()
      .then(arg => {
        props.onStateChange('signIn');
      })
      .catch(console.error);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <DevMenuTrigger>
        <Button title="Logout" onPress={signOut} />
        <Text>Content - Props!</Text>
      </DevMenuTrigger>
    </SafeAreaView>
  );
}

/* 
  This is worst case scenario and one I have come across. Using the Authenticator
  with a custom Sign Out button that calls Auth.signOut doesn't automatically navigate
  to Sign In as one would expect. Since props weren't passed we can't tap directly into
  changing authState. We can't dispatch into Hub either which would be pretty cool unless
  we hack something together as mentioned above
*/
function LibraryThatDoesntPassProps() {
  function signOut() {
    Auth.signOut()
      .then(console.log)
      .catch(console.error);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <DevMenuTrigger>
        <Button title="Logout" onPress={signOut} />
        <Text>Content - No Props</Text>
      </DevMenuTrigger>
    </SafeAreaView>
  );
}

function App(props) {
  if (props.renderPassProps) return <LibraryThatPassesProps {...props} />;
  return <LibraryThatDoesntPassProps />;
}

// This simulates an App with a good props chain! No problems in this case IF the developer
// knows that an onStateChange prop is passed down to their components and they've taken
// care to pass this down for whatever component needs access to it
function AppPassProps(props) {
  return <App {...props} renderPassProps />;
}

/* 
    This simulates an App with a bad props chain in which case we have no
    way to change the authState at all (to my knowledge!)
*/
function AppDoesntPassProps() {
  return <App renderPassProps={false} />;
}

// Toggle the exports comments to see the difference
// export default withAuthenticator(AppPassProps, !true);
export default withAuthenticator(AppDoesntPassProps, !true);
