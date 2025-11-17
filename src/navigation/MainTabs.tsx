import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/HomeScreen';
import { CheckinScreen } from '../screens/CheckinScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CheckinHistoryScreen } from '../screens/CheckinHistoryScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DeleteAccountScreen } from '../screens/DeleteAccountScreen';

export type MainTabsParamList = {
  Home: undefined;
  Checkin: undefined;
  Tips: undefined;
  Reports: undefined;
  Profile: undefined;
  CheckinHistory: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

type HomeStackParamList = {
  HomeMain: undefined;
  CheckinHistory: undefined;
};

type ReportsStackParamList = {
  ReportsMain: undefined;
  CheckinHistory: undefined;
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  Help: undefined;
  About: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const ReportsStack = createStackNavigator<ReportsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const HomeStackNavigator: React.FC = () => {
  const theme = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CheckinHistory"
        component={CheckinHistoryScreen}
        options={{ title: 'Histórico de Check-ins' }}
      />
    </HomeStack.Navigator>
  );
};

const ReportsStackNavigator: React.FC = () => {
  const theme = useTheme();
  return (
    <ReportsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <ReportsStack.Screen
        name="ReportsMain"
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <ReportsStack.Screen
        name="CheckinHistory"
        component={CheckinHistoryScreen}
        options={{ title: 'Histórico de Check-ins' }}
      />
    </ReportsStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC = () => {
  const theme = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Alterar Senha' }}
      />
      <ProfileStack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ title: 'Deletar Conta' }}
      />
      <ProfileStack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: 'Ajuda' }}
      />
      <ProfileStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Sobre' }}
      />
    </ProfileStack.Navigator>
  );
};

export const MainTabs: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Checkin':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'Tips':
              iconName = focused ? 'bulb' : 'bulb-outline';
              break;
            case 'Reports':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: 'Início', headerShown: false }}
      />
      <Tab.Screen
        name="Checkin"
        component={CheckinScreen}
        options={{ title: 'Check-in', headerTitle: 'Check-in Diário' }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{ title: 'Dicas', headerTitle: 'Dicas de Autocuidado' }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsStackNavigator}
        options={{ title: 'Relatórios', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Perfil', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

