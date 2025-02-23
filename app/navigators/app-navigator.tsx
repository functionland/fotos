import React, { useContext, useEffect, useState } from 'react'
import Animated from 'react-native-reanimated'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Toast from 'react-native-toast-message'

import { navigationRef } from './navigation-utilities'
import {
  LibraryAssetsScreen,
  BoxListScreen,
  BoxAddUpdateScreen,
  HighlightScreen,
  AccountScreen,
  ShareViewerScreen,
  ImageGalleryViewerScreen,
  ConnectWalletScreen,
  CreateDIDScreen,
} from '../screens'
import { HomeNavigator } from './home-navigator'
import { ThemeContext } from '../theme'
import { BoxEntity } from '../realmdb/entities'
import { Asset, AssetStory, RecyclerAssetListSection } from '../types'

enableScreens()
export type RootStackParamList = {
  Home: undefined
  LibraryAssets: undefined
  HighlightScreen: {
    storyId: AssetStory['id']
  }
  AccountScreen: undefined
  Account: undefined
  Settings: undefined
  BoxList: {
    bloxName?: string
    bloxPeerId?: string
  }
  BoxAddUpdate: { box: Partial<BoxEntity> }
  SharedViewer: { assetURI: string }
  ImageGalleryViewer: {
    assetId: Asset['id']
    scrollToItem: (item: RecyclerAssetListSection, animated?: boolean) => void
  }
  ConnectWalletScreen: undefined
  CreateDIDScreen: undefined
}
export enum AppNavigationNames {
  HomeScreen = 'Home',
  AccountScreen = 'AccountScreen',
  LibraryAssets = 'LibraryAssets',
  BoxList = 'BoxList',
  BoxAddUpdate = 'BoxAddUpdate',
  SharedViewer = 'SharedViewer',
  HighlightScreen = 'HighlightScreen',
  ImageGalleryViewer = 'ImageGalleryViewer',
  ConnectWalletScreen = 'ConnectWalletScreen',
  CreateDIDScreen = 'CreateDIDScreen',
}

const Stack = createSharedElementStackNavigator<RootStackParamList>()

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName={AppNavigationNames.HomeScreen}
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name={AppNavigationNames.HomeScreen}
        component={HomeNavigator}
      />
      <Stack.Screen
        name={AppNavigationNames.LibraryAssets}
        component={LibraryAssetsScreen}
      />
      <Stack.Screen
        name={AppNavigationNames.BoxList}
        component={BoxListScreen}
      />
      <Stack.Screen
        name={AppNavigationNames.BoxAddUpdate}
        component={BoxAddUpdateScreen}
      />
      <Stack.Screen
        name={AppNavigationNames.HighlightScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          animationEnabled: true,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
        component={HighlightScreen}
        sharedElements={route => {
          const { storyId = '' } = route.params
          return [storyId]
        }}
      />
      <Stack.Screen
        name={AppNavigationNames.ImageGalleryViewer}
        options={{
          detachPreviousScreen: false,
          headerShown: false,
          headerTransparent: true,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            containerStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
          }),
        }}
        component={ImageGalleryViewerScreen}
        sharedElements={route => {
          const { assetId = '' } = route.params
          return [
            {
              id: assetId,
            },
          ]
        }}
      />
      <Stack.Screen
        name={AppNavigationNames.AccountScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          gestureEnabled: false,
          cardOverlayEnabled: true,
          animationEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
        component={AccountScreen}
        sharedElements={(route, otherRoute) => {
          if (
            route?.name === AppNavigationNames.AccountScreen &&
            otherRoute.name === AppNavigationNames.HomeScreen
          ) {
            return [`AccountAvatar`]
          }
        }}
      />
      <Stack.Screen
        name={AppNavigationNames.SharedViewer}
        component={ShareViewerScreen}
      />
      <Stack.Screen
        name={AppNavigationNames.ConnectWalletScreen}
        component={ConnectWalletScreen}
      />
      <Stack.Screen
        name={AppNavigationNames.CreateDIDScreen}
        component={CreateDIDScreen}
      />
    </Stack.Navigator>
  )
}

type NavigationProps = Partial<React.ComponentProps<typeof NavigationContainer>>

export function AppNavigator(props: NavigationProps) {
  const { theme } = useContext(ThemeContext)
  const [toastVisible, setToastVisible] = useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToastVisible(true)
    }, 1000)
    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
  return (
    <Animated.View style={{ flex: 1 }}>
      <NavigationContainer
        theme={theme}
        ref={navigationRef}
        linking={{
          prefixes: [
            'https://fotos.fx.land',
            'http://fotos.fx.land',
            'fotos://fotos.fx.land',
            'fotos://',
            'fxfotos://',
          ],
          config: {
            initialRouteName: AppNavigationNames.HomeScreen,
            screens: {
              [AppNavigationNames.SharedViewer]: 'shared/:jwe',
              [AppNavigationNames.BoxList]: 'addblox/:bloxName/:bloxPeerId',
            },
          },
        }}
        // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        {...props}
      >
        <AppStack />
      </NavigationContainer>
      {toastVisible && <Toast />}
    </Animated.View>
  )
}

AppNavigator.displayName = 'AppNavigator'

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['welcome']
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
