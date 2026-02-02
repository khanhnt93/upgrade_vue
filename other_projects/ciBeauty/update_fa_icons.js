#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// FA4 to FA6 icon mapping
const iconMap = {
    'fa fa-cubes': 'fa-solid fa-cubes',
    'fa fa-bar-chart': 'fa-solid fa-chart-bar',
    'fa fa-edit': 'fa-solid fa-pen-to-square',
    'fa fa-signal': 'fa-solid fa-signal',
    'fa fa-line-chart': 'fa-solid fa-chart-line',
    'fa fa-phone': 'fa-solid fa-phone',
    'fa fa-home': 'fa-solid fa-house',
    'fa fa-sign-in': 'fa-solid fa-right-to-bracket',
    'fa fa-heart': 'fa-solid fa-heart',
    'fa fa-usd': 'fa-solid fa-dollar-sign',
    'fa fa-address-card': 'fa-solid fa-address-card',
    'fa fa-users': 'fa-solid fa-users',
    'fa fa-history': 'fa-solid fa-clock-rotate-left',
    'fa fa-cog': 'fa-solid fa-gear',
    'fa fa-cogs': 'fa-solid fa-gears',
    'fa fa-gift': 'fa-solid fa-gift',
    'fa fa-user': 'fa-solid fa-user',
    'fa fa-trash': 'fa-solid fa-trash',
    'fa fa-archive': 'fa-solid fa-box-archive',
    'fa fa-balance-scale': 'fa-solid fa-scale-balanced',
    'fa fa-paw': 'fa-solid fa-paw',
    'fa fa-plus': 'fa-solid fa-plus',
    'fa fa-align-left': 'fa-solid fa-align-left',
    'fa fa-cutlery': 'fa-solid fa-utensils',
    'fa fa-table': 'fa-solid fa-table',
    'fa fa-gavel': 'fa-solid fa-gavel',
    'fa fa-print': 'fa-solid fa-print',
    'fa fa-bullhorn': 'fa-solid fa-bullhorn',
    'fa fa-info': 'fa-solid fa-circle-info',
    'fa fa-language': 'fa-solid fa-language',
    'fa fa-calendar': 'fa-solid fa-calendar',
    'fa fa-list': 'fa-solid fa-list',
    'fa fa-file': 'fa-solid fa-file',
    'fa fa-book': 'fa-solid fa-book',
    'fa fa-newspaper-o': 'fa-regular fa-newspaper',
    'fa fa-money': 'fa-solid fa-money-bill',
    'fa fa-calendar-check-o': 'fa-regular fa-calendar-check',
};

// Files to update
const files = [
    'src/navAdmin.js',
    'src/navBrandManager.js',
    'src/navCashier.js',
    'src/navCus.js',
    'src/navCusNotLogin.js',
    'src/navKitchen.js',
    'src/navSpAdmin.js',
    'src/navStaff.js',
];

let totalReplacements = 0;

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    // Replace each icon class
    Object.entries(iconMap).forEach(([oldIcon, newIcon]) => {
        const regex = new RegExp(`icon:\\s*['"]${oldIcon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, `icon: '${newIcon}'`);
            fileReplacements += matches.length;
        }
    });

    if (fileReplacements > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}: ${fileReplacements} icons`);
        totalReplacements += fileReplacements;
    } else {
        console.log(`   ${file}: No changes needed`);
    }
});

console.log(`\n🎉 Total: ${totalReplacements} icon classes updated to FA6 syntax`);
