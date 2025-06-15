# Project Summary
The **MP Player Development** project is a React-based dashboard aimed at improving the productivity of sports coaches by providing a comprehensive platform for tracking player development, managing observations, and generating personal development plans (PDPs). The application features a modern, single-page interface built with responsive Tailwind CSS and data visualization through Recharts, facilitating efficient access to player information and streamlining the observation logging process.

# Project Module Description
- **Top Section**: Displays player count and weekly observations, with options to add players or observations.
- **Left Section**: Searchable and sortable player list with expandable rows for PDP summaries and buttons for viewing or updating PDPs.
- **Right Section**: Shows the 5 most recent observations sorted by date, with a "Show More" button for additional entries and a search bar for filtering observations.
- **PDP History Modal**: Displays a chronological list of all PDPs for a selected player, including associated observations, with date formats updated to MM/DD/YY.
- **Form Modals**: Ensures a consistent UI/UX for adding and updating players, observations, and PDPs, emphasizing simplicity and ease of use.
- **Player Card**: Expanded view showing essential information: Player Name, Current PDP summary, Last 3 Observations, an optional "Show More" button, and action buttons (Add Observation, Update PDP, View PDP History).
- **Mobile Responsiveness**: Ensures all elements, including the title "MP Player Development," are properly centered on mobile displays.

# Directory Tree
```
dashboard/
├── README.md                # Project overview and instructions
├── eslint.config.js         # ESLint configuration file
├── index.html               # Main HTML file with updated title
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── src/
│   ├── App.jsx              # Main application component
│   ├── components/          # Contains all reusable components
│   │   ├── dashboard/       # Components for the dashboard
│   │   │   ├── NewDashboard.jsx  # Updated main dashboard component with centered title
│   │   │   ├── ObservationList.jsx  # Component for displaying observations
│   │   │   ├── PlayerList.jsx  # Component for displaying players with updated observation limit
│   │   │   ├── PDPHistoryModal.jsx  # Modal for displaying PDP history with updated date format
│   │   │   ├── TopSection.jsx  # Component showing metrics and actions
│   │   │   ├── modals/      # Contains modal components
│   │   │   │   ├── BaseFormModal.jsx  # Base modal component for consistency
│   │   │   │   ├── AddPlayerModal.jsx  # Modal for adding new players
│   │   │   │   ├── AddObservationModal.jsx  # Modal for adding new observations
│   │   │   │   ├── AddPDPModal.jsx  # Modal for adding new PDPs
│   │   │   │   └── UpdatePDPModalNew.jsx  # Redesigned modal for updating PDPs
│   │   ├── data/            # Contains mock data
│   │   │   └── mockData.js  # Seed data for players and observations (updated for basketball)
│   │   └── ...              # Other directories and components
├── tailwind.config.js       # Tailwind CSS configuration
├── template_config.json      # Configuration for templates
└── vite.config.js           # Vite configuration for the project
```

# File Description Inventory
- **README.md**: Overview of the project and setup instructions.
- **eslint.config.js**: Configuration for code linting.
- **index.html**: Main HTML structure for the application with updated title.
- **package.json**: Lists dependencies and scripts for building and running the project.
- **postcss.config.js**: Configuration for PostCSS processing.
- **src/**: Contains the source code, including components and styles.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **template_config.json**: Configuration for template settings.
- **vite.config.js**: Configuration for Vite, the build tool.
- **dashboardService.js**: Service file for handling data operations related to the dashboard.
- **supabase.js**: Configuration for Supabase integration.

# Technology Stack
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Recharts**: Charting library for data visualization.
- **Vite**: Build tool for frontend projects.

# Usage
1. Install dependencies: 
   ```bash
   pnpm install
   ```
2. Install additional dependencies:
   ```bash
   pnpm install react-router-dom react-icons
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```
