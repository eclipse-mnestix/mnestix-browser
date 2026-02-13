import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

const root = process.cwd();
const srcApp = path.join(root, 'src', 'app');
const srcAppBackup = path.join(root, 'src', 'app.original');
const generated = path.join(root, '.generated');

console.log('[restore] Restoring original app structure...');

// Remove symlink and generated directory
if (fs.existsSync(srcApp)) {
    fse.removeSync(srcApp);
    console.log('[restore] Removed symlink at src/app');
}

if (fs.existsSync(generated)) {
    fse.removeSync(generated);
    console.log('[restore] Removed .generated directory');
}

// Restore from backup if exists, otherwise recreate basic structure
if (fs.existsSync(srcAppBackup)) {
    fse.moveSync(srcAppBackup, srcApp);
    console.log('[restore] Restored original src/app from backup');
} else {
    // We need to recreate a basic app structure
    console.warn('[restore] No backup found, you may need to restore from git');
    console.log('[restore] Run: git checkout HEAD -- src/app');
}

console.log('[restore] ✅ Restore complete');
