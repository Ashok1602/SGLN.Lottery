import React from 'react';
import { Redirect } from 'react-router-dom';
import { TRANSLATE } from '../constants';
// Authentication related pages
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register.js';
import ForgetPwd from '../pages/authentication/ForgetPassword.js';
import ResetPassword from '../pages/authentication/ResetPassword.jsx';
// Users related pages
import Users from '../pages/users/index.js';
// Announcement
import Announcements from '../pages/announcements';
// Dashboard
import Dashboard from '../pages/dashboard/index';
import ChangePassword from '../pages/authentication/ChangePassword';
// Request list
import RequestList from '../pages/requestProcessing';
import RequestDetails from '../pages/requestProcessing/requestDetails';
//Application settings
import ApplicationSettings from '../pages/applicationSettings';
// Document Support
import DocManagement from '../pages/docManagement';
//Notifications
import Notifications from '../pages/notifications';
//Video Training Client
import VideoTraingins from '../pages/trainings/videoTraining';
//Distance Training Client
import DistanceTraining from '../pages/trainings/distanceTraining';
//Interactive Training
import InteractiveTraining from '../pages/trainings/interactiveTraining';
//Interactive Training details
import InteractiveTrainingDetails from '../pages/trainings/interactiveTraining/InteractiveTrainingDetails';
//Training Module
import TrainingModule from '../pages/trainingModule';
//Retailer
import Retailer from '../pages/retailer';
import RetailerDetails from '../pages/retailer/RetailerDetails';
//Reports
import TrainingByModuleReport from '../pages/reports/TrainingByModule';
import TrainingByRetailerReport from '../pages/reports/TrainingByRetailer';
import ReportByIncentive from '../pages/reports/ReportByIncentive';
import GenerateRatioReport from '../pages/reports/RatioRequests';
import GenerateRequestReport from '../pages/reports/Requests';
import generateTimeReports from '../pages/reports/TimeRequests';
import getRetailerReport from "../pages/reports/RetailerReport";
//incentive Module
import IncentiveModule from '../pages/incentive';
//Request categories
import RequestCategories from '../pages/requestCategory';

import { confirmPermissions } from '../helpers';

const userRoutes = [
  {
    path: '/dashboard',
    component: Dashboard,
    name: TRANSLATE.t('SIDEBAR_MENU.DASHBOARD'),
    icon: 'bx bx-home-circle',
  },
  {
    path: '/requests',
    component: RequestList,
    name: TRANSLATE.t('REQUESTS.REQUESTS'),
    icon: 'mdi mdi-clipboard-list-outline',
    hide: !confirmPermissions('CanGetRequests'),
  },
  {
    path: '/retailer',
    component: Retailer,
    name: TRANSLATE.t('SIDEBAR_MENU.RETAILERS'),
    icon: 'bx bx-user',
    hide: !confirmPermissions('CanGetRetailers'),
  },
  {
    name: TRANSLATE.t('SIDEBAR_MENU.TRAINING'),
    icon: 'bx bx-chalkboard',
    hide: !confirmPermissions('CanGetTrainings'),
    submenu: [
      {
        path: '/videoTrainings',
        component: VideoTraingins,
        name: TRANSLATE.t('TRAININGS.TITLE'),
        icon: 'bx bx-video',
      },
      {
        path: '/distanceTrainings',
        component: DistanceTraining,
        name: TRANSLATE.t('TRAININGS.DISTANCE_TRAINING'),
        icon: 'bx bx-chalkboard',
      },
      {
        path: '/interactiveTraining',
        component: InteractiveTraining,
        name: TRANSLATE.t('TRAININGS.INTERACTIVE_TRAINING'),
        icon: 'bx bx-transfer-alt',
      },
    ],
  },
  {
    path: '/announcements',
    component: Announcements,
    name: TRANSLATE.t('SIDEBAR_MENU.ANNOUNCEMENTS'),
    icon: 'bx bx-news',
    hide: !confirmPermissions('CanGetAnnouncements'),
  },
  {
    path: '/docs',
    component: DocManagement,
    name: TRANSLATE.t('DOC_SUPPORT.TITLE'),
    icon: 'bx bxs-file',
    hide: !confirmPermissions('CanGetApplicationDocuments'),
  },
  {
    path: '/notifications',
    component: Notifications,
    name: TRANSLATE.t('NOTIFICATION.NOTIFICATIONS'),
    icon: 'bx bx-bell',
    hide: !confirmPermissions('CanGetNotifications'),
  },
  {
    name: TRANSLATE.t('REPORT.REPORTS'),
    icon: 'bx bxs-report',
    hide: !(confirmPermissions('CanGetTrainingsByModuleReport') || confirmPermissions('CanGetTrainingsByRetailerReport') || confirmPermissions('CanGetIncentivesReport')),
    submenu: [
      {
        path: '/report/TrainingByModuleReport',
        component: TrainingByModuleReport,
        name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_BY_MODULE'),
        icon: 'bx bxs-report',
        hide: !confirmPermissions('CanGetTrainingsByModuleReport'),
      },
      {
        path: '/report/TrainingByRetailerReport',
        component: TrainingByRetailerReport,
        name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_BY_RETAILER'),
        icon: 'bx bxs-report',
        hide: !confirmPermissions('CanGetTrainingsByRetailerReport'),
      },
      {
        path: '/report/IntenciveReport',
        component: ReportByIncentive,
        name: TRANSLATE.t('SIDEBAR_MENU.REPORTS_BY_INCENTIVE'),
        hide: !confirmPermissions('CanGetIncentivesReport'),
      },

      {
        path: '/report/generateRatioRequestReport',
        component: GenerateRatioReport,
        name: TRANSLATE.t('REPORT.RATIO_REQESTS'),
        icon: 'bx bxs-report',
        // hide: !confirmPermissions("CanGetTrainingsByModuleReport"),
      },
      {
        path: '/report/generateRequestReport',
        component: GenerateRequestReport,
        name: TRANSLATE.t('REPORT.REQUEST'),
        icon: 'bx bxs-report',
        // hide: !confirmPermissions("CanGetTrainingsByRetailerReport"),
      },
      {
        path: '/report/generateTimeProcessingReport',
        component: generateTimeReports,
        name: TRANSLATE.t('REPORT.TIME_PROCESSING_MENU'),
        icon: 'bx bxs-report',
        // hide: !confirmPermissions("CanGetIncentivesReport"),
      },
      {
        path: '/report/retailerReport',
        component: getRetailerReport,
        name: TRANSLATE.t('REPORT.DASHBOARD_RETAILER'),
        icon: 'bx bxs-report',
        // hide: !confirmPermissions("CanGetIncentivesReport"),
      }
    ],
  },
  {
    path: '/incentiveModule',
    component: IncentiveModule,
    name: TRANSLATE.t('SIDEBAR_MENU.INCENTIVE'),
    icon: 'bx bx-trophy',
    hide: !confirmPermissions('CanGetIncentives'),
  },
  {
    path: '/users',
    component: Users,
    name: TRANSLATE.t('SIDEBAR_MENU.USERS'),
    icon: 'bx bx-user-circle',
    hide: !confirmPermissions('CanGetUsers'),
  },
  {
    name: TRANSLATE.t('SIDEBAR_MENU.OBJECT_SETTING'),
    icon: 'bx bx-cog',
    hide: !(confirmPermissions('CanGetRequestObjects') || confirmPermissions("CanGetRequestCategories") || confirmPermissions('CanGetTrainingModules')),
    submenu: [
      {
        path: '/app-settings',
        component: ApplicationSettings,
        name: TRANSLATE.t('APP_SETTINGS.APP_SETTINGS'),
        icon: 'bx bx-cog',
        hide: !confirmPermissions('CanGetRequestObjects'),
      },
      {
        path: '/requestCategory',
        component: RequestCategories,
        name: TRANSLATE.t('SIDEBAR_MENU.REQUEST_CATEGORY'),
        icon: 'bx bx-cog',
        hide: !confirmPermissions("CanGetRequestCategories"),
      },
      {
        path: '/trainingModule',
        component: TrainingModule,
        name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_MODULE'),
        icon: 'bx bx-task',
        hide: !confirmPermissions('CanGetTrainingModules'),
      },
    ],
  },
  {
    path: '/change-password',
    hide: true,
    component: ChangePassword,
    name: 'change-password',
  },
  //here on words hide = true
  {
    path: '/trainingModule',
    component: TrainingModule,
    name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_MODULE'),
    icon: 'bx bx-task',
    hide: true,
  },
  {
    path: '/app-settings',
    component: ApplicationSettings,
    name: TRANSLATE.t('APP_SETTINGS.APP_SETTINGS'),
    icon: 'bx bx-cog',
    hide: true,
  },
  {
    path: '/requestCategory',
    component: RequestCategories,
    name: TRANSLATE.t('SIDEBAR_MENU.REQUEST_CATEGORY'),
    icon: 'bx bx-cog',
    hide: true,
  },
  {
    path: '/requestDetails/:id',
    hide: true,
    component: RequestDetails,
    name: 'RequestDetails',
  },
  {
    path: '/retailerDetails/:id',
    hide: true,
    component: RetailerDetails,
    name: TRANSLATE.t('RETAILER.RETAILER'),
  },
  {
    path: '/videoTrainings',
    hide: true,
    component: VideoTraingins,
    name: TRANSLATE.t('TRAININGS.TITLE'),
    icon: 'bx bx-video',
  },
  {
    path: '/distanceTrainings',
    hide: true,
    component: DistanceTraining,
    name: TRANSLATE.t('TRAININGS.DISTANCE_TRAINING'),
    icon: 'bx bx-chalkboard',
  },
  {
    path: '/interactiveTraining',
    hide: true,
    component: InteractiveTraining,
    name: TRANSLATE.t('TRAININGS.INTERACTIVE_TRAINING'),
    icon: 'bx bx-transfer-alt',
  },
  {
    path: '/interactiveTrainingDetails',
    hide: true,
    component: InteractiveTrainingDetails,
  },
  {
    path: '/report/TrainingByModuleReport',
    component: TrainingByModuleReport,
    name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_BY_MODULE'),
    icon: 'bx bxs-report',
    hide: true,
  },
  {
    path: '/report/TrainingByRetailerReport',
    component: TrainingByRetailerReport,
    name: TRANSLATE.t('SIDEBAR_MENU.TRAINING_BY_RETAILER'),
    icon: 'bx bxs-report',
    hide: true,
  },
  {
    path: '/report/IntenciveReport',
    component: ReportByIncentive,
    name: TRANSLATE.t('SIDEBAR_MENU.REPORTS_BY_INCENTIVE'),
    hide: true,
  },

  {
    path: '/report/generateRatioRequestReport',
    component: GenerateRatioReport,
    name: 'Ratio Requests',
    icon: 'bx bxs-report',
    hide: true,
  },
  {
    path: '/report/generateRequestReport',
    component: GenerateRequestReport,
    name: 'Requests',
    icon: 'bx bxs-report',
    hide: true,
  },
  {
    path: '/report/generateTimeProcessingReport',
    component: generateTimeReports,
    name: 'Time Process Requestes',
    icon: 'bx bxs-report',
    hide: true,
  },
  {
    path: '/report/retailerReport',
    component: getRetailerReport,
    name: 'Retailer Report',
    icon: 'bx bxs-report',
    hide: true,
  },
  // this route should be at the end of all other routes
  {
    path: '/',
    exact: true,
    hide: true,
    component: () => <Redirect to='/dashboard' />,
  },
];
//InteractiveTrainingDetails
const authRoutes = [
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgetPwd },
  { path: '/register', component: Register },
  { path: '/reset-password', component: ResetPassword },
];

export { userRoutes, authRoutes };
