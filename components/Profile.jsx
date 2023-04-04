import { Button } from '@rneui/themed';
import {
  TextInput,
  View,
  Image,
  Text,
  Pressable,
  SafeAreaView,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles.js';
import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/getUserProfile.js';
import { patchUserProfile } from '../api/patchUserProfile.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Profile = ({ usernameForProfile }) => {
  usernameToDisplay = usernameForProfile || 'Carces';
  const [newUserTag, setNewUserTag] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAge, setCurrentUserAge] = useState('');
  const [currentUserGender, setCurrentUserGender] = useState('');
  const [currentUserInterests, setCurrentUserInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function addInterest() {
    setCurrentUserInterests((previous) => [...previous, newUserTag]);
    patchUserProfile(usernameToDisplay, null, null, null, [newUserTag]);
  }

  function removeInterest(interest) {
    const updatedInterests = [...currentUserInterests];
    updatedInterests.splice(updatedInterests.indexOf(interest), 1);
    setCurrentUserInterests(updatedInterests);
    patchUserProfile(usernameToDisplay, null, null, null, [`-${interest}`]);
  }

  useEffect(() => {
    setIsLoading(true);
    getUserProfile(usernameToDisplay).then((fetchedProfile) => {
      const {
        Item: { name, age, gender, interests },
      } = fetchedProfile;
      const nameValue = name ? name.S : null;
      const ageValue = age ? age.N : null;
      const genderValue = gender ? gender.S : null;
      const interestsValue = interests ? interests.S.split(',') : null;
      if (name) setCurrentUserName(nameValue);
      if (age) setCurrentUserAge(ageValue);
      if (gender) setCurrentUserGender(genderValue);
      if (interests) setCurrentUserInterests(interestsValue);
      setIsLoading(false);
    });
  }, [usernameToDisplay]);

  if (isLoading) return <ActivityIndicator />;

  const interestsButtons = !currentUserInterests
    ? null
    : currentUserInterests.map((interest, index) => {
        return (
          <Button
            key={index}
            style={styles.Profile_InterestButton}
            onPress={() => removeInterest(interest)}
          >
            {interest}
          </Button>
        );
      });

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.LandingPage_View}
      scrollEnabled={true}
    >
      <View style={styles.Profile_View}>
        <Text style={{ fontWeight: 'bold', fontSize: 15, paddingBottom: 20 }}>
          Filling out your profile helps you match with more buddies. Get
          started now!
        </Text>
        <Image
          source={{ uri: 'https://source.unsplash.com/random' }}
          style={styles.Profile_Image}
        />
        <Text style={styles.Profile_username}>{usernameToDisplay}</Text>

        {currentUserAge ? <Text>Age: {currentUserAge} </Text> : null}
        {currentUserName ? <Text>Name: {currentUserName} </Text> : null}
        {currentUserGender ? <Text>Gender: {currentUserGender}</Text> : null}
        <Text style={styles.Profile_CurrentUserInterests}>
          Interests: {interestsButtons || 'none'}
        </Text>
        <Text style={styles.Profile_AddToUserInterests}>
          Add to your interests:
        </Text>
        <TextInput
          value={newUserTag}
          onChangeText={(newUserTag) => {
            setNewUserTag(newUserTag);
          }}
          style={styles.Profile_TextInput}
          placeholder="Type here ... e.g. food-lover, travellor, Spanish  "
        />

        <View style={{ paddingTop: 10 }}>
          <TouchableHighlight
            style={styles.Profile_Buttons}
            onPress={addInterest}
          >
            <Text style={styles.Profile_Buttons_Text}>Add interest</Text>
          </TouchableHighlight>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Profile;

/*
<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20, borderRadius: 1, }}>
          <Button color="#ec8e2f" title="Submit" borderRadius="1" inClick={() => {setCurrentUserTags(currentUserTags + newUserTag)}}/>
        </View>
*/
