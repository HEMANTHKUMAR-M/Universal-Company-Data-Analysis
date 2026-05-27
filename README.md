# Universal Company Performance Analytics Dashboard for Business Intelligence

## Project Overview

The **Universal Company Performance Analytics Dashboard for Business Intelligence** is a modern web-based analytics platform designed to help companies analyze business data dynamically using interactive dashboards, KPI cards, charts, filters, insights, and reports.

This project allows users to upload company datasets in **CSV, Excel, or JSON** format, map columns dynamically, and automatically generate analytics dashboards without changing the source code.

The system is designed to work for different company domains such as:

- Sales
- Retail
- E-Commerce
- Manufacturing
- Finance
- HR
- Marketing
- Customer Analytics
- Product Analytics
- Regional Analytics

---

## Main Objective

The main objective of this project is to convert raw company data into meaningful business insights using data analytics and visualization techniques.

The project helps users:

- Understand company performance
- Track sales and profit
- Analyze customers and products
- Compare regional performance
- Generate business reports
- Make data-driven decisions

---

## Application Flow

```text
Starter Page
      ↓
Sign In / Register
      ↓
Dataset Upload
      ↓
Column Mapping
      ↓
Dashboard Generation
      ↓
Analytics Pages
      ↓
Business Insights
      ↓
Reports Export
```

---

## Key Features

### 1. Starter Page

The application starts with a professional landing page that includes:

- Project title
- Short description
- Feature highlights
- Get Started button
- Modern UI design

---

### 2. Authentication System

The system includes secure authentication using Firebase.

Features:

- User registration
- User login
- Forgot password
- Logout
- Session management
- Protected routes

---

### 3. Dataset Upload System

Users can upload datasets in multiple formats.

Supported formats:

- CSV
- Excel `.xlsx`
- JSON

Features:

- Drag and drop upload
- File picker
- Upload validation
- Dataset preview
- Error handling

---

### 4. Column Mapping System

Different companies may use different column names. To solve this, the system provides a dynamic column mapping feature.

Users can map dataset columns to:

- Date
- Revenue / Sales
- Profit
- Quantity
- Customer
- Product
- Category
- Region
- Department
- Employee
- Expense
- Payment Mode
- Sales Channel

---

### 5. Dashboard

The dashboard is generated dynamically from the uploaded dataset.

Dashboard includes:

- KPI cards
- Revenue chart
- Profit chart
- Product chart
- Region chart
- Recent records table

---

## Dashboard KPIs

The system calculates the following KPIs dynamically:

- Total Revenue
- Total Profit
- Total Orders
- Total Customers
- Average Order Value
- Profit Margin
- Total Quantity
- Total Expense

---

## Analytics Modules

### 1. Sales Analytics

Sales Analytics helps users understand revenue performance.

Includes:

- Monthly sales trend
- Daily sales trend
- Revenue by category
- Revenue by region
- Sales channel performance
- Top revenue periods

---

### 2. Profit Analysis

Profit Analysis helps users understand business profitability.

Includes:

- Total profit
- Profit margin
- Profit trend
- Most profitable products
- Loss-making products
- Expense vs profit comparison
- Region-wise profit

Formula:

```text
Profit Margin = (Profit / Revenue) × 100
```

---

### 3. Customer Insights

Customer Insights helps users understand customer behavior.

Includes:

- Total unique customers
- Repeat customers
- Top customers by revenue
- Customer purchase behavior
- Customer segmentation
- Customer type analysis

---

### 4. Product Performance

Product Performance helps users analyze product-level business results.

Includes:

- Top-selling products
- Low-performing products
- Product revenue analysis
- Product quantity analysis
- Category-wise product performance
- Product ranking charts

---

### 5. Regional Analysis

Regional Analysis helps users compare company performance across regions.

Includes:

- Region-wise revenue
- Region-wise profit
- Best performing region
- Worst performing region
- Regional comparison charts

---

### 6. Business Insights

The system automatically generates business insights based on uploaded data.

Example insights:

- Best performing region
- Highest revenue product
- Most profitable category
- Fastest growing segment
- Highest customer contribution
- Revenue growth trend

---

### 7. Reports Module

The Reports module generates summaries from the analyzed dataset.

Reports include:

- KPI summary
- Revenue summary
- Profit summary
- Customer insights
- Product insights
- Regional insights
- Business recommendations

Export options:

- PDF
- CSV
- Excel

---

## Admin Panel

The project can include an admin panel to manage the platform professionally.

Admin features:

- User management
- Dataset monitoring
- Analytics tracking
- Report management
- Activity logs
- Notifications
- System settings
- Role-based authentication
- Secure admin routes

---

## Technologies Used

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Framer Motion
- Lucide React Icons

### Authentication and Database

- Firebase Authentication
- Firebase Firestore

### File Processing

- PapaParse
- XLSX

### Export Tools

- jsPDF
- html2canvas

---

## Project Structure

```text
src/
│
├── assets/
│
├── components/
│   ├── charts/
│   ├── cards/
│   ├── filters/
│   ├── layout/
│   ├── upload/
│   └── common/
│
├── context/
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── FilterContext.jsx
│
├── firebase/
│   └── firebase.js
│
├── pages/
│   ├── StarterPage.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── UploadDataset.jsx
│   ├── ColumnMapping.jsx
│   ├── Dashboard.jsx
│   ├── SalesAnalytics.jsx
│   ├── ProfitAnalysis.jsx
│   ├── CustomerInsights.jsx
│   ├── ProductPerformance.jsx
│   ├── RegionalAnalysis.jsx
│   ├── Insights.jsx
│   ├── Reports.jsx
│   ├── AdminDashboard.jsx
│   └── Settings.jsx
│
├── routes/
│
├── hooks/
│
├── utils/
│   ├── analytics.js
│   ├── parser.js
│   ├── insights.js
│   ├── export.js
│   └── cleaners.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Route Structure

```text
/                 → Starter Page
/signin           → Login Page
/register         → Register Page
/upload           → Dataset Upload Page
/mapping          → Column Mapping Page
/dashboard        → Dashboard Page
/sales            → Sales Analytics Page
/profit           → Profit Analysis Page
/customers        → Customer Insights Page
/products         → Product Performance Page
/regions          → Regional Analysis Page
/insights         → Business Insights Page
/reports          → Reports Page
/settings         → Settings Page
/admin/dashboard  → Admin Dashboard
```

---

## Installation Steps

### 1. Clone the Project

```bash
git clone <repository-url>
```

### 2. Open Project Folder

```bash
cd universal-company-performance-dashboard
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Firebase Environment Variables

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Project

```bash
npm run dev
```

---

## Required Dependencies

```bash
npm install react-router-dom firebase recharts lucide-react framer-motion papaparse xlsx jspdf html2canvas
```

---

## Dataset Format Example

The uploaded dataset can contain columns like:

```text
Order_ID
Order_Date
Customer_Name
Company_Name
Region
Department
Product
Category
Quantity
Sales
Profit
Discount
Payment_Mode
Customer_Type
Sales_Channel
Employee_Name
Expense
```

The system does not depend on fixed column names because users can map columns manually.

---

## Data Processing Flow

```text
Upload Dataset
      ↓
Parse File
      ↓
Preview Dataset
      ↓
Map Columns
      ↓
Clean Data
      ↓
Calculate KPIs
      ↓
Generate Charts
      ↓
Generate Insights
      ↓
Export Reports
```

---

## Data Cleaning Features

The system should handle:

- Empty rows
- Missing values
- Duplicate records
- Invalid numbers
- Invalid dates
- Unsupported files
- Corrupted uploads

---

## Chart Features

Charts should be:

- Dynamic
- Responsive
- Attractive
- Easy to understand
- Filter-aware
- Based only on uploaded data

Charts used:

- Line chart
- Bar chart
- Pie chart
- Donut chart
- Area chart
- Comparison chart

---

## UI/UX Features

- Modern SaaS-style interface
- Sidebar navigation
- Top navbar
- Responsive design
- Dark/light mode
- Gradient cards
- Rounded corners
- Smooth animations
- Hover effects
- Professional chart cards
- Mobile-friendly layout

---

## Security Features

- Firebase authentication
- Protected routes
- Role-based access
- Admin-only pages
- Secure user session
- Logout system

---

## Expected Output

After uploading and mapping a dataset, the application should generate:

- Dashboard KPIs
- Sales analytics
- Profit analytics
- Customer insights
- Product performance
- Regional analysis
- Business insights
- Exportable reports

---

## Future Enhancements

- AI-powered business insights
- Machine learning sales prediction
- Cloud dataset storage
- Multi-company support
- Team collaboration
- Real-time analytics
- API integrations
- Advanced admin dashboard
- Email report sharing
- Scheduled reports

---

## Conclusion

The **Universal Company Performance Analytics Dashboard for Business Intelligence** is a flexible and professional analytics platform that helps companies convert raw data into valuable insights.

It supports dynamic dataset upload, column mapping, business analytics, interactive charts, reports, and admin features. This makes the project suitable for academic use, internships, resumes, and real-world business intelligence applications.

---

## License

This project is developed for educational and learning purposes.
