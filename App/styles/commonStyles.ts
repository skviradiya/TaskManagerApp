import { StyleSheet } from 'react-native';
import colors from '@App/constants/colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: colors.darkText,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    color: colors.primaryMain,
  },
}); 