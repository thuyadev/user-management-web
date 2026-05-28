export const logsRoutes = [
  {
    path: '/activity-logs',
    name: 'ActivityLogs',
    component: () => import('./pages/ActivityLogs.vue'),
    meta: {
      title: 'Activity Logs',
      requiresAuth: true,
      permission: 'logs.view',
    },
  },
]
