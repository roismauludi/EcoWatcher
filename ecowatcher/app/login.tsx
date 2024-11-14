// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Enter email" />
      
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
      
      <Button title="Login" onPress={() => navigation.replace('MainTabs')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
