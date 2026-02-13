import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

const root = process.cwd();
const edition = process.env.EDITION ?? 'ce';
const generated = path.join(root, '.generated', 'app');

console.log(`[assemble-app] Starting assembly for edition: ${edition}`);

// 1) Clean and re-create the generated directory
fse.removeSync(generated);
fse.ensureDirSync(generated);

// 2) Copy CE app tree as the baseline (from original or backup)
const srcAppBackup = path.join(root, 'src', 'app.original');
const ceAppPath = fs.existsSync(srcAppBackup) ? srcAppBackup : path.join(root, 'src', 'app');

if (!fs.existsSync(ceAppPath)) {
    throw new Error('CE app directory not found at src/app or src/app.original');
}

fse.copySync(ceAppPath, generated, {
    dereference: true,
});
console.log(`[assemble-app] Copied CE routes from src/app to ${generated}`);

// 3) If EE edition, merge EE app subtree from the submodule
if (edition === 'ee') {
    const eeApp = path.join(root, 'ee', 'app-ee');

    if (!fs.existsSync(eeApp)) {
        console.warn('[assemble-app] EE subtree not found at ee/app-ee. Did you init submodules?');
        console.warn('[assemble-app] Continuing with CE-only build...');
    } else {
        // Merge EE routes into the generated app directory
        fse.copySync(eeApp, generated, {
            dereference: true,
            overwrite: true,
        });
        console.log(`[assemble-app] Merged EE routes from ee/app-ee`);

        // Optional: Log the EE routes that were added
        const logEERoutes = (dir: string, basePath: string = '') => {
            const items = fs.readdirSync(dir);
            items.forEach((item) => {
                const itemPath = path.join(dir, item);
                const routePath = path.join(basePath, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    logEERoutes(itemPath, routePath);
                } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
                    console.log(`[assemble-app] Added EE route: /${routePath.replace(/\\\\/g, '/')}`);
                }
            });
        };

        logEERoutes(eeApp, '');
    }
}

// 4) Copy generated app to src/app (more reliable than symlinks on Windows)
const srcApp = path.join(root, 'src', 'app');

// Backup original src/app if it exists and is not already backed up
if (fs.existsSync(srcApp) && !fs.lstatSync(srcApp).isSymbolicLink()) {
    if (!fs.existsSync(srcAppBackup)) {
        fse.moveSync(srcApp, srcAppBackup);
        console.log(`[assemble-app] Backed up original src/app to src/app.original`);
    } else {
        fse.removeSync(srcApp);
        console.log(`[assemble-app] Removed existing src/app`);
    }
} else if (fs.existsSync(srcApp)) {
    // Remove existing symlink/directory
    fse.removeSync(srcApp);
    console.log(`[assemble-app] Removed existing src/app`);
}

// Copy generated app to src/app (more reliable than symlinks)
fse.copySync(generated, srcApp);
console.log(`[assemble-app] Copied generated app to src/app`);

console.log(`[assemble-app] ✅ Assembly complete for edition=${edition}`);
