import { StadiumApp } from './components/StadiumApp';

// Initialize the application
const container = document.getElementById('container');
if (!container) {
  throw new Error('Container element not found');
}

const app = new StadiumApp(container);
app.init();
app.start();