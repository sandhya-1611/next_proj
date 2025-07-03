# DentalFlow - Dental Center Management Dashboard

A comprehensive dental practice management system built with Next.js, React, and Material-UI. This application provides role-based access for both dental practitioners (admins) and patients to manage appointments, patient records, treatments, and file attachments.

## 🚀 Features

### Authentication & Authorization
- **Simulated Authentication**: Email/password login with hardcoded users
- **Role-based Access Control**: Separate dashboards for Admin (Dentist) and Patient roles
- **Session Persistence**: User sessions stored in localStorage
- **Automatic Routing**: Role-based redirection to appropriate dashboards

### Admin (Dentist) Features
- **Dashboard Overview**: 
  - Real-time KPIs (total patients, today's appointments, monthly revenue, pending treatments)
  - Next 10 upcoming appointments display
  - Dynamic calculations based on actual data
  
- **Patient Management**:
  - View all patients in a comprehensive table
  - Add new patients with complete information
  - Edit existing patient records
  - Delete patient records with confirmation
  - Search and filter capabilities
  
- **Appointment Management**:
  - Schedule new appointments with date/time selection
  - Edit existing appointments
  - Delete appointments with confirmation
  - Status tracking (Scheduled, In Progress, Completed, Cancelled)
  - Cost management and tracking
  
- **Treatment Records**:
  - File upload functionality for treatment records
  - Support for images, PDFs, and documents
  - File preview and download capabilities
  - Base64 storage in localStorage
  - Attachment management for each appointment
  
- **Calendar View**:
  - Monthly calendar display
  - Visual appointment scheduling
  - Click-through navigation between months
  - Color-coded appointment statuses
  
- **Analytics & Reports**:
  - Financial overview with total revenue and average costs
  - Top patients by visit frequency
  - Most common treatments analysis
  - Treatment statistics and reporting

### Patient Features
- **Personal Dashboard**:
  - Upcoming appointments with details
  - Appointment history with completed treatments
  - Personal profile management
  
- **Appointment Scheduling**:
  - Self-service appointment booking
  - Treatment type selection
  - Preferred date and time selection
  - Special notes and requests
  
- **Medical Records Access**:
  - View treatment history
  - Access to attached files and documents
  - Cost information for completed treatments
  - Treatment status tracking
  
- **Profile Management**:
  - Update personal information
  - View medical information
  - Account details and preferences

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 15.3.4 with React 19
- **UI Library**: Material-UI (MUI) 7.2.0
- **Dashboard Components**: Toolpad Core 0.16.0
- **Styling**: TailwindCSS 4.0
- **Icons**: Material-UI Icons
- **State Management**: React Context API
- **Data Storage**: localStorage (simulated backend)
- **Language**: TypeScript
- **File Handling**: Base64 encoding for file storage

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dentalflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Credentials

### Admin (Dentist) Access
- **Email**: `admin@dentalflow.com`
- **Password**: `admin123`

### Patient Access
- **Email**: `john.doe@example.com`
- **Password**: `patient123`
- **Alternative**: `jane.smith@example.com` / `patient456`

## 📁 Project Structure

```
dentalflow/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Calendar.tsx     # Calendar view component
│   │   │   ├── FileUpload.tsx   # File upload component
│   │   │   ├── Login.tsx        # Authentication component
│   │   │   └── Table/           # Table components
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.tsx  # Authentication state
│   │   │   └── DataContext.tsx  # Data management
│   │   ├── admin/
│   │   │   └── dashboard/       # Admin dashboard
│   │   ├── patient/
│   │   │   └── dashboard/       # Patient dashboard
│   │   ├── utils/               # Utility functions
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   └── config/                  # Configuration and data
│       ├── constants.js         # App constants
│       ├── usersData.js         # User accounts
│       ├── patientsData.js      # Patient records
│       └── incidentData.js      # Appointment/incident data
└── public/                      # Static assets
```

## 🔄 Data Management

### localStorage Structure
The application uses localStorage to simulate a backend database:

- **`dentalflow_users`**: User accounts and authentication data
- **`dentalflow_patients`**: Patient records and information
- **`dentalflow_incidents`**: Appointments/treatments with file attachments
- **`dentalflow_initialized`**: Initialization flag

### Data Models

#### User
```typescript
{
  id: string
  name: string
  email: string
  hashedPassword: string
  isAdmin: boolean
  patientId?: string  // For patient users
}
```

#### Patient
```typescript
{
  id: string
  name: string
  dob: string
  contact: string
  healthInfo: string
}
```

#### Incident/Appointment
```typescript
{
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost: number
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  files: Array<{name: string, url: string, type: string}>
}
```

## ✨ Key Features Implementation

### File Upload System
- **Multiple file support**: Upload up to 5 files per appointment
- **File validation**: Size limits (10MB) and type restrictions
- **Preview functionality**: Image preview and PDF download
- **Base64 storage**: Files stored as base64 strings in localStorage
- **File management**: Delete and organize attachments

### Real-time KPIs
- **Dynamic calculations**: All metrics calculated from actual data
- **Today's appointments**: Count of appointments for current date
- **Monthly revenue**: Sum of completed treatments in current month
- **Pending treatments**: Count of scheduled/in-progress appointments

### Responsive Design
- **Mobile-first approach**: Optimized for all device sizes
- **Flexible layouts**: Adaptive cards and tables
- **Touch-friendly**: Large buttons and touch targets
- **Modern UI**: Clean, professional medical interface

### Form Validation
- **Required field validation**: Prevents incomplete submissions
- **Date/time validation**: Ensures proper appointment scheduling
- **File type validation**: Restricts uploads to allowed formats
- **User feedback**: Clear error messages and success notifications

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🚀 Deployment Options

### Recommended Platforms
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site hosting with serverless functions
- **GitHub Pages**: Free hosting for public repositories

### Deployment Steps (Vercel)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings (if needed)
4. Deploy automatically on every push

## 📝 Future Enhancements

### Potential Improvements
- **Real backend integration**: Replace localStorage with proper database
- **Email notifications**: Appointment reminders and confirmations
- **Payment processing**: Integrated billing and payment system
- **Advanced reporting**: Detailed analytics and business intelligence
- **Mobile app**: React Native companion application
- **Multi-location support**: Manage multiple clinic locations
- **Staff management**: Role-based access for different staff types

### Security Considerations
- **Proper authentication**: Implement JWT or session-based auth
- **Data encryption**: Encrypt sensitive medical information
- **Audit logging**: Track all data access and modifications
- **HIPAA compliance**: Ensure medical data privacy compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [hr@entnt.in](mailto:hr@entnt.in)

---

**DentalFlow** - Streamlining dental practice management with modern technology.
