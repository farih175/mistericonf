# Confession Website 💕

A romantic confession website designed to help someone express their feelings to a crush and ask her to be a girlfriend. The website features a beautiful pink/rose theme, hearts & flowers animations, and Indonesian language interface.

## Features

- **Mobile-First Design**: Optimized for mobile viewing (320px - 768px)
- **Romantic Aesthetic**: Pink/rose color palette with elegant typography
- **Heartfelt Confession**: Scrollable message container for personalized messages
- **Interactive Response**: "Mau" (Yes) and "Tidak" (No) buttons with persuasion features
- **Celebration Experience**: Hearts & flowers explosion when "Mau" is clicked
- **Personalization**: Customizable via URL parameters
- **100% Client-Side**: No server required, works offline
- **Cute Ornaments**: Teddy bears, hearts, flowers, sparkles for adorable aesthetic

## Personalization

The website can be personalized through URL parameters:

### URL Parameters
- `n`: Visitor nickname (e.g., `Acell`)
- `f`: Visitor full name (optional, e.g., `Salma%20Yumna%20Putri`)
- `c`: Confessor name (e.g., `Ian`)
- `m`: Base64-encoded message (optional)
- `t`: Theme (`pink`, `rose`, `lavender`) - default: `pink`
- `a`: Animation style (`hearts-flowers`, `sparkles`, `petals`) - default: `hearts-flowers`
- `l`: Language (`id`, `en`) - default: `id`

### Example URL
```
https://your-domain.com/?n=Acell&f=Salma%20Yumna%20Putri&c=Ian&t=pink&a=hearts-flowers&l=id
```

## Deployment

### GitHub Pages
1. Push the code to a GitHub repository
2. Go to Repository Settings → Pages
3. Select branch (usually `main`) and folder (`/root`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the folder to Netlify dashboard
2. Or connect your GitHub repository
3. Netlify will automatically deploy the site

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

## File Structure

```
confession-website/
├── index.html              # Main HTML file
├── README.md              # This file
├── package.json           # NPM dependencies
├── vitest.config.js       # Test configuration
├── assets/
│   └── Backstreet Boys - Shape Of My Heart.mp3  # Background music
├── scripts/
│   ├── app.js             # Main application logic
│   ├── animations.js      # Animation engine
│   ├── ornaments.js       # Cute decorative elements
│   └── personalization.js # URL parameter handling
├── styles/
│   ├── theme.css          # Pink/rose theme variables
│   ├── main.css           # Core styles and layout
│   └── animations.css     # Animation keyframes
└── tests/
    └── *.test.js          # Test files
```

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation
```bash
npm install
```

### Running Tests
```bash
npm test
```

### Running Development Server
```bash
npx serve .
```

## Customization

### Changing the Confession Message
1. Edit the `CONFIG.message` in `scripts/app.js`
2. Or use URL parameter `m` with base64-encoded message

### Changing Theme Colors
Edit the CSS variables in `styles/theme.css`:
```css
:root {
  --color-primary: #FF69B4;        /* Hot Pink */
  --color-primary-light: #FFB6C1;  /* Light Pink */
  /* ... more variables */
}
```

### Adding New Animations
Add new keyframes in `styles/animations.css` and corresponding logic in `scripts/animations.js`

## Requirements Coverage

This website implements all requirements from the specification:

| Requirement | Implementation |
|-------------|----------------|
| 1. Mobile-First | Responsive design with media queries |
| 2. Aesthetic Landing | Pink/rose theme with floating hearts |
| 3. Confession Message | Scrollable container with elegant formatting |
| 4. Response Collection | "Mau" and "Tidak" buttons with persuasion |
| 5. Celebration | Hearts explosion with thank you message |
| 6. Cute Visuals | Teddy bears, flowers, hearts, sparkles |
| 7. Smooth Navigation | CSS transitions between sections |
| 8. Personalization | URL parameter support |
| 9. Privacy | 100% client-side, no tracking |
| 10. Browser Compatibility | Progressive enhancement approach |

## License

This project is open source and available for personal use.

## Credits

- **Icons**: Unicode emojis and symbols
- **Fonts**: Google Fonts (Dancing Script, Nunito)
- **Music**: Backstreet Boys - Shape Of My Heart (provided for romantic atmosphere)
- **Design**: Romantic pink/rose aesthetic with feminine touch

## Support

For issues or questions, please check the test files or run the test suite:
```bash
npm test
```

Enjoy creating beautiful confessions! 💝