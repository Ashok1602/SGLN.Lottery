/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIos from '@react-native-community/push-notification-ios';

import {NOTIFICATION_CONSTANTS} from '../../redux/notification/notification-constant';
import {New_Notification} from '../../redux/notification/notification-action';

export const InitializeNotifications = dispatch => {
  const CallingNotification = () => {
    dispatch(
      New_Notification(NOTIFICATION_CONSTANTS.NEW_NOTIFICATION, {
        data: true,
      }),
    );
  };
  messaging()
    .requestPermission()
    .then(authStatus => {
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Message handled in the background! : ', remoteMessage);
        });

        messaging().onTokenRefresh(token => {
          console.log('messaging.onTokenRefresh: ', token);
        });

        messaging().subscribeToTopic('notified');

        messaging().subscribeToTopic('all');

        fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
          if (Platform.OS === 'ios') {
            PushNotificationIos.addNotificationRequest({
              id: remoteMessage.messageId,
              body: remoteMessage.notification.body,
              title: remoteMessage.notification.title,
              userInfo: remoteMessage.data,
            });
          }
          console.log('A new FCM message arrived!', remoteMessage);
        });

        // When a user tap on a push notification and the app is in background
        backgroundNotificationListener = messaging().onNotificationOpenedApp(
          async remoteMessage => {
            console.log('Background Push Notification opened');
          },
        );

        // When a user tap on a push notification and the app is CLOSED
        closedAppNotificationListener = messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('App Closed Push Notification opened');
            }
          });

        // When a user receives a push notification and the app is in foreground
        onMessageListener = messaging().onMessage(() => {
          CallingNotification();
          console.log('Foreground Push Notification opened');
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
          );
        });

        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage,
              );
            }
          });
      } else {
        console.log('requestPermission Denied');
      }
    })
    .catch(err => {
      console.log('messaging.requestPermission Error: ', err);
    });
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  var fcmToken;
  if (enabled) {
    await messaging()
      .getToken()
      .then(token => {
        fcmToken = token;
      });
    return fcmToken;
  }
};
