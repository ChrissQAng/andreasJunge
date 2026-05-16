import * as migration_20260516_111616 from './20260516_111616';

export const migrations = [
  {
    up: migration_20260516_111616.up,
    down: migration_20260516_111616.down,
    name: '20260516_111616'
  },
];
