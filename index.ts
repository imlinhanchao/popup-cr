import { activate } from './module';
import type { FishPi } from 'fishpi';

declare global {
  const fishpi: FishPi;
}
activate(window, document, fishpi);