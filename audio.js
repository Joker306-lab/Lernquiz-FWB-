function correctSound(){
try{
const ctx=new (window.AudioContext||window.webkitAudioContext)();
const o=ctx.createOscillator();
o.frequency.value=800;
o.connect(ctx.destination);
o.start();
o.stop(ctx.currentTime+0.2);
}catch(e){}
}
function wrongSound(){
try{
const ctx=new (window.AudioContext||window.webkitAudioContext)();
const o=ctx.createOscillator();
o.frequency.value=200;
o.connect(ctx.destination);
o.start();
o.stop(ctx.currentTime+0.2);
}catch(e){}
}