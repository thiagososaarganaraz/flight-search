# Google Flights Clone

A modern, responsive flight search application built with React, TypeScript, and Next.js. This application replicates the core functionality of Google Flights with a clean, accessible interface.

## Features

- **Flight Search**: Search for flights with origin, destination, dates, and passenger details
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Loading States**: Smooth loading animations while searching
- **Error Handling**: Graceful error handling with retry functionality
- **Accessibility**: Built with accessibility best practices
- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Modular code structure with separation of concerns

## Architecture

The application follows a clean architecture pattern with clear separation of concerns:

\`\`\`
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── flight-search-form.tsx
│   ├── flight-results.tsx
│   ├── flight-card.tsx
│   ├── loading-state.tsx
│   └── error-state.tsx
├── hooks/              # Custom React hooks
│   └── use-flight-search.ts
├── services/           # API services and external integrations
│   └── flight-api.ts
├── types/              # TypeScript type definitions
│   └── flight.ts
└── app/                # Next.js app router pages
    ├── page.tsx
    ├── layout.tsx
    └── globals.css
\`\`\`

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API Integration**: Sky Scrapper API (RapidAPI)

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd google-flights-clone
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

This application is designed to work with the Sky Scrapper API from RapidAPI. The current implementation includes mock data for demonstration purposes. To use real flight data:

1. Sign up for RapidAPI
2. Subscribe to the Sky Scrapper API
3. Add your API key to the environment variables
4. Update the `flight-api.ts` service to make actual API calls

## Key Components

### FlightSearchForm
- Handles user input for flight search parameters
- Supports both one-way and round-trip searches
- Includes passenger count and cabin class selection
- Form validation and accessibility features

### FlightResults
- Displays search results in a clean, organized layout
- Shows flight details including times, duration, stops, and price
- Responsive design for mobile and desktop

### FlightCard
- Individual flight result component
- Displays airline, route, timing, and pricing information
- Interactive selection functionality

### Custom Hooks
- `useFlightSearch`: Manages flight search state and API calls
- Handles loading, error, and success states
- Provides retry functionality

## Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interactive elements
- Optimized typography and spacing

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme
- Focus management

## Performance Optimizations

- Next.js App Router for optimal performance
- Component lazy loading
- Efficient state management
- Optimized bundle size
- Image optimization

## Future Enhancements

- [ ] Flight booking integration
- [ ] User authentication
- [ ] Saved searches and favorites
- [ ] Price alerts
- [ ] Multi-city search
- [ ] Seat selection
- [ ] Baggage options
- [ ] Airline filtering
- [ ] Price history charts
- [ ] Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
