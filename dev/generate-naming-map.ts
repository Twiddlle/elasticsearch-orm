// generating map object from query interfaces to apply it for custom field names
import * as path from 'path';
import { DevGenerator } from './devUtils/DevGenerator';

async function generate() {
  const devGenerator = new DevGenerator(
    path.join(__dirname, '..', 'src', 'query', 'sort.ts'),
  );

  await devGenerator.processMapping();
}

generate().then();
