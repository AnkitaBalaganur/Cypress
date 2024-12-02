import './commands'
import 'cypress-wait-until';
import 'cypress-iframe';

import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';
addMatchImageSnapshotCommand();