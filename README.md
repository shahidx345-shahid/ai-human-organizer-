# AI Home Organizer

A comprehensive AI-powered home organization application that helps users optimize their living spaces through intelligent analysis and personalized recommendations.

## 🚀 Features

### Frontend (React + Vite)
- **Modern Dashboard**: Beautiful, responsive dashboard with real-time statistics
- **Project Management**: Create, view, and manage organization projects
- **Image Upload**: Advanced drag & drop image upload with multiple angle support
- **AI Analysis**: Real-time AI analysis simulation with progress tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth animations powered by Framer Motion

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for projects
- **Image Upload**: Secure file upload with multer
- **CORS Support**: Cross-origin resource sharing configuration
- **File Storage**: Organized file storage system
- **Health Monitoring**: API health check endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Dropzone** - File upload component
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Nodemon** - Development server

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/shahidx345-shahid/ai-human-organizer-.git
   cd ai-human-organizer-
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both backend (port 3001) and frontend (port 3002) servers concurrently.

## 🚀 Usage

### Development
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### API Endpoints

#### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### File Upload
- `POST /api/upload` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

## 📱 Application Pages

### Dashboard (`/`)
- Project overview with statistics
- Real-time analytics
- Quick action buttons
- Project cards with status indicators

### New Project (`/projects/new`)
- **Step 1**: Project details form
- **Step 2**: Image upload with drag & drop
- **Step 3**: AI analysis submission
- Multi-step wizard with progress tracking

### Project Detail (`/projects/:id`)
- Complete project information
- Photo gallery
- Project statistics and timeline
- Recommendation status tracking

### AI Analysis (`/projects/:id/analysis`)
- Real-time analysis progress
- AI recommendations with priority levels
- Shopping list with store information
- Efficiency scores and improvement metrics

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Dark/Light Mode**: Automatic theme detection
- **Smooth Animations**: Framer Motion powered transitions
- **Modern UI**: Clean, professional interface
- **Accessibility**: WCAG compliant components

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3001
NODE_ENV=development
```

### Tailwind CSS
The project uses Tailwind CSS v3 with custom configuration:
- Responsive design utilities
- Custom color palette
- Component-based styling

## 📁 Project Structure

```
ai-home-organizer/
├── backend/
│   ├── src/
│   │   └── app.js          # Express server
│   ├── uploads/            # File uploads directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── store/          # State management
│   │   └── styles/         # CSS files
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Express.js for the robust backend framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by [Shahid](https://github.com/shahidx345-shahid)**
