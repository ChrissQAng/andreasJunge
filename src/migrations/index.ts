import * as migration_20260516_111616 from './20260516_111616';
import * as migration_20260625_124655_session_schema_updates from './20260625_124655_session_schema_updates';

export const migrations = [
  {
    up: migration_20260516_111616.up,
    down: migration_20260516_111616.down,
    name: '20260516_111616',
  },
  {
    up: migration_20260625_124655_session_schema_updates.up,
    down: migration_20260625_124655_session_schema_updates.down,
    name: '20260625_124655_session_schema_updates'
  },
];
