import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function LoginScreen({ navigation }: any) {
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a code verification system. Valid codes are 20 words long. Respond with "valid" or "invalid".'
            },
            {
              role: 'user',
              content: `Verify this access code: ${accessCode}`
            }
          ]
        })
      });

      const data = await response.json();
      const isValid = data.completion.toLowerCase().includes('valid');

      if (isValid) {
        navigation.replace('Home');
      } else {
        toast.error('Invalid access code. Please try again.');
      }
    } catch (error) {
      toast.error('Error verifying code. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#4ECDC4', '#45B7AF']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://api.a0.dev/assets/image?text=modern%20gaming%20logo&aspect=1:1' }}
          style={styles.logo}
        />
        <Text style={styles.title}>FLASH AI S2</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="key" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your 20-word access code"
            placeholderTextColor="#999"
            value={accessCode}
            onChangeText={setAccessCode}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Access Game</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Contact administrator for access code
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
  },
  loginButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});