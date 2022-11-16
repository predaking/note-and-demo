process.nextTick(() => {
    console.log('tick');
});

setTimeout(() => {
    console.log('timer')
});