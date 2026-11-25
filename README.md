# 🌤️ SkyView — Modern Weather Forecast App

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<p align="center">
  <strong>A modern, responsive, and interactive weather application that helps users explore real-time weather conditions and forecasts for cities around the world.</strong>
</p>

<p align="center">
  Built with React, Tailwind CSS, and the Open-Meteo Weather API.
</p>

---

## 🌍 About SkyView

**SkyView** is a modern weather forecasting web application designed to provide users with accurate and up-to-date weather information through a clean, interactive, and user-friendly interface.

The application allows users to search for cities worldwide, explore current weather conditions, view hourly and weekly forecasts, save their favourite cities, and customize their weather experience.

SkyView focuses on combining useful weather information with a smooth user experience, responsive design, and dynamic weather visuals.

Whether you want to check the current temperature, explore upcoming weather conditions, or keep track of your favourite locations, SkyView brings everything together in one place.

---

## ✨ Features

### 🌡️ Real-Time Weather Information
- Search for cities around the world.
- Get current weather conditions for selected locations.
- Display current temperature and weather descriptions.
- View feels-like temperature.
- Check minimum and maximum temperatures.
- Access detailed weather information.

### 📊 Detailed Weather Statistics

SkyView provides additional weather details, including:

- Humidity
- Wind Speed
- Atmospheric Pressure
- Visibility
- UV Index

### ⏰ Hourly Weather Forecast
- Explore upcoming hourly weather conditions.
- View temperature changes throughout the day.
- Check weather conditions for upcoming hours.
- Understand how the weather changes over time.

### 📅 7-Day Weather Forecast
- View weather predictions for the upcoming seven days.
- Check daily temperature information.
- Explore expected weather conditions.
- Plan activities according to upcoming forecasts.

### ❤️ Favourite Cities
- Add cities to your favourites using the Heart icon.
- Remove cities from your favourite list.
- Quickly access saved locations.
- Manage favourite cities from the dedicated favourites section.

### 💾 Local Storage Integration
SkyView uses browser Local Storage to preserve important user preferences and saved information.

- Favourite cities remain saved after refreshing the page.
- User preferences are stored locally.
- Theme preferences are preserved.
- Temperature unit preferences are maintained.
- Saved settings remain available when the user revisits the application.

### 🌗 Dark & Light Mode
- Switch between dark and light themes.
- Enjoy a comfortable viewing experience.
- Theme preferences are saved locally.
- Experience a visually consistent interface across both modes.

### 🎨 Dynamic Weather Interface
- Weather-related icons and visuals.
- Interactive weather cards.
- Clean dashboard layout.
- Modern gradients and styling.
- Visually organized weather information.

### 📱 Fully Responsive Design
- Desktop-friendly interface.
- Tablet responsiveness.
- Mobile-friendly layouts.
- Responsive navigation and weather cards.
- Consistent experience across different screen sizes.

### ⚡ Additional Features
- Loading states while fetching weather information.
- Error handling for unsuccessful requests.
- Celsius and Fahrenheit temperature conversion.
- Interactive navigation between application pages.
- Dynamic weather data rendering.

---

## 🛠️ Technologies Used

SkyView is developed using modern frontend technologies and libraries.

| Technology | Purpose |
|---|---|
| React 19 | Building reusable UI components |
| JavaScript ES6+ | Application logic and functionality |
| Vite | Development server and production build |
| Tailwind CSS 4 | Responsive styling and UI design |
| React Router DOM | Navigation and page routing |
| Open-Meteo API | Weather data and city search |
| Fetch API | Retrieving weather information |
| React Hooks | State management and component lifecycle |
| Context API | Sharing application state |
| Local Storage | Saving user preferences and favourites |
| Lucide React | Icons and interface elements |
| Recharts | Weather data visualization |
| Leaflet | Interactive map functionality |

---

## 🌐 Weather API Integration

SkyView uses the **Open-Meteo API** to retrieve weather information.

Open-Meteo provides weather forecasting and geocoding services, allowing the application to search for locations and retrieve weather information using geographical coordinates.

### APIs Used

**1. Geocoding API**

Used to search for cities and retrieve their geographical coordinates.

https://geocoding-api.open-meteo.com/v1/search

**2. Weather Forecast API**

Used to retrieve current weather conditions, hourly forecasts, and daily forecasts.

https://api.open-meteo.com/v1/forecast

### How API Integration Works

1. The user enters a city name in the search field.
2. The Geocoding API searches for the requested location.
3. Latitude and longitude are retrieved.
4. The Forecast API uses these coordinates to fetch weather information.
5. React updates the interface with the retrieved data.
6. Weather information is displayed through interactive components.

**Note:** Open-Meteo does not require an API key for its free non-commercial access.

---

## 📂 Project Structure

The project follows a component-based React architecture to keep the application organized and maintainable.

```text
Sky-View---Weather-App/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── context/
│   │
│   ├── pages/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
│
└── README.md
```

*Note: This is a representative project structure. Individual folders and component names may vary depending on the actual implementation.*

---

## 🚀 Getting Started

Follow these steps to run SkyView on your local machine.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/uroojrizwan-sketch/Sky-View---Weather-App.git
```

### 2. Navigate to the Project Folder

```bash
cd Sky-View---Weather-App
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

After starting the development server, open the local URL displayed in your terminal.

Usually:

```text
http://localhost:5173
```

Now you can explore SkyView on your local machine!

---

## 📦 Production Build

To generate an optimized production build, run:

```bash
npm run build
```

Vite generates the production-ready files inside the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deployment

SkyView can be deployed using **Vercel**.

### Deployment Steps

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Import the SkyView GitHub repository.
4. Select Vite as the framework preset.
5. Set the build command to `npm run build`.
6. Set the output directory to `dist`.
7. Click Deploy.

Vercel will build and deploy the application.

---

## 🧠 Key Concepts Practiced

This project provided practical experience with several important frontend development concepts.

- React component-based architecture.
- React Hooks (`useState`, `useEffect`, `useContext`).
- Context API for shared application state.
- API integration using Fetch API.
- Asynchronous JavaScript (`async/await`).
- Dynamic rendering of API data.
- Conditional rendering.
- React Router DOM.
- Reusable components.
- State management.
- Browser Local Storage.
- Responsive web design.
- Temperature conversion logic.
- Error and loading state management.
- Git and GitHub version control.
- Production builds and deployment.

---

## 🎯 Project Goals

The main goal of SkyView was to strengthen practical frontend development skills by building a complete, interactive, and responsive React application.

Through this project, I explored how to:

- Build a real-world React application.
- Work with external APIs.
- Handle dynamic weather data.
- Manage application state.
- Implement persistent user preferences.
- Create reusable UI components.
- Design responsive interfaces.
- Deploy a React application for production.

---

## 🔮 Future Improvements

Some ideas for future enhancements include:

- Weather alerts and notifications.
- More advanced weather visualizations.
- Additional forecast details.
- Improved performance through code splitting.
- More location-based weather features.

---

## 👩‍💻 Developer

**Urooj Rizwan**

Frontend Development Learner | React Developer

This project represents my practical learning experience with React, JavaScript, API integration, responsive design, and modern frontend development.

### 🔗 Connect With Me

- **GitHub:** [uroojrizwan-sketch](https://github.com/uroojrizwan-sketch)
- **Project Repository:** [SkyView — Weather App](https://github.com/uroojrizwan-sketch/Sky-View---Weather-App)

---

## ⭐ Support

If you find this project interesting or helpful, consider giving the repository a ⭐ on GitHub.

Your support and feedback are always appreciated!

---

<p align="center">
  <strong>🌤️ SkyView — Explore the Weather, Anywhere in the World!</strong>
</p>

<p align="center">
  Made with ❤️ using React.
</p>
