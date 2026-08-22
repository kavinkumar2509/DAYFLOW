import './index.css';
import { App } from './app';

const app = new App('app');
app.init().catch((err) => {
  console.error('Failed to initialize DAYFLOW application:', err);
});
