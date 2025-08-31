// Mock data for TaskKita app

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Citizen',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    badges: {
      cleanupHours: 25,
      tasksCompleted: 8
    },
    bio: 'Active community member helping keep our barangay clean',
    joinDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Worker',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    badges: {
      cleanupHours: 45,
      tasksCompleted: 15
    },
    bio: 'Professional environmental worker with 3 years experience',
    joinDate: '2022-03-10',
    hourlyRate: 150,
    specializations: ['Waste Management', 'Drainage Cleaning', 'Street Sweeping']
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'admin@lgu.gov.ph',
    role: 'LGU',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    badges: {
      cleanupHours: 0,
      tasksCompleted: 0
    },
    bio: 'LGU Administrator managing community cleanup initiatives',
    joinDate: '2021-01-01'
  }
];

export const mockReports = [
  {
    id: '1',
    title: 'Garbage pile in Barangay 1',
    description: 'Large pile of mixed waste near the basketball court',
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: 'Barangay 1, Manila'
    },
    photos: ['https://via.placeholder.com/300x200'],
    status: 'pending',
    submittedBy: '1',
    submittedAt: '2024-01-15T10:30:00Z',
    type: 'waste'
  },
  {
    id: '2',
    title: 'Drainage clogged in Barangay 2',
    description: 'Drainage system blocked with plastic waste',
    location: {
      latitude: 14.6000,
      longitude: 120.9850,
      address: 'Barangay 2, Manila'
    },
    photos: ['https://via.placeholder.com/300x200'],
    status: 'approved',
    submittedBy: '2',
    submittedAt: '2024-01-14T15:45:00Z',
    type: 'drainage'
  },
  {
    id: '3',
    title: 'Illegal dumping in vacant lot',
    description: 'Construction waste dumped in vacant lot',
    location: {
      latitude: 14.5980,
      longitude: 120.9830,
      address: 'Barangay 3, Manila'
    },
    photos: ['https://via.placeholder.com/300x200'],
    status: 'converted_to_task',
    submittedBy: '1',
    submittedAt: '2024-01-13T09:15:00Z',
    type: 'construction'
  }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Cleanup Barangay 1 Basketball Court',
    description: 'Remove garbage pile and clean the area',
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: 'Barangay 1, Manila'
    },
    date: '2024-01-20',
    time: '08:00',
    duration: '4 hours',
    slots: {
      total: 20,
      filled: 15,
      available: 5
    },
    requiredOutfit: 'Safety vest, gloves, face mask',
    providedGear: 'Trash bags, brooms, shovels',
    status: 'active',
    payment: 500,
    applicants: ['1', '2'],
    approvedWorkers: ['1'],
    reportId: '1'
  },
  {
    id: '2',
    title: 'Drainage Cleaning Barangay 2',
    description: 'Unclog drainage system and remove waste',
    location: {
      latitude: 14.6000,
      longitude: 120.9850,
      address: 'Barangay 2, Manila'
    },
    date: '2024-01-22',
    time: '07:00',
    duration: '6 hours',
    slots: {
      total: 15,
      filled: 8,
      available: 7
    },
    requiredOutfit: 'Safety vest, gloves, boots',
    providedGear: 'Drainage tools, safety equipment',
    status: 'active',
    payment: 800,
    applicants: ['2'],
    approvedWorkers: ['2'],
    reportId: '2'
  },
  {
    id: '3',
    title: 'Vacant Lot Cleanup',
    description: 'Remove construction waste from vacant lot',
    location: {
      latitude: 14.5980,
      longitude: 120.9830,
      address: 'Barangay 3, Manila'
    },
    date: '2024-01-25',
    time: '06:00',
    duration: '8 hours',
    slots: {
      total: 25,
      filled: 20,
      available: 5
    },
    requiredOutfit: 'Safety vest, gloves, hard hat',
    providedGear: 'Heavy equipment, trucks',
    status: 'upcoming',
    payment: 1200,
    applicants: ['1', '2'],
    approvedWorkers: [],
    reportId: '3'
  }
];

export const mockTaskApplications = [
  {
    id: '1',
    taskId: '1',
    userId: '1',
    status: 'approved',
    appliedAt: '2024-01-16T14:30:00Z',
    user: mockUsers[0]
  },
  {
    id: '2',
    taskId: '1',
    userId: '2',
    status: 'pending',
    appliedAt: '2024-01-16T15:45:00Z',
    user: mockUsers[1]
  },
  {
    id: '3',
    taskId: '2',
    userId: '2',
    status: 'approved',
    appliedAt: '2024-01-17T09:20:00Z',
    user: mockUsers[1]
  }
];

export const mockCompletedTasks = [
  {
    id: '4',
    title: 'Beach Cleanup Drive',
    location: {
      latitude: 14.5970,
      longitude: 120.9820,
      address: 'Manila Bay, Manila'
    },
    date: '2024-01-10',
    payment: 600,
    status: 'completed',
    checkInTime: '2024-01-10T08:00:00Z',
    checkOutTime: '2024-01-10T12:00:00Z',
    beforePhotos: ['https://via.placeholder.com/300x200'],
    afterPhotos: ['https://via.placeholder.com/300x200']
  }
];

export const mockPayments = [
  {
    id: '1',
    taskId: '4',
    amount: 600,
    status: 'completed',
    completedAt: '2024-01-10T12:00:00Z',
    taskTitle: 'Beach Cleanup Drive'
  }
];

export const mockDashboardStats = {
  totalReports: 15,
  pendingApprovals: 3,
  activeTasks: 8,
  totalWorkersEngaged: 45,
  paymentStatus: {
    pending: 12000,
    completed: 45000,
    total: 57000
  }
};

export const mockNotifications = [
  {
    id: '1',
    title: 'Task Approved',
    message: 'Your application for "Cleanup Barangay 1" has been approved',
    type: 'success',
    timestamp: '2024-01-16T16:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'New Task Available',
    message: 'New cleanup task available in your area',
    type: 'info',
    timestamp: '2024-01-15T10:00:00Z',
    read: true
  }
];
