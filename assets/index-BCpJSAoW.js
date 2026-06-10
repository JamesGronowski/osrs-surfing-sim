var Nf=Object.defineProperty;var Uf=(n,t,e)=>t in n?Nf(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var z=(n,t,e)=>Uf(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const We=16,Jr=360/We,Ff=600,Of=22.5,Ts=2,kf=2,Bf=2.5;function mh(n){return n*Ts}function ml(n){return n/Ts}const Hf=mh(kf),Gf=mh(Bf),Yi={turnRateDegPerTick:Of,speedPaddle:Hf,speedRide:Gf},zf=1,gh=4,Vf=["Low","Medium","High"];function ha(n){return Vf[n]}function xc(n){const t=n%360;return t<0?t+360:t}function tn(n){return xc(n*Jr)}function Wf(n){const t=xc(n);return Math.round(t/Jr)%We}function en(n){const t=xc(n*180/Math.PI);return Wf(t)}function vc(n){const t=tn(n)*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}}function Xf(n,t){let e=(t-n)%We;return e>We/2&&(e-=We),e<-We/2&&(e+=We),e}function Yf(n,t,e){const i=Xf(n,t);if(i===0)return n;const s=Math.max(1,Math.round(e/Jr)),r=Math.sign(i)*Math.min(Math.abs(i),s);return(n+r+We)%We}function lo(n,t,e){const i=Math.min(1,Math.max(0,e)),s=tn(n);let a=tn(t)-s;return a>180&&(a-=360),a<-180&&(a+=360),(s+a*i)/Jr}function _h(n){return n==="grass"||n==="sand"}function qf(n){return n==="deep_water"||n==="shallow"||n==="tide_zone"}function xh(n){return n==="sand"||n==="deep_water"||n==="shallow"||n==="coral_rideable"||n==="tide_zone"}function Kf(n,t,e){const i=Array.from({length:t},()=>Array.from({length:n},()=>e));return{widthTiles:n,heightTiles:t,tiles:i,blockedQuarters:new Set}}function qs(n,t,e,i){e<0||e>=n.heightTiles||t<0||t>=n.widthTiles||(n.tiles[e][t]=i)}function yn(n,t,e){return e<0||e>=n.heightTiles||t<0||t>=n.widthTiles?null:n.tiles[e][t]}function Zf(n,t,e){const i=Math.floor(t),s=Math.floor(e),r=yn(n,i,s);return r===null?!1:qf(r)}function zs(n,t,e){const i=yn(n,Math.floor(t),Math.floor(e));return i===null?!1:xh(i)&&i!=="grass"}const $f=[{tx:1,ty:0},{tx:-1,ty:0},{tx:0,ty:1},{tx:0,ty:-1}],Jf=[{tx:1,ty:1},{tx:1,ty:-1},{tx:-1,ty:1},{tx:-1,ty:-1}];function Ar(n,t,e){const i=yn(n,t,e);return i===null?!1:_h(i)}function jf(n,t,e,i,s){if(!Ar(n,i,s))return!1;const r=i-t,a=s-e;return r===0||a===0?!0:Ar(n,t+r,e)&&Ar(n,t,e+a)}function da(n,t){return`${n},${t}`}function Qf(n,t,e,i,s){if(!Ar(n,i,s))return null;if(t===i&&e===s)return[{tx:t,ty:e}];const r=[{tx:t,ty:e}],a=new Map;for(a.set(da(t,e),null);r.length>0;){const o=r.shift();if(o.tx===i&&o.ty===s){const l=[];let u=o;for(;u;)l.push(u),u=a.get(da(u.tx,u.ty))??null;return l.reverse(),l}const c=[...$f,...Jf];for(const l of c){const u=o.tx+l.tx,d=o.ty+l.ty,h=da(u,d);a.has(h)||jf(n,o.tx,o.ty,u,d)&&(a.set(h,o),r.push({tx:u,ty:d}))}}return null}function tp(n,t){return{x:n+.5,y:t+.5}}const ep=2;function np(n,t,e,i=!0){return{path:n,pathIndex:n.length>1?1:0,running:i,walkTickCounter:0,targetTx:t,targetTy:e}}function ip(n,t,e){const i=yn(n,Math.floor(t),Math.floor(e));return i===null?!1:_h(i)}function sp(n,t,e,i){const s=Math.floor(e),r=Math.floor(i);if(!ip(n,e,i))return null;const a=Math.floor(t.x),o=Math.floor(t.y),c=Qf(n,a,o,s,r);return c?np(c,s,r):null}function rp(n,t,e){if(e.pathIndex>=e.path.length)return{position:n,heading:t,walk:null,moved:!1};if(!e.running&&(e.walkTickCounter+=1,e.walkTickCounter%ep!==0))return{position:n,heading:t,walk:e,moved:!1};const i=e.path[e.pathIndex],s=tp(i.tx,i.ty),r=en(Math.atan2(s.y-n.y,s.x-n.x)),a={...e,pathIndex:e.pathIndex+1},o=a.pathIndex>=a.path.length;return{position:s,heading:r,walk:o?null:a,moved:!0}}function vh(n,t,e=0){return{position:{x:n,y:t},currentHeading:e,intendedHeading:e,speedState:"seated",isRotating:!1}}function ap(n,t,e,i){const s=Math.atan2(i-t,e-n);return en(s)}function op(n,t){return n.speedState==="paddling"?t.speedPaddle/Ts:n.speedState==="riding"?t.speedRide/Ts:n.speedState==="reversing"?-t.speedPaddle/Ts:0}function cp(n,t){const e={...n};return t.setIntendedHeading!==void 0&&(e.intendedHeading=t.setIntendedHeading,e.isRotating=e.intendedHeading!==e.currentHeading),t.startPaddle&&(e.speedState="paddling"),t.standUp&&e.speedState!=="seated"&&(e.speedState="riding"),t.lieDown&&e.speedState==="riding"&&(e.speedState="paddling"),t.reverse&&e.speedState==="seated"&&(e.speedState="reversing"),t.stop&&(e.speedState="seated"),e}function lp(n,t,e){const i=yn(n,Math.floor(t),Math.floor(e));return i===null?!0:!xh(i)}function Mc(n,t,e={},i=Yi){const s=cp(n,e);let r=!1,a=!1,o=!1;const c=s.currentHeading;s.isRotating&&(s.currentHeading=Yf(s.currentHeading,s.intendedHeading,i.turnRateDegPerTick),s.isRotating=s.currentHeading!==s.intendedHeading,o=s.currentHeading!==c);const l=op(s,i);if(l!==0){const u=vc(s.currentHeading),d=s.position.x+u.x*l,h=s.position.y+u.y*l;lp(t,d,h)?a=!0:(s.position={x:d,y:h},r=!0)}return{state:s,moved:r,collided:a,headingChanged:o}}const up=1,Nr=.55,hp=.12,dp=2.2,fp=.08,Mh=.08;function pp(){return up*Nr/(Nr+hp)+fp}const Sc=.6,jr=.14,Sh=3.25,yh=jr,mp=.06,gp=.04,_p={rail:1.15,jump:pp(),brain_coral:.8,wall_ride:.675},xp={rail:.16,jump:dp/2,brain_coral:.8,wall_ride:.17},vp={rail:.54,jump:Nr+Mh,brain_coral:.8,wall_ride:1.09},Mp={rail:.27,jump:(Nr+Mh)/2,brain_coral:.4,wall_ride:.55};function Sp(){const n=Sc,t=jr,e=Sh,i=yh,s=gp,r=i+n+t;return{halfAlongRide:t*e+s,halfLateral:n+t+s,height:r+s,centerY:r/2}}function Eh(n,t){if(n==="tunnel"){const e=Sp();return{halfAlongRide:t*e.halfAlongRide,halfLateral:t*e.halfLateral,height:t*e.height,centerY:t*e.centerY}}return{halfAlongRide:t*_p[n],halfLateral:t*xp[n],height:t*vp[n],centerY:t*Mp[n]}}function Th(n){const t=Eh(n.type,n.radius);return Math.max(t.halfAlongRide,t.halfLateral)}function yp(n,t){const e=t.x-n.center.x,i=t.y-n.center.y,s=Math.cos(n.rotationRadians),r=Math.sin(n.rotationRadians);return{alongRide:e*s+i*r,lateral:-e*r+i*s}}function Ep(n,t){const{halfAlongRide:e,halfLateral:i}=Eh(n.type,n.radius),s=yp(n,t);return Math.abs(s.alongRide)<=e&&Math.abs(s.lateral)<=i}const Tp=.92,Cs=2;function bp(n,t){const e=fe(n),i=fe(t);return e<=i?i-e:Ur-e+i}function bh(n,t){const e=wh(n);return bp(t.phaseRadians,e)<=t.advancePerTick*Cs+1e-9}function Ah(n,t,e=0){if(!t||!ei(n,t))return 1;const i=Math.atan2(n.center.y-t.centerY,n.center.x-t.centerX);if(n.spawnedAtHighTide){if(!bh(i,t))return 0;const r=(n.emergedRenderTicks??0)+e;return Math.min(1,r/Cs)}const s=(n.submergedRenderTicks??0)+e;return Math.max(0,1-Math.min(1,s/Cs))}function Ap(n,t,e=0){return!t||!ei(n,t)?0:1-Ah(n,t,e)}function Rp(n,t){return n.map(e=>{if(!ei(e,t))return e.submergedRenderTicks===void 0&&e.emergedRenderTicks===void 0?e:{...e,submergedRenderTicks:void 0,emergedRenderTicks:void 0};const i=Math.atan2(e.center.y-t.centerY,e.center.x-t.centerX);if(e.spawnedAtHighTide){if(!bh(i,t))return e.emergedRenderTicks===void 0?e:{...e,emergedRenderTicks:void 0};const r=e.emergedRenderTicks;return r===void 0?{...e,emergedRenderTicks:0,submergedRenderTicks:void 0}:r>=Cs?e:{...e,emergedRenderTicks:r+1}}const s=e.submergedRenderTicks;return s===void 0?{...e,submergedRenderTicks:0,emergedRenderTicks:void 0}:s>=Cs?e:{...e,submergedRenderTicks:s+1,emergedRenderTicks:void 0}})}const Ur=Math.PI*2,wp=.05;function Cp(n){return{centerX:n.centerX,centerY:n.centerY,innerRadius:n.innerRadius,outerRadius:n.outerRadius,sweepRadians:n.sweepRadians,phaseRadians:0,advancePerTick:n.advancePerTick??wp,innerRadiusAtAngle:n.innerRadiusAtAngle,outerRadiusAtAngle:n.outerRadiusAtAngle}}function Pp(n){return{...n,phaseRadians:fe(n.phaseRadians+n.advancePerTick)}}function fe(n){const t=n%Ur;return t<0?t+Ur:t}function Rh(n,t,e){const i=fe(t),s=fe(t+e),r=fe(n);return i<=s?r>=i&&r<=s:r>=i||r<=s}function es(n,t,e){var l,u;const i=n-e.centerX,s=t-e.centerY,r=Math.hypot(i,s),a=Math.atan2(s,i),o=((l=e.innerRadiusAtAngle)==null?void 0:l.call(e,a))??e.innerRadius,c=((u=e.outerRadiusAtAngle)==null?void 0:u.call(e,a))??e.outerRadius;return r<o-.3||r>c+.4?!1:Rh(a,e.phaseRadians,e.sweepRadians)}function ei(n,t){return es(n.center.x,n.center.y,t)}function Ip(n){return fe(n.phaseRadians+n.sweepRadians)}function Lp(n,t){return fe(n-t.sweepRadians/2)}function Dp(n,t){return fe(n-t.sweepRadians)}function wh(n){return fe(n)}function Np(n,t){return Up(Dp(n,t),Lp(n,t),Tp)}function gl(n,t){const e=Np(n,t),i=wh(n);return Fp(t.phaseRadians,e,i)}function Up(n,t,e){const i=fe(n),s=fe(t);if(i<=s)return fe(i+(s-i)*e);const r=Ur-i+s;return fe(i+r*e)}function Fp(n,t,e){const i=fe(n),s=fe(t),r=fe(e);return s<=r?i>=s&&i<=r:i>=s||i<=r}function Fr(n,t){return fe(t-n)}function Ch(n,t,e){let i=null,s=1/0;for(const r of n){if(r.tricked||e&&ei(r,e))continue;const a=t.x-r.center.x,o=t.y-r.center.y,c=Math.sqrt(a*a+o*o);Ep(r,t)&&c<s&&(i=r,s=c)}return i}function Op(n){return n.ticksSincePrepare>=zf&&n.ticksSincePrepare<=gh}function Or(n){if(!n)return null;const t=n.ticksSincePrepare+1;return t>gh?null:{...n,ticksSincePrepare:t}}function kp(n,t){return n.map(e=>e.id===t?{...e,tricked:!0}:e)}const Bp=Math.PI*2,Rr=.12,uo=2.6,ho=4.4,ns=ho*1.12,_l=.3,xl=.1;function Hp(n){const t=Math.min(1,Math.max(0,n));return t*t*(3-2*t)}function Ph(n){const t=ns;if(n<=_l)return t*Hp(n/_l);const e=1-xl;if(n<=e)return t;const i=(n-e)/xl;return t*(1-i)}function yc(n,t){const e=Lh(n,t);return e===null?0:Ph(e)}function Ih(n,t,e){var l,u;const i=n-e.centerX,s=t-e.centerY,r=Math.hypot(i,s),a=Math.atan2(s,i),o=((l=e.innerRadiusAtAngle)==null?void 0:l.call(e,a))??e.innerRadius,c=((u=e.outerRadiusAtAngle)==null?void 0:u.call(e,a))??e.outerRadius;return r<o-.5||r>c+.5?0:yc(a,e)}function Lh(n,t){if(!Rh(n,t.phaseRadians,t.sweepRadians))return null;const e=fe(t.phaseRadians),i=fe(n),s=fe(e+t.sweepRadians);return e<=s||i>=e?(i-e)/t.sweepRadians:(Bp-e+i)/t.sweepRadians}function Dh(n,t){const e=Lh(n,t);return e===null?0:Math.sin(Math.PI*e)}function Gp(n,t,e){var l,u;const i=n-e.centerX,s=t-e.centerY,r=Math.hypot(i,s),a=Math.atan2(s,i),o=((l=e.innerRadiusAtAngle)==null?void 0:l.call(e,a))??e.innerRadius,c=((u=e.outerRadiusAtAngle)==null?void 0:u.call(e,a))??e.outerRadius;return r<o-.5||r>c+.5?0:Dh(a,e)}function Nh(n,t,e){if(!e)return Rr;const i=Ih(n,t,e);if(i<=0)return Rr;const s=Gp(n,t,e),r=Rr-s*uo,a=Math.min(1,s+i/ns);return r+a*(i-r)}const zp=2,Un=.28,Vp={rail:1.85,jump:1.65,tunnel:1.75,wall_ride:1.55,brain_coral:1.2},Wp=.46;function Uh(n){const t=n.rotationRadians,e=Math.cos(t),i=Math.sin(t);return{x:e,y:i}}function mi(n,t,e,i){return n*e+t*i}const Xp=.08;function Yp(n,t,e){const i=Uh(n),s=vc(e),r=mi(s.x,s.y,i.x,i.y);if(Math.abs(r)>=.05)return r>=0?i:{x:-i.x,y:-i.y};const a={x:t.x-n.center.x,y:t.y-n.center.y};return mi(a.x,a.y,i.x,i.y)<=0?i:{x:-i.x,y:-i.y}}function qp(n,t,e){if(n.type==="jump")return Yp(n,t,e);const i=Uh(n),s=vc(e),r=mi(s.x,s.y,i.x,i.y),a={x:t.x-n.center.x,y:t.y-n.center.y},o=mi(a.x,a.y,i.x,i.y),c=n.radius*Xp;return o<=-c?i:o>=c?Math.abs(r)>=.05?r>=0?i:{x:-i.x,y:-i.y}:{x:-i.x,y:-i.y}:Math.abs(r)>=.05?r>=0?i:{x:-i.x,y:-i.y}:i}function Kp(n,t,e){const i={x:t.x-n.center.x,y:t.y-n.center.y},s=mi(i.x,i.y,e.x,e.y);return{x:n.center.x+e.x*s,y:n.center.y+e.y*s}}function Zp(n){return en(Math.atan2(n.y,n.x))}function $p(n){return{x:-n.y,y:n.x}}function Jp(n,t,e){const i=$p(e),s={x:t.x-n.center.x,y:t.y-n.center.y},r=mi(s.x,s.y,i.x,i.y);return Math.abs(r)<.01||r>=0?1:-1}function vl(n,t,e){return{x:n.x+(t.x-n.x)*e,y:n.y+(t.y-n.y)*e}}function Fh(n){return n?{type:n.type,zoneRadius:n.zoneRadius,zoneCenter:{...n.zoneCenter},rotationRadians:n.rotationRadians,rideSide:n.rideSide,entry:{...n.entry},start:{...n.start},end:{...n.end},ticksElapsed:n.ticksElapsed,ticksTotal:n.ticksTotal}:null}function Oh(n,t){const e=Math.min(1,Math.max(0,t));if(e<=Un){const s=e/Un;return vl(n.entry,n.start,s)}const i=(e-Un)/(1-Un);return vl(n.start,n.end,i)}function jp(n,t,e,i){const r=t.radius*Vp[t.type]*Wp,a=-r,o=r,c=Kp(t,e,i),l=mi(c.x-t.center.x,c.y-t.center.y,i.x,i.y),u=Math.max(a,Math.min(l,o)),d={x:t.center.x+i.x*u,y:t.center.y+i.y*u};for(let h=4;h>=1;h-=1){const f=h/4,g=u+(o-u)*f,S=t.center.x+i.x*g,p=t.center.y+i.y*g;if(zs(n,S,p))return{start:d,end:{x:S,y:p}}}return{start:d,end:{...d}}}function kh(n,t,e,i){const s=qp(t,e,i),r=Zp(s),{start:a,end:o}=jp(n,t,e,s);return{zoneId:t.id,type:t.type,zoneRadius:t.radius,zoneCenter:{...t.center},rotationRadians:t.rotationRadians,rideSide:Jp(t,e,s),entry:{...e},entryHeading:i,start:a,end:o,endHeading:r,ticksElapsed:0,ticksTotal:zp}}function Qp(n,t){const e=Math.min(1,Math.max(0,t));if(e<=Un){const i=e/Un;return lo(n.entryHeading,n.endHeading,i)}return n.endHeading}function Bh(n){const t=n.ticksElapsed+1,e=Math.min(1,t/n.ticksTotal),i=Oh(n,e),s=Qp(n,e);return t>=n.ticksTotal?{state:null,position:{...n.end},heading:n.endHeading}:{state:{...n,ticksElapsed:t},position:i,heading:s}}const Hh=560,Gh=448,nn=Hh/2,sn=Gh/2,zh=40,tm=52,em=60,Vh=66,Wh=120,nm=16,im=16.5,sm=17,rm=17.5,am=14,om=-.9,cm=.55,lm=16,um=2.3,hm=.45,dm=8,fm=14;function Ml(n,t,e){let i=n-t;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return Math.exp(-(i*i)/(2*e*e))}function pm(n,t){const e=.26*Math.sin(n+.7)+.5*Math.sin(n*2+.55)+.34*Math.sin(n*3+1.85)+.18*Math.sin(n*5+.95)+.08*Math.sin(n*8+2.6),i=t*e-lm*Ml(n,om,cm)+dm*Ml(n,um,hm);return Math.max(i,fm-zh)}function Qr(n,t,e){return t+pm(n,e)}function mm(n,t,e){return t+e*(.38*Math.sin(n+2.35)+.27*Math.sin(n*3+.15)+.2*Math.sin(n*6+3.05)+.15*Math.sin(n*9+1.2))}function Ec(n){return Qr(n,zh,nm)}function kr(n){return Qr(n,tm,im)}function gm(n){return Qr(n,em,sm)}function Br(n){return Qr(n,Vh,rm)}function Ps(n){return mm(n,Wh,am)}function _m(n,t){return Math.atan2(t-sn+.5,n-nn+.5)}function xm(n,t){return Math.hypot(n-nn+.5,t-sn+.5)}const Xh=.1,Ms=.25,Yh=3.6;function vm(){return`${Xh}|${Ms}|${Yh}`}function zi(n,t,e){const i=Math.atan2(t-sn,n-nn),s=Math.hypot(n-nn,t-sn),r=Ec(i),a=kr(i);if(e==="grass"){const l=r>0?Math.min(1,s/r):1,u=(1-l)*(1-l);return Ms+u*(Yh-Ms)}const o=a-r,c=o>0?Math.min(1,Math.max(0,(s-r)/o)):1;return Ms+c*(Xh-Ms)}const Mm=Vh,Sm=Wh,bs=Math.PI*2,Gn=.55,ym=.28,Em=.5,Tm=.22,Sl=.22,bm=.12,ta=.4,qh=.22,fo=8,Am=2,Rm=45,wm=4,Cm=2,po=12,Tc=.18,Pm=16,Im=7,Lm=.7,Dm=40,Nm=5,Um=2,Fm=4,Om=18,km=.3,Bm=25,Hm=30,Gm=.5,zm=70,Vm=8,Wm=4,Kh=10,Zh={kind:"loop",ringDepth:Gn,doesTricks:!0};function $h(n){return{direction:1,wanderTarget:null,loungeTicksRemaining:0,lastPosition:null,stuckTicks:0,rngState:n>>>0||1}}function Is(n){let t=n.rngState;return t^=t<<13>>>0,t^=t>>>17,t^=t<<5>>>0,n.rngState=t>>>0,n.rngState/4294967296}function ea(n,t){let e=(t-n)%bs;return e>Math.PI&&(e-=bs),e<-Math.PI&&(e+=bs),e}function Ke(n,t){const e=n-nn,i=t-sn;return{angle:Math.atan2(i,e),radius:Math.hypot(e,i)}}function bc(n){return n+Math.PI/2}function Jh(n){return bs-n.sweepRadians}function Xm(n,t){const{fromTrailing:e}=na(n,t);return e>Jh(t)*Em}function Ym(n,t){const{fromTrailing:e,toLeading:i}=na(n,t),s=t.sweepRadians*Tm,r=t.sweepRadians*ta+gi(t);return e<s||i<r}function qm(n,t){const{fromTrailing:e,toLeading:i}=na(n,t),s=t.sweepRadians*Sl,r=t.sweepRadians*Sl+gi(t);return e<s||i<r}function Km(n,t,e=Gn){const i=Ls(n,t),s=t.sweepRadians*ta+gi(t),r=t.sweepRadians*qh+gi(t);if(i>=s)return e;const a=Math.min(e,ym),o=1-(i-r)/Math.max(s-r,.01),c=Math.min(1,Math.max(0,o));return e+(a-e)*c}function Zm(n,t){const e=Br(n),i=Ps(n),s=e+(i-e)*t;return{x:nn+Math.cos(n)*s,y:sn+Math.sin(n)*s}}function ni(n,t=null,e=Gn){const i=t?Km(n,t,e):e;return Zm(n,i)}function jh(n,t,e,i,s=Gn,r=1){const{angle:a,radius:o}=Ke(n.x,n.y),c=ni(a,i,s),l=Math.hypot(c.x-nn,c.y-sn),u=bc(a)+(r===1?0:Math.PI),h=i!==null&&Ls(a,i)<i.sweepRadians*ta+gi(i)?.2:.08,f=o-l,g=Math.max(-.45,Math.min(.45,f*h)),S=Math.cos(u)*.82+Math.cos(a)*g+(t-n.x)*.06,p=Math.sin(u)*.82+Math.sin(a)*g+(e-n.y)*.06;return en(Math.atan2(p,S))}function na(n,t){const e=Ip(t),i=t.phaseRadians;return{fromTrailing:Fr(e,n),toLeading:Fr(n,i)}}function gi(n){return n.advancePerTick*wm}function Ls(n,t){return na(n,t).toLeading}function $m(n,t,e,i=Gn){if(es(n.x,n.y,e))return!1;const{angle:s}=Ke(n.x,n.y),r=Ls(s,e),a=e.sweepRadians*qh+gi(e),o=jm(n,e,t.speedState,i);return r<a||o}function Jm(n){return(n+Am+We)%We}function jm(n,t,e,i=Gn){if(e!=="riding")return!1;const{angle:s,radius:r}=Ke(n.x,n.y),a=t.sweepRadians*ta+gi(t);if(Ls(s,t)>a*1.15)return!1;const c=2.5/Math.max(r,1);for(let l=1;l<=Cm;l+=1){const u=s+c*l,d=ni(u,null,i);if(es(d.x,d.y,t)||Ls(u,t)<a)return!0}return!1}function Qm(n,t,e){if(!t)return{standUp:!0};const{angle:i}=Ke(n.x,n.y);return es(n.x,n.y,t)?{lieDown:!0}:e?{standUp:!0}:Ym(i,t)?{lieDown:!0}:{standUp:!0}}function tg(n,t,e,i=null){if(!e)return null;const s=Ke(n.x,n.y).angle,r=qm(s,e),a=Jh(e);let o=null,c=1/0;for(const l of t){if(l.tricked||ei(l,e))continue;const u=Math.atan2(l.center.y-e.centerY,l.center.x-e.centerX);if(i&&Math.abs(ea(i.centerRadians,u))>i.halfWidthRadians)continue;const d=Fr(s,u);if(!(Fr(u,s)<=bm)&&d>a)continue;const f=Math.hypot(n.x-l.center.x,n.y-l.center.y);f<c&&(c=f,o=l)}return r&&o!==null&&c>po+4?null:o}function Qh(n,t){const e=Math.hypot(n.x-t.center.x,n.y-t.center.y);if(e>20)return{steerX:t.center.x,steerY:t.center.y};if(e>Th(t)+2.5)return{steerX:t.center.x,steerY:t.center.y};const i=n.x+Math.cos(t.rotationRadians)*5,s=n.y+Math.sin(t.rotationRadians)*5;return{steerX:i,steerY:s}}function td(n,t,e,i){if(e)return;const s=Math.hypot(n.x-t.center.x,n.y-t.center.y),r=i?po+4:po,a=Th(t)*(i?.35:.45);if(s<r&&s>a)return t.prepareSlot}function ed(n,t,e){const i=Math.hypot(e.x-t.x,e.y-t.y),s=Math.max(1,Math.ceil(i/Wm));for(let r=1;r<=s;r+=1){const a=r/s,o=t.x+(e.x-t.x)*a,c=t.y+(e.y-t.y)*a;if(!zs(n,o,c))return!1}return!0}function eg(n,t,e){for(let i=0;i<Vm;i+=1){const s=Is(e)*bs-Math.PI,r=kr(s)+2,a=Ps(s)+10,o=r+Is(e)*(a-r),c=nn+Math.cos(s)*o,l=sn+Math.sin(s)*o;if(zs(n,c,l)&&ed(n,t,{x:c,y:l}))return{x:c,y:l}}return ni(Ke(t.x,t.y).angle+.6)}function ng(n){const t={...n};return Is(t)<Gm?(t.loungeTicksRemaining=zm,t.wanderTarget=null,{aiState:t,lounge:!0}):{aiState:t,lounge:!1}}function ig(n,t){const{surfboard:e,map:i}=n,s=e.position;if(t.loungeTicksRemaining>0)return t.loungeTicksRemaining-=1,{stop:!0,setIntendedHeading:e.currentHeading};const r=t.lastPosition,a=!r||Math.hypot(s.x-r.x,s.y-r.y)>.01;t.lastPosition={...s},t.stuckTicks=a?0:t.stuckTicks+1,t.stuckTicks>Kh&&(t.wanderTarget=null,t.stuckTicks=0);const o=t.wanderTarget,c=o?Math.hypot(o.x-s.x,o.y-s.y):1/0;if(!o||c<Fm){if(Is(t)<km)return t.loungeTicksRemaining=Bm+Math.floor(Is(t)*Hm),t.wanderTarget=null,{stop:!0,setIntendedHeading:e.currentHeading};t.wanderTarget=eg(i,s,t)}const l=t.wanderTarget,u=en(Math.atan2(l.y-s.y,l.x-s.x));return{...c>Om?{standUp:!0}:{lieDown:!0},setIntendedHeading:u}}function sg(n,t,e){const{surfboard:i,trickPrepare:s,trickZones:r,tide:a}=n,o=i.position,c=Ke(o.x,o.y).angle;if(t.kind==="sector"){const v=ea(t.centerRadians,c);v>t.halfWidthRadians?e.direction=-1:v<-t.halfWidthRadians&&(e.direction=1)}const l=t.kind==="sector"?e.direction:1,u=a!==null&&Xm(c,a),d=t.kind==="sector"?{centerRadians:t.centerRadians,halfWidthRadians:t.halfWidthRadians}:null,h=t.doesTricks&&l===1?tg(o,r,a,d):null;let f=o.x,g=o.y;if(h){const v=Qh(o,h);f=v.steerX,g=v.steerY}else{const v=c+l*Tc,E=ni(v,a,t.ringDepth);f=E.x,g=E.y}const m={...Qm(o,a,h!==null),setIntendedHeading:jh(o,f,g,a,t.ringDepth,l)};if(h){const v=td(o,h,s,u);v!==void 0&&(m.prepareSlot=v)}return m}function rg(n,t,e){for(const i of[0,.5,-.5,1,-1]){const s=t.facingRadians+i;for(const r of[1,1.4,2,2.8]){const a=t.x+Math.cos(s)*e*r,o=t.y+Math.sin(s)*e*r;if(zs(n,a,o))return{x:a,y:o}}}return ni(Ke(t.x,t.y).angle)}function ag(n,t,e,i){let s=null,r=1/0;for(const a of e){if(a.tricked||i&&ei(a,i))continue;const o=Math.atan2(a.center.y-t.y,a.center.x-t.x);if(Math.abs(ea(t.facingRadians,o))>Lm||Math.hypot(a.center.x-t.x,a.center.y-t.y)>Dm)continue;const l=Math.hypot(a.center.x-n.x,a.center.y-n.y);l<r&&(r=l,s=a)}return s}function yl(n,t,e,i){if(ed(n,e,i))return en(Math.atan2(i.y-e.y,i.x-e.x));const s=Ke(e.x,e.y).angle,r=Ke(i.x,i.y).angle,a=ea(s,r)>=0?1:-1,o=ni(s+a*Tc*1.5,t);return en(Math.atan2(o.y-e.y,o.x-e.x))}function og(n,t,e){const{surfboard:i,trickPrepare:s,trickZones:r,tide:a,map:o,audience:c}=n,l=i.position;if(!c){const p=Ke(l.x,l.y).angle,m=ni(p+Tc,a);return{standUp:!0,setIntendedHeading:jh(l,m.x,m.y,a)}}if(a&&es(l.x,l.y,a)){const p=bc(Ke(l.x,l.y).angle)+Math.PI;return{standUp:!0,setIntendedHeading:en(p)}}if(Math.hypot(l.x-c.x,l.y-c.y)<Im)return{standUp:!0,setIntendedHeading:en(Math.atan2(l.y-c.y,l.x-c.x))};const d=e.lastPosition,h=!d||Math.hypot(l.x-d.x,l.y-d.y)>.01;if(e.lastPosition={...l},e.stuckTicks=h?0:e.stuckTicks+1,e.stuckTicks>Kh)return e.stuckTicks=0,{standUp:!0,setIntendedHeading:en(Ke(l.x,l.y).angle)};const f=ag(l,c,r,a);if(f){const p=Qh(l,f),m={standUp:!0,setIntendedHeading:yl(o,a,l,{x:p.steerX,y:p.steerY})},v=td(l,f,s,!0);return v!==void 0&&(m.prepareSlot=v),m}const g=rg(o,c,t.followDistance);return Math.hypot(g.x-l.x,g.y-l.y)<Nm?{standUp:!0,setIntendedHeading:(i.currentHeading+Um+We)%We}:{standUp:!0,setIntendedHeading:yl(o,a,l,g)}}function cg(n){const t=n.behavior??Zh,e={...n.aiState??$h(1)},{surfboard:i}=n,s=t.kind==="explorer"&&e.loungeTicksRemaining>0;return i.speedState==="seated"&&!s?{input:{startPaddle:!0,standUp:!0,setIntendedHeading:i.currentHeading},aiState:e}:{input:t.kind==="explorer"?ig(n,e):t.kind==="showoff"?og(n,t,e):sg(n,t,e),aiState:e}}function lg(n,t=Gn){const e=ni(n,null,t);return{x:e.x,y:e.y,heading:en(bc(n))}}const Ac=4,ug=12,Hr=["rail","tunnel","jump","brain_coral","wall_ride"],nd={rail:0,brain_coral:0,tunnel:1,wall_ride:1,jump:2},hg=.22,El=.22,dg=.92,id=5,fg=.2,Ds=Math.PI*2,Tl=-5,pg=5;function sd(n=Math.random){const t=pg-Tl;return(Tl+n()*t)*Math.PI/180}function mg(n){return n-Math.PI/2}function rd(n,t){const e=mg(n),i=n+Math.PI/2;return t?i:e}function gg(){return{nextZoneId:1e3}}function Rc(n,t){return ud(hg+n*(Ds/t))}function ad(n=Math.random){return El+n()*(dg-El)}function od(n,t){return Math.atan2(n.center.y-t.centerY,n.center.x-t.centerX)}function cd(n,t,e){const i=Br(t),s=Ps(t);for(let r=e;r>=.18;r-=.04){const a=i+(s-i)*r,o=nn+Math.cos(t)*a,c=sn+Math.sin(t)*a;if(yn(n,Math.floor(o),Math.floor(c))==="coral_rideable")return{x:o,y:c}}return null}function ld(n,t){for(const e of t)if(Math.hypot(n.x-e.center.x,n.y-e.center.y)-Ac*2<ug)return!1;return!0}function _g(n=Math.random){return Hr[Math.floor(n()*Hr.length)]}function xg(n,t,e,i,s,r,a=Math.random,o=!0,c=!1){const l=cd(n,t,r);if(!l||o&&!ld(l,s)||!c&&es(l.x,l.y,e))return null;const u=_g(a),d=a()<fg,h=rd(t,d);return{id:i,type:u,prepareSlot:nd[u],center:l,radius:Ac,rotationRadians:h,rotationJitterRadians:sd(a),tricked:!1}}function vg(n,t,e,i,s,r,a){for(let o=0;o<id;o+=1){const c=xg(n,t,e,i,s,ad(r),r,!0,a);if(c)return c}return null}function Mg(n,t,e,i,s,r=Math.random){const a=Ds/s*.35,o=[];for(const c of n){const l=od(c,t);if(!ei(c,t)){o.push(c.spawnedAtHighTide?{...c,spawnedAtHighTide:void 0}:c);continue}gl(l,t)&&!c.spawnedAtHighTide||o.push(c)}for(let c=0;c<s&&!(o.length>=s);c+=1){if(Sg(o,t,c,s,a))continue;const l=Rc(c,s);if(!gl(l,t))continue;const u=vg(e,l,t,`feature-${i.nextZoneId}`,o,r,!0);u&&(i.nextZoneId+=1,o.push({...u,spawnedAtHighTide:!0}))}return o}function Sg(n,t,e,i,s){const r=Rc(e,i);return n.some(a=>{const o=od(a,t);return yg(o,r,s)})}function yg(n,t,e){let i=Math.abs(ud(n-t));return i>Math.PI&&(i=Ds-i),i<=e}function ud(n){const t=n%Ds;return t<0?t+Ds:t}const mo=28;function Eg(n){const t=[];for(let e=0;e<mo;e+=1){const i=Rc(e,mo);let s=null;for(let c=0;c<id;c+=1){const l=cd(n,i,ad());if(l&&ld(l,t)){s=l;break}}if(!s)continue;const r=Hr[e%Hr.length],a=e%5===0,o=rd(i,a);t.push({id:`${r}-${e}`,type:r,prepareSlot:nd[r],center:s,radius:Ac,rotationRadians:o,rotationJitterRadians:sd(),tricked:!1})}return t}const bl=2.3,Tg=.9,bg=.45,Ag=.82,Rg=1.25;function wg(){return[{id:"nalu",name:"Nalu",spawnAngle:-Math.PI/4,behavior:{kind:"loop",ringDepth:Gn,doesTricks:!0}},{id:"kai",name:"Kai",spawnAngle:bl,behavior:{kind:"sector",centerRadians:bl,halfWidthRadians:Tg,ringDepth:bg,doesTricks:!0}},{id:"hina",name:"Hina",spawnAngle:-Math.PI*3/4,behavior:{kind:"loop",ringDepth:Ag,doesTricks:!1}},{id:"tama",name:"Tama",spawnAngle:Math.PI,behavior:{kind:"explorer"}},{id:"koa",name:"Koa",spawnAngle:Math.PI/2+.4,behavior:{kind:"showoff",followDistance:Pm},speedMultiplier:Rg}].map(t=>{const e=t.behavior.kind==="loop"||t.behavior.kind==="sector"?t.behavior.ringDepth:void 0,i=lg(t.spawnAngle,e);return{id:t.id,name:t.name,startX:i.x,startY:i.y,startHeading:i.heading,behavior:t.behavior,speedMultiplier:t.speedMultiplier}})}function Cg(){const n=Hh,t=Gh,e=Kf(n,t,"deep_water");for(let d=0;d<t;d+=1)for(let h=0;h<n;h+=1){const f=_m(h,d),g=xm(h,d),S=Ec(f),p=kr(f),m=gm(f),v=Br(f),E=Ps(f);g<=S?qs(e,h,d,"grass"):g<=p?qs(e,h,d,"sand"):g<=m?qs(e,h,d,"shallow"):g>=v&&g<=E&&qs(e,h,d,"coral_rideable")}const i=Math.PI/2,s=kr(i),r=nn,a=sn+s-1.5,o=r-1.2,c=a-1.8,l=r+1.2,u=a-1.5;return{map:e,spawnX:o,spawnY:c,spawnHeading:4,boardDockX:r,boardDockY:a,requiresBoardMount:!0,tide:{centerX:nn,centerY:sn,innerRadius:Mm,outerRadius:Sm,innerRadiusAtAngle:Br,outerRadiusAtAngle:Ps,sweepRadians:Math.PI/1.35,advancePerTick:.022},npcs:[{id:"guru",name:"Kaulu the Surf Guru",x:l,y:u,interactRadius:.9,dialogue:["Welcome to Coral Park, surfer!","Your board sits on the sand ring — click it when you are ready.","Ride the wide reef loop around the island.","Yellow chevrons show which way to ride through each feature.","Prime a trick button 1–4 ticks before you hit the matching coral.","Tai'ura's tide submerges features — they fade underwater, then fresh coral rises as the swell passes.","Watch Nalu and her friends ride the reef — they time the swell to hit features in the dry zone."]}],demoSurfers:wg(),trickZones:Eg(e)}}function Pg(n,t,e){for(const i of n){const s=t-i.x,r=e-i.y;if(Math.hypot(s,r)<=i.interactRadius)return i}return null}function Ig(n,t,e){for(const i of n)if(Math.floor(i.x)===t&&Math.floor(i.y)===e)return i;return null}function Lg(n,t,e,i=0){for(const s of n){const r=t-s.x,a=e-s.y;if(Math.hypot(r,a)<=s.interactRadius+i)return s}return null}function Al(n,t,e,i=.3){const s=t-n.x,r=e-n.y;return Math.hypot(s,r)<=n.interactRadius+i}function Dg(n){let t=2166136261;for(let e=0;e<n.length;e+=1)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Ng(n,t){const e=vh(n.startX,n.startY,n.startHeading),i=t??{...Yi},s=n.speedMultiplier??1,r=s===1?i:{turnRateDegPerTick:i.turnRateDegPerTick*s,speedPaddle:i.speedPaddle*s,speedRide:i.speedRide*s};return{config:n,behavior:n.behavior??Zh,aiState:$h(Dg(n.id)),surfboard:{...e,speedState:"riding"},trickPrepare:null,trickAnimation:null,activeTrickZoneId:null,tideSpinTicksRemaining:0,stats:r}}function Ug(n){return n.tideSpinTicksRemaining<=0?null:1-n.tideSpinTicksRemaining/fo}function Fg(n){return{id:n.config.id,name:n.config.name,surfboard:{...n.surfboard,position:{...n.surfboard.position}},trickPrepare:n.trickPrepare?{...n.trickPrepare}:null,trickAnimation:Fh(n.trickAnimation),tideSpinProgress:Ug(n)}}function Og(n,t,e){const i=kh(e,t,n.surfboard.position,n.surfboard.currentHeading);return{...n,trickPrepare:null,trickAnimation:i,activeTrickZoneId:null,tideSpinTicksRemaining:0,surfboard:{...n.surfboard,speedState:"riding",intendedHeading:i.endHeading,isRotating:!1}}}function fa(n,t){const e={...n.stats,turnRateDegPerTick:Rm},i=Mc(n.surfboard,t,{lieDown:!0,setIntendedHeading:Jm(n.surfboard.currentHeading)},e);return{...n,surfboard:i.state,tideSpinTicksRemaining:Math.max(0,n.tideSpinTicksRemaining-1),trickPrepare:Or(n.trickPrepare),activeTrickZoneId:null}}function kg(n,t,e,i,s=null){if(n.trickAnimation){const d=Bh(n.trickAnimation);return{...n,trickAnimation:d.state,surfboard:{...n.surfboard,position:d.position,currentHeading:d.heading,intendedHeading:d.heading,isRotating:!1},trickPrepare:Or(n.trickPrepare)}}if(n.tideSpinTicksRemaining>0)return fa(n,t);const r=n.behavior.kind==="loop"||n.behavior.kind==="sector"?n.behavior.ringDepth:Gn;if(n.behavior.kind!=="showoff"&&i&&$m(n.surfboard.position,n.surfboard,i,r)){if(n.behavior.kind!=="explorer")return fa({...n,tideSpinTicksRemaining:fo},t);if(n.aiState.loungeTicksRemaining<=0){const d=ng(n.aiState);if(n={...n,aiState:d.aiState},!d.lounge)return fa({...n,tideSpinTicksRemaining:fo},t)}}const a=cg({surfboard:n.surfboard,trickPrepare:n.trickPrepare,trickZones:e,tide:i,map:t,behavior:n.behavior,aiState:n.aiState,audience:s}),{prepareSlot:o,...c}=a.input;let l={...n,aiState:a.aiState};o!==void 0&&(l={...l,trickPrepare:{slot:o,ticksSincePrepare:0}});const u=Mc(l.surfboard,t,c,l.stats);if(l={...l,surfboard:u.state,trickPrepare:Or(l.trickPrepare)},l.surfboard.speedState!=="seated"){const d=Ch(e,l.surfboard.position,i);return d&&l.activeTrickZoneId!==d.id?Og({...l,activeTrickZoneId:d.id},d,t):d?l:{...l,activeTrickZoneId:null}}return{...l,activeTrickZoneId:null}}const Gr=[{id:"teeny_tai",name:"Teeny Tai",description:"Miniature wave spirit pet resembling Tai'ura.",tokenCost:null,earnOnly:!0},{id:"taiura_blessing",name:"Tai'ura's Blessing",description:"Coral blessing for ship combat ammo recovery.",tokenCost:500,minSailingLevel:40},{id:"ebb_and_flow",name:"Ebb and Flow",description:"Lunar spell — weapon swap grants a boosted attack.",tokenCost:750,minSailingLevel:60},{id:"living_coral",name:"Living Coral",description:"20% chance to double grinding output.",tokenCost:400,minAgilityLevel:50},{id:"coral_rail_cosmetic",name:"Coral Rail Trim",description:"Cosmetic surfboard rail glow.",tokenCost:150},{id:"surf_guru_board",name:"Ironwood Board",description:"Tier-2 surfboard cosmetic from the guru.",tokenCost:300,minAgilityLevel:30}],wc=["Bronze","Iron","Steel","Mithril","Adamant","Rune","Dragon"];function Bg(n){return n<=0?1:Math.min(wc.length,Math.floor(n/10)+1)}function Hg(n){return n<=0?0:Math.min(wc.length-1,Math.floor(n/10))}function Rl(n){return wc[Hg(n)]}function Gg(n){if(n<=0)return 0;const t=n%10;return t===0?10:t}const zg=45,Vg=35,wl=1/10,Cl=6,Wg=10,Xg=new Set(Gr.map(n=>n.id));function Yg(){return{xp:{agility:0,sailing:0},coralTokens:0,unlocked:new Set,session:{tricksLanded:0,combo:0,maxCombo:0}}}function qg(n){return{xp:{...n.xp},coralTokens:n.coralTokens,unlocked:new Set(n.unlocked),session:{...n.session}}}function Kg(n){return{xp:{...n.xp},coralTokens:n.coralTokens,unlocked:[...n.unlocked],session:{...n.session}}}function Ti(n){return typeof n=="number"&&Number.isFinite(n)&&n>=0}function Zg(n){if(!n||typeof n!="object")return null;const t=n;if(!t.xp||typeof t.xp!="object"||!Ti(t.xp.agility)||!Ti(t.xp.sailing)||!Ti(t.coralTokens)||!t.session||typeof t.session!="object"||!Ti(t.session.tricksLanded)||!Ti(t.session.combo)||!Ti(t.session.maxCombo)||!Array.isArray(t.unlocked))return null;const e=[];for(const i of t.unlocked){if(typeof i!="string"||!Xg.has(i))return null;e.push(i)}return{xp:{agility:t.xp.agility,sailing:t.xp.sailing},coralTokens:t.coralTokens,unlocked:new Set(e),session:{tricksLanded:t.session.tricksLanded,combo:t.session.combo,maxCombo:t.session.maxCombo}}}function go(n){return Math.floor(Math.sqrt(n/100))+1}function _o(n){return Math.floor(Math.sqrt(n/120))+1}function hd(n,t){return t.earnOnly?{ok:!1,reason:"Earned through gameplay only"}:n.unlocked.has(t.id)?{ok:!1,reason:"Already unlocked"}:t.tokenCost!==null&&n.coralTokens<t.tokenCost?{ok:!1,reason:"Not enough Coral Tokens"}:t.minAgilityLevel&&go(n.xp.agility)<t.minAgilityLevel?{ok:!1,reason:`Requires Agility ${t.minAgilityLevel}`}:t.minSailingLevel&&_o(n.xp.sailing)<t.minSailingLevel?{ok:!1,reason:`Requires Sailing ${t.minSailingLevel}`}:{ok:!0}}function $g(n,t){const e=Gr.find(r=>r.id===t);if(!e)return{state:n,success:!1,reason:"Unknown unlock"};const i=hd(n,e);return i.ok?{state:{...n,coralTokens:e.tokenCost!==null?n.coralTokens-e.tokenCost:n.coralTokens,unlocked:new Set([...n.unlocked,t])},success:!0}:{state:n,success:!1,reason:i.reason}}function Jg(n=Math.random){const t=n();if(t>=wl)return 0;const e=Wg-Cl+1,i=Math.floor(t/wl*e);return Cl+Math.min(e-1,i)}function jg(n,t=Math.random){const e=n.session.combo+1,i=Bg(e),s={agility:zg*i,sailing:Vg*i},r=Jg(t);return{state:{...n,xp:{agility:n.xp.agility+s.agility,sailing:n.xp.sailing+s.sailing},coralTokens:n.coralTokens+r,session:{tricksLanded:n.session.tricksLanded+1,combo:e,maxCombo:Math.max(n.session.maxCombo,e)}},xpGained:s,tokensGained:r}}function Qg(n){return n.session.combo===0?n:{...n,session:{...n.session,combo:0}}}class t0{constructor(t){z(this,"surfboard");z(this,"progression");z(this,"trickZones");z(this,"tide");z(this,"pendingInput",{});z(this,"stats");z(this,"arena");z(this,"tickMs");z(this,"cursorWorldX",null);z(this,"cursorWorldY",null);z(this,"hoverHeading",null);z(this,"clickValid",!0);z(this,"tickCount",0);z(this,"xpDrops",[]);z(this,"npcDialogueIndex",new Map);z(this,"proximityGreeted",new Set);z(this,"pendingDialogue",[]);z(this,"boardMounted");z(this,"walk",null);z(this,"walkClickMarker",null);z(this,"pendingNpcTalk",null);z(this,"pendingBoardMount",!1);z(this,"trickZoneTideSync");z(this,"trickPrepare",null);z(this,"activeTrickZoneId",null);z(this,"trickAnimation",null);z(this,"tideFrozen",!1);z(this,"cameraFacingRadians",null);z(this,"movementFrozen",!1);z(this,"boardInteractRadius",1.3);z(this,"demoSurfers",[]);this.arena=t.arena,this.boardMounted=!t.arena.requiresBoardMount,this.stats=t.stats??{...Yi},this.tickMs=t.tickMs??Ff,this.surfboard=vh(t.arena.spawnX,t.arena.spawnY,t.arena.spawnHeading),this.progression=t.initialProgression?qg(t.initialProgression):Yg(),this.trickZones=t.arena.trickZones.map(e=>({...e})),this.tide=t.arena.tide?Cp(t.arena.tide):null,this.trickZoneTideSync=gg(),this.demoSurfers=t.arena.demoSurfers.map(e=>Ng(e,this.stats))}getSnapshot(){var t,e,i;return{surfboard:{...this.surfboard,position:{...this.surfboard.position}},progression:{...this.progression,unlocked:new Set(this.progression.unlocked),session:{...this.progression.session},xp:{...this.progression.xp}},trickZones:this.trickZones.map(s=>({...s,center:{...s.center}})),npcs:this.arena.npcs.map(s=>({...s,dialogue:[...s.dialogue]})),boardDockX:this.arena.boardDockX,boardDockY:this.arena.boardDockY,boardMounted:this.boardMounted,tide:this.tide?{...this.tide}:null,cursorWorldX:this.cursorWorldX,cursorWorldY:this.cursorWorldY,hoverHeading:this.hoverHeading,clickValid:this.clickValid,tickCount:this.tickCount,walkTargetTx:((t=this.walkClickMarker)==null?void 0:t.tx)??null,walkTargetTy:((e=this.walkClickMarker)==null?void 0:e.ty)??null,walkClickValid:((i=this.walkClickMarker)==null?void 0:i.valid)??!0,onFootMoving:this.walk!==null,trickPrepare:this.trickPrepare?{...this.trickPrepare}:null,trickAnimation:Fh(this.trickAnimation),demoSurfers:this.demoSurfers.map(s=>Fg(s))}}consumeXpDrops(){const t=this.xpDrops;return this.xpDrops=[],t}setCursor(t,e){if(this.cursorWorldX=t,this.cursorWorldY=e,!this.boardMounted){this.clickValid=!0,this.hoverHeading=null;return}const i=this.boardMounted?zs(this.arena.map,t,e):Zf(this.arena.map,t,e);this.clickValid=i,this.clickValid?this.hoverHeading=ap(this.surfboard.position.x,this.surfboard.position.y,t,e):this.hoverHeading=null}clearCursor(){this.cursorWorldX=null,this.cursorWorldY=null,this.hoverHeading=null,this.clickValid=!0}consumeDialogue(){const t=this.pendingDialogue;return this.pendingDialogue=[],t}clickWorld(t,e){const i=Math.floor(t),s=Math.floor(e),r=Pg(this.arena.npcs,t,e)??Ig(this.arena.npcs,i,s);if(r){this.handleNpcClick(r);return}if(!this.boardMounted&&this.isBoardClick(i,s,t,e)){this.handleBoardClick();return}if(!this.boardMounted){this.pendingNpcTalk=null,this.pendingBoardMount=!1,this.clickToWalk(t,e);return}this.clickOcean(t,e)}handleNpcClick(t){if(Al(t,this.surfboard.position.x,this.surfboard.position.y)){this.queueNpcDialogue(t);return}this.pendingNpcTalk=t,this.pendingBoardMount=!1,this.clickToWalk(t.x,t.y)}handleBoardClick(){if(this.isNearBoard()){this.tryMountBoard();return}this.pendingBoardMount=!0,this.pendingNpcTalk=null,this.clickToWalk(this.arena.boardDockX,this.arena.boardDockY)}isBoardClick(t,e,i,s){const r=Math.floor(this.arena.boardDockX),a=Math.floor(this.arena.boardDockY);if(t===r&&e===a)return!0;const o=i-this.arena.boardDockX,c=s-this.arena.boardDockY;return Math.hypot(o,c)<=this.boardInteractRadius}isNearBoard(){const t=this.surfboard.position.x-this.arena.boardDockX,e=this.surfboard.position.y-this.arena.boardDockY;return Math.hypot(t,e)<=this.boardInteractRadius}clickToWalk(t,e){const i=Math.floor(t),s=Math.floor(e),r=sp(this.arena.map,this.surfboard.position,t,e);if(!r){this.walk=null,this.walkClickMarker={tx:i,ty:s,valid:!1};return}this.walk=r,this.walkClickMarker={tx:i,ty:s,valid:!0}}tryMountBoard(){return this.boardMounted||this.surfboard.speedState!=="seated"||!this.isNearBoard()?!1:(this.boardMounted=!0,this.walk=null,this.walkClickMarker=null,this.pendingBoardMount=!1,this.surfboard={...this.surfboard,position:{x:this.arena.boardDockX,y:this.arena.boardDockY},currentHeading:this.arena.spawnHeading,intendedHeading:this.arena.spawnHeading,isRotating:!1},this.pendingDialogue.push("You climb onto your surfboard."),!0)}clickOcean(t,e){this.setCursor(t,e),!(!this.clickValid||this.hoverHeading===null)&&(this.pendingInput.setIntendedHeading=this.hoverHeading)}queueNpcDialogue(t){const e=this.npcDialogueIndex.get(t.id)??0,i=t.dialogue[e];i!==void 0&&(this.pendingDialogue.push(`${t.name}: ${i}`),this.npcDialogueIndex.set(t.id,e+1))}checkProximityDialogue(){if(this.boardMounted&&this.surfboard.speedState!=="seated")return;const t=Lg(this.arena.npcs,this.surfboard.position.x,this.surfboard.position.y,.6);!t||this.proximityGreeted.has(t.id)||(this.proximityGreeted.add(t.id),this.queueNpcDialogue(t))}resolvePendingInteractions(){this.pendingNpcTalk&&Al(this.pendingNpcTalk,this.surfboard.position.x,this.surfboard.position.y)&&(this.queueNpcDialogue(this.pendingNpcTalk),this.pendingNpcTalk=null),this.pendingBoardMount&&this.isNearBoard()&&this.tryMountBoard()}setSpeedState(t){if(t==="seated")this.pendingInput.stop=!0;else if(t==="paddling"){if(!this.boardMounted){if(!this.isNearBoard()){this.pendingDialogue.push("Walk to your surfboard on the beach first.");return}this.tryMountBoard()}this.boardMounted&&(this.pendingInput.startPaddle=!0)}else if(t==="riding"){if(!this.boardMounted){if(!this.isNearBoard()){this.pendingDialogue.push("Walk to your surfboard on the beach first.");return}this.tryMountBoard()}if(!this.boardMounted)return;this.surfboard.speedState==="seated"&&(this.pendingInput.startPaddle=!0),this.pendingInput.standUp=!0}else if(t==="reversing"){if(!this.boardMounted){if(!this.isNearBoard()){this.pendingDialogue.push("Walk to your surfboard on the beach first.");return}this.tryMountBoard()}this.boardMounted&&(this.pendingInput.reverse=!0)}}prepareTrick(t){!this.boardMounted||this.surfboard.speedState==="seated"||this.trickAnimation||(this.trickPrepare={slot:t,ticksSincePrepare:0})}clearTrickPrepare(){this.trickPrepare=null}resolveTrickZoneEntry(t){const e=this.trickPrepare,i=e!==null&&e.slot===t.prepareSlot&&Op(e);if(this.trickPrepare=null,!i){this.bailTrick(t);return}const s=jg(this.progression);this.progression=s.state,this.trickZones=kp(this.trickZones,t.id),this.trickAnimation=kh(this.arena.map,t,this.surfboard.position,this.surfboard.currentHeading),this.surfboard={...this.surfboard,intendedHeading:this.trickAnimation.endHeading,isRotating:!1},this.activeTrickZoneId=null,this.xpDrops.push({agility:s.xpGained.agility,sailing:s.xpGained.sailing,tokens:s.tokensGained,x:this.surfboard.position.x,y:this.surfboard.position.y})}bailTrick(t,e){this.trickPrepare=null,this.trickAnimation=null,this.progression=Qg(this.progression),this.activeTrickZoneId=null,this.surfboard={...this.surfboard,speedState:"seated",isRotating:!1},this.pendingDialogue.push(e??`Bailed on the ${t.type}! Prime the trick 1–4 ticks before you hit it.`)}checkTrickZoneResolution(){if(this.trickAnimation)return;if(!this.boardMounted||this.surfboard.speedState!=="riding"){this.activeTrickZoneId=null;return}const t=Ch(this.trickZones,this.surfboard.position,this.tide);if(!t){this.activeTrickZoneId=null;return}this.activeTrickZoneId!==t.id&&(this.activeTrickZoneId=t.id,this.resolveTrickZoneEntry(t))}tryPurchaseUnlock(t){const e=$g(this.progression,t);return e.success?(this.progression=e.state,null):e.reason??"Purchase failed"}setStats(t){this.stats={...this.stats,...t}}setCameraFacing(t){this.cameraFacingRadians=t}setTideFrozen(t){this.tideFrozen=t}setMovementFrozen(t){this.movementFrozen=t}getArena(){return this.arena}tickTrickAnimationMovement(){if(!this.trickAnimation)return;const t=Bh(this.trickAnimation);this.trickAnimation=t.state,this.surfboard={...this.surfboard,position:t.position,currentHeading:t.heading,intendedHeading:t.heading,isRotating:!1}}tick(){if(this.boardMounted&&!this.movementFrozen)if(this.trickAnimation)this.tickTrickAnimationMovement();else{const e=Mc(this.surfboard,this.arena.map,this.pendingInput,this.stats);this.surfboard=e.state}else if(this.walk){const e=rp(this.surfboard.position,this.surfboard.currentHeading,this.walk);this.walk=e.walk,this.surfboard={...this.surfboard,position:e.position,currentHeading:e.heading,intendedHeading:e.heading},e.walk||(this.walkClickMarker=null,this.resolvePendingInteractions())}this.pendingInput={},this.trickPrepare=Or(this.trickPrepare),this.checkTrickZoneResolution(),this.tide&&!this.tideFrozen&&(this.tide=Pp(this.tide),this.trickZones=Mg(this.trickZones,this.tide,this.arena.map,this.trickZoneTideSync,mo),this.trickZones=Rp(this.trickZones,this.tide)),this.checkProximityDialogue();const t={x:this.surfboard.position.x,y:this.surfboard.position.y,facingRadians:this.cameraFacingRadians??tn(this.surfboard.currentHeading)*Math.PI/180};this.demoSurfers=this.demoSurfers.map(e=>kg(e,this.arena.map,this.trickZones,this.tide,t)),this.tickCount+=1}}const dd="osrs-surfing-progression";function e0(){try{const n=localStorage.getItem(dd);return n?Zg(JSON.parse(n)):null}catch{return null}}function Pl(n){try{localStorage.setItem(dd,JSON.stringify(Kg(n)))}catch{}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cc="184",n0=0,Il=1,i0=2,wr=1,s0=2,Ss=3,Qn=0,He=1,Nn=2,On=0,qi=1,Ll=2,Dl=3,Nl=4,r0=5,li=100,a0=101,o0=102,c0=103,l0=104,u0=200,h0=201,d0=202,f0=203,xo=204,vo=205,p0=206,m0=207,g0=208,_0=209,x0=210,v0=211,M0=212,S0=213,y0=214,Mo=0,So=1,yo=2,Zi=3,Eo=4,To=5,bo=6,Ao=7,fd=0,E0=1,T0=2,En=0,pd=1,md=2,gd=3,_d=4,xd=5,vd=6,Md=7,Sd=300,_i=301,$i=302,pa=303,ma=304,ia=306,Ro=1e3,Fn=1001,wo=1002,Ce=1003,b0=1004,Ks=1005,Ne=1006,ga=1007,hi=1008,Xe=1009,yd=1010,Ed=1011,Ns=1012,Pc=1013,bn=1014,hn=1015,Bn=1016,Ic=1017,Lc=1018,Us=1020,Td=35902,bd=35899,Ad=1021,Rd=1022,dn=1023,Hn=1026,di=1027,Dc=1028,Nc=1029,xi=1030,Uc=1031,Fc=1033,Cr=33776,Pr=33777,Ir=33778,Lr=33779,Co=35840,Po=35841,Io=35842,Lo=35843,Do=36196,No=37492,Uo=37496,Fo=37488,Oo=37489,zr=37490,ko=37491,Bo=37808,Ho=37809,Go=37810,zo=37811,Vo=37812,Wo=37813,Xo=37814,Yo=37815,qo=37816,Ko=37817,Zo=37818,$o=37819,Jo=37820,jo=37821,Qo=36492,tc=36494,ec=36495,nc=36283,ic=36284,Vr=36285,sc=36286,A0=3200,rc=0,R0=1,Jn="",je="srgb",Wr="srgb-linear",Xr="linear",oe="srgb",bi=7680,Ul=519,w0=512,C0=513,P0=514,Oc=515,I0=516,L0=517,kc=518,D0=519,Fl=35044,Ol="300 es",Sn=2e3,Fs=2001;function N0(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Yr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function U0(){const n=Yr("canvas");return n.style.display="block",n}const kl={};function Bl(...n){const t="THREE."+n.shift();console.log(t,...n)}function wd(n){const t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Nt(...n){n=wd(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function jt(...n){n=wd(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function ac(...n){const t=n.join(" ");t in kl||(kl[t]=!0,Nt(...n))}function F0(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const O0={[Mo]:So,[yo]:bo,[Eo]:Ao,[Zi]:To,[So]:Mo,[bo]:yo,[Ao]:Eo,[To]:Zi};class Mi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],_a=Math.PI/180,oc=180/Math.PI;function is(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[i&255]+Le[i>>8&255]+Le[i>>16&255]+Le[i>>24&255]).toLowerCase()}function Zt(n,t,e){return Math.max(t,Math.min(e,n))}function k0(n,t){return(n%t+t)%t}function xa(n,t,e){return(1-e)*n+e*t}function cs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ke(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const nl=class nl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};nl.prototype.isVector2=!0;let pt=nl;class ss{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],d=i[s+3],h=r[a+0],f=r[a+1],g=r[a+2],S=r[a+3];if(d!==S||c!==h||l!==f||u!==g){let p=c*h+l*f+u*g+d*S;p<0&&(h=-h,f=-f,g=-g,S=-S,p=-p);let m=1-o;if(p<.9995){const v=Math.acos(p),E=Math.sin(v);m=Math.sin(m*v)/E,o=Math.sin(o*v)/E,c=c*m+h*o,l=l*m+f*o,u=u*m+g*o,d=d*m+S*o}else{c=c*m+h*o,l=l*m+f*o,u=u*m+g*o,d=d*m+S*o;const v=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=v,l*=v,u*=v,d*=v}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],d=r[a],h=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+u*d+c*f-l*h,t[e+1]=c*g+u*h+l*d-o*f,t[e+2]=l*g+u*f+o*h-c*d,t[e+3]=u*g-o*d-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),d=o(r/2),h=c(i/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"YZX":this._x=h*u*d+l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d-h*f*g;break;case"XZY":this._x=h*u*d-l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d+h*f*g;break;default:Nt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],d=e[10],h=i+o+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(u-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+i*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+i*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const il=class il{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),u=2*(o*e-r*s),d=2*(r*i-a*e);return this.x=e+c*l+a*d-o*u,this.y=i+c*u+o*l-r*d,this.z=s+c*d+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return va.copy(this).projectOnVector(t),this.sub(va)}reflect(t){return this.sub(va.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};il.prototype.isVector3=!0;let L=il;const va=new L,Hl=new ss,sl=class sl{constructor(t,e,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],S=s[0],p=s[3],m=s[6],v=s[1],E=s[4],y=s[7],P=s[2],b=s[5],C=s[8];return r[0]=a*S+o*v+c*P,r[3]=a*p+o*E+c*b,r[6]=a*m+o*y+c*C,r[1]=l*S+u*v+d*P,r[4]=l*p+u*E+d*b,r[7]=l*m+u*y+d*C,r[2]=h*S+f*v+g*P,r[5]=h*p+f*E+g*b,r[8]=h*m+f*y+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],d=u*a-o*l,h=o*c-u*r,f=l*r-a*c,g=e*d+i*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return t[0]=d*S,t[1]=(s*l-u*i)*S,t[2]=(o*i-s*a)*S,t[3]=h*S,t[4]=(u*e-s*c)*S,t[5]=(s*r-o*e)*S,t[6]=f*S,t[7]=(i*c-l*e)*S,t[8]=(a*e-i*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ma.makeScale(t,e)),this}rotate(t){return this.premultiply(Ma.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ma.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};sl.prototype.isMatrix3=!0;let zt=sl;const Ma=new zt,Gl=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zl=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function B0(){const n={enabled:!0,workingColorSpace:Wr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===oe&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===oe&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Jn?Xr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ac("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ac("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Wr]:{primaries:t,whitePoint:i,transfer:Xr,toXYZ:Gl,fromXYZ:zl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:t,whitePoint:i,transfer:oe,toXYZ:Gl,fromXYZ:zl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:je}}}),n}const Qt=B0();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ki(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ai;class H0{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ai===void 0&&(Ai=Yr("canvas")),Ai.width=t.width,Ai.height=t.height;const s=Ai.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ai}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Yr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=kn(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(kn(e[i]/255)*255):e[i]=kn(e[i]);return{data:e,width:t.width,height:t.height}}else return Nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let G0=0;class Bc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:G0++}),this.uuid=is(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Sa(s[a].image)):r.push(Sa(s[a]))}else r=Sa(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Sa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?H0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Nt("Texture: Unable to serialize Texture."),{})}let z0=0;const ya=new L;class Fe extends Mi{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,i=Fn,s=Fn,r=Ne,a=hi,o=dn,c=Xe,l=Fe.DEFAULT_ANISOTROPY,u=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:z0++}),this.uuid=is(),this.name="",this.source=new Bc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ya).x}get height(){return this.source.getSize(ya).y}get depth(){return this.source.getSize(ya).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Nt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Nt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Sd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ro:t.x=t.x-Math.floor(t.x);break;case Fn:t.x=t.x<0?0:1;break;case wo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ro:t.y=t.y-Math.floor(t.y);break;case Fn:t.y=t.y<0?0:1;break;case wo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Sd;Fe.DEFAULT_ANISOTROPY=1;const rl=class rl{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],g=c[9],S=c[2],p=c[6],m=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-S)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+S)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(l+1)/2,y=(f+1)/2,P=(m+1)/2,b=(u+h)/4,C=(d+S)/4,x=(g+p)/4;return E>y&&E>P?E<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(E),s=b/i,r=C/i):y>P?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=b/s,r=x/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=C/r,s=x/r),this.set(i,s,r,e),this}let v=Math.sqrt((p-g)*(p-g)+(d-S)*(d-S)+(h-u)*(h-u));return Math.abs(v)<.001&&(v=1),this.x=(p-g)/v,this.y=(d-S)/v,this.z=(h-u)/v,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};rl.prototype.isVector4=!0;let ve=rl;class V0 extends Mi{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:i.depth},r=new Fe(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Ne,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Bc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends V0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Cd extends Fe{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class W0 extends Fe{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const $r=class $r{constructor(t,e,i,s,r,a,o,c,l,u,d,h,f,g,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,u,d,h,f,g,S,p)}set(t,e,i,s,r,a,o,c,l,u,d,h,f,g,S,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=u,m[10]=d,m[14]=h,m[3]=f,m[7]=g,m[11]=S,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $r().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const e=this.elements,i=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),a=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const h=a*u,f=a*d,g=o*u,S=o*d;e[0]=c*u,e[4]=-c*d,e[8]=l,e[1]=f+g*l,e[5]=h-S*l,e[9]=-o*c,e[2]=S-h*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const h=c*u,f=c*d,g=l*u,S=l*d;e[0]=h+S*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*d,e[5]=a*u,e[9]=-o,e[2]=f*o-g,e[6]=S+h*o,e[10]=a*c}else if(t.order==="ZXY"){const h=c*u,f=c*d,g=l*u,S=l*d;e[0]=h-S*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*u,e[9]=S-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const h=a*u,f=a*d,g=o*u,S=o*d;e[0]=c*u,e[4]=g*l-f,e[8]=h*l+S,e[1]=c*d,e[5]=S*l+h,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const h=a*c,f=a*l,g=o*c,S=o*l;e[0]=c*u,e[4]=S-h*d,e[8]=g*d+f,e[1]=d,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=f*d+g,e[10]=h-S*d}else if(t.order==="XZY"){const h=a*c,f=a*l,g=o*c,S=o*l;e[0]=c*u,e[4]=-d,e[8]=l*u,e[1]=h*d+S,e[5]=a*u,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*u,e[10]=S*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(X0,t,Y0)}lookAt(t,e,i){const s=this.elements;return ze.subVectors(t,e),ze.lengthSq()===0&&(ze.z=1),ze.normalize(),Xn.crossVectors(i,ze),Xn.lengthSq()===0&&(Math.abs(i.z)===1?ze.x+=1e-4:ze.z+=1e-4,ze.normalize(),Xn.crossVectors(i,ze)),Xn.normalize(),Zs.crossVectors(ze,Xn),s[0]=Xn.x,s[4]=Zs.x,s[8]=ze.x,s[1]=Xn.y,s[5]=Zs.y,s[9]=ze.y,s[2]=Xn.z,s[6]=Zs.z,s[10]=ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],S=i[6],p=i[10],m=i[14],v=i[3],E=i[7],y=i[11],P=i[15],b=s[0],C=s[4],x=s[8],A=s[12],I=s[1],R=s[5],F=s[9],X=s[13],W=s[2],N=s[6],B=s[10],k=s[14],j=s[3],nt=s[7],ft=s[11],St=s[15];return r[0]=a*b+o*I+c*W+l*j,r[4]=a*C+o*R+c*N+l*nt,r[8]=a*x+o*F+c*B+l*ft,r[12]=a*A+o*X+c*k+l*St,r[1]=u*b+d*I+h*W+f*j,r[5]=u*C+d*R+h*N+f*nt,r[9]=u*x+d*F+h*B+f*ft,r[13]=u*A+d*X+h*k+f*St,r[2]=g*b+S*I+p*W+m*j,r[6]=g*C+S*R+p*N+m*nt,r[10]=g*x+S*F+p*B+m*ft,r[14]=g*A+S*X+p*k+m*St,r[3]=v*b+E*I+y*W+P*j,r[7]=v*C+E*R+y*N+P*nt,r[11]=v*x+E*F+y*B+P*ft,r[15]=v*A+E*X+y*k+P*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],d=t[6],h=t[10],f=t[14],g=t[3],S=t[7],p=t[11],m=t[15],v=c*f-l*h,E=o*f-l*d,y=o*h-c*d,P=a*f-l*u,b=a*h-c*u,C=a*d-o*u;return e*(S*v-p*E+m*y)-i*(g*v-p*P+m*b)+s*(g*E-S*P+m*C)-r*(g*y-S*b+p*C)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],d=t[9],h=t[10],f=t[11],g=t[12],S=t[13],p=t[14],m=t[15],v=e*o-i*a,E=e*c-s*a,y=e*l-r*a,P=i*c-s*o,b=i*l-r*o,C=s*l-r*c,x=u*S-d*g,A=u*p-h*g,I=u*m-f*g,R=d*p-h*S,F=d*m-f*S,X=h*m-f*p,W=v*X-E*F+y*R+P*I-b*A+C*x;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/W;return t[0]=(o*X-c*F+l*R)*N,t[1]=(s*F-i*X-r*R)*N,t[2]=(S*C-p*b+m*P)*N,t[3]=(h*b-d*C-f*P)*N,t[4]=(c*I-a*X-l*A)*N,t[5]=(e*X-s*I+r*A)*N,t[6]=(p*y-g*C-m*E)*N,t[7]=(u*C-h*y+f*E)*N,t[8]=(a*F-o*I+l*x)*N,t[9]=(i*I-e*F-r*x)*N,t[10]=(g*b-S*y+m*v)*N,t[11]=(d*y-u*b-f*v)*N,t[12]=(o*A-a*R-c*x)*N,t[13]=(e*R-i*A+s*x)*N,t[14]=(S*E-g*P-p*v)*N,t[15]=(u*P-d*E+h*v)*N,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,u=a+a,d=o+o,h=r*l,f=r*u,g=r*d,S=a*u,p=a*d,m=o*d,v=c*l,E=c*u,y=c*d,P=i.x,b=i.y,C=i.z;return s[0]=(1-(S+m))*P,s[1]=(f+y)*P,s[2]=(g-E)*P,s[3]=0,s[4]=(f-y)*b,s[5]=(1-(h+m))*b,s[6]=(p+v)*b,s[7]=0,s[8]=(g+E)*C,s[9]=(p-v)*C,s[10]=(1-(h+S))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinant();if(r===0)return i.set(1,1,1),e.identity(),this;let a=Ri.set(s[0],s[1],s[2]).length();const o=Ri.set(s[4],s[5],s[6]).length(),c=Ri.set(s[8],s[9],s[10]).length();r<0&&(a=-a),rn.copy(this);const l=1/a,u=1/o,d=1/c;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=d,rn.elements[9]*=d,rn.elements[10]*=d,e.setFromRotationMatrix(rn),i.x=a,i.y=o,i.z=c,this}makePerspective(t,e,i,s,r,a,o=Sn,c=!1){const l=this.elements,u=2*r/(e-t),d=2*r/(i-s),h=(e+t)/(e-t),f=(i+s)/(i-s);let g,S;if(c)g=r/(a-r),S=a*r/(a-r);else if(o===Sn)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Fs)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=Sn,c=!1){const l=this.elements,u=2/(e-t),d=2/(i-s),h=-(e+t)/(e-t),f=-(i+s)/(i-s);let g,S;if(c)g=1/(a-r),S=a/(a-r);else if(o===Sn)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===Fs)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};$r.prototype.isMatrix4=!0;let ae=$r;const Ri=new L,rn=new ae,X0=new L(0,0,0),Y0=new L(1,1,1),Xn=new L,Zs=new L,ze=new L,Vl=new ae,Wl=new ss;class ti{constructor(t=0,e=0,i=0,s=ti.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Zt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Zt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Vl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Vl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ti.DEFAULT_ORDER="XYZ";class Hc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let q0=0;const Xl=new L,wi=new ss,Cn=new ae,$s=new L,ls=new L,K0=new L,Z0=new ss,Yl=new L(1,0,0),ql=new L(0,1,0),Kl=new L(0,0,1),Zl={type:"added"},$0={type:"removed"},Ci={type:"childadded",child:null},Ea={type:"childremoved",child:null};class Pe extends Mi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:q0++}),this.uuid=is(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new L,e=new ti,i=new ss,s=new L(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new zt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Hc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.multiply(wi),this}rotateOnWorldAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.premultiply(wi),this}rotateX(t){return this.rotateOnAxis(Yl,t)}rotateY(t){return this.rotateOnAxis(ql,t)}rotateZ(t){return this.rotateOnAxis(Kl,t)}translateOnAxis(t,e){return Xl.copy(t).applyQuaternion(this.quaternion),this.position.add(Xl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Yl,t)}translateY(t){return this.translateOnAxis(ql,t)}translateZ(t){return this.translateOnAxis(Kl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?$s.copy(t):$s.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(ls,$s,this.up):Cn.lookAt($s,ls,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),wi.setFromRotationMatrix(Cn),this.quaternion.premultiply(wi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zl),Ci.child=t,this.dispatchEvent(Ci),Ci.child=null):jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($0),Ea.child=t,this.dispatchEvent(Ea),Ea.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zl),Ci.child=t,this.dispatchEvent(Ci),Ci.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ls,t,K0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ls,Z0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),d=a(t.shapes),h=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Pe.DEFAULT_UP=new L(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class me extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const J0={type:"move"};class Ta{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const S of t.hand.values()){const p=e.getJointPose(S,i),m=this._getHandJoint(l,S);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(J0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new me;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function ba(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class te{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Qt.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=Qt.workingColorSpace){if(t=k0(t,1),e=Zt(e,0,1),i=Zt(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=ba(a,r,t+1/3),this.g=ba(a,r,t),this.b=ba(a,r,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,e=je){function i(r){r!==void 0&&parseFloat(r)<1&&Nt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Nt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Nt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const i=Pd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Nt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=kn(t.r),this.g=kn(t.g),this.b=kn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return Qt.workingToColorSpace(De.copy(this),t),Math.round(Zt(De.r*255,0,255))*65536+Math.round(Zt(De.g*255,0,255))*256+Math.round(Zt(De.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(De.copy(this),e);const i=De.r,s=De.g,r=De.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case i:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-i)/d+2;break;case r:c=(i-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=je){Qt.workingToColorSpace(De.copy(this),t);const e=De.r,i=De.g,s=De.b;return t!==je?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(Js);const i=xa(Yn.h,Js.h,e),s=xa(Yn.s,Js.s,e),r=xa(Yn.l,Js.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const De=new te;te.NAMES=Pd;class j0 extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ti,this.environmentIntensity=1,this.environmentRotation=new ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const an=new L,Pn=new L,Aa=new L,In=new L,Pi=new L,Ii=new L,$l=new L,Ra=new L,wa=new L,Ca=new L,Pa=new ve,Ia=new ve,La=new ve;class ln{constructor(t=new L,e=new L,i=new L){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),an.subVectors(t,e),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){an.subVectors(s,e),Pn.subVectors(i,e),Aa.subVectors(t,e);const a=an.dot(an),o=an.dot(Pn),c=an.dot(Aa),l=Pn.dot(Pn),u=Pn.dot(Aa),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(l*c-o*u)*h,g=(a*u-o*c)*h;return r.set(1-f-g,g,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,In.x),c.addScaledVector(a,In.y),c.addScaledVector(o,In.z),c)}static getInterpolatedAttribute(t,e,i,s,r,a){return Pa.setScalar(0),Ia.setScalar(0),La.setScalar(0),Pa.fromBufferAttribute(t,e),Ia.fromBufferAttribute(t,i),La.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Pa,r.x),a.addScaledVector(Ia,r.y),a.addScaledVector(La,r.z),a}static isFrontFacing(t,e,i,s){return an.subVectors(i,e),Pn.subVectors(t,e),an.cross(Pn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),an.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return ln.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;Pi.subVectors(s,i),Ii.subVectors(r,i),Ra.subVectors(t,i);const c=Pi.dot(Ra),l=Ii.dot(Ra);if(c<=0&&l<=0)return e.copy(i);wa.subVectors(t,s);const u=Pi.dot(wa),d=Ii.dot(wa);if(u>=0&&d<=u)return e.copy(s);const h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(i).addScaledVector(Pi,a);Ca.subVectors(t,r);const f=Pi.dot(Ca),g=Ii.dot(Ca);if(g>=0&&f<=g)return e.copy(r);const S=f*l-c*g;if(S<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Ii,o);const p=u*g-f*d;if(p<=0&&d-u>=0&&f-g>=0)return $l.subVectors(r,s),o=(d-u)/(d-u+(f-g)),e.copy(s).addScaledVector($l,o);const m=1/(p+S+h);return a=S*m,o=h*m,e.copy(i).addScaledVector(Pi,a).addScaledVector(Ii,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Si{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(on.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(on.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=on.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,on):on.fromBufferAttribute(r,a),on.applyMatrix4(t.matrixWorld),this.expandByPoint(on);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),js.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),js.copy(i.boundingBox)),js.applyMatrix4(t.matrixWorld),this.union(js)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,on),on.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(us),Qs.subVectors(this.max,us),Li.subVectors(t.a,us),Di.subVectors(t.b,us),Ni.subVectors(t.c,us),qn.subVectors(Di,Li),Kn.subVectors(Ni,Di),si.subVectors(Li,Ni);let e=[0,-qn.z,qn.y,0,-Kn.z,Kn.y,0,-si.z,si.y,qn.z,0,-qn.x,Kn.z,0,-Kn.x,si.z,0,-si.x,-qn.y,qn.x,0,-Kn.y,Kn.x,0,-si.y,si.x,0];return!Da(e,Li,Di,Ni,Qs)||(e=[1,0,0,0,1,0,0,0,1],!Da(e,Li,Di,Ni,Qs))?!1:(tr.crossVectors(qn,Kn),e=[tr.x,tr.y,tr.z],Da(e,Li,Di,Ni,Qs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,on).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(on).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ln),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ln=[new L,new L,new L,new L,new L,new L,new L,new L],on=new L,js=new Si,Li=new L,Di=new L,Ni=new L,qn=new L,Kn=new L,si=new L,us=new L,Qs=new L,tr=new L,ri=new L;function Da(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ri.fromArray(n,r);const o=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),c=t.dot(ri),l=e.dot(ri),u=i.dot(ri);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const Te=new L,er=new pt;let Q0=0;class fn extends Mi{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Q0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Fl,this.updateRanges=[],this.gpuType=hn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)er.fromBufferAttribute(this,e),er.applyMatrix3(t),this.setXY(e,er.x,er.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=cs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ke(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cs(e,this.array)),e}setX(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cs(e,this.array)),e}setY(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cs(e,this.array)),e}setW(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array),s=ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array),s=ke(s,this.array),r=ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fl&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Id extends fn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ld extends fn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Me extends fn{constructor(t,e,i){super(new Float32Array(t),e,i)}}const t_=new Si,hs=new L,Na=new L;class rs{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):t_.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hs.subVectors(t,this.center);const e=hs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(hs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Na.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hs.copy(t.center).add(Na)),this.expandByPoint(hs.copy(t.center).sub(Na))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let e_=0;const $e=new ae,Ua=new Pe,Ui=new L,Ve=new Si,ds=new Si,we=new L;class Oe extends Mi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:e_++}),this.uuid=is(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(N0(t)?Ld:Id)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,i){return $e.makeTranslation(t,e,i),this.applyMatrix4($e),this}scale(t,e,i){return $e.makeScale(t,e,i),this.applyMatrix4($e),this}lookAt(t){return Ua.lookAt(t),Ua.updateMatrix(),this.applyMatrix4(Ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ui).negate(),this.translate(Ui.x,Ui.y,Ui.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Me(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Si);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];Ve.setFromBufferAttribute(r),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,Ve.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,Ve.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(Ve.min),this.boundingBox.expandByPoint(Ve.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const i=this.boundingSphere.center;if(Ve.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ds.setFromBufferAttribute(o),this.morphTargetsRelative?(we.addVectors(Ve.min,ds.min),Ve.expandByPoint(we),we.addVectors(Ve.max,ds.max),Ve.expandByPoint(we)):(Ve.expandByPoint(ds.min),Ve.expandByPoint(ds.max))}Ve.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)we.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(we));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)we.fromBufferAttribute(o,l),c&&(Ui.fromBufferAttribute(t,l),we.add(Ui)),s=Math.max(s,i.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let x=0;x<i.count;x++)o[x]=new L,c[x]=new L;const l=new L,u=new L,d=new L,h=new pt,f=new pt,g=new pt,S=new L,p=new L;function m(x,A,I){l.fromBufferAttribute(i,x),u.fromBufferAttribute(i,A),d.fromBufferAttribute(i,I),h.fromBufferAttribute(r,x),f.fromBufferAttribute(r,A),g.fromBufferAttribute(r,I),u.sub(l),d.sub(l),f.sub(h),g.sub(h);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(S.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(R),p.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(R),o[x].add(S),o[A].add(S),o[I].add(S),c[x].add(p),c[A].add(p),c[I].add(p))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let x=0,A=v.length;x<A;++x){const I=v[x],R=I.start,F=I.count;for(let X=R,W=R+F;X<W;X+=3)m(t.getX(X+0),t.getX(X+1),t.getX(X+2))}const E=new L,y=new L,P=new L,b=new L;function C(x){P.fromBufferAttribute(s,x),b.copy(P);const A=o[x];E.copy(A),E.sub(P.multiplyScalar(P.dot(A))).normalize(),y.crossVectors(b,A);const R=y.dot(c[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,R)}for(let x=0,A=v.length;x<A;++x){const I=v[x],R=I.start,F=I.count;for(let X=R,W=R+F;X<W;X+=3)C(t.getX(X+0)),C(t.getX(X+1)),C(t.getX(X+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const s=new L,r=new L,a=new L,o=new L,c=new L,l=new L,u=new L,d=new L;if(t)for(let h=0,f=t.count;h<f;h+=3){const g=t.getX(h+0),S=t.getX(h+1),p=t.getX(h+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,p),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,S),l.fromBufferAttribute(i,p),o.add(u),c.add(u),l.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(S,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(o,c){const l=o.array,u=o.itemSize,d=o.normalized,h=new l.constructor(c.length*u);let f=0,g=0;for(let S=0,p=c.length;S<p;S++){o.isInterleavedBufferAttribute?f=c[S]*o.data.stride+o.offset:f=c[S]*u;for(let m=0;m<u;m++)h[g++]=l[f++]}return new fn(h,u,d)}if(this.index===null)return Nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Oe,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let u=0,d=l.length;u<d;u++){const h=l[u],f=t(h,i);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){const f=l[d];u.push(f.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],d=r[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let n_=0;class as extends Mi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=is(),this.name="",this.type="Material",this.blending=qi,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xo,this.blendDst=vo,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=Zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ul,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Nt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Nt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(i.blending=this.blending),this.side!==Qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==xo&&(i.blendSrc=this.blendSrc),this.blendDst!==vo&&(i.blendDst=this.blendDst),this.blendEquation!==li&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Zi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ul&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Dn=new L,Fa=new L,nr=new L,Zn=new L,Oa=new L,ir=new L,ka=new L;class Gc{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Fa.copy(t).add(e).multiplyScalar(.5),nr.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(Fa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(nr),o=Zn.dot(this.direction),c=-Zn.dot(nr),l=Zn.lengthSq(),u=Math.abs(1-a*a);let d,h,f,g;if(u>0)if(d=a*c-o,h=a*o-c,g=r*u,d>=0)if(h>=-g)if(h<=g){const S=1/u;d*=S,h*=S,f=d*(d+a*h+2*o)+h*(a*d+h+2*c)+l}else h=r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Fa).addScaledVector(nr,h),f}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const i=Dn.dot(this.direction),s=Dn.dot(Dn)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-h.z)*d,c=(t.max.z-h.z)*d):(o=(t.max.z-h.z)*d,c=(t.min.z-h.z)*d),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,i,s,r){Oa.subVectors(e,t),ir.subVectors(i,t),ka.crossVectors(Oa,ir);let a=this.direction.dot(ka),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,t);const c=o*this.direction.dot(ir.crossVectors(Zn,ir));if(c<0)return null;const l=o*this.direction.dot(Oa.cross(Zn));if(l<0||c+l>a)return null;const u=-o*Zn.dot(ka);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class zc extends as{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.combine=fd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Jl=new ae,ai=new Gc,sr=new rs,jl=new L,rr=new L,ar=new L,or=new L,Ba=new L,cr=new L,Ql=new L,lr=new L;class $t extends Pe{constructor(t=new Oe,e=new zc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){cr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=o[c],d=r[c];u!==0&&(Ba.fromBufferAttribute(d,t),a?cr.addScaledVector(Ba,u):cr.addScaledVector(Ba.sub(e),u))}e.add(cr)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),sr.copy(i.boundingSphere),sr.applyMatrix4(r),ai.copy(t.ray).recast(t.near),!(sr.containsPoint(ai.origin)===!1&&(ai.intersectSphere(sr,jl)===null||ai.origin.distanceToSquared(jl)>(t.far-t.near)**2))&&(Jl.copy(r).invert(),ai.copy(t.ray).applyMatrix4(Jl),!(i.boundingBox!==null&&ai.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ai)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=h.length;g<S;g++){const p=h[g],m=a[p.materialIndex],v=Math.max(p.start,f.start),E=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,P=E;y<P;y+=3){const b=o.getX(y),C=o.getX(y+1),x=o.getX(y+2);s=ur(this,m,t,i,l,u,d,b,C,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),S=Math.min(o.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const v=o.getX(p),E=o.getX(p+1),y=o.getX(p+2);s=ur(this,a,t,i,l,u,d,v,E,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,S=h.length;g<S;g++){const p=h[g],m=a[p.materialIndex],v=Math.max(p.start,f.start),E=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,P=E;y<P;y+=3){const b=y,C=y+1,x=y+2;s=ur(this,m,t,i,l,u,d,b,C,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),S=Math.min(c.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const v=p,E=p+1,y=p+2;s=ur(this,a,t,i,l,u,d,v,E,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function i_(n,t,e,i,s,r,a,o){let c;if(t.side===He?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===Qn,o),c===null)return null;lr.copy(o),lr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(lr);return l<e.near||l>e.far?null:{distance:l,point:lr.clone(),object:n}}function ur(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,rr),n.getVertexPosition(c,ar),n.getVertexPosition(l,or);const u=i_(n,t,e,i,rr,ar,or,Ql);if(u){const d=new L;ln.getBarycoord(Ql,rr,ar,or,d),s&&(u.uv=ln.getInterpolatedAttribute(s,o,c,l,d,new pt)),r&&(u.uv1=ln.getInterpolatedAttribute(r,o,c,l,d,new pt)),a&&(u.normal=ln.getInterpolatedAttribute(a,o,c,l,d,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new L,materialIndex:0};ln.getNormal(rr,ar,or,h.normal),u.face=h,u.barycoord=d}return u}class Dd extends Fe{constructor(t=null,e=1,i=1,s,r,a,o,c,l=Ce,u=Ce,d,h){super(null,a,o,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class tu extends fn{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Fi=new ae,eu=new ae,hr=[],nu=new Si,s_=new ae,fs=new $t,ps=new rs;class fi extends $t{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new tu(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,s_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Si),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Fi),nu.copy(t.boundingBox).applyMatrix4(Fi),this.boundingBox.union(nu)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new rs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Fi),ps.copy(t.boundingSphere).applyMatrix4(Fi),this.boundingSphere.union(ps)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=t.previousInstanceMatrix.clone()),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(t,e){const i=this.matrixWorld,s=this.count;if(fs.geometry=this.geometry,fs.material=this.material,fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ps.copy(this.boundingSphere),ps.applyMatrix4(i),t.ray.intersectsSphere(ps)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Fi),eu.multiplyMatrices(i,Fi),fs.matrixWorld=eu,fs.raycast(t,hr);for(let a=0,o=hr.length;a<o;a++){const c=hr[a];c.instanceId=r,c.object=this,e.push(c)}hr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new tu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Dd(new Float32Array(s*this.count),s,this.count,Dc,hn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;return r[c]=o,r.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ha=new L,r_=new L,a_=new zt;class ci{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Ha.subVectors(i,e).cross(r_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const s=t.delta(Ha),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||a_.getNormalMatrix(t),s=this.coplanarPoint(Ha).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const oi=new rs,o_=new pt(.5,.5),dr=new L;class Vc{constructor(t=new ci,e=new ci,i=new ci,s=new ci,r=new ci,a=new ci){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Sn,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],S=r[9],p=r[10],m=r[11],v=r[12],E=r[13],y=r[14],P=r[15];if(s[0].setComponents(l-a,f-u,m-g,P-v).normalize(),s[1].setComponents(l+a,f+u,m+g,P+v).normalize(),s[2].setComponents(l+o,f+d,m+S,P+E).normalize(),s[3].setComponents(l-o,f-d,m-S,P-E).normalize(),i)s[4].setComponents(c,h,p,y).normalize(),s[5].setComponents(l-c,f-h,m-p,P-y).normalize();else if(s[4].setComponents(l-c,f-h,m-p,P-y).normalize(),e===Sn)s[5].setComponents(l+c,f+h,m+p,P+y).normalize();else if(e===Fs)s[5].setComponents(c,h,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){oi.center.set(0,0,0);const e=o_.distanceTo(t.center);return oi.radius=.7071067811865476+e,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(dr.x=s.normal.x>0?t.max.x:t.min.x,dr.y=s.normal.y>0?t.max.y:t.min.y,dr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(dr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Nd extends as{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const qr=new L,Kr=new L,iu=new ae,ms=new Gc,fr=new rs,Ga=new L,su=new L;class c_ extends Pe{constructor(t=new Oe,e=new Nd){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)qr.fromBufferAttribute(e,s-1),Kr.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=qr.distanceTo(Kr);t.setAttribute("lineDistance",new Me(i,1))}else Nt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),fr.copy(i.boundingSphere),fr.applyMatrix4(s),fr.radius+=r,t.ray.intersectsSphere(fr)===!1)return;iu.copy(s).invert(),ms.copy(t.ray).applyMatrix4(iu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let S=f,p=g-1;S<p;S+=l){const m=u.getX(S),v=u.getX(S+1),E=pr(this,t,ms,c,m,v,S);E&&e.push(E)}if(this.isLineLoop){const S=u.getX(g-1),p=u.getX(f),m=pr(this,t,ms,c,S,p,g-1);m&&e.push(m)}}else{const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let S=f,p=g-1;S<p;S+=l){const m=pr(this,t,ms,c,S,S+1,S);m&&e.push(m)}if(this.isLineLoop){const S=pr(this,t,ms,c,g-1,f,g-1);S&&e.push(S)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pr(n,t,e,i,s,r,a){const o=n.geometry.attributes.position;if(qr.fromBufferAttribute(o,s),Kr.fromBufferAttribute(o,r),e.distanceSqToSegment(qr,Kr,Ga,su)>i)return;Ga.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Ga);if(!(l<t.near||l>t.far))return{distance:l,point:su.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}class Ud extends Fe{constructor(t=[],e=_i,i,s,r,a,o,c,l,u){super(t,e,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ji extends Fe{constructor(t,e,i=bn,s,r,a,o=Ce,c=Ce,l,u=Hn,d=1){if(u!==Hn&&u!==di)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:d};super(h,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Bc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class l_ extends Ji{constructor(t,e=bn,i=_i,s,r,a=Ce,o=Ce,c,l=Hn){const u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,i,s,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Fd extends Fe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class be extends Oe{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(d,2));function g(S,p,m,v,E,y,P,b,C,x,A){const I=y/C,R=P/x,F=y/2,X=P/2,W=b/2,N=C+1,B=x+1;let k=0,j=0;const nt=new L;for(let ft=0;ft<B;ft++){const St=ft*R-X;for(let At=0;At<N;At++){const Xt=At*I-F;nt[S]=Xt*v,nt[p]=St*E,nt[m]=W,l.push(nt.x,nt.y,nt.z),nt[S]=0,nt[p]=0,nt[m]=b>0?1:-1,u.push(nt.x,nt.y,nt.z),d.push(At/C),d.push(1-ft/x),k+=1}}for(let ft=0;ft<x;ft++)for(let St=0;St<C;St++){const At=h+St+N*ft,Xt=h+St+N*(ft+1),ee=h+(St+1)+N*(ft+1),Bt=h+(St+1)+N*ft;c.push(At,Xt,Bt),c.push(Xt,ee,Bt),j+=6}o.addGroup(f,j,A),f+=j,h+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new be(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ji extends Oe{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],d=[],h=[],f=[];let g=0;const S=[],p=i/2;let m=0;v(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new Me(d,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2));function v(){const y=new L,P=new L;let b=0;const C=(e-t)/i;for(let x=0;x<=r;x++){const A=[],I=x/r,R=I*(e-t)+t;for(let F=0;F<=s;F++){const X=F/s,W=X*c+o,N=Math.sin(W),B=Math.cos(W);P.x=R*N,P.y=-I*i+p,P.z=R*B,d.push(P.x,P.y,P.z),y.set(N,C,B).normalize(),h.push(y.x,y.y,y.z),f.push(X,1-I),A.push(g++)}S.push(A)}for(let x=0;x<s;x++)for(let A=0;A<r;A++){const I=S[A][x],R=S[A+1][x],F=S[A+1][x+1],X=S[A][x+1];(t>0||A!==0)&&(u.push(I,R,X),b+=3),(e>0||A!==r-1)&&(u.push(R,F,X),b+=3)}l.addGroup(m,b,0),m+=b}function E(y){const P=g,b=new pt,C=new L;let x=0;const A=y===!0?t:e,I=y===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,p*I,0),h.push(0,I,0),f.push(.5,.5),g++;const R=g;for(let F=0;F<=s;F++){const W=F/s*c+o,N=Math.cos(W),B=Math.sin(W);C.x=A*B,C.y=p*I,C.z=A*N,d.push(C.x,C.y,C.z),h.push(0,I,0),b.x=N*.5+.5,b.y=B*.5*I+.5,f.push(b.x,b.y),g++}for(let F=0;F<s;F++){const X=P+F,W=R+F;y===!0?u.push(W,W+1,X):u.push(W+1,W,X),x+=3}l.addGroup(m,x,y===!0?1:2),m+=x}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Os extends ji{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Os(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Wc extends Oe{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const r=[],a=[];o(s),l(i),u(),this.setAttribute("position",new Me(r,3)),this.setAttribute("normal",new Me(r.slice(),3)),this.setAttribute("uv",new Me(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const E=new L,y=new L,P=new L;for(let b=0;b<e.length;b+=3)f(e[b+0],E),f(e[b+1],y),f(e[b+2],P),c(E,y,P,v)}function c(v,E,y,P){const b=P+1,C=[];for(let x=0;x<=b;x++){C[x]=[];const A=v.clone().lerp(y,x/b),I=E.clone().lerp(y,x/b),R=b-x;for(let F=0;F<=R;F++)F===0&&x===b?C[x][F]=A:C[x][F]=A.clone().lerp(I,F/R)}for(let x=0;x<b;x++)for(let A=0;A<2*(b-x)-1;A++){const I=Math.floor(A/2);A%2===0?(h(C[x][I+1]),h(C[x+1][I]),h(C[x][I])):(h(C[x][I+1]),h(C[x+1][I+1]),h(C[x+1][I]))}}function l(v){const E=new L;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(v),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function u(){const v=new L;for(let E=0;E<r.length;E+=3){v.x=r[E+0],v.y=r[E+1],v.z=r[E+2];const y=p(v)/2/Math.PI+.5,P=m(v)/Math.PI+.5;a.push(y,1-P)}g(),d()}function d(){for(let v=0;v<a.length;v+=6){const E=a[v+0],y=a[v+2],P=a[v+4],b=Math.max(E,y,P),C=Math.min(E,y,P);b>.9&&C<.1&&(E<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),P<.2&&(a[v+4]+=1))}}function h(v){r.push(v.x,v.y,v.z)}function f(v,E){const y=v*3;E.x=t[y+0],E.y=t[y+1],E.z=t[y+2]}function g(){const v=new L,E=new L,y=new L,P=new L,b=new pt,C=new pt,x=new pt;for(let A=0,I=0;A<r.length;A+=9,I+=6){v.set(r[A+0],r[A+1],r[A+2]),E.set(r[A+3],r[A+4],r[A+5]),y.set(r[A+6],r[A+7],r[A+8]),b.set(a[I+0],a[I+1]),C.set(a[I+2],a[I+3]),x.set(a[I+4],a[I+5]),P.copy(v).add(E).add(y).divideScalar(3);const R=p(P);S(b,I+0,v,R),S(C,I+2,E,R),S(x,I+4,y,R)}}function S(v,E,y,P){P<0&&v.x===1&&(a[E]=v.x-1),y.x===0&&y.z===0&&(a[E]=P/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wc(t.vertices,t.indices,t.radius,t.detail)}}class Rn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Nt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);const u=i[s],h=i[s+1]-u,f=(a-u)/h;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new pt:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new L,s=[],r=[],a=[],o=new L,c=new ae;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new L)}r[0]=new L,a[0]=new L;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),d=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=l&&(l=u,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),h<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Zt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Zt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Xc extends Rn{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new pt){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*u-f*d+this.aX,l=h*d+f*u+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class u_ extends Xc{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Yc(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,u,d){let h=(a-r)/l-(o-r)/(l+u)+(o-a)/u,f=(o-a)/u-(c-a)/(u+d)+(c-o)/d;h*=u,f*=u,s(a,o,h,f)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const ru=new L,au=new L,za=new Yc,Va=new Yc,Wa=new Yc;class h_ extends Rn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new L){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,u;this.closed||o>0?l=s[(o-1)%r]:(au.subVectors(s[0],s[1]).add(s[0]),l=au);const d=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(ru.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ru),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),S=Math.pow(d.distanceToSquared(h),f),p=Math.pow(h.distanceToSquared(u),f);S<1e-4&&(S=1),g<1e-4&&(g=S),p<1e-4&&(p=S),za.initNonuniformCatmullRom(l.x,d.x,h.x,u.x,g,S,p),Va.initNonuniformCatmullRom(l.y,d.y,h.y,u.y,g,S,p),Wa.initNonuniformCatmullRom(l.z,d.z,h.z,u.z,g,S,p)}else this.curveType==="catmullrom"&&(za.initCatmullRom(l.x,d.x,h.x,u.x,this.tension),Va.initCatmullRom(l.y,d.y,h.y,u.y,this.tension),Wa.initCatmullRom(l.z,d.z,h.z,u.z,this.tension));return i.set(za.calc(c),Va.calc(c),Wa.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ou(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function d_(n,t){const e=1-n;return e*e*t}function f_(n,t){return 2*(1-n)*n*t}function p_(n,t){return n*n*t}function As(n,t,e,i){return d_(n,t)+f_(n,e)+p_(n,i)}function m_(n,t){const e=1-n;return e*e*e*t}function g_(n,t){const e=1-n;return 3*e*e*n*t}function __(n,t){return 3*(1-n)*n*n*t}function x_(n,t){return n*n*n*t}function Rs(n,t,e,i,s){return m_(n,t)+g_(n,e)+__(n,i)+x_(n,s)}class Od extends Rn{constructor(t=new pt,e=new pt,i=new pt,s=new pt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new pt){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Rs(t,s.x,r.x,a.x,o.x),Rs(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class v_ extends Rn{constructor(t=new L,e=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new L){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Rs(t,s.x,r.x,a.x,o.x),Rs(t,s.y,r.y,a.y,o.y),Rs(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kd extends Rn{constructor(t=new pt,e=new pt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new pt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new pt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class M_ extends Rn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bd extends Rn{constructor(t=new pt,e=new pt,i=new pt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new pt){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class S_ extends Rn{constructor(t=new L,e=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new L){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y),As(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hd extends Rn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new pt){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return i.set(ou(o,c.x,l.x,u.x,d.x),ou(o,c.y,l.y,u.y,d.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new pt().fromArray(s))}return this}}var cc=Object.freeze({__proto__:null,ArcCurve:u_,CatmullRomCurve3:h_,CubicBezierCurve:Od,CubicBezierCurve3:v_,EllipseCurve:Xc,LineCurve:kd,LineCurve3:M_,QuadraticBezierCurve:Bd,QuadraticBezierCurve3:S_,SplineCurve:Hd});class y_ extends Rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new cc[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const u=c[l];i&&i.equals(u)||(e.push(u),i=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new cc[s.type]().fromJSON(s))}return this}}class cu extends y_{constructor(t){super(),this.type="Path",this.currentPoint=new pt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new kd(this.currentPoint.clone(),new pt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Bd(this.currentPoint.clone(),new pt(t,e),new pt(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new Od(this.currentPoint.clone(),new pt(t,e),new pt(i,s),new pt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Hd(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){const l=new Xc(t,e,i,s,r,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Gd extends cu{constructor(t){super(t),this.uuid=is(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new cu().fromJSON(s))}return this}}function E_(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=zd(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=w_(n,t,r,e)),n.length>80*e){o=n[0],c=n[1];let u=o,d=c;for(let h=e;h<s;h+=e){const f=n[h],g=n[h+1];f<o&&(o=f),g<c&&(c=g),f>u&&(u=f),g>d&&(d=g)}l=Math.max(u-o,d-c),l=l!==0?32767/l:0}return ks(r,a,e,o,c,l,0),a}function zd(n,t,e,i,s){let r;if(s===B_(n,t,e,i)>0)for(let a=t;a<e;a+=i)r=lu(a/i|0,n[a],n[a+1],r);else for(let a=e-i;a>=t;a-=i)r=lu(a/i|0,n[a],n[a+1],r);return r&&Qi(r,r.next)&&(Hs(r),r=r.next),r}function vi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Qi(e,e.next)||_e(e.prev,e,e.next)===0)){if(Hs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ks(n,t,e,i,s,r,a){if(!n)return;!a&&r&&D_(n,i,s,r);let o=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(r?b_(n,i,s,r):T_(n)){t.push(c.i,n.i,l.i),Hs(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=A_(vi(n),t),ks(n,t,e,i,s,r,2)):a===2&&R_(n,t,e,i,s,r):ks(vi(n),t,e,i,s,r,1);break}}}function T_(n){const t=n.prev,e=n,i=n.next;if(_e(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,u=Math.min(s,r,a),d=Math.min(o,c,l),h=Math.max(s,r,a),f=Math.max(o,c,l);let g=i.next;for(;g!==t;){if(g.x>=u&&g.x<=h&&g.y>=d&&g.y<=f&&ys(s,o,r,c,a,l,g.x,g.y)&&_e(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function b_(n,t,e,i){const s=n.prev,r=n,a=n.next;if(_e(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,u=s.y,d=r.y,h=a.y,f=Math.min(o,c,l),g=Math.min(u,d,h),S=Math.max(o,c,l),p=Math.max(u,d,h),m=lc(f,g,t,e,i),v=lc(S,p,t,e,i);let E=n.prevZ,y=n.nextZ;for(;E&&E.z>=m&&y&&y.z<=v;){if(E.x>=f&&E.x<=S&&E.y>=g&&E.y<=p&&E!==s&&E!==a&&ys(o,u,c,d,l,h,E.x,E.y)&&_e(E.prev,E,E.next)>=0||(E=E.prevZ,y.x>=f&&y.x<=S&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&ys(o,u,c,d,l,h,y.x,y.y)&&_e(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;E&&E.z>=m;){if(E.x>=f&&E.x<=S&&E.y>=g&&E.y<=p&&E!==s&&E!==a&&ys(o,u,c,d,l,h,E.x,E.y)&&_e(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=S&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&ys(o,u,c,d,l,h,y.x,y.y)&&_e(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function A_(n,t){let e=n;do{const i=e.prev,s=e.next.next;!Qi(i,s)&&Wd(i,e,e.next,s)&&Bs(i,s)&&Bs(s,i)&&(t.push(i.i,e.i,s.i),Hs(e),Hs(e.next),e=n=s),e=e.next}while(e!==n);return vi(e)}function R_(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&F_(a,o)){let c=Xd(a,o);a=vi(a,a.next),c=vi(c,c.next),ks(a,t,e,i,s,r,0),ks(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function w_(n,t,e,i){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=zd(n,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(U_(l))}s.sort(C_);for(let r=0;r<s.length;r++)e=P_(s[r],e);return e}function C_(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function P_(n,t){const e=I_(n,t);if(!e)return t;const i=Xd(e,n);return vi(i,i.next),vi(e,e.next)}function I_(n,t){let e=t;const i=n.x,s=n.y;let r=-1/0,a;if(Qi(n,e))return e;do{if(Qi(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=i&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let u=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Vd(s<l?i:r,s,c,l,s<l?r:i,s,e.x,e.y)){const d=Math.abs(s-e.y)/(i-e.x);Bs(e,n)&&(d<u||d===u&&(e.x>a.x||e.x===a.x&&L_(a,e)))&&(a=e,u=d)}e=e.next}while(e!==o);return a}function L_(n,t){return _e(n.prev,n,t.prev)<0&&_e(t.next,n,n.next)<0}function D_(n,t,e,i){let s=n;do s.z===0&&(s.z=lc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,N_(s)}function N_(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,e*=2}while(t>1);return n}function lc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function U_(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Vd(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function ys(n,t,e,i,s,r,a,o){return!(n===a&&t===o)&&Vd(n,t,e,i,s,r,a,o)}function F_(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!O_(n,t)&&(Bs(n,t)&&Bs(t,n)&&k_(n,t)&&(_e(n.prev,n,t.prev)||_e(n,t.prev,t))||Qi(n,t)&&_e(n.prev,n,n.next)>0&&_e(t.prev,t,t.next)>0)}function _e(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Qi(n,t){return n.x===t.x&&n.y===t.y}function Wd(n,t,e,i){const s=gr(_e(n,t,e)),r=gr(_e(n,t,i)),a=gr(_e(e,i,n)),o=gr(_e(e,i,t));return!!(s!==r&&a!==o||s===0&&mr(n,e,t)||r===0&&mr(n,i,t)||a===0&&mr(e,n,i)||o===0&&mr(e,t,i))}function mr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function gr(n){return n>0?1:n<0?-1:0}function O_(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Wd(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Bs(n,t){return _e(n.prev,n,n.next)<0?_e(n,t,n.next)>=0&&_e(n,n.prev,t)>=0:_e(n,t,n.prev)<0||_e(n,n.next,t)<0}function k_(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Xd(n,t){const e=uc(n.i,n.x,n.y),i=uc(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function lu(n,t,e,i){const s=uc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Hs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function uc(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function B_(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class H_{static triangulate(t,e,i=2){return E_(t,e,i)}}class Vi{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return Vi.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];uu(t),hu(i,t);let a=t.length;e.forEach(uu);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,hu(i,e[c]);const o=H_.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function uu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function hu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class qc extends Oe{constructor(t=new Gd([new pt(.5,.5),new pt(-.5,.5),new pt(-.5,-.5),new pt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new Me(s,3)),this.setAttribute("uv",new Me(r,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let h=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,S=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:G_;let E,y=!1,P,b,C,x;if(m){E=m.getSpacedPoints(u),y=!0,h=!1;const J=m.isCatmullRomCurve3?m.closed:!1;P=m.computeFrenetFrames(u,J),b=new L,C=new L,x=new L}h||(p=0,f=0,g=0,S=0);const A=o.extractPoints(l);let I=A.shape;const R=A.holes;if(!Vi.isClockWise(I)){I=I.reverse();for(let J=0,it=R.length;J<it;J++){const Q=R[J];Vi.isClockWise(Q)&&(R[J]=Q.reverse())}}function X(J){const Q=10000000000000001e-36;let xt=J[0];for(let dt=1;dt<=J.length;dt++){const Ot=dt%J.length,w=J[Ot],Ht=w.x-xt.x,Rt=w.y-xt.y,kt=Ht*Ht+Rt*Rt,st=Math.max(Math.abs(w.x),Math.abs(w.y),Math.abs(xt.x),Math.abs(xt.y)),re=Q*st*st;if(kt<=re){J.splice(Ot,1),dt--;continue}xt=w}}X(I),R.forEach(X);const W=R.length,N=I;for(let J=0;J<W;J++){const it=R[J];I=I.concat(it)}function B(J,it,Q){return it||jt("ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(it,Q)}const k=I.length;function j(J,it,Q){let xt,dt,Ot;const w=J.x-it.x,Ht=J.y-it.y,Rt=Q.x-J.x,kt=Q.y-J.y,st=w*w+Ht*Ht,re=w*kt-Ht*Rt;if(Math.abs(re)>Number.EPSILON){const T=Math.sqrt(st),_=Math.sqrt(Rt*Rt+kt*kt),O=it.x-Ht/T,K=it.y+w/T,tt=Q.x-kt/_,rt=Q.y+Rt/_,lt=((tt-O)*kt-(rt-K)*Rt)/(w*kt-Ht*Rt);xt=O+w*lt-J.x,dt=K+Ht*lt-J.y;const Y=xt*xt+dt*dt;if(Y<=2)return new pt(xt,dt);Ot=Math.sqrt(Y/2)}else{let T=!1;w>Number.EPSILON?Rt>Number.EPSILON&&(T=!0):w<-Number.EPSILON?Rt<-Number.EPSILON&&(T=!0):Math.sign(Ht)===Math.sign(kt)&&(T=!0),T?(xt=-Ht,dt=w,Ot=Math.sqrt(st)):(xt=w,dt=Ht,Ot=Math.sqrt(st/2))}return new pt(xt/Ot,dt/Ot)}const nt=[];for(let J=0,it=N.length,Q=it-1,xt=J+1;J<it;J++,Q++,xt++)Q===it&&(Q=0),xt===it&&(xt=0),nt[J]=j(N[J],N[Q],N[xt]);const ft=[];let St,At=nt.concat();for(let J=0,it=W;J<it;J++){const Q=R[J];St=[];for(let xt=0,dt=Q.length,Ot=dt-1,w=xt+1;xt<dt;xt++,Ot++,w++)Ot===dt&&(Ot=0),w===dt&&(w=0),St[xt]=j(Q[xt],Q[Ot],Q[w]);ft.push(St),At=At.concat(St)}let Xt;if(p===0)Xt=Vi.triangulateShape(N,R);else{const J=[],it=[];for(let Q=0;Q<p;Q++){const xt=Q/p,dt=f*Math.cos(xt*Math.PI/2),Ot=g*Math.sin(xt*Math.PI/2)+S;for(let w=0,Ht=N.length;w<Ht;w++){const Rt=B(N[w],nt[w],Ot);Ct(Rt.x,Rt.y,-dt),xt===0&&J.push(Rt)}for(let w=0,Ht=W;w<Ht;w++){const Rt=R[w];St=ft[w];const kt=[];for(let st=0,re=Rt.length;st<re;st++){const T=B(Rt[st],St[st],Ot);Ct(T.x,T.y,-dt),xt===0&&kt.push(T)}xt===0&&it.push(kt)}}Xt=Vi.triangulateShape(J,it)}const ee=Xt.length,Bt=g+S;for(let J=0;J<k;J++){const it=h?B(I[J],At[J],Bt):I[J];y?(C.copy(P.normals[0]).multiplyScalar(it.x),b.copy(P.binormals[0]).multiplyScalar(it.y),x.copy(E[0]).add(C).add(b),Ct(x.x,x.y,x.z)):Ct(it.x,it.y,0)}for(let J=1;J<=u;J++)for(let it=0;it<k;it++){const Q=h?B(I[it],At[it],Bt):I[it];y?(C.copy(P.normals[J]).multiplyScalar(Q.x),b.copy(P.binormals[J]).multiplyScalar(Q.y),x.copy(E[J]).add(C).add(b),Ct(x.x,x.y,x.z)):Ct(Q.x,Q.y,d/u*J)}for(let J=p-1;J>=0;J--){const it=J/p,Q=f*Math.cos(it*Math.PI/2),xt=g*Math.sin(it*Math.PI/2)+S;for(let dt=0,Ot=N.length;dt<Ot;dt++){const w=B(N[dt],nt[dt],xt);Ct(w.x,w.y,d+Q)}for(let dt=0,Ot=R.length;dt<Ot;dt++){const w=R[dt];St=ft[dt];for(let Ht=0,Rt=w.length;Ht<Rt;Ht++){const kt=B(w[Ht],St[Ht],xt);y?Ct(kt.x,kt.y+E[u-1].y,E[u-1].x+Q):Ct(kt.x,kt.y,d+Q)}}}$(),gt();function $(){const J=s.length/3;if(h){let it=0,Q=k*it;for(let xt=0;xt<ee;xt++){const dt=Xt[xt];Ut(dt[2]+Q,dt[1]+Q,dt[0]+Q)}it=u+p*2,Q=k*it;for(let xt=0;xt<ee;xt++){const dt=Xt[xt];Ut(dt[0]+Q,dt[1]+Q,dt[2]+Q)}}else{for(let it=0;it<ee;it++){const Q=Xt[it];Ut(Q[2],Q[1],Q[0])}for(let it=0;it<ee;it++){const Q=Xt[it];Ut(Q[0]+k*u,Q[1]+k*u,Q[2]+k*u)}}i.addGroup(J,s.length/3-J,0)}function gt(){const J=s.length/3;let it=0;at(N,it),it+=N.length;for(let Q=0,xt=R.length;Q<xt;Q++){const dt=R[Q];at(dt,it),it+=dt.length}i.addGroup(J,s.length/3-J,1)}function at(J,it){let Q=J.length;for(;--Q>=0;){const xt=Q;let dt=Q-1;dt<0&&(dt=J.length-1);for(let Ot=0,w=u+p*2;Ot<w;Ot++){const Ht=k*Ot,Rt=k*(Ot+1),kt=it+xt+Ht,st=it+dt+Ht,re=it+dt+Rt,T=it+xt+Rt;Dt(kt,st,re,T)}}}function Ct(J,it,Q){c.push(J),c.push(it),c.push(Q)}function Ut(J,it,Q){ne(J),ne(it),ne(Q);const xt=s.length/3,dt=v.generateTopUV(i,s,xt-3,xt-2,xt-1);Ft(dt[0]),Ft(dt[1]),Ft(dt[2])}function Dt(J,it,Q,xt){ne(J),ne(it),ne(xt),ne(it),ne(Q),ne(xt);const dt=s.length/3,Ot=v.generateSideWallUV(i,s,dt-6,dt-3,dt-2,dt-1);Ft(Ot[0]),Ft(Ot[1]),Ft(Ot[3]),Ft(Ot[1]),Ft(Ot[2]),Ft(Ot[3])}function ne(J){s.push(c[J*3+0]),s.push(c[J*3+1]),s.push(c[J*3+2])}function Ft(J){r.push(J.x),r.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return z_(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new cc[s.type]().fromJSON(s)),new qc(i,t.options)}}const G_={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],u=t[s*3+1];return[new pt(r,a),new pt(o,c),new pt(l,u)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],u=t[i*3+1],d=t[i*3+2],h=t[s*3],f=t[s*3+1],g=t[s*3+2],S=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(o-u)<Math.abs(a-l)?[new pt(a,1-c),new pt(l,1-d),new pt(h,1-g),new pt(S,1-m)]:[new pt(o,1-c),new pt(u,1-d),new pt(f,1-g),new pt(p,1-m)]}};function z_(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ws extends Wc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ws(t.radius,t.detail)}}class Vs extends Oe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,d=t/o,h=e/c,f=[],g=[],S=[],p=[];for(let m=0;m<u;m++){const v=m*h-a;for(let E=0;E<l;E++){const y=E*d-r;g.push(y,-v,0),S.push(0,0,1),p.push(E/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let v=0;v<o;v++){const E=v+l*m,y=v+l*(m+1),P=v+1+l*(m+1),b=v+1+l*m;f.push(E,y,b),f.push(y,P,b)}this.setIndex(f),this.setAttribute("position",new Me(g,3)),this.setAttribute("normal",new Me(S,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vs(t.width,t.height,t.widthSegments,t.heightSegments)}}class sa extends Oe{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),s=Math.floor(s);const c=[],l=[],u=[],d=[],h=new L,f=new L,g=new L;for(let S=0;S<=i;S++){const p=a+S/i*o;for(let m=0;m<=s;m++){const v=m/s*r;f.x=(t+e*Math.cos(p))*Math.cos(v),f.y=(t+e*Math.cos(p))*Math.sin(v),f.z=e*Math.sin(p),l.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),g.subVectors(f,h).normalize(),u.push(g.x,g.y,g.z),d.push(m/s),d.push(S/i)}}for(let S=1;S<=i;S++)for(let p=1;p<=s;p++){const m=(s+1)*S+p-1,v=(s+1)*(S-1)+p-1,E=(s+1)*(S-1)+p,y=(s+1)*S+p;c.push(m,v,y),c.push(v,E,y)}this.setIndex(c),this.setAttribute("position",new Me(l,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}function ts(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];if(du(s))s.isRenderTargetTexture?(Nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(du(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function Ue(n){const t={};for(let e=0;e<n.length;e++){const i=ts(n[e]);for(const s in i)t[s]=i[s]}return t}function du(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function V_(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Yd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const W_={clone:ts,merge:Ue};var X_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Y_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class An extends as{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=X_,this.fragmentShader=Y_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ts(t.uniforms),this.uniformsGroups=V_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class q_ extends An{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ye extends as{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class K_ extends as{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=A0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Z_ extends as{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class qd extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}const Xa=new ae,fu=new L,pu=new L;class $_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pt(512,512),this.mapType=Xe,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vc,this._frameExtents=new pt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;fu.setFromMatrixPosition(t.matrixWorld),e.position.copy(fu),pu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pu),e.updateMatrixWorld(),Xa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xa,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Fs||e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Xa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const _r=new L,xr=new ss,_n=new L;class Kd extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(_r,xr,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_r,xr,_n.set(1,1,1)).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorld.decompose(_r,xr,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_r,xr,_n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const $n=new L,mu=new pt,gu=new pt;class Qe extends Kd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=oc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(_a*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oc*2*Math.atan(Math.tan(_a*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){$n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set($n.x,$n.y).multiplyScalar(-t/$n.z),$n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set($n.x,$n.y).multiplyScalar(-t/$n.z)}getViewSize(t,e){return this.getViewBounds(t,mu,gu),e.subVectors(gu,mu)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(_a*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Kc extends Kd{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class J_ extends $_{constructor(){super(new Kc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class j_ extends qd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new J_}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Q_ extends qd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Oi=-90,ki=1;class tx extends Pe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(Oi,ki,t,e);s.layers=this.layers,this.add(s);const r=new Qe(Oi,ki,t,e);r.layers=this.layers,this.add(r);const a=new Qe(Oi,ki,t,e);a.layers=this.layers,this.add(a);const o=new Qe(Oi,ki,t,e);o.layers=this.layers,this.add(o);const c=new Qe(Oi,ki,t,e);c.layers=this.layers,this.add(c);const l=new Qe(Oi,ki,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Sn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Fs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(i,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),i.texture.generateMipmaps=S,t.setRenderTarget(i,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class ex extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const _u=new ae;class nx{constructor(t,e,i=0,s=1/0){this.ray=new Gc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Hc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):jt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return _u.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_u),this}intersectObject(t,e=!0,i=[]){return hc(t,this,i,e),i.sort(xu),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)hc(t[s],this,i,e);return i.sort(xu),i}}function xu(n,t){return n.distance-t.distance}function hc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)hc(r[a],t,e,!0)}}const al=class al{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};al.prototype.isMatrix2=!0;let vu=al;function Mu(n,t,e,i){const s=ix(i);switch(e){case Ad:return n*t;case Dc:return n*t/s.components*s.byteLength;case Nc:return n*t/s.components*s.byteLength;case xi:return n*t*2/s.components*s.byteLength;case Uc:return n*t*2/s.components*s.byteLength;case Rd:return n*t*3/s.components*s.byteLength;case dn:return n*t*4/s.components*s.byteLength;case Fc:return n*t*4/s.components*s.byteLength;case Cr:case Pr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ir:case Lr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Po:case Lo:return Math.max(n,16)*Math.max(t,8)/4;case Co:case Io:return Math.max(n,8)*Math.max(t,8)/2;case Do:case No:case Fo:case Oo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Uo:case zr:case ko:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Bo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ho:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Go:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case zo:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Vo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Wo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Xo:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Yo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case qo:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ko:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Zo:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case $o:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Jo:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case jo:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Qo:case tc:case ec:return Math.ceil(n/4)*Math.ceil(t/4)*16;case nc:case ic:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Vr:case sc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ix(n){switch(n){case Xe:case yd:return{byteLength:1,components:1};case Ns:case Ed:case Bn:return{byteLength:2,components:1};case Ic:case Lc:return{byteLength:2,components:4};case bn:case Pc:case hn:return{byteLength:4,components:1};case Td:case bd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cc}}));typeof window<"u"&&(window.__THREE__?Nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Zd(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function sx(n){const t=new WeakMap;function e(o,c){const l=o.array,u=o.usage,d=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,u),o.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const u=c.array,d=c.updateRanges;if(n.bindBuffer(l,o),d.length===0)n.bufferSubData(l,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){const g=d[h],S=d[f];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++h,d[h]=S)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){const S=d[f];n.bufferSubData(l,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var rx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ax=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ox=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ux=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,px=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_x=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,xx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ex=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,bx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ax=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,wx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Cx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Px=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ix=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ux="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ox=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Bx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Hx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,qx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$x=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Jx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ev=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,iv=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,av=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ov=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,cv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,lv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_v=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ev=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Av=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Cv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Iv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Uv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ov=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,zv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,qv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$v=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Jv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,eM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,iM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,aM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,dM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,pM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,mM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_M=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,MM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,SM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,TM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,AM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,RM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,CM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,PM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,LM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,NM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,UM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,OM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:rx,alphahash_pars_fragment:ax,alphamap_fragment:ox,alphamap_pars_fragment:cx,alphatest_fragment:lx,alphatest_pars_fragment:ux,aomap_fragment:hx,aomap_pars_fragment:dx,batching_pars_vertex:fx,batching_vertex:px,begin_vertex:mx,beginnormal_vertex:gx,bsdfs:_x,iridescence_fragment:xx,bumpmap_pars_fragment:vx,clipping_planes_fragment:Mx,clipping_planes_pars_fragment:Sx,clipping_planes_pars_vertex:yx,clipping_planes_vertex:Ex,color_fragment:Tx,color_pars_fragment:bx,color_pars_vertex:Ax,color_vertex:Rx,common:wx,cube_uv_reflection_fragment:Cx,defaultnormal_vertex:Px,displacementmap_pars_vertex:Ix,displacementmap_vertex:Lx,emissivemap_fragment:Dx,emissivemap_pars_fragment:Nx,colorspace_fragment:Ux,colorspace_pars_fragment:Fx,envmap_fragment:Ox,envmap_common_pars_fragment:kx,envmap_pars_fragment:Bx,envmap_pars_vertex:Hx,envmap_physical_pars_fragment:Jx,envmap_vertex:Gx,fog_vertex:zx,fog_pars_vertex:Vx,fog_fragment:Wx,fog_pars_fragment:Xx,gradientmap_pars_fragment:Yx,lightmap_pars_fragment:qx,lights_lambert_fragment:Kx,lights_lambert_pars_fragment:Zx,lights_pars_begin:$x,lights_toon_fragment:jx,lights_toon_pars_fragment:Qx,lights_phong_fragment:tv,lights_phong_pars_fragment:ev,lights_physical_fragment:nv,lights_physical_pars_fragment:iv,lights_fragment_begin:sv,lights_fragment_maps:rv,lights_fragment_end:av,lightprobes_pars_fragment:ov,logdepthbuf_fragment:cv,logdepthbuf_pars_fragment:lv,logdepthbuf_pars_vertex:uv,logdepthbuf_vertex:hv,map_fragment:dv,map_pars_fragment:fv,map_particle_fragment:pv,map_particle_pars_fragment:mv,metalnessmap_fragment:gv,metalnessmap_pars_fragment:_v,morphinstance_vertex:xv,morphcolor_vertex:vv,morphnormal_vertex:Mv,morphtarget_pars_vertex:Sv,morphtarget_vertex:yv,normal_fragment_begin:Ev,normal_fragment_maps:Tv,normal_pars_fragment:bv,normal_pars_vertex:Av,normal_vertex:Rv,normalmap_pars_fragment:wv,clearcoat_normal_fragment_begin:Cv,clearcoat_normal_fragment_maps:Pv,clearcoat_pars_fragment:Iv,iridescence_pars_fragment:Lv,opaque_fragment:Dv,packing:Nv,premultiplied_alpha_fragment:Uv,project_vertex:Fv,dithering_fragment:Ov,dithering_pars_fragment:kv,roughnessmap_fragment:Bv,roughnessmap_pars_fragment:Hv,shadowmap_pars_fragment:Gv,shadowmap_pars_vertex:zv,shadowmap_vertex:Vv,shadowmask_pars_fragment:Wv,skinbase_vertex:Xv,skinning_pars_vertex:Yv,skinning_vertex:qv,skinnormal_vertex:Kv,specularmap_fragment:Zv,specularmap_pars_fragment:$v,tonemapping_fragment:Jv,tonemapping_pars_fragment:jv,transmission_fragment:Qv,transmission_pars_fragment:tM,uv_pars_fragment:eM,uv_pars_vertex:nM,uv_vertex:iM,worldpos_vertex:sM,background_vert:rM,background_frag:aM,backgroundCube_vert:oM,backgroundCube_frag:cM,cube_vert:lM,cube_frag:uM,depth_vert:hM,depth_frag:dM,distance_vert:fM,distance_frag:pM,equirect_vert:mM,equirect_frag:gM,linedashed_vert:_M,linedashed_frag:xM,meshbasic_vert:vM,meshbasic_frag:MM,meshlambert_vert:SM,meshlambert_frag:yM,meshmatcap_vert:EM,meshmatcap_frag:TM,meshnormal_vert:bM,meshnormal_frag:AM,meshphong_vert:RM,meshphong_frag:wM,meshphysical_vert:CM,meshphysical_frag:PM,meshtoon_vert:IM,meshtoon_frag:LM,points_vert:DM,points_frag:NM,shadow_vert:UM,shadow_frag:FM,sprite_vert:OM,sprite_frag:kM},mt={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},Mn={basic:{uniforms:Ue([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:Ue([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new te(0)},envMapIntensity:{value:1}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:Ue([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:Ue([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:Ue([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new te(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:Ue([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:Ue([mt.points,mt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:Ue([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:Ue([mt.common,mt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:Ue([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:Ue([mt.sprite,mt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distance:{uniforms:Ue([mt.common,mt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distance_vert,fragmentShader:qt.distance_frag},shadow:{uniforms:Ue([mt.lights,mt.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};Mn.physical={uniforms:Ue([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const vr={r:0,b:0,g:0},BM=new ae,$d=new zt;$d.set(-1,0,0,0,1,0,0,0,1);function HM(n,t,e,i,s,r){const a=new te(0);let o=s===!0?0:1,c,l,u=null,d=0,h=null;function f(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){const y=v.backgroundBlurriness>0;E=t.get(E,y)}return E}function g(v){let E=!1;const y=f(v);y===null?p(a,o):y&&y.isColor&&(p(y,1),E=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?e.buffers.color.setClear(0,0,0,1,r):P==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function S(v,E){const y=f(E);y&&(y.isCubeTexture||y.mapping===ia)?(l===void 0&&(l=new $t(new be(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:ts(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(BM.makeRotationFromEuler(E.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply($d),l.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,(u!==y||d!==y.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new $t(new Vs(2,2),new An({name:"BackgroundMaterial",uniforms:ts(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,E){v.getRGB(vr,Yd(n)),e.buffers.color.setClear(vr.r,vr.g,vr.b,E,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,E=1){a.set(v),o=E,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,p(a,o)},render:g,addToRenderList:S,dispose:m}}function GM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(R,F,X,W,N){let B=!1;const k=d(R,W,X,F);r!==k&&(r=k,l(r.object)),B=f(R,W,X,N),B&&g(R,W,X,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(B||a)&&(a=!1,y(R,F,X,W),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return n.createVertexArray()}function l(R){return n.bindVertexArray(R)}function u(R){return n.deleteVertexArray(R)}function d(R,F,X,W){const N=W.wireframe===!0;let B=i[F.id];B===void 0&&(B={},i[F.id]=B);const k=R.isInstancedMesh===!0?R.id:0;let j=B[k];j===void 0&&(j={},B[k]=j);let nt=j[X.id];nt===void 0&&(nt={},j[X.id]=nt);let ft=nt[N];return ft===void 0&&(ft=h(c()),nt[N]=ft),ft}function h(R){const F=[],X=[],W=[];for(let N=0;N<e;N++)F[N]=0,X[N]=0,W[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:X,attributeDivisors:W,object:R,attributes:{},index:null}}function f(R,F,X,W){const N=r.attributes,B=F.attributes;let k=0;const j=X.getAttributes();for(const nt in j)if(j[nt].location>=0){const St=N[nt];let At=B[nt];if(At===void 0&&(nt==="instanceMatrix"&&R.instanceMatrix&&(At=R.instanceMatrix),nt==="instanceColor"&&R.instanceColor&&(At=R.instanceColor)),St===void 0||St.attribute!==At||At&&St.data!==At.data)return!0;k++}return r.attributesNum!==k||r.index!==W}function g(R,F,X,W){const N={},B=F.attributes;let k=0;const j=X.getAttributes();for(const nt in j)if(j[nt].location>=0){let St=B[nt];St===void 0&&(nt==="instanceMatrix"&&R.instanceMatrix&&(St=R.instanceMatrix),nt==="instanceColor"&&R.instanceColor&&(St=R.instanceColor));const At={};At.attribute=St,St&&St.data&&(At.data=St.data),N[nt]=At,k++}r.attributes=N,r.attributesNum=k,r.index=W}function S(){const R=r.newAttributes;for(let F=0,X=R.length;F<X;F++)R[F]=0}function p(R){m(R,0)}function m(R,F){const X=r.newAttributes,W=r.enabledAttributes,N=r.attributeDivisors;X[R]=1,W[R]===0&&(n.enableVertexAttribArray(R),W[R]=1),N[R]!==F&&(n.vertexAttribDivisor(R,F),N[R]=F)}function v(){const R=r.newAttributes,F=r.enabledAttributes;for(let X=0,W=F.length;X<W;X++)F[X]!==R[X]&&(n.disableVertexAttribArray(X),F[X]=0)}function E(R,F,X,W,N,B,k){k===!0?n.vertexAttribIPointer(R,F,X,N,B):n.vertexAttribPointer(R,F,X,W,N,B)}function y(R,F,X,W){S();const N=W.attributes,B=X.getAttributes(),k=F.defaultAttributeValues;for(const j in B){const nt=B[j];if(nt.location>=0){let ft=N[j];if(ft===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(ft=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(ft=R.instanceColor)),ft!==void 0){const St=ft.normalized,At=ft.itemSize,Xt=t.get(ft);if(Xt===void 0)continue;const ee=Xt.buffer,Bt=Xt.type,$=Xt.bytesPerElement,gt=Bt===n.INT||Bt===n.UNSIGNED_INT||ft.gpuType===Pc;if(ft.isInterleavedBufferAttribute){const at=ft.data,Ct=at.stride,Ut=ft.offset;if(at.isInstancedInterleavedBuffer){for(let Dt=0;Dt<nt.locationSize;Dt++)m(nt.location+Dt,at.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Dt=0;Dt<nt.locationSize;Dt++)p(nt.location+Dt);n.bindBuffer(n.ARRAY_BUFFER,ee);for(let Dt=0;Dt<nt.locationSize;Dt++)E(nt.location+Dt,At/nt.locationSize,Bt,St,Ct*$,(Ut+At/nt.locationSize*Dt)*$,gt)}else{if(ft.isInstancedBufferAttribute){for(let at=0;at<nt.locationSize;at++)m(nt.location+at,ft.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let at=0;at<nt.locationSize;at++)p(nt.location+at);n.bindBuffer(n.ARRAY_BUFFER,ee);for(let at=0;at<nt.locationSize;at++)E(nt.location+at,At/nt.locationSize,Bt,St,At*$,At/nt.locationSize*at*$,gt)}}else if(k!==void 0){const St=k[j];if(St!==void 0)switch(St.length){case 2:n.vertexAttrib2fv(nt.location,St);break;case 3:n.vertexAttrib3fv(nt.location,St);break;case 4:n.vertexAttrib4fv(nt.location,St);break;default:n.vertexAttrib1fv(nt.location,St)}}}}v()}function P(){A();for(const R in i){const F=i[R];for(const X in F){const W=F[X];for(const N in W){const B=W[N];for(const k in B)u(B[k].object),delete B[k];delete W[N]}}delete i[R]}}function b(R){if(i[R.id]===void 0)return;const F=i[R.id];for(const X in F){const W=F[X];for(const N in W){const B=W[N];for(const k in B)u(B[k].object),delete B[k];delete W[N]}}delete i[R.id]}function C(R){for(const F in i){const X=i[F];for(const W in X){const N=X[W];if(N[R.id]===void 0)continue;const B=N[R.id];for(const k in B)u(B[k].object),delete B[k];delete N[R.id]}}}function x(R){for(const F in i){const X=i[F],W=R.isInstancedMesh===!0?R.id:0,N=X[W];if(N!==void 0){for(const B in N){const k=N[B];for(const j in k)u(k[j].object),delete k[j];delete N[B]}delete X[W],Object.keys(X).length===0&&delete i[F]}}}function A(){I(),a=!0,r!==s&&(r=s,l(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:p,disableUnusedAttributes:v}}function zM(n,t,e){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),e.update(l,i,1)}function a(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),e.update(l,i,u))}function o(c,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];e.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function VM(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==dn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===Bn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Xe&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==hn&&!x)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(Nt("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:y,maxSamples:P,samples:b}}function WM(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new ci,o=new zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||i!==0||s;return s=h,i=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,m=n.get(d);if(!s||g===null||g.length===0||r&&!p)r?u(null):l();else{const v=r?0:i,E=v*4;let y=m.clippingState||null;c.value=y,y=u(g,h,E,f);for(let P=0;P!==E;++P)y[P]=e[P];m.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(d,h,f,g){const S=d!==null?d.length:0;let p=null;if(S!==0){if(p=c.value,g!==!0||p===null){const m=f+S*4,v=h.matrixWorldInverse;o.getNormalMatrix(v),(p===null||p.length<m)&&(p=new Float32Array(m));for(let E=0,y=f;E!==S;++E,y+=4)a.copy(d[E]).applyMatrix4(v,o),a.normal.toArray(p,y),p[y+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,p}}const jn=4,Su=[.125,.215,.35,.446,.526,.582],ui=20,XM=256,gs=new Kc,yu=new te;let Ya=null,qa=0,Ka=0,Za=!1;const YM=new L;class Eu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=YM}=r;Ya=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),Za=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Au(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ya,qa,Ka),this._renderer.xr.enabled=Za,t.scissorTest=!1,Bi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_i||t.mapping===$i?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ya=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ka=this._renderer.getActiveMipmapLevel(),Za=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Bn,format:dn,colorSpace:Wr,depthBuffer:!1},s=Tu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tu(t,e,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=qM(r)),this._blurMaterial=ZM(r,t,e),this._ggxMaterial=KM(r,t,e)}return s}_compileMaterial(t){const e=new $t(new Oe,t);this._renderer.compile(e,gs)}_sceneToCubeUV(t,e,i,s,r){const c=new Qe(90,1,e,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(yu),d.toneMapping=En,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $t(new be,new zc({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,p=S.material;let m=!1;const v=t.background;v?v.isColor&&(p.color.copy(v),t.background=null,m=!0):(p.color.copy(yu),m=!0);for(let E=0;E<6;E++){const y=E%3;y===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[E],r.y,r.z)):y===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[E]));const P=this._cubeSize;Bi(s,y*P,E>2?P:0,P,P),d.setRenderTarget(s),m&&d.render(S,c),d.render(t,c)}d.toneMapping=f,d.autoClear=h,t.background=v}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===_i||t.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Au()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bu());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Bi(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,gs)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=0+l*1.25,f=d*h,{_lodMax:g}=this,S=this._sizeLods[i],p=3*S*(i>g-jn?i-g+jn:0),m=4*(this._cubeSize-S);c.envMap.value=t.texture,c.roughness.value=f,c.mipInt.value=g-e,Bi(r,p,m,3*S,2*S),s.setRenderTarget(r),s.render(o,gs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,Bi(t,p,m,3*S,2*S),s.setRenderTarget(t),s.render(o,gs)}_blur(t,e,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&jt("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[s];d.material=l;const h=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ui-1),S=r/g,p=isFinite(r)?1+Math.floor(u*S):ui;p>ui&&Nt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ui}`);const m=[];let v=0;for(let C=0;C<ui;++C){const x=C/S,A=Math.exp(-x*x/2);m.push(A),C===0?v+=A:C<p&&(v+=2*A)}for(let C=0;C<m.length;C++)m[C]=m[C]/v;h.envMap.value=t.texture,h.samples.value=p,h.weights.value=m,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:E}=this;h.dTheta.value=g,h.mipInt.value=E-i;const y=this._sizeLods[s],P=3*y*(s>E-jn?s-E+jn:0),b=4*(this._cubeSize-y);Bi(e,P,b,3*y,2*y),c.setRenderTarget(e),c.render(d,gs)}}function qM(n){const t=[],e=[],i=[];let s=n;const r=n-jn+1+Su.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>n-jn?c=Su[a-n+jn-1]:a===0&&(c=0),e.push(c);const l=1/(o-2),u=-l,d=1+l,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,S=3,p=2,m=1,v=new Float32Array(S*g*f),E=new Float32Array(p*g*f),y=new Float32Array(m*g*f);for(let b=0;b<f;b++){const C=b%3*2/3-1,x=b>2?0:-1,A=[C,x,0,C+2/3,x,0,C+2/3,x+1,0,C,x,0,C+2/3,x+1,0,C,x+1,0];v.set(A,S*g*b),E.set(h,p*g*b);const I=[b,b,b,b,b,b];y.set(I,m*g*b)}const P=new Oe;P.setAttribute("position",new fn(v,S)),P.setAttribute("uv",new fn(E,p)),P.setAttribute("faceIndex",new fn(y,m)),i.push(new $t(P,null)),s>jn&&s--}return{lodMeshes:i,sizeLods:t,sigmas:e}}function Tu(n,t,e){const i=new Tn(n,t,e);return i.texture.mapping=ia,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Bi(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function KM(n,t,e){return new An({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:XM,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ra(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function ZM(n,t,e){const i=new Float32Array(ui),s=new L(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function bu(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Au(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function ra(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Jd extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ud(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new be(5,5,5),r=new An({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:He,blending:On});r.uniforms.tEquirect.value=e;const a=new $t(s,r),o=e.minFilter;return e.minFilter===hi&&(e.minFilter=Ne),new tx(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}function $M(n){let t=new WeakMap,e=new WeakMap,i=null;function s(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){const f=h.mapping;if(f===pa||f===ma)if(t.has(h)){const g=t.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const S=new Jd(g.height);return S.fromEquirectangularTexture(n,h),t.set(h,S),h.addEventListener("dispose",l),o(S.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const f=h.mapping,g=f===pa||f===ma,S=f===_i||f===$i;if(g||S){let p=e.get(h);const m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return i===null&&(i=new Eu(n)),p=g?i.fromEquirectangular(h,p):i.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{const v=h.image;return g&&v&&v.height>0||S&&v&&c(v)?(i===null&&(i=new Eu(n)),p=g?i.fromEquirectangular(h):i.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function o(h,f){return f===pa?h.mapping=_i:f===ma&&(h.mapping=$i),h}function c(h){let f=0;const g=6;for(let S=0;S<g;S++)h[S]!==void 0&&f++;return f===g}function l(h){const f=h.target;f.removeEventListener("dispose",l);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(h){const f=h.target;f.removeEventListener("dispose",u);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function JM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];const s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&ac("WebGLRenderer: "+i+" extension not supported."),s}}}function jM(n,t,e,i){const s={},r=new WeakMap;function a(d){const h=d.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];const f=r.get(h);f&&(t.remove(f),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function c(d){const h=d.attributes;for(const f in h)t.update(h[f],n.ARRAY_BUFFER)}function l(d){const h=[],f=d.index,g=d.attributes.position;let S=0;if(g===void 0)return;if(f!==null){const v=f.array;S=f.version;for(let E=0,y=v.length;E<y;E+=3){const P=v[E+0],b=v[E+1],C=v[E+2];h.push(P,b,b,C,C,P)}}else{const v=g.array;S=g.version;for(let E=0,y=v.length/3-1;E<y;E+=3){const P=E+0,b=E+1,C=E+2;h.push(P,b,b,C,C,P)}}const p=new(g.count>=65535?Ld:Id)(h,1);p.version=S;const m=r.get(d);m&&t.remove(m),r.set(d,p)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function QM(n,t,e){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,h){n.drawElements(i,h,r,d*a),e.update(h,i,1)}function l(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,r,d*a,f),e.update(h,i,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,d,0,f);let S=0;for(let p=0;p<f;p++)S+=h[p];e.update(S,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function tS(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:jt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function eS(n,t,e){const i=new WeakMap,s=new ve;function r(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(o);if(h===void 0||h.count!==d){let I=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",I)};var f=I;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),S===!0&&(y=2),p===!0&&(y=3);let P=o.attributes.position.count*y,b=1;P>t.maxTextureSize&&(b=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const C=new Float32Array(P*b*4*d),x=new Cd(C,P,b,d);x.type=hn,x.needsUpdate=!0;const A=y*4;for(let R=0;R<d;R++){const F=m[R],X=v[R],W=E[R],N=P*b*4*R;for(let B=0;B<F.count;B++){const k=B*A;g===!0&&(s.fromBufferAttribute(F,B),C[N+k+0]=s.x,C[N+k+1]=s.y,C[N+k+2]=s.z,C[N+k+3]=0),S===!0&&(s.fromBufferAttribute(X,B),C[N+k+4]=s.x,C[N+k+5]=s.y,C[N+k+6]=s.z,C[N+k+7]=0),p===!0&&(s.fromBufferAttribute(W,B),C[N+k+8]=s.x,C[N+k+9]=s.y,C[N+k+10]=s.z,C[N+k+11]=W.itemSize===4?s.w:1)}}h={count:d,texture:x,size:new pt(P,b)},i.set(o,h),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const S=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",S),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function nS(n,t,e,i,s){let r=new WeakMap;function a(l){const u=s.render.frame,d=l.geometry,h=t.get(l,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}const iS={[pd]:"LINEAR_TONE_MAPPING",[md]:"REINHARD_TONE_MAPPING",[gd]:"CINEON_TONE_MAPPING",[_d]:"ACES_FILMIC_TONE_MAPPING",[vd]:"AGX_TONE_MAPPING",[Md]:"NEUTRAL_TONE_MAPPING",[xd]:"CUSTOM_TONE_MAPPING"};function sS(n,t,e,i,s){const r=new Tn(t,e,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new Ji(t,e):void 0}),a=new Tn(t,e,{type:Bn,depthBuffer:!1,stencilBuffer:!1}),o=new Oe;o.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Me([0,2,0,0,2,0],2));const c=new q_({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new $t(o,c),u=new Kc(-1,1,1,-1,0,1);let d=null,h=null,f=!1,g,S=null,p=[],m=!1;this.setSize=function(v,E){r.setSize(v,E),a.setSize(v,E);for(let y=0;y<p.length;y++){const P=p[y];P.setSize&&P.setSize(v,E)}},this.setEffects=function(v){p=v,m=p.length>0&&p[0].isRenderPass===!0;const E=r.width,y=r.height;for(let P=0;P<p.length;P++){const b=p[P];b.setSize&&b.setSize(E,y)}},this.begin=function(v,E){if(f||v.toneMapping===En&&p.length===0)return!1;if(S=E,E!==null){const y=E.width,P=E.height;(r.width!==y||r.height!==P)&&this.setSize(y,P)}return m===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=En,!0},this.hasRenderPass=function(){return m},this.end=function(v,E){v.toneMapping=g,f=!0;let y=r,P=a;for(let b=0;b<p.length;b++){const C=p[b];if(C.enabled!==!1&&(C.render(v,P,y,E),C.needsSwap!==!1)){const x=y;y=P,P=x}}if(d!==v.outputColorSpace||h!==v.toneMapping){d=v.outputColorSpace,h=v.toneMapping,c.defines={},Qt.getTransfer(d)===oe&&(c.defines.SRGB_TRANSFER="");const b=iS[h];b&&(c.defines[b]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=y.texture,v.setRenderTarget(S),v.render(l,u),S=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),a.dispose(),o.dispose(),c.dispose()}}const jd=new Fe,dc=new Ji(1,1),Qd=new Cd,tf=new W0,ef=new Ud,Ru=[],wu=[],Cu=new Float32Array(16),Pu=new Float32Array(9),Iu=new Float32Array(4);function os(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=Ru[s];if(r===void 0&&(r=new Float32Array(s),Ru[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ae(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Re(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function aa(n,t){let e=wu[t];e===void 0&&(e=new Int32Array(t),wu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function rS(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function aS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2fv(this.addr,t),Re(e,t)}}function oS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;n.uniform3fv(this.addr,t),Re(e,t)}}function cS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4fv(this.addr,t),Re(e,t)}}function lS(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Iu.set(i),n.uniformMatrix2fv(this.addr,!1,Iu),Re(e,i)}}function uS(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Pu.set(i),n.uniformMatrix3fv(this.addr,!1,Pu),Re(e,i)}}function hS(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ae(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,i))return;Cu.set(i),n.uniformMatrix4fv(this.addr,!1,Cu),Re(e,i)}}function dS(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function fS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2iv(this.addr,t),Re(e,t)}}function pS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;n.uniform3iv(this.addr,t),Re(e,t)}}function mS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4iv(this.addr,t),Re(e,t)}}function gS(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function _S(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;n.uniform2uiv(this.addr,t),Re(e,t)}}function xS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;n.uniform3uiv(this.addr,t),Re(e,t)}}function vS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;n.uniform4uiv(this.addr,t),Re(e,t)}}function MS(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(dc.compareFunction=e.isReversedDepthBuffer()?kc:Oc,r=dc):r=jd,e.setTexture2D(t||r,s)}function SS(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||tf,s)}function yS(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||ef,s)}function ES(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Qd,s)}function TS(n){switch(n){case 5126:return rS;case 35664:return aS;case 35665:return oS;case 35666:return cS;case 35674:return lS;case 35675:return uS;case 35676:return hS;case 5124:case 35670:return dS;case 35667:case 35671:return fS;case 35668:case 35672:return pS;case 35669:case 35673:return mS;case 5125:return gS;case 36294:return _S;case 36295:return xS;case 36296:return vS;case 35678:case 36198:case 36298:case 36306:case 35682:return MS;case 35679:case 36299:case 36307:return SS;case 35680:case 36300:case 36308:case 36293:return yS;case 36289:case 36303:case 36311:case 36292:return ES}}function bS(n,t){n.uniform1fv(this.addr,t)}function AS(n,t){const e=os(t,this.size,2);n.uniform2fv(this.addr,e)}function RS(n,t){const e=os(t,this.size,3);n.uniform3fv(this.addr,e)}function wS(n,t){const e=os(t,this.size,4);n.uniform4fv(this.addr,e)}function CS(n,t){const e=os(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function PS(n,t){const e=os(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function IS(n,t){const e=os(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function LS(n,t){n.uniform1iv(this.addr,t)}function DS(n,t){n.uniform2iv(this.addr,t)}function NS(n,t){n.uniform3iv(this.addr,t)}function US(n,t){n.uniform4iv(this.addr,t)}function FS(n,t){n.uniform1uiv(this.addr,t)}function OS(n,t){n.uniform2uiv(this.addr,t)}function kS(n,t){n.uniform3uiv(this.addr,t)}function BS(n,t){n.uniform4uiv(this.addr,t)}function HS(n,t,e){const i=this.cache,s=t.length,r=aa(e,s);Ae(i,r)||(n.uniform1iv(this.addr,r),Re(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=dc:a=jd;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function GS(n,t,e){const i=this.cache,s=t.length,r=aa(e,s);Ae(i,r)||(n.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||tf,r[a])}function zS(n,t,e){const i=this.cache,s=t.length,r=aa(e,s);Ae(i,r)||(n.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ef,r[a])}function VS(n,t,e){const i=this.cache,s=t.length,r=aa(e,s);Ae(i,r)||(n.uniform1iv(this.addr,r),Re(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Qd,r[a])}function WS(n){switch(n){case 5126:return bS;case 35664:return AS;case 35665:return RS;case 35666:return wS;case 35674:return CS;case 35675:return PS;case 35676:return IS;case 5124:case 35670:return LS;case 35667:case 35671:return DS;case 35668:case 35672:return NS;case 35669:case 35673:return US;case 5125:return FS;case 36294:return OS;case 36295:return kS;case 36296:return BS;case 35678:case 36198:case 36298:case 36306:case 35682:return HS;case 35679:case 36299:case 36307:return GS;case 35680:case 36300:case 36308:case 36293:return zS;case 36289:case 36303:case 36311:case 36292:return VS}}class XS{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=TS(e.type)}}class YS{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=WS(e.type)}}class qS{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const $a=/(\w+)(\])?(\[|\.)?/g;function Lu(n,t){n.seq.push(t),n.map[t.id]=t}function KS(n,t,e){const i=n.name,s=i.length;for($a.lastIndex=0;;){const r=$a.exec(i),a=$a.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Lu(e,l===void 0?new XS(o,n,t):new YS(o,n,t));break}else{let d=e.map[o];d===void 0&&(d=new qS(o),Lu(e,d)),e=d}}}class Dr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);KS(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function Du(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const ZS=37297;let $S=0;function JS(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Nu=new zt;function jS(n){Qt._getMatrix(Nu,Qt.workingColorSpace,n);const t=`mat3( ${Nu.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(n)){case Xr:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return Nt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Uu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+JS(n.getShaderSource(t),o)}else return r}function QS(n,t){const e=jS(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const ty={[pd]:"Linear",[md]:"Reinhard",[gd]:"Cineon",[_d]:"ACESFilmic",[vd]:"AgX",[Md]:"Neutral",[xd]:"Custom"};function ey(n,t){const e=ty[t];return e===void 0?(Nt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Mr=new L;function ny(){Qt.getLuminanceCoefficients(Mr);const n=Mr.x.toFixed(4),t=Mr.y.toFixed(4),e=Mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Es).join(`
`)}function sy(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function ry(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Es(n){return n!==""}function Fu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ou(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ay=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(n){return n.replace(ay,cy)}const oy=new Map;function cy(n,t){let e=qt[t];if(e===void 0){const i=oy.get(t);if(i!==void 0)e=qt[i],Nt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return fc(e)}const ly=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ku(n){return n.replace(ly,uy)}function uy(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bu(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const hy={[wr]:"SHADOWMAP_TYPE_PCF",[Ss]:"SHADOWMAP_TYPE_VSM"};function dy(n){return hy[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const fy={[_i]:"ENVMAP_TYPE_CUBE",[$i]:"ENVMAP_TYPE_CUBE",[ia]:"ENVMAP_TYPE_CUBE_UV"};function py(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":fy[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const my={[$i]:"ENVMAP_MODE_REFRACTION"};function gy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":my[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const _y={[fd]:"ENVMAP_BLENDING_MULTIPLY",[E0]:"ENVMAP_BLENDING_MIX",[T0]:"ENVMAP_BLENDING_ADD"};function xy(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":_y[n.combine]||"ENVMAP_BLENDING_NONE"}function vy(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function My(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=dy(e),l=py(e),u=gy(e),d=xy(e),h=vy(e),f=iy(e),g=sy(r),S=s.createProgram();let p,m,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),m.length>0&&(m+=`
`)):(p=[Bu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),m=[Bu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?qt.tonemapping_pars_fragment:"",e.toneMapping!==En?ey("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,QS("linearToOutputTexel",e.outputColorSpace),ny(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Es).join(`
`)),a=fc(a),a=Fu(a,e),a=Ou(a,e),o=fc(o),o=Fu(o,e),o=Ou(o,e),a=ku(a),o=ku(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===Ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const E=v+p+a,y=v+m+o,P=Du(s,s.VERTEX_SHADER,E),b=Du(s,s.FRAGMENT_SHADER,y);s.attachShader(S,P),s.attachShader(S,b),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function C(R){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(S)||"",X=s.getShaderInfoLog(P)||"",W=s.getShaderInfoLog(b)||"",N=F.trim(),B=X.trim(),k=W.trim();let j=!0,nt=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,S,P,b);else{const ft=Uu(s,P,"vertex"),St=Uu(s,b,"fragment");jt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+ft+`
`+St)}else N!==""?Nt("WebGLProgram: Program Info Log:",N):(B===""||k==="")&&(nt=!1);nt&&(R.diagnostics={runnable:j,programLog:N,vertexShader:{log:B,prefix:p},fragmentShader:{log:k,prefix:m}})}s.deleteShader(P),s.deleteShader(b),x=new Dr(s,S),A=ry(s,S)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(S,ZS)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$S++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=P,this.fragmentShader=b,this}let Sy=0;class yy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Ey(t),e.set(t,i)),i}}class Ey{constructor(t){this.id=Sy++,this.code=t,this.usedTimes=0}}function Ty(n){return n===xi||n===zr||n===Vr}function by(n,t,e,i,s,r){const a=new Hc,o=new yy,c=new Set,l=[],u=new Map,d=i.logarithmicDepthBuffer;let h=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function S(x,A,I,R,F,X){const W=R.fog,N=F.geometry,B=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,k=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,j=t.get(x.envMap||B,k),nt=j&&j.mapping===ia?j.image.height:null,ft=f[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Nt("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));const St=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,At=St!==void 0?St.length:0;let Xt=0;N.morphAttributes.position!==void 0&&(Xt=1),N.morphAttributes.normal!==void 0&&(Xt=2),N.morphAttributes.color!==void 0&&(Xt=3);let ee,Bt,$,gt;if(ft){const Vt=Mn[ft];ee=Vt.vertexShader,Bt=Vt.fragmentShader}else ee=x.vertexShader,Bt=x.fragmentShader,o.update(x),$=o.getVertexShaderID(x),gt=o.getFragmentShaderID(x);const at=n.getRenderTarget(),Ct=n.state.buffers.depth.getReversed(),Ut=F.isInstancedMesh===!0,Dt=F.isBatchedMesh===!0,ne=!!x.map,Ft=!!x.matcap,J=!!j,it=!!x.aoMap,Q=!!x.lightMap,xt=!!x.bumpMap,dt=!!x.normalMap,Ot=!!x.displacementMap,w=!!x.emissiveMap,Ht=!!x.metalnessMap,Rt=!!x.roughnessMap,kt=x.anisotropy>0,st=x.clearcoat>0,re=x.dispersion>0,T=x.iridescence>0,_=x.sheen>0,O=x.transmission>0,K=kt&&!!x.anisotropyMap,tt=st&&!!x.clearcoatMap,rt=st&&!!x.clearcoatNormalMap,lt=st&&!!x.clearcoatRoughnessMap,Y=T&&!!x.iridescenceMap,Z=T&&!!x.iridescenceThicknessMap,Mt=_&&!!x.sheenColorMap,Tt=_&&!!x.sheenRoughnessMap,ut=!!x.specularMap,ot=!!x.specularColorMap,Gt=!!x.specularIntensityMap,Yt=O&&!!x.transmissionMap,se=O&&!!x.thicknessMap,D=!!x.gradientMap,ct=!!x.alphaMap,q=x.alphaTest>0,yt=!!x.alphaHash,ht=!!x.extensions;let et=En;x.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(et=n.toneMapping);const Pt={shaderID:ft,shaderType:x.type,shaderName:x.name,vertexShader:ee,fragmentShader:Bt,defines:x.defines,customVertexShaderID:$,customFragmentShaderID:gt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Dt,batchingColor:Dt&&F._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&F.instanceColor!==null,instancingMorph:Ut&&F.morphTexture!==null,outputColorSpace:at===null?n.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ne,matcap:Ft,envMap:J,envMapMode:J&&j.mapping,envMapCubeUVHeight:nt,aoMap:it,lightMap:Q,bumpMap:xt,normalMap:dt,displacementMap:Ot,emissiveMap:w,normalMapObjectSpace:dt&&x.normalMapType===R0,normalMapTangentSpace:dt&&x.normalMapType===rc,packedNormalMap:dt&&x.normalMapType===rc&&Ty(x.normalMap.format),metalnessMap:Ht,roughnessMap:Rt,anisotropy:kt,anisotropyMap:K,clearcoat:st,clearcoatMap:tt,clearcoatNormalMap:rt,clearcoatRoughnessMap:lt,dispersion:re,iridescence:T,iridescenceMap:Y,iridescenceThicknessMap:Z,sheen:_,sheenColorMap:Mt,sheenRoughnessMap:Tt,specularMap:ut,specularColorMap:ot,specularIntensityMap:Gt,transmission:O,transmissionMap:Yt,thicknessMap:se,gradientMap:D,opaque:x.transparent===!1&&x.blending===qi&&x.alphaToCoverage===!1,alphaMap:ct,alphaTest:q,alphaHash:yt,combine:x.combine,mapUv:ne&&g(x.map.channel),aoMapUv:it&&g(x.aoMap.channel),lightMapUv:Q&&g(x.lightMap.channel),bumpMapUv:xt&&g(x.bumpMap.channel),normalMapUv:dt&&g(x.normalMap.channel),displacementMapUv:Ot&&g(x.displacementMap.channel),emissiveMapUv:w&&g(x.emissiveMap.channel),metalnessMapUv:Ht&&g(x.metalnessMap.channel),roughnessMapUv:Rt&&g(x.roughnessMap.channel),anisotropyMapUv:K&&g(x.anisotropyMap.channel),clearcoatMapUv:tt&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:rt&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&g(x.sheenRoughnessMap.channel),specularMapUv:ut&&g(x.specularMap.channel),specularColorMapUv:ot&&g(x.specularColorMap.channel),specularIntensityMapUv:Gt&&g(x.specularIntensityMap.channel),transmissionMapUv:Yt&&g(x.transmissionMap.channel),thicknessMapUv:se&&g(x.thicknessMap.channel),alphaMapUv:ct&&g(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(dt||kt),vertexNormals:!!N.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!N.attributes.uv&&(ne||ct),fog:!!W,useFog:x.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||N.attributes.normal===void 0&&dt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ct,skinning:F.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:Xt,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:et,decodeVideoTexture:ne&&x.map.isVideoTexture===!0&&Qt.getTransfer(x.map.colorSpace)===oe,decodeVideoTextureEmissive:w&&x.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(x.emissiveMap.colorSpace)===oe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Nn,flipSided:x.side===He,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ht&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ht&&x.extensions.multiDraw===!0||Dt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Pt.vertexUv1s=c.has(1),Pt.vertexUv2s=c.has(2),Pt.vertexUv3s=c.has(3),c.clear(),Pt}function p(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)A.push(I),A.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(m(A,x),v(A,x),A.push(n.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function m(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function v(x,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),x.push(a.mask)}function E(x){const A=f[x.type];let I;if(A){const R=Mn[A];I=W_.clone(R.uniforms)}else I=x.uniforms;return I}function y(x,A){let I=u.get(A);return I!==void 0?++I.usedTimes:(I=new My(n,A,x,s),l.push(I),u.set(A,I)),I}function P(x){if(--x.usedTimes===0){const A=l.indexOf(x);l[A]=l[l.length-1],l.pop(),u.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function C(){o.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:E,acquireProgram:y,releaseProgram:P,releaseShaderCache:b,programs:l,dispose:C}}function Ay(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Ry(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function Hu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Gu(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,g,S,p,m){let v=n[t];return v===void 0?(v={id:h.id,object:h,geometry:f,material:g,materialVariant:a(h),groupOrder:S,renderOrder:h.renderOrder,z:p,group:m},n[t]=v):(v.id=h.id,v.object=h,v.geometry=f,v.material=g,v.materialVariant=a(h),v.groupOrder=S,v.renderOrder=h.renderOrder,v.z=p,v.group=m),t++,v}function c(h,f,g,S,p,m){const v=o(h,f,g,S,p,m);g.transmission>0?i.push(v):g.transparent===!0?s.push(v):e.push(v)}function l(h,f,g,S,p,m){const v=o(h,f,g,S,p,m);g.transmission>0?i.unshift(v):g.transparent===!0?s.unshift(v):e.unshift(v)}function u(h,f){e.length>1&&e.sort(h||Ry),i.length>1&&i.sort(f||Hu),s.length>1&&s.sort(f||Hu)}function d(){for(let h=t,f=n.length;h<f;h++){const g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function wy(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new Gu,n.set(i,[a])):s>=r.length?(a=new Gu,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Cy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new te};break;case"SpotLight":e={position:new L,direction:new L,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new L,halfWidth:new L,halfHeight:new L};break}return n[t.id]=e,e}}}function Py(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Iy=0;function Ly(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Dy(n){const t=new Cy,e=Py(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);const s=new L,r=new ae,a=new ae;function o(l){let u=0,d=0,h=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let f=0,g=0,S=0,p=0,m=0,v=0,E=0,y=0,P=0,b=0,C=0;l.sort(Ly);for(let A=0,I=l.length;A<I;A++){const R=l[A],F=R.color,X=R.intensity,W=R.distance;let N=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===xi?N=R.shadow.map.texture:N=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=F.r*X,d+=F.g*X,h+=F.b*X;else if(R.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(R.sh.coefficients[B],X);C++}else if(R.isDirectionalLight){const B=t.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const k=R.shadow,j=e.get(R);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,i.directionalShadow[f]=j,i.directionalShadowMap[f]=N,i.directionalShadowMatrix[f]=R.shadow.matrix,v++}i.directional[f]=B,f++}else if(R.isSpotLight){const B=t.get(R);B.position.setFromMatrixPosition(R.matrixWorld),B.color.copy(F).multiplyScalar(X),B.distance=W,B.coneCos=Math.cos(R.angle),B.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),B.decay=R.decay,i.spot[S]=B;const k=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,k.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[S]=k.matrix,R.castShadow){const j=e.get(R);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,i.spotShadow[S]=j,i.spotShadowMap[S]=N,y++}S++}else if(R.isRectAreaLight){const B=t.get(R);B.color.copy(F).multiplyScalar(X),B.halfWidth.set(R.width*.5,0,0),B.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=B,p++}else if(R.isPointLight){const B=t.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),B.distance=R.distance,B.decay=R.decay,R.castShadow){const k=R.shadow,j=e.get(R);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,j.shadowCameraNear=k.camera.near,j.shadowCameraFar=k.camera.far,i.pointShadow[g]=j,i.pointShadowMap[g]=N,i.pointShadowMatrix[g]=R.shadow.matrix,E++}i.point[g]=B,g++}else if(R.isHemisphereLight){const B=t.get(R);B.skyColor.copy(R.color).multiplyScalar(X),B.groundColor.copy(R.groundColor).multiplyScalar(X),i.hemi[m]=B,m++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_FLOAT_1,i.rectAreaLTC2=mt.LTC_FLOAT_2):(i.rectAreaLTC1=mt.LTC_HALF_1,i.rectAreaLTC2=mt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const x=i.hash;(x.directionalLength!==f||x.pointLength!==g||x.spotLength!==S||x.rectAreaLength!==p||x.hemiLength!==m||x.numDirectionalShadows!==v||x.numPointShadows!==E||x.numSpotShadows!==y||x.numSpotMaps!==P||x.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=S,i.rectArea.length=p,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=y+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=C,x.directionalLength=f,x.pointLength=g,x.spotLength=S,x.rectAreaLength=p,x.hemiLength=m,x.numDirectionalShadows=v,x.numPointShadows=E,x.numSpotShadows=y,x.numSpotMaps=P,x.numLightProbes=C,i.version=Iy++)}function c(l,u){let d=0,h=0,f=0,g=0,S=0;const p=u.matrixWorldInverse;for(let m=0,v=l.length;m<v;m++){const E=l[m];if(E.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),d++}else if(E.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),f++}else if(E.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),a.identity(),r.copy(E.matrixWorld),r.premultiply(p),a.extractRotation(r),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(p),h++}else if(E.isHemisphereLight){const y=i.hemi[S];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(p),S++}}}return{setup:o,setupView:c,state:i}}function zu(n){const t=new Dy(n),e=[],i=[],s=[];function r(h){d.camera=h,e.length=0,i.length=0,s.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function c(h){s.push(h)}function l(){t.setup(e)}function u(h){t.setupView(e,h)}const d={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Ny(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new zu(n),t.set(s,[o])):r>=a.length?(o=new zu(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const Uy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Oy=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],ky=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Vu=new ae,_s=new L,Ja=new L;function By(n,t,e){let i=new Vc;const s=new pt,r=new pt,a=new ve,o=new K_,c=new Z_,l={},u=e.maxTextureSize,d={[Qn]:He,[He]:Qn,[Nn]:Nn},h=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:Uy,fragmentShader:Fy}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new Oe;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new $t(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wr;let m=this.type;this.render=function(b,C,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===s0&&(Nt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=wr);const A=n.getRenderTarget(),I=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),F=n.state;F.setBlending(On),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const X=m!==this.type;X&&C.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(N=>N.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,N=b.length;W<N;W++){const B=b[W],k=B.shadow;if(k===void 0){Nt("WebGLShadowMap:",B,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const j=k.getFrameExtents();s.multiply(j),r.copy(k.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/j.x),s.x=r.x*j.x,k.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/j.y),s.y=r.y*j.y,k.mapSize.y=r.y));const nt=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=nt,k.map===null||X===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Ss){if(B.isPointLight){Nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Tn(s.x,s.y,{format:xi,type:Bn,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),k.map.texture.name=B.name+".shadowMap",k.map.depthTexture=new Ji(s.x,s.y,hn),k.map.depthTexture.name=B.name+".shadowMapDepth",k.map.depthTexture.format=Hn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ce,k.map.depthTexture.magFilter=Ce}else B.isPointLight?(k.map=new Jd(s.x),k.map.depthTexture=new l_(s.x,bn)):(k.map=new Tn(s.x,s.y),k.map.depthTexture=new Ji(s.x,s.y,bn)),k.map.depthTexture.name=B.name+".shadowMap",k.map.depthTexture.format=Hn,this.type===wr?(k.map.depthTexture.compareFunction=nt?kc:Oc,k.map.depthTexture.minFilter=Ne,k.map.depthTexture.magFilter=Ne):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ce,k.map.depthTexture.magFilter=Ce);k.camera.updateProjectionMatrix()}const ft=k.map.isWebGLCubeRenderTarget?6:1;for(let St=0;St<ft;St++){if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,St),n.clear();else{St===0&&(n.setRenderTarget(k.map),n.clear());const At=k.getViewport(St);a.set(r.x*At.x,r.y*At.y,r.x*At.z,r.y*At.w),F.viewport(a)}if(B.isPointLight){const At=k.camera,Xt=k.matrix,ee=B.distance||At.far;ee!==At.far&&(At.far=ee,At.updateProjectionMatrix()),_s.setFromMatrixPosition(B.matrixWorld),At.position.copy(_s),Ja.copy(At.position),Ja.add(Oy[St]),At.up.copy(ky[St]),At.lookAt(Ja),At.updateMatrixWorld(),Xt.makeTranslation(-_s.x,-_s.y,-_s.z),Vu.multiplyMatrices(At.projectionMatrix,At.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Vu,At.coordinateSystem,At.reversedDepth)}else k.updateMatrices(B);i=k.getFrustum(),y(C,x,k.camera,B,this.type)}k.isPointLightShadow!==!0&&this.type===Ss&&v(k,x),k.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(A,I,R)};function v(b,C){const x=t.update(S);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Tn(s.x,s.y,{format:xi,type:Bn})),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value=b.mapSize,h.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(C,null,x,h,S,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(C,null,x,f,S,null)}function E(b,C,x,A){let I=null;const R=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)I=R;else if(I=x.isPointLight===!0?c:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=I.uuid,X=C.uuid;let W=l[F];W===void 0&&(W={},l[F]=W);let N=W[X];N===void 0&&(N=I.clone(),W[X]=N,C.addEventListener("dispose",P)),I=N}if(I.visible=C.visible,I.wireframe=C.wireframe,A===Ss?I.side=C.shadowSide!==null?C.shadowSide:C.side:I.side=C.shadowSide!==null?C.shadowSide:d[C.side],I.alphaMap=C.alphaMap,I.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,I.map=C.map,I.clipShadows=C.clipShadows,I.clippingPlanes=C.clippingPlanes,I.clipIntersection=C.clipIntersection,I.displacementMap=C.displacementMap,I.displacementScale=C.displacementScale,I.displacementBias=C.displacementBias,I.wireframeLinewidth=C.wireframeLinewidth,I.linewidth=C.linewidth,x.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const F=n.properties.get(I);F.light=x}return I}function y(b,C,x,A,I){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===Ss)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);const X=t.update(b),W=b.material;if(Array.isArray(W)){const N=X.groups;for(let B=0,k=N.length;B<k;B++){const j=N[B],nt=W[j.materialIndex];if(nt&&nt.visible){const ft=E(b,nt,A,I);b.onBeforeShadow(n,b,C,x,X,ft,j),n.renderBufferDirect(x,null,X,ft,b,j),b.onAfterShadow(n,b,C,x,X,ft,j)}}}else if(W.visible){const N=E(b,W,A,I);b.onBeforeShadow(n,b,C,x,X,N,null),n.renderBufferDirect(x,null,X,N,b,null),b.onAfterShadow(n,b,C,x,X,N,null)}}const F=b.children;for(let X=0,W=F.length;X<W;X++)y(F[X],C,x,A,I)}function P(b){b.target.removeEventListener("dispose",P);for(const x in l){const A=l[x],I=b.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function Hy(n,t){function e(){let D=!1;const ct=new ve;let q=null;const yt=new ve(0,0,0,0);return{setMask:function(ht){q!==ht&&!D&&(n.colorMask(ht,ht,ht,ht),q=ht)},setLocked:function(ht){D=ht},setClear:function(ht,et,Pt,Vt,Se){Se===!0&&(ht*=Vt,et*=Vt,Pt*=Vt),ct.set(ht,et,Pt,Vt),yt.equals(ct)===!1&&(n.clearColor(ht,et,Pt,Vt),yt.copy(ct))},reset:function(){D=!1,q=null,yt.set(-1,0,0,0)}}}function i(){let D=!1,ct=!1,q=null,yt=null,ht=null;return{setReversed:function(et){if(ct!==et){const Pt=t.get("EXT_clip_control");et?Pt.clipControlEXT(Pt.LOWER_LEFT_EXT,Pt.ZERO_TO_ONE_EXT):Pt.clipControlEXT(Pt.LOWER_LEFT_EXT,Pt.NEGATIVE_ONE_TO_ONE_EXT),ct=et;const Vt=ht;ht=null,this.setClear(Vt)}},getReversed:function(){return ct},setTest:function(et){et?at(n.DEPTH_TEST):Ct(n.DEPTH_TEST)},setMask:function(et){q!==et&&!D&&(n.depthMask(et),q=et)},setFunc:function(et){if(ct&&(et=O0[et]),yt!==et){switch(et){case Mo:n.depthFunc(n.NEVER);break;case So:n.depthFunc(n.ALWAYS);break;case yo:n.depthFunc(n.LESS);break;case Zi:n.depthFunc(n.LEQUAL);break;case Eo:n.depthFunc(n.EQUAL);break;case To:n.depthFunc(n.GEQUAL);break;case bo:n.depthFunc(n.GREATER);break;case Ao:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}yt=et}},setLocked:function(et){D=et},setClear:function(et){ht!==et&&(ht=et,ct&&(et=1-et),n.clearDepth(et))},reset:function(){D=!1,q=null,yt=null,ht=null,ct=!1}}}function s(){let D=!1,ct=null,q=null,yt=null,ht=null,et=null,Pt=null,Vt=null,Se=null;return{setTest:function(ce){D||(ce?at(n.STENCIL_TEST):Ct(n.STENCIL_TEST))},setMask:function(ce){ct!==ce&&!D&&(n.stencilMask(ce),ct=ce)},setFunc:function(ce,wn,mn){(q!==ce||yt!==wn||ht!==mn)&&(n.stencilFunc(ce,wn,mn),q=ce,yt=wn,ht=mn)},setOp:function(ce,wn,mn){(et!==ce||Pt!==wn||Vt!==mn)&&(n.stencilOp(ce,wn,mn),et=ce,Pt=wn,Vt=mn)},setLocked:function(ce){D=ce},setClear:function(ce){Se!==ce&&(n.clearStencil(ce),Se=ce)},reset:function(){D=!1,ct=null,q=null,yt=null,ht=null,et=null,Pt=null,Vt=null,Se=null}}}const r=new e,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let u={},d={},h={},f=new WeakMap,g=[],S=null,p=!1,m=null,v=null,E=null,y=null,P=null,b=null,C=null,x=new te(0,0,0),A=0,I=!1,R=null,F=null,X=null,W=null,N=null;const B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,j=0;const nt=n.getParameter(n.VERSION);nt.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(nt)[1]),k=j>=1):nt.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),k=j>=2);let ft=null,St={};const At=n.getParameter(n.SCISSOR_BOX),Xt=n.getParameter(n.VIEWPORT),ee=new ve().fromArray(At),Bt=new ve().fromArray(Xt);function $(D,ct,q,yt){const ht=new Uint8Array(4),et=n.createTexture();n.bindTexture(D,et),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pt=0;Pt<q;Pt++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(ct,0,n.RGBA,1,1,yt,0,n.RGBA,n.UNSIGNED_BYTE,ht):n.texImage2D(ct+Pt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ht);return et}const gt={};gt[n.TEXTURE_2D]=$(n.TEXTURE_2D,n.TEXTURE_2D,1),gt[n.TEXTURE_CUBE_MAP]=$(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[n.TEXTURE_2D_ARRAY]=$(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),gt[n.TEXTURE_3D]=$(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(n.DEPTH_TEST),a.setFunc(Zi),xt(!1),dt(Il),at(n.CULL_FACE),it(On);function at(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function Ct(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function Ut(D,ct){return h[D]!==ct?(n.bindFramebuffer(D,ct),h[D]=ct,D===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ct),D===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ct),!0):!1}function Dt(D,ct){let q=g,yt=!1;if(D){q=f.get(ct),q===void 0&&(q=[],f.set(ct,q));const ht=D.textures;if(q.length!==ht.length||q[0]!==n.COLOR_ATTACHMENT0){for(let et=0,Pt=ht.length;et<Pt;et++)q[et]=n.COLOR_ATTACHMENT0+et;q.length=ht.length,yt=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,yt=!0);yt&&n.drawBuffers(q)}function ne(D){return S!==D?(n.useProgram(D),S=D,!0):!1}const Ft={[li]:n.FUNC_ADD,[a0]:n.FUNC_SUBTRACT,[o0]:n.FUNC_REVERSE_SUBTRACT};Ft[c0]=n.MIN,Ft[l0]=n.MAX;const J={[u0]:n.ZERO,[h0]:n.ONE,[d0]:n.SRC_COLOR,[xo]:n.SRC_ALPHA,[x0]:n.SRC_ALPHA_SATURATE,[g0]:n.DST_COLOR,[p0]:n.DST_ALPHA,[f0]:n.ONE_MINUS_SRC_COLOR,[vo]:n.ONE_MINUS_SRC_ALPHA,[_0]:n.ONE_MINUS_DST_COLOR,[m0]:n.ONE_MINUS_DST_ALPHA,[v0]:n.CONSTANT_COLOR,[M0]:n.ONE_MINUS_CONSTANT_COLOR,[S0]:n.CONSTANT_ALPHA,[y0]:n.ONE_MINUS_CONSTANT_ALPHA};function it(D,ct,q,yt,ht,et,Pt,Vt,Se,ce){if(D===On){p===!0&&(Ct(n.BLEND),p=!1);return}if(p===!1&&(at(n.BLEND),p=!0),D!==r0){if(D!==m||ce!==I){if((v!==li||P!==li)&&(n.blendEquation(n.FUNC_ADD),v=li,P=li),ce)switch(D){case qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ll:n.blendFunc(n.ONE,n.ONE);break;case Dl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Nl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:jt("WebGLState: Invalid blending: ",D);break}else switch(D){case qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ll:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Dl:jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nl:jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:jt("WebGLState: Invalid blending: ",D);break}E=null,y=null,b=null,C=null,x.set(0,0,0),A=0,m=D,I=ce}return}ht=ht||ct,et=et||q,Pt=Pt||yt,(ct!==v||ht!==P)&&(n.blendEquationSeparate(Ft[ct],Ft[ht]),v=ct,P=ht),(q!==E||yt!==y||et!==b||Pt!==C)&&(n.blendFuncSeparate(J[q],J[yt],J[et],J[Pt]),E=q,y=yt,b=et,C=Pt),(Vt.equals(x)===!1||Se!==A)&&(n.blendColor(Vt.r,Vt.g,Vt.b,Se),x.copy(Vt),A=Se),m=D,I=!1}function Q(D,ct){D.side===Nn?Ct(n.CULL_FACE):at(n.CULL_FACE);let q=D.side===He;ct&&(q=!q),xt(q),D.blending===qi&&D.transparent===!1?it(On):it(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const yt=D.stencilWrite;o.setTest(yt),yt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),w(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?at(n.SAMPLE_ALPHA_TO_COVERAGE):Ct(n.SAMPLE_ALPHA_TO_COVERAGE)}function xt(D){R!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),R=D)}function dt(D){D!==n0?(at(n.CULL_FACE),D!==F&&(D===Il?n.cullFace(n.BACK):D===i0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ct(n.CULL_FACE),F=D}function Ot(D){D!==X&&(k&&n.lineWidth(D),X=D)}function w(D,ct,q){D?(at(n.POLYGON_OFFSET_FILL),(W!==ct||N!==q)&&(W=ct,N=q,a.getReversed()&&(ct=-ct),n.polygonOffset(ct,q))):Ct(n.POLYGON_OFFSET_FILL)}function Ht(D){D?at(n.SCISSOR_TEST):Ct(n.SCISSOR_TEST)}function Rt(D){D===void 0&&(D=n.TEXTURE0+B-1),ft!==D&&(n.activeTexture(D),ft=D)}function kt(D,ct,q){q===void 0&&(ft===null?q=n.TEXTURE0+B-1:q=ft);let yt=St[q];yt===void 0&&(yt={type:void 0,texture:void 0},St[q]=yt),(yt.type!==D||yt.texture!==ct)&&(ft!==q&&(n.activeTexture(q),ft=q),n.bindTexture(D,ct||gt[D]),yt.type=D,yt.texture=ct)}function st(){const D=St[ft];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function re(){try{n.compressedTexImage2D(...arguments)}catch(D){jt("WebGLState:",D)}}function T(){try{n.compressedTexImage3D(...arguments)}catch(D){jt("WebGLState:",D)}}function _(){try{n.texSubImage2D(...arguments)}catch(D){jt("WebGLState:",D)}}function O(){try{n.texSubImage3D(...arguments)}catch(D){jt("WebGLState:",D)}}function K(){try{n.compressedTexSubImage2D(...arguments)}catch(D){jt("WebGLState:",D)}}function tt(){try{n.compressedTexSubImage3D(...arguments)}catch(D){jt("WebGLState:",D)}}function rt(){try{n.texStorage2D(...arguments)}catch(D){jt("WebGLState:",D)}}function lt(){try{n.texStorage3D(...arguments)}catch(D){jt("WebGLState:",D)}}function Y(){try{n.texImage2D(...arguments)}catch(D){jt("WebGLState:",D)}}function Z(){try{n.texImage3D(...arguments)}catch(D){jt("WebGLState:",D)}}function Mt(D){return d[D]!==void 0?d[D]:n.getParameter(D)}function Tt(D,ct){d[D]!==ct&&(n.pixelStorei(D,ct),d[D]=ct)}function ut(D){ee.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),ee.copy(D))}function ot(D){Bt.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),Bt.copy(D))}function Gt(D,ct){let q=l.get(ct);q===void 0&&(q=new WeakMap,l.set(ct,q));let yt=q.get(D);yt===void 0&&(yt=n.getUniformBlockIndex(ct,D.name),q.set(D,yt))}function Yt(D,ct){const yt=l.get(ct).get(D);c.get(ct)!==yt&&(n.uniformBlockBinding(ct,yt,D.__bindingPointIndex),c.set(ct,yt))}function se(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},ft=null,St={},h={},f=new WeakMap,g=[],S=null,p=!1,m=null,v=null,E=null,y=null,P=null,b=null,C=null,x=new te(0,0,0),A=0,I=!1,R=null,F=null,X=null,W=null,N=null,ee.set(0,0,n.canvas.width,n.canvas.height),Bt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:at,disable:Ct,bindFramebuffer:Ut,drawBuffers:Dt,useProgram:ne,setBlending:it,setMaterial:Q,setFlipSided:xt,setCullFace:dt,setLineWidth:Ot,setPolygonOffset:w,setScissorTest:Ht,activeTexture:Rt,bindTexture:kt,unbindTexture:st,compressedTexImage2D:re,compressedTexImage3D:T,texImage2D:Y,texImage3D:Z,pixelStorei:Tt,getParameter:Mt,updateUBOMapping:Gt,uniformBlockBinding:Yt,texStorage2D:rt,texStorage3D:lt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:K,compressedTexSubImage3D:tt,scissor:ut,viewport:ot,reset:se}}function Gy(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new pt,u=new WeakMap,d=new Set;let h;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(T,_){return g?new OffscreenCanvas(T,_):Yr("canvas")}function p(T,_,O){let K=1;const tt=re(T);if((tt.width>O||tt.height>O)&&(K=O/Math.max(tt.width,tt.height)),K<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const rt=Math.floor(K*tt.width),lt=Math.floor(K*tt.height);h===void 0&&(h=S(rt,lt));const Y=_?S(rt,lt):h;return Y.width=rt,Y.height=lt,Y.getContext("2d").drawImage(T,0,0,rt,lt),Nt("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+rt+"x"+lt+")."),Y}else return"data"in T&&Nt("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),T;return T}function m(T){return T.generateMipmaps}function v(T){n.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(T,_,O,K,tt,rt=!1){if(T!==null){if(n[T]!==void 0)return n[T];Nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let lt;K&&(lt=t.get("EXT_texture_norm16"),lt||Nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=_;if(_===n.RED&&(O===n.FLOAT&&(Y=n.R32F),O===n.HALF_FLOAT&&(Y=n.R16F),O===n.UNSIGNED_BYTE&&(Y=n.R8),O===n.UNSIGNED_SHORT&&lt&&(Y=lt.R16_EXT),O===n.SHORT&&lt&&(Y=lt.R16_SNORM_EXT)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.R8UI),O===n.UNSIGNED_SHORT&&(Y=n.R16UI),O===n.UNSIGNED_INT&&(Y=n.R32UI),O===n.BYTE&&(Y=n.R8I),O===n.SHORT&&(Y=n.R16I),O===n.INT&&(Y=n.R32I)),_===n.RG&&(O===n.FLOAT&&(Y=n.RG32F),O===n.HALF_FLOAT&&(Y=n.RG16F),O===n.UNSIGNED_BYTE&&(Y=n.RG8),O===n.UNSIGNED_SHORT&&lt&&(Y=lt.RG16_EXT),O===n.SHORT&&lt&&(Y=lt.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RG8UI),O===n.UNSIGNED_SHORT&&(Y=n.RG16UI),O===n.UNSIGNED_INT&&(Y=n.RG32UI),O===n.BYTE&&(Y=n.RG8I),O===n.SHORT&&(Y=n.RG16I),O===n.INT&&(Y=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),O===n.UNSIGNED_INT&&(Y=n.RGB32UI),O===n.BYTE&&(Y=n.RGB8I),O===n.SHORT&&(Y=n.RGB16I),O===n.INT&&(Y=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),O===n.UNSIGNED_INT&&(Y=n.RGBA32UI),O===n.BYTE&&(Y=n.RGBA8I),O===n.SHORT&&(Y=n.RGBA16I),O===n.INT&&(Y=n.RGBA32I)),_===n.RGB&&(O===n.UNSIGNED_SHORT&&lt&&(Y=lt.RGB16_EXT),O===n.SHORT&&lt&&(Y=lt.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(Y=n.R11F_G11F_B10F)),_===n.RGBA){const Z=rt?Xr:Qt.getTransfer(tt);O===n.FLOAT&&(Y=n.RGBA32F),O===n.HALF_FLOAT&&(Y=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Y=Z===oe?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&lt&&(Y=lt.RGBA16_EXT),O===n.SHORT&&lt&&(Y=lt.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function P(T,_){let O;return T?_===null||_===bn||_===Us?O=n.DEPTH24_STENCIL8:_===hn?O=n.DEPTH32F_STENCIL8:_===Ns&&(O=n.DEPTH24_STENCIL8,Nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===bn||_===Us?O=n.DEPTH_COMPONENT24:_===hn?O=n.DEPTH_COMPONENT32F:_===Ns&&(O=n.DEPTH_COMPONENT16),O}function b(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ce&&T.minFilter!==Ne?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function C(T){const _=T.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function x(T){const _=T.target;_.removeEventListener("dispose",x),R(_)}function A(T){const _=i.get(T);if(_.__webglInit===void 0)return;const O=T.source,K=f.get(O);if(K){const tt=K[_.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&I(T),Object.keys(K).length===0&&f.delete(O)}i.remove(T)}function I(T){const _=i.get(T);n.deleteTexture(_.__webglTexture);const O=T.source,K=f.get(O);delete K[_.__cacheKey],a.memory.textures--}function R(T){const _=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(_.__webglFramebuffer[K]))for(let tt=0;tt<_.__webglFramebuffer[K].length;tt++)n.deleteFramebuffer(_.__webglFramebuffer[K][tt]);else n.deleteFramebuffer(_.__webglFramebuffer[K]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[K])}else{if(Array.isArray(_.__webglFramebuffer))for(let K=0;K<_.__webglFramebuffer.length;K++)n.deleteFramebuffer(_.__webglFramebuffer[K]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let K=0;K<_.__webglColorRenderbuffer.length;K++)_.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[K]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=T.textures;for(let K=0,tt=O.length;K<tt;K++){const rt=i.get(O[K]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),a.memory.textures--),i.remove(O[K])}i.remove(T)}let F=0;function X(){F=0}function W(){return F}function N(T){F=T}function B(){const T=F;return T>=s.maxTextures&&Nt("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),F+=1,T}function k(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function j(T,_){const O=i.get(T);if(T.isVideoTexture&&kt(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const K=T.image;if(K===null)Nt("WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)Nt("WebGLRenderer: Texture marked for update but image is incomplete");else{Ct(O,T,_);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function nt(T,_){const O=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Ct(O,T,_);return}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function ft(T,_){const O=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Ct(O,T,_);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function St(T,_){const O=i.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&O.__version!==T.version){Ut(O,T,_);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}const At={[Ro]:n.REPEAT,[Fn]:n.CLAMP_TO_EDGE,[wo]:n.MIRRORED_REPEAT},Xt={[Ce]:n.NEAREST,[b0]:n.NEAREST_MIPMAP_NEAREST,[Ks]:n.NEAREST_MIPMAP_LINEAR,[Ne]:n.LINEAR,[ga]:n.LINEAR_MIPMAP_NEAREST,[hi]:n.LINEAR_MIPMAP_LINEAR},ee={[w0]:n.NEVER,[D0]:n.ALWAYS,[C0]:n.LESS,[Oc]:n.LEQUAL,[P0]:n.EQUAL,[kc]:n.GEQUAL,[I0]:n.GREATER,[L0]:n.NOTEQUAL};function Bt(T,_){if(_.type===hn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ne||_.magFilter===ga||_.magFilter===Ks||_.magFilter===hi||_.minFilter===Ne||_.minFilter===ga||_.minFilter===Ks||_.minFilter===hi)&&Nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,At[_.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,At[_.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,At[_.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,Xt[_.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,Xt[_.minFilter]),_.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,ee[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ce||_.minFilter!==Ks&&_.minFilter!==hi||_.type===hn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function $(T,_){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",C));const K=_.source;let tt=f.get(K);tt===void 0&&(tt={},f.set(K,tt));const rt=k(_);if(rt!==T.__cacheKey){tt[rt]===void 0&&(tt[rt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),tt[rt].usedTimes++;const lt=tt[T.__cacheKey];lt!==void 0&&(tt[T.__cacheKey].usedTimes--,lt.usedTimes===0&&I(_)),T.__cacheKey=rt,T.__webglTexture=tt[rt].texture}return O}function gt(T,_,O){return Math.floor(Math.floor(T/O)/_)}function at(T,_,O,K){const rt=T.updateRanges;if(rt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,K,_.data);else{rt.sort((Tt,ut)=>Tt.start-ut.start);let lt=0;for(let Tt=1;Tt<rt.length;Tt++){const ut=rt[lt],ot=rt[Tt],Gt=ut.start+ut.count,Yt=gt(ot.start,_.width,4),se=gt(ut.start,_.width,4);ot.start<=Gt+1&&Yt===se&&gt(ot.start+ot.count-1,_.width,4)===Yt?ut.count=Math.max(ut.count,ot.start+ot.count-ut.start):(++lt,rt[lt]=ot)}rt.length=lt+1;const Y=e.getParameter(n.UNPACK_ROW_LENGTH),Z=e.getParameter(n.UNPACK_SKIP_PIXELS),Mt=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let Tt=0,ut=rt.length;Tt<ut;Tt++){const ot=rt[Tt],Gt=Math.floor(ot.start/4),Yt=Math.ceil(ot.count/4),se=Gt%_.width,D=Math.floor(Gt/_.width),ct=Yt,q=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,se),e.pixelStorei(n.UNPACK_SKIP_ROWS,D),e.texSubImage2D(n.TEXTURE_2D,0,se,D,ct,q,O,K,_.data)}T.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,Y),e.pixelStorei(n.UNPACK_SKIP_PIXELS,Z),e.pixelStorei(n.UNPACK_SKIP_ROWS,Mt)}}function Ct(T,_,O){let K=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(K=n.TEXTURE_3D);const tt=$(T,_),rt=_.source;e.bindTexture(K,T.__webglTexture,n.TEXTURE0+O);const lt=i.get(rt);if(rt.version!==lt.__version||tt===!0){if(e.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const q=Qt.getPrimaries(Qt.workingColorSpace),yt=_.colorSpace===Jn?null:Qt.getPrimaries(_.colorSpace),ht=_.colorSpace===Jn||q===yt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht)}e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let Z=p(_.image,!1,s.maxTextureSize);Z=st(_,Z);const Mt=r.convert(_.format,_.colorSpace),Tt=r.convert(_.type);let ut=y(_.internalFormat,Mt,Tt,_.normalized,_.colorSpace,_.isVideoTexture);Bt(K,_);let ot;const Gt=_.mipmaps,Yt=_.isVideoTexture!==!0,se=lt.__version===void 0||tt===!0,D=rt.dataReady,ct=b(_,Z);if(_.isDepthTexture)ut=P(_.format===di,_.type),se&&(Yt?e.texStorage2D(n.TEXTURE_2D,1,ut,Z.width,Z.height):e.texImage2D(n.TEXTURE_2D,0,ut,Z.width,Z.height,0,Mt,Tt,null));else if(_.isDataTexture)if(Gt.length>0){Yt&&se&&e.texStorage2D(n.TEXTURE_2D,ct,ut,Gt[0].width,Gt[0].height);for(let q=0,yt=Gt.length;q<yt;q++)ot=Gt[q],Yt?D&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,ot.width,ot.height,Mt,Tt,ot.data):e.texImage2D(n.TEXTURE_2D,q,ut,ot.width,ot.height,0,Mt,Tt,ot.data);_.generateMipmaps=!1}else Yt?(se&&e.texStorage2D(n.TEXTURE_2D,ct,ut,Z.width,Z.height),D&&at(_,Z,Mt,Tt)):e.texImage2D(n.TEXTURE_2D,0,ut,Z.width,Z.height,0,Mt,Tt,Z.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Yt&&se&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ct,ut,Gt[0].width,Gt[0].height,Z.depth);for(let q=0,yt=Gt.length;q<yt;q++)if(ot=Gt[q],_.format!==dn)if(Mt!==null)if(Yt){if(D)if(_.layerUpdates.size>0){const ht=Mu(ot.width,ot.height,_.format,_.type);for(const et of _.layerUpdates){const Pt=ot.data.subarray(et*ht/ot.data.BYTES_PER_ELEMENT,(et+1)*ht/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,et,ot.width,ot.height,1,Mt,Pt)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ot.width,ot.height,Z.depth,Mt,ot.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,ut,ot.width,ot.height,Z.depth,0,ot.data,0,0);else Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Yt?D&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ot.width,ot.height,Z.depth,Mt,Tt,ot.data):e.texImage3D(n.TEXTURE_2D_ARRAY,q,ut,ot.width,ot.height,Z.depth,0,Mt,Tt,ot.data)}else{Yt&&se&&e.texStorage2D(n.TEXTURE_2D,ct,ut,Gt[0].width,Gt[0].height);for(let q=0,yt=Gt.length;q<yt;q++)ot=Gt[q],_.format!==dn?Mt!==null?Yt?D&&e.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,ot.width,ot.height,Mt,ot.data):e.compressedTexImage2D(n.TEXTURE_2D,q,ut,ot.width,ot.height,0,ot.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?D&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,ot.width,ot.height,Mt,Tt,ot.data):e.texImage2D(n.TEXTURE_2D,q,ut,ot.width,ot.height,0,Mt,Tt,ot.data)}else if(_.isDataArrayTexture)if(Yt){if(se&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ct,ut,Z.width,Z.height,Z.depth),D)if(_.layerUpdates.size>0){const q=Mu(Z.width,Z.height,_.format,_.type);for(const yt of _.layerUpdates){const ht=Z.data.subarray(yt*q/Z.data.BYTES_PER_ELEMENT,(yt+1)*q/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,yt,Z.width,Z.height,1,Mt,Tt,ht)}_.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Mt,Tt,Z.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ut,Z.width,Z.height,Z.depth,0,Mt,Tt,Z.data);else if(_.isData3DTexture)Yt?(se&&e.texStorage3D(n.TEXTURE_3D,ct,ut,Z.width,Z.height,Z.depth),D&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Mt,Tt,Z.data)):e.texImage3D(n.TEXTURE_3D,0,ut,Z.width,Z.height,Z.depth,0,Mt,Tt,Z.data);else if(_.isFramebufferTexture){if(se)if(Yt)e.texStorage2D(n.TEXTURE_2D,ct,ut,Z.width,Z.height);else{let q=Z.width,yt=Z.height;for(let ht=0;ht<ct;ht++)e.texImage2D(n.TEXTURE_2D,ht,ut,q,yt,0,Mt,Tt,null),q>>=1,yt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){const q=n.canvas;if(q.hasAttribute("layoutsubtree")||q.setAttribute("layoutsubtree","true"),Z.parentNode!==q){q.appendChild(Z),d.add(_),q.onpaint=Vt=>{const Se=Vt.changedElements;for(const ce of d)Se.includes(ce.image)&&(ce.needsUpdate=!0)},q.requestPaint();return}const yt=0,ht=n.RGBA,et=n.RGBA,Pt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,yt,ht,et,Pt,Z),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Gt.length>0){if(Yt&&se){const q=re(Gt[0]);e.texStorage2D(n.TEXTURE_2D,ct,ut,q.width,q.height)}for(let q=0,yt=Gt.length;q<yt;q++)ot=Gt[q],Yt?D&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,Mt,Tt,ot):e.texImage2D(n.TEXTURE_2D,q,ut,Mt,Tt,ot);_.generateMipmaps=!1}else if(Yt){if(se){const q=re(Z);e.texStorage2D(n.TEXTURE_2D,ct,ut,q.width,q.height)}D&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,Tt,Z)}else e.texImage2D(n.TEXTURE_2D,0,ut,Mt,Tt,Z);m(_)&&v(K),lt.__version=rt.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Ut(T,_,O){if(_.image.length!==6)return;const K=$(T,_),tt=_.source;e.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+O);const rt=i.get(tt);if(tt.version!==rt.__version||K===!0){e.activeTexture(n.TEXTURE0+O);const lt=Qt.getPrimaries(Qt.workingColorSpace),Y=_.colorSpace===Jn?null:Qt.getPrimaries(_.colorSpace),Z=_.colorSpace===Jn||lt===Y?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const Mt=_.isCompressedTexture||_.image[0].isCompressedTexture,Tt=_.image[0]&&_.image[0].isDataTexture,ut=[];for(let et=0;et<6;et++)!Mt&&!Tt?ut[et]=p(_.image[et],!0,s.maxCubemapSize):ut[et]=Tt?_.image[et].image:_.image[et],ut[et]=st(_,ut[et]);const ot=ut[0],Gt=r.convert(_.format,_.colorSpace),Yt=r.convert(_.type),se=y(_.internalFormat,Gt,Yt,_.normalized,_.colorSpace),D=_.isVideoTexture!==!0,ct=rt.__version===void 0||K===!0,q=tt.dataReady;let yt=b(_,ot);Bt(n.TEXTURE_CUBE_MAP,_);let ht;if(Mt){D&&ct&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,se,ot.width,ot.height);for(let et=0;et<6;et++){ht=ut[et].mipmaps;for(let Pt=0;Pt<ht.length;Pt++){const Vt=ht[Pt];_.format!==dn?Gt!==null?D?q&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt,0,0,Vt.width,Vt.height,Gt,Vt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt,se,Vt.width,Vt.height,0,Vt.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?q&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt,0,0,Vt.width,Vt.height,Gt,Yt,Vt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt,se,Vt.width,Vt.height,0,Gt,Yt,Vt.data)}}}else{if(ht=_.mipmaps,D&&ct){ht.length>0&&yt++;const et=re(ut[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,se,et.width,et.height)}for(let et=0;et<6;et++)if(Tt){D?q&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ut[et].width,ut[et].height,Gt,Yt,ut[et].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,se,ut[et].width,ut[et].height,0,Gt,Yt,ut[et].data);for(let Pt=0;Pt<ht.length;Pt++){const Se=ht[Pt].image[et].image;D?q&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt+1,0,0,Se.width,Se.height,Gt,Yt,Se.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt+1,se,Se.width,Se.height,0,Gt,Yt,Se.data)}}else{D?q&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Gt,Yt,ut[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,se,Gt,Yt,ut[et]);for(let Pt=0;Pt<ht.length;Pt++){const Vt=ht[Pt];D?q&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt+1,0,0,Gt,Yt,Vt.image[et]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt+1,se,Gt,Yt,Vt.image[et])}}}m(_)&&v(n.TEXTURE_CUBE_MAP),rt.__version=tt.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Dt(T,_,O,K,tt,rt){const lt=r.convert(O.format,O.colorSpace),Y=r.convert(O.type),Z=y(O.internalFormat,lt,Y,O.normalized,O.colorSpace),Mt=i.get(_),Tt=i.get(O);if(Tt.__renderTarget=_,!Mt.__hasExternalTextures){const ut=Math.max(1,_.width>>rt),ot=Math.max(1,_.height>>rt);tt===n.TEXTURE_3D||tt===n.TEXTURE_2D_ARRAY?e.texImage3D(tt,rt,Z,ut,ot,_.depth,0,lt,Y,null):e.texImage2D(tt,rt,Z,ut,ot,0,lt,Y,null)}e.bindFramebuffer(n.FRAMEBUFFER,T),Rt(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,tt,Tt.__webglTexture,0,Ht(_)):(tt===n.TEXTURE_2D||tt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,tt,Tt.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ne(T,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,T),_.depthBuffer){const K=_.depthTexture,tt=K&&K.isDepthTexture?K.type:null,rt=P(_.stencilBuffer,tt),lt=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Rt(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ht(_),rt,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ht(_),rt,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,rt,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,T)}else{const K=_.textures;for(let tt=0;tt<K.length;tt++){const rt=K[tt],lt=r.convert(rt.format,rt.colorSpace),Y=r.convert(rt.type),Z=y(rt.internalFormat,lt,Y,rt.normalized,rt.colorSpace);Rt(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ht(_),Z,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ht(_),Z,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,Z,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ft(T,_,O){const K=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=i.get(_.depthTexture);if(tt.__renderTarget=_,(!tt.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),K){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),tt.__webglTexture===void 0){tt.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,tt.__webglTexture),Bt(n.TEXTURE_CUBE_MAP,_.depthTexture);const Mt=r.convert(_.depthTexture.format),Tt=r.convert(_.depthTexture.type);let ut;_.depthTexture.format===Hn?ut=n.DEPTH_COMPONENT24:_.depthTexture.format===di&&(ut=n.DEPTH24_STENCIL8);for(let ot=0;ot<6;ot++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,ut,_.width,_.height,0,Mt,Tt,null)}}else j(_.depthTexture,0);const rt=tt.__webglTexture,lt=Ht(_),Y=K?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,Z=_.depthTexture.format===di?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===Hn)Rt(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,Y,rt,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,Z,Y,rt,0);else if(_.depthTexture.format===di)Rt(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,Y,rt,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,Z,Y,rt,0);else throw new Error("Unknown depthTexture format")}function J(T){const _=i.get(T),O=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const K=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),K){const tt=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,K.removeEventListener("dispose",tt)};K.addEventListener("dispose",tt),_.__depthDisposeCallback=tt}_.__boundDepthTexture=K}if(T.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let K=0;K<6;K++)Ft(_.__webglFramebuffer[K],T,K);else{const K=T.texture.mipmaps;K&&K.length>0?Ft(_.__webglFramebuffer[0],T,0):Ft(_.__webglFramebuffer,T,0)}else if(O){_.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[K]),_.__webglDepthbuffer[K]===void 0)_.__webglDepthbuffer[K]=n.createRenderbuffer(),ne(_.__webglDepthbuffer[K],T,!1);else{const tt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=_.__webglDepthbuffer[K];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,rt)}}else{const K=T.texture.mipmaps;if(K&&K.length>0?e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),ne(_.__webglDepthbuffer,T,!1);else{const tt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,rt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function it(T,_,O){const K=i.get(T);_!==void 0&&Dt(K.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&J(T)}function Q(T){const _=T.texture,O=i.get(T),K=i.get(_);T.addEventListener("dispose",x);const tt=T.textures,rt=T.isWebGLCubeRenderTarget===!0,lt=tt.length>1;if(lt||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=_.version,a.memory.textures++),rt){O.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[Y]=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[Y][Z]=n.createFramebuffer()}else O.__webglFramebuffer[Y]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let Y=0;Y<_.mipmaps.length;Y++)O.__webglFramebuffer[Y]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(lt)for(let Y=0,Z=tt.length;Y<Z;Y++){const Mt=i.get(tt[Y]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&Rt(T)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Y=0;Y<tt.length;Y++){const Z=tt[Y];O.__webglColorRenderbuffer[Y]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[Y]);const Mt=r.convert(Z.format,Z.colorSpace),Tt=r.convert(Z.type),ut=y(Z.internalFormat,Mt,Tt,Z.normalized,Z.colorSpace,T.isXRRenderTarget===!0),ot=Ht(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,ot,ut,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Y,n.RENDERBUFFER,O.__webglColorRenderbuffer[Y])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ne(O.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),Bt(n.TEXTURE_CUBE_MAP,_);for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Dt(O.__webglFramebuffer[Y][Z],T,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Z);else Dt(O.__webglFramebuffer[Y],T,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(_)&&v(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){for(let Y=0,Z=tt.length;Y<Z;Y++){const Mt=tt[Y],Tt=i.get(Mt);let ut=n.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ut=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ut,Tt.__webglTexture),Bt(ut,Mt),Dt(O.__webglFramebuffer,T,Mt,n.COLOR_ATTACHMENT0+Y,ut,0),m(Mt)&&v(ut)}e.unbindTexture()}else{let Y=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Y=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Y,K.__webglTexture),Bt(Y,_),_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Dt(O.__webglFramebuffer[Z],T,_,n.COLOR_ATTACHMENT0,Y,Z);else Dt(O.__webglFramebuffer,T,_,n.COLOR_ATTACHMENT0,Y,0);m(_)&&v(Y),e.unbindTexture()}T.depthBuffer&&J(T)}function xt(T){const _=T.textures;for(let O=0,K=_.length;O<K;O++){const tt=_[O];if(m(tt)){const rt=E(T),lt=i.get(tt).__webglTexture;e.bindTexture(rt,lt),v(rt),e.unbindTexture()}}}const dt=[],Ot=[];function w(T){if(T.samples>0){if(Rt(T)===!1){const _=T.textures,O=T.width,K=T.height;let tt=n.COLOR_BUFFER_BIT;const rt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=i.get(T),Y=_.length>1;if(Y)for(let Mt=0;Mt<_.length;Mt++)e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer);const Z=T.texture.mipmaps;Z&&Z.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,lt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let Mt=0;Mt<_.length;Mt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(tt|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(tt|=n.STENCIL_BUFFER_BIT)),Y){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,lt.__webglColorRenderbuffer[Mt]);const Tt=i.get(_[Mt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Tt,0)}n.blitFramebuffer(0,0,O,K,0,0,O,K,tt,n.NEAREST),c===!0&&(dt.length=0,Ot.length=0,dt.push(n.COLOR_ATTACHMENT0+Mt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(dt.push(rt),Ot.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ot)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,dt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Y)for(let Mt=0;Mt<_.length;Mt++){e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.RENDERBUFFER,lt.__webglColorRenderbuffer[Mt]);const Tt=i.get(_[Mt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Mt,n.TEXTURE_2D,Tt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const _=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Ht(T){return Math.min(s.maxSamples,T.samples)}function Rt(T){const _=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function kt(T){const _=a.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function st(T,_){const O=T.colorSpace,K=T.format,tt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==Wr&&O!==Jn&&(Qt.getTransfer(O)===oe?(K!==dn||tt!==Xe)&&Nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):jt("WebGLTextures: Unsupported texture color space:",O)),_}function re(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=X,this.getTextureUnits=W,this.setTextureUnits=N,this.setTexture2D=j,this.setTexture2DArray=nt,this.setTexture3D=ft,this.setTextureCube=St,this.rebindTextures=it,this.setupRenderTarget=Q,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=w,this.setupDepthRenderbuffer=J,this.setupFrameBufferTexture=Dt,this.useMultisampledRTT=Rt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function zy(n,t){function e(i,s=Jn){let r;const a=Qt.getTransfer(s);if(i===Xe)return n.UNSIGNED_BYTE;if(i===Ic)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Lc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Td)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===bd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===yd)return n.BYTE;if(i===Ed)return n.SHORT;if(i===Ns)return n.UNSIGNED_SHORT;if(i===Pc)return n.INT;if(i===bn)return n.UNSIGNED_INT;if(i===hn)return n.FLOAT;if(i===Bn)return n.HALF_FLOAT;if(i===Ad)return n.ALPHA;if(i===Rd)return n.RGB;if(i===dn)return n.RGBA;if(i===Hn)return n.DEPTH_COMPONENT;if(i===di)return n.DEPTH_STENCIL;if(i===Dc)return n.RED;if(i===Nc)return n.RED_INTEGER;if(i===xi)return n.RG;if(i===Uc)return n.RG_INTEGER;if(i===Fc)return n.RGBA_INTEGER;if(i===Cr||i===Pr||i===Ir||i===Lr)if(a===oe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Cr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Cr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Pr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ir)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Co||i===Po||i===Io||i===Lo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Co)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Po)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Io)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Lo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Do||i===No||i===Uo||i===Fo||i===Oo||i===zr||i===ko)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Do||i===No)return a===oe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Uo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Fo)return r.COMPRESSED_R11_EAC;if(i===Oo)return r.COMPRESSED_SIGNED_R11_EAC;if(i===zr)return r.COMPRESSED_RG11_EAC;if(i===ko)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Bo||i===Ho||i===Go||i===zo||i===Vo||i===Wo||i===Xo||i===Yo||i===qo||i===Ko||i===Zo||i===$o||i===Jo||i===jo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Bo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ho)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Go)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===zo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Vo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Wo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Xo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ko)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Zo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===$o)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Jo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===jo)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Qo||i===tc||i===ec)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Qo)return a===oe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ec)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===nc||i===ic||i===Vr||i===sc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===nc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Vr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===sc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Us?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const Vy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Wy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Xy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Fd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new An({vertexShader:Vy,fragmentShader:Wy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new $t(new Vs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Yy extends Mi{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,g=null;const S=typeof XRWebGLBinding<"u",p=new Xy,m={},v=e.getContextAttributes();let E=null,y=null;const P=[],b=[],C=new pt;let x=null;const A=new Qe;A.viewport=new ve;const I=new Qe;I.viewport=new ve;const R=[A,I],F=new ex;let X=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let gt=P[$];return gt===void 0&&(gt=new Ta,P[$]=gt),gt.getTargetRaySpace()},this.getControllerGrip=function($){let gt=P[$];return gt===void 0&&(gt=new Ta,P[$]=gt),gt.getGripSpace()},this.getHand=function($){let gt=P[$];return gt===void 0&&(gt=new Ta,P[$]=gt),gt.getHandSpace()};function N($){const gt=b.indexOf($.inputSource);if(gt===-1)return;const at=P[gt];at!==void 0&&(at.update($.inputSource,$.frame,l||a),at.dispatchEvent({type:$.type,data:$.inputSource}))}function B(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",k);for(let $=0;$<P.length;$++){const gt=b[$];gt!==null&&(b[$]=null,P[$].disconnect(gt))}X=null,W=null,p.reset();for(const $ in m)delete m[$];t.setRenderTarget(E),f=null,h=null,d=null,s=null,y=null,Bt.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&Nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&Nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",B),s.addEventListener("inputsourceschange",k),v.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(C),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let at=null,Ct=null,Ut=null;v.depth&&(Ut=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=v.stencil?di:Hn,Ct=v.stencil?Us:bn);const Dt={colorFormat:e.RGBA8,depthFormat:Ut,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Dt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),y=new Tn(h.textureWidth,h.textureHeight,{format:dn,type:Xe,depthTexture:new Ji(h.textureWidth,h.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const at={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,at),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Tn(f.framebufferWidth,f.framebufferHeight,{format:dn,type:Xe,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Bt.setContext(s),Bt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function k($){for(let gt=0;gt<$.removed.length;gt++){const at=$.removed[gt],Ct=b.indexOf(at);Ct>=0&&(b[Ct]=null,P[Ct].disconnect(at))}for(let gt=0;gt<$.added.length;gt++){const at=$.added[gt];let Ct=b.indexOf(at);if(Ct===-1){for(let Dt=0;Dt<P.length;Dt++)if(Dt>=b.length){b.push(at),Ct=Dt;break}else if(b[Dt]===null){b[Dt]=at,Ct=Dt;break}if(Ct===-1)break}const Ut=P[Ct];Ut&&Ut.connect(at)}}const j=new L,nt=new L;function ft($,gt,at){j.setFromMatrixPosition(gt.matrixWorld),nt.setFromMatrixPosition(at.matrixWorld);const Ct=j.distanceTo(nt),Ut=gt.projectionMatrix.elements,Dt=at.projectionMatrix.elements,ne=Ut[14]/(Ut[10]-1),Ft=Ut[14]/(Ut[10]+1),J=(Ut[9]+1)/Ut[5],it=(Ut[9]-1)/Ut[5],Q=(Ut[8]-1)/Ut[0],xt=(Dt[8]+1)/Dt[0],dt=ne*Q,Ot=ne*xt,w=Ct/(-Q+xt),Ht=w*-Q;if(gt.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Ht),$.translateZ(w),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ut[10]===-1)$.projectionMatrix.copy(gt.projectionMatrix),$.projectionMatrixInverse.copy(gt.projectionMatrixInverse);else{const Rt=ne+w,kt=Ft+w,st=dt-Ht,re=Ot+(Ct-Ht),T=J*Ft/kt*Rt,_=it*Ft/kt*Rt;$.projectionMatrix.makePerspective(st,re,T,_,Rt,kt),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function St($,gt){gt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(gt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let gt=$.near,at=$.far;p.texture!==null&&(p.depthNear>0&&(gt=p.depthNear),p.depthFar>0&&(at=p.depthFar)),F.near=I.near=A.near=gt,F.far=I.far=A.far=at,(X!==F.near||W!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),X=F.near,W=F.far),F.layers.mask=$.layers.mask|6,A.layers.mask=F.layers.mask&-5,I.layers.mask=F.layers.mask&-3;const Ct=$.parent,Ut=F.cameras;St(F,Ct);for(let Dt=0;Dt<Ut.length;Dt++)St(Ut[Dt],Ct);Ut.length===2?ft(F,A,I):F.projectionMatrix.copy(A.projectionMatrix),At($,F,Ct)};function At($,gt,at){at===null?$.matrix.copy(gt.matrixWorld):($.matrix.copy(at.matrixWorld),$.matrix.invert(),$.matrix.multiply(gt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(gt.projectionMatrix),$.projectionMatrixInverse.copy(gt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=oc*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function($){return m[$]};let Xt=null;function ee($,gt){if(u=gt.getViewerPose(l||a),g=gt,u!==null){const at=u.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Ct=!1;at.length!==F.cameras.length&&(F.cameras.length=0,Ct=!0);for(let Ft=0;Ft<at.length;Ft++){const J=at[Ft];let it=null;if(f!==null)it=f.getViewport(J);else{const xt=d.getViewSubImage(h,J);it=xt.viewport,Ft===0&&(t.setRenderTargetTextures(y,xt.colorTexture,xt.depthStencilTexture),t.setRenderTarget(y))}let Q=R[Ft];Q===void 0&&(Q=new Qe,Q.layers.enable(Ft),Q.viewport=new ve,R[Ft]=Q),Q.matrix.fromArray(J.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(J.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(it.x,it.y,it.width,it.height),Ft===0&&(F.matrix.copy(Q.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ct===!0&&F.cameras.push(Q)}const Ut=s.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){d=i.getBinding();const Ft=d.getDepthInformation(at[0]);Ft&&Ft.isValid&&Ft.texture&&p.init(Ft,s.renderState)}if(Ut&&Ut.includes("camera-access")&&S){t.state.unbindTexture(),d=i.getBinding();for(let Ft=0;Ft<at.length;Ft++){const J=at[Ft].camera;if(J){let it=m[J];it||(it=new Fd,m[J]=it);const Q=d.getCameraImage(J);it.sourceTexture=Q}}}}for(let at=0;at<P.length;at++){const Ct=b[at],Ut=P[at];Ct!==null&&Ut!==void 0&&Ut.update(Ct,gt,l||a)}Xt&&Xt($,gt),gt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:gt}),g=null}const Bt=new Zd;Bt.setAnimationLoop(ee),this.setAnimationLoop=function($){Xt=$},this.dispose=function(){}}}const qy=new ae,nf=new zt;nf.set(-1,0,0,0,1,0,0,0,1);function Ky(n,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Yd(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,v,E,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),S(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,v,E):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===He&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===He&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const v=t.get(m),E=v.envMap,y=v.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(qy.makeRotationFromEuler(y)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(nf),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,v,E){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*v,p.scale.value=E*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,v){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===He&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function S(p,m){const v=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Zy(n,t,e,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,E){const y=E.program;i.uniformBlockBinding(v,y)}function l(v,E){let y=s[v.id];y===void 0&&(g(v),y=u(v),s[v.id]=y,v.addEventListener("dispose",p));const P=E.program;i.updateUBOMapping(v,P);const b=t.render.frame;r[v.id]!==b&&(h(v),r[v.id]=b)}function u(v){const E=d();v.__bindingPointIndex=E;const y=n.createBuffer(),P=v.__size,b=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,y),y}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const E=s[v.id],y=v.uniforms,P=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let b=0,C=y.length;b<C;b++){const x=Array.isArray(y[b])?y[b]:[y[b]];for(let A=0,I=x.length;A<I;A++){const R=x[A];if(f(R,b,A,P)===!0){const F=R.__offset,X=Array.isArray(R.value)?R.value:[R.value];let W=0;for(let N=0;N<X.length;N++){const B=X[N],k=S(B);typeof B=="number"||typeof B=="boolean"?(R.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,F+W,R.__data)):B.isMatrix3?(R.__data[0]=B.elements[0],R.__data[1]=B.elements[1],R.__data[2]=B.elements[2],R.__data[3]=0,R.__data[4]=B.elements[3],R.__data[5]=B.elements[4],R.__data[6]=B.elements[5],R.__data[7]=0,R.__data[8]=B.elements[6],R.__data[9]=B.elements[7],R.__data[10]=B.elements[8],R.__data[11]=0):ArrayBuffer.isView(B)?R.__data.set(new B.constructor(B.buffer,B.byteOffset,R.__data.length)):(B.toArray(R.__data,W),W+=k.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,E,y,P){const b=v.value,C=E+"_"+y;if(P[C]===void 0)return typeof b=="number"||typeof b=="boolean"?P[C]=b:ArrayBuffer.isView(b)?P[C]=b.slice():P[C]=b.clone(),!0;{const x=P[C];if(typeof b=="number"||typeof b=="boolean"){if(x!==b)return P[C]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(x.equals(b)===!1)return x.copy(b),!0}}return!1}function g(v){const E=v.uniforms;let y=0;const P=16;for(let C=0,x=E.length;C<x;C++){const A=Array.isArray(E[C])?E[C]:[E[C]];for(let I=0,R=A.length;I<R;I++){const F=A[I],X=Array.isArray(F.value)?F.value:[F.value];for(let W=0,N=X.length;W<N;W++){const B=X[W],k=S(B),j=y%P,nt=j%k.boundary,ft=j+nt;y+=nt,ft!==0&&P-ft<k.storage&&(y+=P-ft),F.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=k.storage}}}const b=y%P;return b>0&&(y+=P-b),v.__size=y,v.__cache={},this}function S(v){const E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Nt("WebGLRenderer: Unsupported uniform value type.",v),E}function p(v){const E=v.target;E.removeEventListener("dispose",p);const y=a.indexOf(E.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function m(){for(const v in s)n.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}const $y=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let xn=null;function Jy(){return xn===null&&(xn=new Dd($y,16,16,xi,Bn),xn.name="DFG_LUT",xn.minFilter=Ne,xn.magFilter=Ne,xn.wrapS=Fn,xn.wrapT=Fn,xn.generateMipmaps=!1,xn.needsUpdate=!0),xn}class jy{constructor(t={}){const{canvas:e=U0(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=Xe}=t;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const S=f,p=new Set([Fc,Uc,Nc]),m=new Set([Xe,bn,Ns,Us,Ic,Lc]),v=new Uint32Array(4),E=new Int32Array(4),y=new L;let P=null,b=null;const C=[],x=[];let A=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=En,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let R=!1,F=null;this._outputColorSpace=je;let X=0,W=0,N=null,B=-1,k=null;const j=new ve,nt=new ve;let ft=null;const St=new te(0);let At=0,Xt=e.width,ee=e.height,Bt=1,$=null,gt=null;const at=new ve(0,0,Xt,ee),Ct=new ve(0,0,Xt,ee);let Ut=!1;const Dt=new Vc;let ne=!1,Ft=!1;const J=new ae,it=new L,Q=new ve,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let dt=!1;function Ot(){return N===null?Bt:1}let w=i;function Ht(M,U){return e.getContext(M,U)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cc}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",Vt,!1),w===null){const U="webgl2";if(w=Ht(U,M),w===null)throw Ht(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw jt("WebGLRenderer: "+M.message),M}let Rt,kt,st,re,T,_,O,K,tt,rt,lt,Y,Z,Mt,Tt,ut,ot,Gt,Yt,se,D,ct,q;function yt(){Rt=new JM(w),Rt.init(),D=new zy(w,Rt),kt=new VM(w,Rt,t,D),st=new Hy(w,Rt),kt.reversedDepthBuffer&&h&&st.buffers.depth.setReversed(!0),re=new tS(w),T=new Ay,_=new Gy(w,Rt,st,T,kt,D,re),O=new $M(I),K=new sx(w),ct=new GM(w,K),tt=new jM(w,K,re,ct),rt=new nS(w,tt,K,ct,re),Gt=new eS(w,kt,_),Tt=new WM(T),lt=new by(I,O,Rt,kt,ct,Tt),Y=new Ky(I,T),Z=new wy,Mt=new Ny(Rt),ot=new HM(I,O,st,rt,g,c),ut=new By(I,rt,kt),q=new Zy(w,re,kt,st),Yt=new zM(w,Rt,re),se=new QM(w,Rt,re),re.programs=lt.programs,I.capabilities=kt,I.extensions=Rt,I.properties=T,I.renderLists=Z,I.shadowMap=ut,I.state=st,I.info=re}yt(),S!==Xe&&(A=new sS(S,e.width,e.height,s,r));const ht=new Yy(I,w);this.xr=ht,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){const M=Rt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Rt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Bt},this.setPixelRatio=function(M){M!==void 0&&(Bt=M,this.setSize(Xt,ee,!1))},this.getSize=function(M){return M.set(Xt,ee)},this.setSize=function(M,U,V=!0){if(ht.isPresenting){Nt("WebGLRenderer: Can't change size while VR device is presenting.");return}Xt=M,ee=U,e.width=Math.floor(M*Bt),e.height=Math.floor(U*Bt),V===!0&&(e.style.width=M+"px",e.style.height=U+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(Xt*Bt,ee*Bt).floor()},this.setDrawingBufferSize=function(M,U,V){Xt=M,ee=U,Bt=V,e.width=Math.floor(M*V),e.height=Math.floor(U*V),this.setViewport(0,0,M,U)},this.setEffects=function(M){if(S===Xe){jt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let U=0;U<M.length;U++)if(M[U].isOutputPass===!0){Nt("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(j)},this.getViewport=function(M){return M.copy(at)},this.setViewport=function(M,U,V,H){M.isVector4?at.set(M.x,M.y,M.z,M.w):at.set(M,U,V,H),st.viewport(j.copy(at).multiplyScalar(Bt).round())},this.getScissor=function(M){return M.copy(Ct)},this.setScissor=function(M,U,V,H){M.isVector4?Ct.set(M.x,M.y,M.z,M.w):Ct.set(M,U,V,H),st.scissor(nt.copy(Ct).multiplyScalar(Bt).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(M){st.setScissorTest(Ut=M)},this.setOpaqueSort=function(M){$=M},this.setTransparentSort=function(M){gt=M},this.getClearColor=function(M){return M.copy(ot.getClearColor())},this.setClearColor=function(){ot.setClearColor(...arguments)},this.getClearAlpha=function(){return ot.getClearAlpha()},this.setClearAlpha=function(){ot.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,V=!0){let H=0;if(M){let G=!1;if(N!==null){const vt=N.texture.format;G=p.has(vt)}if(G){const vt=N.texture.type,bt=m.has(vt),_t=ot.getClearColor(),wt=ot.getClearAlpha(),It=_t.r,Wt=_t.g,Kt=_t.b;bt?(v[0]=It,v[1]=Wt,v[2]=Kt,v[3]=wt,w.clearBufferuiv(w.COLOR,0,v)):(E[0]=It,E[1]=Wt,E[2]=Kt,E[3]=wt,w.clearBufferiv(w.COLOR,0,E))}else H|=w.COLOR_BUFFER_BIT}U&&(H|=w.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(H|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&w.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",Vt,!1),ot.dispose(),Z.dispose(),Mt.dispose(),T.dispose(),O.dispose(),rt.dispose(),ct.dispose(),q.dispose(),lt.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",ol),ht.removeEventListener("sessionend",cl),ii.stop()};function et(M){M.preventDefault(),Bl("WebGLRenderer: Context Lost."),R=!0}function Pt(){Bl("WebGLRenderer: Context Restored."),R=!1;const M=re.autoReset,U=ut.enabled,V=ut.autoUpdate,H=ut.needsUpdate,G=ut.type;yt(),re.autoReset=M,ut.enabled=U,ut.autoUpdate=V,ut.needsUpdate=H,ut.type=G}function Vt(M){jt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Se(M){const U=M.target;U.removeEventListener("dispose",Se),ce(U)}function ce(M){wn(M),T.remove(M)}function wn(M){const U=T.get(M).programs;U!==void 0&&(U.forEach(function(V){lt.releaseProgram(V)}),M.isShaderMaterial&&lt.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,V,H,G,vt){U===null&&(U=xt);const bt=G.isMesh&&G.matrixWorld.determinant()<0,_t=wf(M,U,V,H,G);st.setMaterial(H,bt);let wt=V.index,It=1;if(H.wireframe===!0){if(wt=tt.getWireframeAttribute(V),wt===void 0)return;It=2}const Wt=V.drawRange,Kt=V.attributes.position;let Lt=Wt.start*It,le=(Wt.start+Wt.count)*It;vt!==null&&(Lt=Math.max(Lt,vt.start*It),le=Math.min(le,(vt.start+vt.count)*It)),wt!==null?(Lt=Math.max(Lt,0),le=Math.min(le,wt.count)):Kt!=null&&(Lt=Math.max(Lt,0),le=Math.min(le,Kt.count));const ye=le-Lt;if(ye<0||ye===1/0)return;ct.setup(G,H,_t,V,wt);let xe,he=Yt;if(wt!==null&&(xe=K.get(wt),he=se,he.setIndex(xe)),G.isMesh)H.wireframe===!0?(st.setLineWidth(H.wireframeLinewidth*Ot()),he.setMode(w.LINES)):he.setMode(w.TRIANGLES);else if(G.isLine){let Ie=H.linewidth;Ie===void 0&&(Ie=1),st.setLineWidth(Ie*Ot()),G.isLineSegments?he.setMode(w.LINES):G.isLineLoop?he.setMode(w.LINE_LOOP):he.setMode(w.LINE_STRIP)}else G.isPoints?he.setMode(w.POINTS):G.isSprite&&he.setMode(w.TRIANGLES);if(G.isBatchedMesh)if(Rt.get("WEBGL_multi_draw"))he.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ie=G._multiDrawStarts,Et=G._multiDrawCounts,Ge=G._multiDrawCount,ie=wt?K.get(wt).bytesPerElement:1,Ze=T.get(H).currentProgram.getUniforms();for(let gn=0;gn<Ge;gn++)Ze.setValue(w,"_gl_DrawID",gn),he.render(Ie[gn]/ie,Et[gn])}else if(G.isInstancedMesh)he.renderInstances(Lt,ye,G.count);else if(V.isInstancedBufferGeometry){const Ie=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Et=Math.min(V.instanceCount,Ie);he.renderInstances(Lt,ye,Et)}else he.render(Lt,ye)};function mn(M,U,V){M.transparent===!0&&M.side===Nn&&M.forceSinglePass===!1?(M.side=He,M.needsUpdate=!0,Ys(M,U,V),M.side=Qn,M.needsUpdate=!0,Ys(M,U,V),M.side=Nn):Ys(M,U,V)}this.compile=function(M,U,V=null){V===null&&(V=M),b=Mt.get(V),b.init(U),x.push(b),V.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),M!==V&&M.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights();const H=new Set;return M.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const vt=G.material;if(vt)if(Array.isArray(vt))for(let bt=0;bt<vt.length;bt++){const _t=vt[bt];mn(_t,V,G),H.add(_t)}else mn(vt,V,G),H.add(vt)}),b=x.pop(),H},this.compileAsync=function(M,U,V=null){const H=this.compile(M,U,V);return new Promise(G=>{function vt(){if(H.forEach(function(bt){T.get(bt).currentProgram.isReady()&&H.delete(bt)}),H.size===0){G(M);return}setTimeout(vt,10)}Rt.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let la=null;function Af(M){la&&la(M)}function ol(){ii.stop()}function cl(){ii.start()}const ii=new Zd;ii.setAnimationLoop(Af),typeof self<"u"&&ii.setContext(self),this.setAnimationLoop=function(M){la=M,ht.setAnimationLoop(M),M===null?ii.stop():ii.start()},ht.addEventListener("sessionstart",ol),ht.addEventListener("sessionend",cl),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;F!==null&&F.renderStart(M,U);const V=ht.enabled===!0&&ht.isPresenting===!0,H=A!==null&&(N===null||V)&&A.begin(I,N);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(U),U=ht.getCamera()),M.isScene===!0&&M.onBeforeRender(I,M,U,N),b=Mt.get(M,x.length),b.init(U),b.state.textureUnits=_.getTextureUnits(),x.push(b),J.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Dt.setFromProjectionMatrix(J,Sn,U.reversedDepth),Ft=this.localClippingEnabled,ne=Tt.init(this.clippingPlanes,Ft),P=Z.get(M,C.length),P.init(),C.push(P),ht.enabled===!0&&ht.isPresenting===!0){const bt=I.xr.getDepthSensingMesh();bt!==null&&ua(bt,U,-1/0,I.sortObjects)}ua(M,U,0,I.sortObjects),P.finish(),I.sortObjects===!0&&P.sort($,gt),dt=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,dt&&ot.addToRenderList(P,M),this.info.render.frame++,ne===!0&&Tt.beginShadows();const G=b.state.shadowsArray;if(ut.render(G,M,U),ne===!0&&Tt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&A.hasRenderPass())===!1){const bt=P.opaque,_t=P.transmissive;if(b.setupLights(),U.isArrayCamera){const wt=U.cameras;if(_t.length>0)for(let It=0,Wt=wt.length;It<Wt;It++){const Kt=wt[It];ul(bt,_t,M,Kt)}dt&&ot.render(M);for(let It=0,Wt=wt.length;It<Wt;It++){const Kt=wt[It];ll(P,M,Kt,Kt.viewport)}}else _t.length>0&&ul(bt,_t,M,U),dt&&ot.render(M),ll(P,M,U)}N!==null&&W===0&&(_.updateMultisampleRenderTarget(N),_.updateRenderTargetMipmap(N)),H&&A.end(I),M.isScene===!0&&M.onAfterRender(I,M,U),ct.resetDefaultState(),B=-1,k=null,x.pop(),x.length>0?(b=x[x.length-1],_.setTextureUnits(b.state.textureUnits),ne===!0&&Tt.setGlobalState(I.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?P=C[C.length-1]:P=null,F!==null&&F.renderEnd()};function ua(M,U,V,H){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)V=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLightProbeGrid)b.pushLightProbeGrid(M);else if(M.isLight)b.pushLight(M),M.castShadow&&b.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Dt.intersectsSprite(M)){H&&Q.setFromMatrixPosition(M.matrixWorld).applyMatrix4(J);const bt=rt.update(M),_t=M.material;_t.visible&&P.push(M,bt,_t,V,Q.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Dt.intersectsObject(M))){const bt=rt.update(M),_t=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Q.copy(M.boundingSphere.center)):(bt.boundingSphere===null&&bt.computeBoundingSphere(),Q.copy(bt.boundingSphere.center)),Q.applyMatrix4(M.matrixWorld).applyMatrix4(J)),Array.isArray(_t)){const wt=bt.groups;for(let It=0,Wt=wt.length;It<Wt;It++){const Kt=wt[It],Lt=_t[Kt.materialIndex];Lt&&Lt.visible&&P.push(M,bt,Lt,V,Q.z,Kt)}}else _t.visible&&P.push(M,bt,_t,V,Q.z,null)}}const vt=M.children;for(let bt=0,_t=vt.length;bt<_t;bt++)ua(vt[bt],U,V,H)}function ll(M,U,V,H){const{opaque:G,transmissive:vt,transparent:bt}=M;b.setupLightsView(V),ne===!0&&Tt.setGlobalState(I.clippingPlanes,V),H&&st.viewport(j.copy(H)),G.length>0&&Xs(G,U,V),vt.length>0&&Xs(vt,U,V),bt.length>0&&Xs(bt,U,V),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function ul(M,U,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){const Lt=Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new Tn(1,1,{generateMipmaps:!0,type:Lt?Bn:Xe,minFilter:hi,samples:Math.max(4,kt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}const vt=b.state.transmissionRenderTarget[H.id],bt=H.viewport||j;vt.setSize(bt.z*I.transmissionResolutionScale,bt.w*I.transmissionResolutionScale);const _t=I.getRenderTarget(),wt=I.getActiveCubeFace(),It=I.getActiveMipmapLevel();I.setRenderTarget(vt),I.getClearColor(St),At=I.getClearAlpha(),At<1&&I.setClearColor(16777215,.5),I.clear(),dt&&ot.render(V);const Wt=I.toneMapping;I.toneMapping=En;const Kt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),ne===!0&&Tt.setGlobalState(I.clippingPlanes,H),Xs(M,V,H),_.updateMultisampleRenderTarget(vt),_.updateRenderTargetMipmap(vt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let le=0,ye=U.length;le<ye;le++){const xe=U[le],{object:he,geometry:Ie,material:Et,group:Ge}=xe;if(Et.side===Nn&&he.layers.test(H.layers)){const ie=Et.side;Et.side=He,Et.needsUpdate=!0,hl(he,V,H,Ie,Et,Ge),Et.side=ie,Et.needsUpdate=!0,Lt=!0}}Lt===!0&&(_.updateMultisampleRenderTarget(vt),_.updateRenderTargetMipmap(vt))}I.setRenderTarget(_t,wt,It),I.setClearColor(St,At),Kt!==void 0&&(H.viewport=Kt),I.toneMapping=Wt}function Xs(M,U,V){const H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,vt=M.length;G<vt;G++){const bt=M[G],{object:_t,geometry:wt,group:It}=bt;let Wt=bt.material;Wt.allowOverride===!0&&H!==null&&(Wt=H),_t.layers.test(V.layers)&&hl(_t,U,V,wt,Wt,It)}}function hl(M,U,V,H,G,vt){M.onBeforeRender(I,U,V,H,G,vt),M.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),G.onBeforeRender(I,U,V,H,M,vt),G.transparent===!0&&G.side===Nn&&G.forceSinglePass===!1?(G.side=He,G.needsUpdate=!0,I.renderBufferDirect(V,U,H,G,M,vt),G.side=Qn,G.needsUpdate=!0,I.renderBufferDirect(V,U,H,G,M,vt),G.side=Nn):I.renderBufferDirect(V,U,H,G,M,vt),M.onAfterRender(I,U,V,H,G,vt)}function Ys(M,U,V){U.isScene!==!0&&(U=xt);const H=T.get(M),G=b.state.lights,vt=b.state.shadowsArray,bt=G.state.version,_t=lt.getParameters(M,G.state,vt,U,V,b.state.lightProbeGridArray),wt=lt.getProgramCacheKey(_t);let It=H.programs;H.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;const Wt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;H.envMap=O.get(M.envMap||H.environment,Wt),H.envMapRotation=H.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,It===void 0&&(M.addEventListener("dispose",Se),It=new Map,H.programs=It);let Kt=It.get(wt);if(Kt!==void 0){if(H.currentProgram===Kt&&H.lightsStateVersion===bt)return fl(M,_t),Kt}else _t.uniforms=lt.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,V,_t),M.onBeforeCompile(_t,I),Kt=lt.acquireProgram(_t,wt),It.set(wt,Kt),H.uniforms=_t.uniforms;const Lt=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Lt.clippingPlanes=Tt.uniform),fl(M,_t),H.needsLights=Pf(M),H.lightsStateVersion=bt,H.needsLights&&(Lt.ambientLightColor.value=G.state.ambient,Lt.lightProbe.value=G.state.probe,Lt.directionalLights.value=G.state.directional,Lt.directionalLightShadows.value=G.state.directionalShadow,Lt.spotLights.value=G.state.spot,Lt.spotLightShadows.value=G.state.spotShadow,Lt.rectAreaLights.value=G.state.rectArea,Lt.ltc_1.value=G.state.rectAreaLTC1,Lt.ltc_2.value=G.state.rectAreaLTC2,Lt.pointLights.value=G.state.point,Lt.pointLightShadows.value=G.state.pointShadow,Lt.hemisphereLights.value=G.state.hemi,Lt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Lt.spotLightMatrix.value=G.state.spotLightMatrix,Lt.spotLightMap.value=G.state.spotLightMap,Lt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=Kt,H.uniformsList=null,Kt}function dl(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=Dr.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function fl(M,U){const V=T.get(M);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function Rf(M,U){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let V=0,H=M.length;V<H;V++){const G=M[V];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function wf(M,U,V,H,G){U.isScene!==!0&&(U=xt),_.resetTextureUnits();const vt=U.fog,bt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,_t=N===null?I.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Qt.workingColorSpace,wt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,It=O.get(H.envMap||bt,wt),Wt=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Kt=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Lt=!!V.morphAttributes.position,le=!!V.morphAttributes.normal,ye=!!V.morphAttributes.color;let xe=En;H.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(xe=I.toneMapping);const he=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ie=he!==void 0?he.length:0,Et=T.get(H),Ge=b.state.lights;if(ne===!0&&(Ft===!0||M!==k)){const pe=M===k&&H.id===B;Tt.setState(H,M,pe)}let ie=!1;H.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Ge.state.version||Et.outputColorSpace!==_t||G.isBatchedMesh&&Et.batching===!1||!G.isBatchedMesh&&Et.batching===!0||G.isBatchedMesh&&Et.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Et.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Et.instancing===!1||!G.isInstancedMesh&&Et.instancing===!0||G.isSkinnedMesh&&Et.skinning===!1||!G.isSkinnedMesh&&Et.skinning===!0||G.isInstancedMesh&&Et.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Et.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Et.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Et.instancingMorph===!1&&G.morphTexture!==null||Et.envMap!==It||H.fog===!0&&Et.fog!==vt||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Tt.numPlanes||Et.numIntersection!==Tt.numIntersection)||Et.vertexAlphas!==Wt||Et.vertexTangents!==Kt||Et.morphTargets!==Lt||Et.morphNormals!==le||Et.morphColors!==ye||Et.toneMapping!==xe||Et.morphTargetsCount!==Ie||!!Et.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(ie=!0):(ie=!0,Et.__version=H.version);let Ze=Et.currentProgram;ie===!0&&(Ze=Ys(H,U,G),F&&H.isNodeMaterial&&F.onUpdateProgram(H,Ze,Et));let gn=!1,zn=!1,yi=!1;const de=Ze.getUniforms(),Ee=Et.uniforms;if(st.useProgram(Ze.program)&&(gn=!0,zn=!0,yi=!0),H.id!==B&&(B=H.id,zn=!0),Et.needsLights){const pe=Rf(b.state.lightProbeGridArray,G);Et.lightProbeGrid!==pe&&(Et.lightProbeGrid=pe,zn=!0)}if(gn||k!==M){st.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),de.setValue(w,"projectionMatrix",M.projectionMatrix),de.setValue(w,"viewMatrix",M.matrixWorldInverse);const Wn=de.map.cameraPosition;Wn!==void 0&&Wn.setValue(w,it.setFromMatrixPosition(M.matrixWorld)),kt.logarithmicDepthBuffer&&de.setValue(w,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&de.setValue(w,"isOrthographic",M.isOrthographicCamera===!0),k!==M&&(k=M,zn=!0,yi=!0)}if(Et.needsLights&&(Ge.state.directionalShadowMap.length>0&&de.setValue(w,"directionalShadowMap",Ge.state.directionalShadowMap,_),Ge.state.spotShadowMap.length>0&&de.setValue(w,"spotShadowMap",Ge.state.spotShadowMap,_),Ge.state.pointShadowMap.length>0&&de.setValue(w,"pointShadowMap",Ge.state.pointShadowMap,_)),G.isSkinnedMesh){de.setOptional(w,G,"bindMatrix"),de.setOptional(w,G,"bindMatrixInverse");const pe=G.skeleton;pe&&(pe.boneTexture===null&&pe.computeBoneTexture(),de.setValue(w,"boneTexture",pe.boneTexture,_))}G.isBatchedMesh&&(de.setOptional(w,G,"batchingTexture"),de.setValue(w,"batchingTexture",G._matricesTexture,_),de.setOptional(w,G,"batchingIdTexture"),de.setValue(w,"batchingIdTexture",G._indirectTexture,_),de.setOptional(w,G,"batchingColorTexture"),G._colorsTexture!==null&&de.setValue(w,"batchingColorTexture",G._colorsTexture,_));const Vn=V.morphAttributes;if((Vn.position!==void 0||Vn.normal!==void 0||Vn.color!==void 0)&&Gt.update(G,V,Ze),(zn||Et.receiveShadow!==G.receiveShadow)&&(Et.receiveShadow=G.receiveShadow,de.setValue(w,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Ee.envMapIntensity.value=U.environmentIntensity),Ee.dfgLUT!==void 0&&(Ee.dfgLUT.value=Jy()),zn){if(de.setValue(w,"toneMappingExposure",I.toneMappingExposure),Et.needsLights&&Cf(Ee,yi),vt&&H.fog===!0&&Y.refreshFogUniforms(Ee,vt),Y.refreshMaterialUniforms(Ee,H,Bt,ee,b.state.transmissionRenderTarget[M.id]),Et.needsLights&&Et.lightProbeGrid){const pe=Et.lightProbeGrid;Ee.probesSH.value=pe.texture,Ee.probesMin.value.copy(pe.boundingBox.min),Ee.probesMax.value.copy(pe.boundingBox.max),Ee.probesResolution.value.copy(pe.resolution)}Dr.upload(w,dl(Et),Ee,_)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Dr.upload(w,dl(Et),Ee,_),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&de.setValue(w,"center",G.center),de.setValue(w,"modelViewMatrix",G.modelViewMatrix),de.setValue(w,"normalMatrix",G.normalMatrix),de.setValue(w,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){const pe=H.uniformsGroups;for(let Wn=0,Ei=pe.length;Wn<Ei;Wn++){const pl=pe[Wn];q.update(pl,Ze),q.bind(pl,Ze)}}return Ze}function Cf(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function Pf(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(M,U,V){const H=T.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),T.get(M.texture).__webglTexture=U,T.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:V,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){const V=T.get(M);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0};const If=w.createFramebuffer();this.setRenderTarget=function(M,U=0,V=0){N=M,X=U,W=V;let H=null,G=!1,vt=!1;if(M){const _t=T.get(M);if(_t.__useDefaultFramebuffer!==void 0){st.bindFramebuffer(w.FRAMEBUFFER,_t.__webglFramebuffer),j.copy(M.viewport),nt.copy(M.scissor),ft=M.scissorTest,st.viewport(j),st.scissor(nt),st.setScissorTest(ft),B=-1;return}else if(_t.__webglFramebuffer===void 0)_.setupRenderTarget(M);else if(_t.__hasExternalTextures)_.rebindTextures(M,T.get(M.texture).__webglTexture,T.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Wt=M.depthTexture;if(_t.__boundDepthTexture!==Wt){if(Wt!==null&&T.has(Wt)&&(M.width!==Wt.image.width||M.height!==Wt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_.setupDepthRenderbuffer(M)}}const wt=M.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(vt=!0);const It=T.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(It[U])?H=It[U][V]:H=It[U],G=!0):M.samples>0&&_.useMultisampledRTT(M)===!1?H=T.get(M).__webglMultisampledFramebuffer:Array.isArray(It)?H=It[V]:H=It,j.copy(M.viewport),nt.copy(M.scissor),ft=M.scissorTest}else j.copy(at).multiplyScalar(Bt).floor(),nt.copy(Ct).multiplyScalar(Bt).floor(),ft=Ut;if(V!==0&&(H=If),st.bindFramebuffer(w.FRAMEBUFFER,H)&&st.drawBuffers(M,H),st.viewport(j),st.scissor(nt),st.setScissorTest(ft),G){const _t=T.get(M.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+U,_t.__webglTexture,V)}else if(vt){const _t=U;for(let wt=0;wt<M.textures.length;wt++){const It=T.get(M.textures[wt]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+wt,It.__webglTexture,V,_t)}}else if(M!==null&&V!==0){const _t=T.get(M.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,_t.__webglTexture,V)}B=-1},this.readRenderTargetPixels=function(M,U,V,H,G,vt,bt,_t=0){if(!(M&&M.isWebGLRenderTarget)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=T.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&bt!==void 0&&(wt=wt[bt]),wt){st.bindFramebuffer(w.FRAMEBUFFER,wt);try{const It=M.textures[_t],Wt=It.format,Kt=It.type;if(M.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+_t),!kt.textureFormatReadable(Wt)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!kt.textureTypeReadable(Kt)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-H&&V>=0&&V<=M.height-G&&w.readPixels(U,V,H,G,D.convert(Wt),D.convert(Kt),vt)}finally{const It=N!==null?T.get(N).__webglFramebuffer:null;st.bindFramebuffer(w.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(M,U,V,H,G,vt,bt,_t=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=T.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&bt!==void 0&&(wt=wt[bt]),wt)if(U>=0&&U<=M.width-H&&V>=0&&V<=M.height-G){st.bindFramebuffer(w.FRAMEBUFFER,wt);const It=M.textures[_t],Wt=It.format,Kt=It.type;if(M.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+_t),!kt.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!kt.textureTypeReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Lt=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,Lt),w.bufferData(w.PIXEL_PACK_BUFFER,vt.byteLength,w.STREAM_READ),w.readPixels(U,V,H,G,D.convert(Wt),D.convert(Kt),0);const le=N!==null?T.get(N).__webglFramebuffer:null;st.bindFramebuffer(w.FRAMEBUFFER,le);const ye=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await F0(w,ye,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,Lt),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,vt),w.deleteBuffer(Lt),w.deleteSync(ye),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,V=0){const H=Math.pow(2,-V),G=Math.floor(M.image.width*H),vt=Math.floor(M.image.height*H),bt=U!==null?U.x:0,_t=U!==null?U.y:0;_.setTexture2D(M,0),w.copyTexSubImage2D(w.TEXTURE_2D,V,0,0,bt,_t,G,vt),st.unbindTexture()};const Lf=w.createFramebuffer(),Df=w.createFramebuffer();this.copyTextureToTexture=function(M,U,V=null,H=null,G=0,vt=0){let bt,_t,wt,It,Wt,Kt,Lt,le,ye;const xe=M.isCompressedTexture?M.mipmaps[vt]:M.image;if(V!==null)bt=V.max.x-V.min.x,_t=V.max.y-V.min.y,wt=V.isBox3?V.max.z-V.min.z:1,It=V.min.x,Wt=V.min.y,Kt=V.isBox3?V.min.z:0;else{const Ee=Math.pow(2,-G);bt=Math.floor(xe.width*Ee),_t=Math.floor(xe.height*Ee),M.isDataArrayTexture?wt=xe.depth:M.isData3DTexture?wt=Math.floor(xe.depth*Ee):wt=1,It=0,Wt=0,Kt=0}H!==null?(Lt=H.x,le=H.y,ye=H.z):(Lt=0,le=0,ye=0);const he=D.convert(U.format),Ie=D.convert(U.type);let Et;U.isData3DTexture?(_.setTexture3D(U,0),Et=w.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(_.setTexture2DArray(U,0),Et=w.TEXTURE_2D_ARRAY):(_.setTexture2D(U,0),Et=w.TEXTURE_2D),st.activeTexture(w.TEXTURE0),st.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,U.flipY),st.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),st.pixelStorei(w.UNPACK_ALIGNMENT,U.unpackAlignment);const Ge=st.getParameter(w.UNPACK_ROW_LENGTH),ie=st.getParameter(w.UNPACK_IMAGE_HEIGHT),Ze=st.getParameter(w.UNPACK_SKIP_PIXELS),gn=st.getParameter(w.UNPACK_SKIP_ROWS),zn=st.getParameter(w.UNPACK_SKIP_IMAGES);st.pixelStorei(w.UNPACK_ROW_LENGTH,xe.width),st.pixelStorei(w.UNPACK_IMAGE_HEIGHT,xe.height),st.pixelStorei(w.UNPACK_SKIP_PIXELS,It),st.pixelStorei(w.UNPACK_SKIP_ROWS,Wt),st.pixelStorei(w.UNPACK_SKIP_IMAGES,Kt);const yi=M.isDataArrayTexture||M.isData3DTexture,de=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){const Ee=T.get(M),Vn=T.get(U),pe=T.get(Ee.__renderTarget),Wn=T.get(Vn.__renderTarget);st.bindFramebuffer(w.READ_FRAMEBUFFER,pe.__webglFramebuffer),st.bindFramebuffer(w.DRAW_FRAMEBUFFER,Wn.__webglFramebuffer);for(let Ei=0;Ei<wt;Ei++)yi&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,T.get(M).__webglTexture,G,Kt+Ei),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,T.get(U).__webglTexture,vt,ye+Ei)),w.blitFramebuffer(It,Wt,bt,_t,Lt,le,bt,_t,w.DEPTH_BUFFER_BIT,w.NEAREST);st.bindFramebuffer(w.READ_FRAMEBUFFER,null),st.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(G!==0||M.isRenderTargetTexture||T.has(M)){const Ee=T.get(M),Vn=T.get(U);st.bindFramebuffer(w.READ_FRAMEBUFFER,Lf),st.bindFramebuffer(w.DRAW_FRAMEBUFFER,Df);for(let pe=0;pe<wt;pe++)yi?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Ee.__webglTexture,G,Kt+pe):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Ee.__webglTexture,G),de?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Vn.__webglTexture,vt,ye+pe):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Vn.__webglTexture,vt),G!==0?w.blitFramebuffer(It,Wt,bt,_t,Lt,le,bt,_t,w.COLOR_BUFFER_BIT,w.NEAREST):de?w.copyTexSubImage3D(Et,vt,Lt,le,ye+pe,It,Wt,bt,_t):w.copyTexSubImage2D(Et,vt,Lt,le,It,Wt,bt,_t);st.bindFramebuffer(w.READ_FRAMEBUFFER,null),st.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else de?M.isDataTexture||M.isData3DTexture?w.texSubImage3D(Et,vt,Lt,le,ye,bt,_t,wt,he,Ie,xe.data):U.isCompressedArrayTexture?w.compressedTexSubImage3D(Et,vt,Lt,le,ye,bt,_t,wt,he,xe.data):w.texSubImage3D(Et,vt,Lt,le,ye,bt,_t,wt,he,Ie,xe):M.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,vt,Lt,le,bt,_t,he,Ie,xe.data):M.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,vt,Lt,le,xe.width,xe.height,he,xe.data):w.texSubImage2D(w.TEXTURE_2D,vt,Lt,le,bt,_t,he,Ie,xe);st.pixelStorei(w.UNPACK_ROW_LENGTH,Ge),st.pixelStorei(w.UNPACK_IMAGE_HEIGHT,ie),st.pixelStorei(w.UNPACK_SKIP_PIXELS,Ze),st.pixelStorei(w.UNPACK_SKIP_ROWS,gn),st.pixelStorei(w.UNPACK_SKIP_IMAGES,zn),vt===0&&U.generateMipmaps&&w.generateMipmap(Et),st.unbindTexture()},this.initRenderTarget=function(M){T.get(M).__webglFramebuffer===void 0&&_.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?_.setTextureCube(M,0):M.isData3DTexture?_.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?_.setTexture2DArray(M,0):_.setTexture2D(M,0),st.unbindTexture()},this.resetState=function(){X=0,W=0,N=null,st.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}const Zc=765,$c=503,Qy=4,Wi=512,pi=334,sf=253,rf=142,af=23,of=rf+af,cf=pi+of,oa=249,Ws=(sf-oa)/2,lf=164,uf=29,tE=48,eE=172,nE=156,iE=8,Jc=Ws+uf,Gi=146,sE=13,rE=8,aE=Jc+sE,oE=Jc+2,cE=2,lE=32,uE=oa,hE=Ws,dE=oa,fE=Ws,hf=37,pE=2,mE=7,df=cf-lf,ff=df-hf*pE,pf=26,mf=190,gE=ff,gf=pf*2+mf,_E=Ws+Math.round((oa-gf)/2),Wu=Math.PI/2;function xE(n,t,e,i){const s=c=>{const l=n.getBoundingClientRect();return{x:(c.clientX-l.left)/l.width*Wi,y:(c.clientY-l.top)/l.height*pi}},r=c=>{const{x:l,y:u}=s(c),d=i(l,u);t(d.x,d.y)},a=c=>{if(c.button!==0)return;c.preventDefault();const{x:l,y:u}=s(c),d=i(l,u);e(d.x,d.y)},o=()=>{t(NaN,NaN)};return n.addEventListener("pointermove",r),n.addEventListener("pointerdown",a),n.addEventListener("pointerleave",o),()=>{n.removeEventListener("pointermove",r),n.removeEventListener("pointerdown",a),n.removeEventListener("pointerleave",o)}}const Be={deepWater:2648208,shallow:3836072,reefExposed:4884640,reefSubmerged:3174544,sand:13217914,grass:5081660,coralSolid:6965848,tideZone:3442856},Xu=.25,ja=.85,vE=.55,ME=.24,Sr=.5,yr=.45,SE=.3;function ca(n){return Math.min(1,Math.max(0,n))}function un(n){const t=ca(n);return .5-.5*Math.cos(Math.PI*t)}function pc(n,t){return Math.hypot(n,t)<1e-6?null:Math.atan2(t,n)}function Yu(n,t,e){const i=Math.PI*2;let s=(t-n)%i;return s>Math.PI&&(s-=i),s<-Math.PI&&(s+=i),n+s*ca(e)}function _f(n){return pc(n.end.x-n.start.x,n.end.y-n.start.y)??pc(n.start.x-n.entry.x,n.start.y-n.entry.y)}function yE(n,t){const e=_f(n);if(e===null)return null;const i=pc(n.start.x-n.entry.x,n.start.y-n.entry.y)??e;if(t<=Un)return Yu(i,e,un(t/Un));if(t>=ja){const s=tn(en(e))*Math.PI/180;return Yu(e,s,(t-ja)/(1-ja))}return e}function EE(n,t){const e=n.zoneRadius,i=Math.sin(t*Math.PI),s=un(t/Xu)*un((1-t)/Xu);return{liftY:e*.26+i*e*.05,pitch:0,roll:n.rideSide*s*.12,yawOffset:n.rideSide*s*(Math.PI/2),offsetX:0,offsetY:0,riderLean:-s*.1}}function TE(n,t){const e=n.zoneRadius,i=e*.9;let s=0;if(t<.26){const a=t/.26;s=un(a)*e*.58}else if(t<.5){const a=(t-.26)/.24;s=e*.58+un(a)*(i-e*.58)}else{const a=(t-.5)/.5;s=i-un(a)*(i-e*.1)}const r=.3*Math.cos(t*Math.PI);return{liftY:s,pitch:r,roll:0,yawOffset:0,offsetX:0,offsetY:0,riderLean:r*.4}}function bE(n,t){const e=n.zoneRadius,i=Math.sin(t*Math.PI);return{liftY:-i*e*.1,pitch:-i*.08,roll:0,yawOffset:0,offsetX:0,offsetY:0,riderLean:-i*.5}}function AE(n,t){const e=n.zoneRadius,i=e*.34,s=Math.sin(t*Math.PI),r=_f(n)??n.rotationRadians,a={x:-Math.sin(r),y:Math.cos(r)},o=n.rideSide;return{liftY:e*.14+s*e*.42,pitch:0,roll:o*(.38+s*.12),yawOffset:0,offsetX:a.x*o*i*s,offsetY:a.y*o*i*s,riderLean:-s*.12}}function RE(n,t){const e=n.zoneRadius,i=e*vE,s=i*ME,r=Un;let a,o;if(t<r){const c=t/r;a=un(c)*s,o=yr*un(c)}else if(t<Sr){const c=(t-r)/(Sr-r);a=s+un(c)*(i-s),o=yr}else{const c=(t-Sr)/(1-Sr);a=i*(1-un(c))+e*SE*Math.sin(Math.PI*c);const l=un(c/.92);o=yr-l*(Math.PI*2+yr)}return{liftY:a,pitch:o,roll:0,yawOffset:0,offsetX:0,offsetY:0,riderLean:o*.9}}function wE(n){const t=ca(n)*Math.PI*2;return{liftY:.06+Math.sin(n*Math.PI)*.1,pitch:Math.sin(t)*.06,roll:Math.sin(t)*.35,yawOffset:t*.12,travelYawRadians:null,offsetX:0,offsetY:0,riderLean:Math.cos(t)*.18}}function CE(n){const t=ca(n.progress);return{...(()=>{switch(n.type){case"rail":return EE(n,t);case"brain_coral":return TE(n,t);case"tunnel":return bE(n,t);case"wall_ride":return AE(n,t);case"jump":return RE(n,t);default:return{liftY:0,pitch:0,roll:0,yawOffset:0,offsetX:0,offsetY:0,riderLean:0}}})(),travelYawRadians:yE(n,t)}}function qe(n,t,e=0){return{x:n,y:e,z:t}}function PE(n){return{x:n.x,y:n.z}}function mc(n){return-tn(n)*Math.PI/180}function xf(n){return-n}const Qa=13145182,IE=3829413,LE=4860946,jc=5917238,DE=13213798,NE=16041282,UE=11027500,FE=6044190,OE=16033721,kE=16777215,qu=[{shirt:2984558,hair:2758672,boardWood:12093514,boardStripe:15258698},{shirt:9055566,hair:1839628,boardWood:13213798,boardStripe:6734568},{shirt:6971317,hair:3811864,boardWood:10123850,boardStripe:16033721},{shirt:12755516,hair:2365968,boardWood:12093514,boardStripe:9429114},{shirt:14700600,hair:1314828,boardWood:15919832,boardStripe:14698568}],BE=.05;function Ku(n,t,e,i,s,r=null){const a=i?CE(i):r!==null?wE(r):null,o=qe(n+((a==null?void 0:a.offsetX)??0),t+((a==null?void 0:a.offsetY)??0)),c=Nh(n,t,s),l=a!==null&&a.travelYawRadians!==null?xf(a.travelYawRadians):mc(e);return{worldX:o.x,worldZ:o.z,boardY:c+((a==null?void 0:a.liftY)??0),rotationY:l+((a==null?void 0:a.yawOffset)??0),pitch:(a==null?void 0:a.pitch)??0,roll:(a==null?void 0:a.roll)??0,riderLean:(a==null?void 0:a.riderLean)??0}}function Zu(n,t,e){n.position.set(e.worldX,e.boardY,e.worldZ),n.rotation.set(e.roll,e.rotationY,e.pitch),t.position.set(e.worldX,e.boardY+BE,e.worldZ),t.rotation.set(e.roll*.35,e.rotationY,e.riderLean)}function vf(n,t=.9){return new Ye({color:n,roughness:t,flatShading:!0})}function cn(n,t,e,i,s,r,a){const o=new $t(new be(n,t,e),vf(i));return o.position.set(s,r,a),o}function Qc(n,t=1){const e=new me;return e.add(cn(.09,.18,.08,n.pants,0,.09,-.055),cn(.09,.18,.08,n.pants,0,.09,.055),cn(.13,.24,.22,n.shirt,0,.3,0),cn(.08,.2,.07,n.shirt,0,.32,-.145),cn(.08,.2,.07,n.shirt,0,.32,.145),cn(.06,.05,.06,Qa,0,.195,-.145),cn(.06,.05,.06,Qa,0,.195,.145),cn(.12,.13,.12,Qa,0,.485,0)),n.hair!==null&&e.add(cn(.13,.05,.13,n.hair,-.005,.565,0)),e.scale.setScalar(t),e}function HE(){const n=new Gd;n.moveTo(-.62,-.13),n.lineTo(-.3,-.22),n.lineTo(.22,-.2),n.lineTo(.58,-.08),n.lineTo(.68,0),n.lineTo(.58,.08),n.lineTo(.22,.2),n.lineTo(-.3,.22),n.lineTo(-.62,.13),n.closePath();const t=new qc(n,{depth:.07,bevelEnabled:!1});return t.rotateX(-Math.PI/2),t.translate(0,-.035,0),t}function gc(n=DE,t=NE){const e=new me,i=new $t(HE(),vf(n,.8)),s=cn(.95,.02,.09,t,0,.04,0),r=cn(.1,.12,.03,n,-.48,-.08,0);return e.add(i,s,r),e}function GE(){return Qc({shirt:IE,pants:jc,hair:LE})}function Mf(n,t){const e=new me,i=new $t(new ji(.5,.5,.02,16),new Ye({color:OE,transparent:!0,opacity:n}));i.scale.set(1.9,1,.8);const s=new $t(new ji(.42,.42,.02,16),new Ye({color:kE,transparent:!0,opacity:t}));return s.scale.set(1.6,1,.65),e.add(i,s),e.visible=!1,e}function zE(n){const t=gc(n.boardWood,n.boardStripe),e=Qc({shirt:n.shirt,pants:jc,hair:n.hair});return t.rotation.order="YXZ",e.rotation.order="YXZ",t.visible=!1,e.visible=!1,{board:t,rider:e,wake:Mf(.32,.28)}}function VE(){return Qc({shirt:UE,pants:jc,hair:FE},1.1)}class WE{constructor(){z(this,"root",new me);z(this,"ridingBoard",gc());z(this,"dockBoard",gc());z(this,"player",GE());z(this,"wake",Mf(.4,.35));z(this,"demoSurferPool",[]);z(this,"npcPool",[]);this.root.add(this.ridingBoard,this.dockBoard,this.player,this.wake);for(const t of[this.ridingBoard,this.player])t.rotation.order="YXZ"}sync(t,e){const i=yn(e,Math.floor(t.surfboard.position.x),Math.floor(t.surfboard.position.y)),s=t.surfboard.speedState==="seated"&&i==="sand",r=s?0:tn(t.surfboard.currentHeading)*Math.PI/180,a=Ku(t.surfboard.position.x,t.surfboard.position.y,t.surfboard.currentHeading,t.trickAnimation,t.tide),o=s?0:mc(t.surfboard.currentHeading),c=a.boardY;if(this.ridingBoard.visible=t.boardMounted,this.dockBoard.visible=!t.boardMounted,this.player.visible=!0,this.syncNpcs(t,e),this.syncDemoSurfers(t),!t.boardMounted){const u=qe(t.boardDockX,t.boardDockY),d=qe(t.surfboard.position.x,t.surfboard.position.y),h=zi(t.boardDockX,t.boardDockY,"sand"),f=yn(e,Math.floor(t.surfboard.position.x),Math.floor(t.surfboard.position.y)),g=f==="grass"||f==="sand"?zi(t.surfboard.position.x,t.surfboard.position.y,f):h;this.dockBoard.position.set(u.x,h,u.z),this.dockBoard.rotation.set(0,0,0),this.player.position.set(d.x,g,d.z),this.player.rotation.set(0,mc(t.surfboard.currentHeading),0),this.ridingBoard.position.set(0,-100,0);return}Zu(this.ridingBoard,this.player,a),this.dockBoard.position.set(0,-100,0);const l=t.surfboard.speedState==="riding"&&t.trickAnimation===null;if(this.wake.visible=l,l){const u=r+Math.PI;this.wake.position.set(a.worldX+Math.cos(u)*.85,c+.02,a.worldZ+Math.sin(u)*.85),this.wake.rotation.set(0,o,0)}}syncDemoSurfers(t){for(;this.demoSurferPool.length<t.demoSurfers.length;){const e=qu[this.demoSurferPool.length%qu.length],i=zE(e);this.demoSurferPool.push(i),this.root.add(i.board,i.rider,i.wake)}for(let e=0;e<this.demoSurferPool.length;e+=1){const i=this.demoSurferPool[e],s=t.demoSurfers[e];if(!s){i.board.visible=!1,i.rider.visible=!1,i.wake.visible=!1;continue}const r=Ku(s.surfboard.position.x,s.surfboard.position.y,s.surfboard.currentHeading,s.trickAnimation,t.tide,s.tideSpinProgress),a=tn(s.surfboard.currentHeading)*Math.PI/180;i.board.visible=!0,i.rider.visible=!0,Zu(i.board,i.rider,r);const o=s.trickAnimation===null&&(s.surfboard.speedState==="riding"||s.tideSpinProgress!==null);if(i.wake.visible=o,o){const c=a+Math.PI;i.wake.position.set(r.worldX+Math.cos(c)*.85,r.boardY+.02,r.worldZ+Math.sin(c)*.85),i.wake.rotation.set(0,r.rotationY,0)}}}syncNpcs(t,e){for(;this.npcPool.length<t.npcs.length;){const i=VE();this.npcPool.push(i),this.root.add(i)}for(let i=0;i<this.npcPool.length;i+=1){const s=this.npcPool[i];if(i>=t.npcs.length){s.visible=!1;continue}const r=t.npcs[i];s.visible=!0;const a=qe(r.x,r.y),o=yn(e,Math.floor(r.x),Math.floor(r.y)),c=o==="grass"||o==="sand"?zi(r.x,r.y,o):zi(r.x,r.y,"sand");s.position.set(a.x,c,a.z)}}dispose(){this.root.traverse(t=>{t instanceof $t&&(t.geometry.dispose(),t.material.dispose())})}}function Sf(n,t,e,i){return n==="coral_rideable"&&i!==null?Ih(t,e,i)/ns>.35?"reef_submerged":"reef_exposed":n}function Zr(n){switch(n){case"deep_water":return Be.deepWater;case"shallow":return Be.shallow;case"reef_exposed":return Be.reefExposed;case"reef_submerged":return Be.reefSubmerged;case"sand":return Be.sand;case"grass":return Be.grass;case"coral_solid":return Be.coralSolid;case"tide_zone":return Be.tideZone;default:return Be.deepWater}}const vn=new ae,to=28,$u=.08,Er=52,XE=.38,eo=8,no=4;function _c(n,t,e){var i,s;return e?((i=n.outerRadiusAtAngle)==null?void 0:i.call(n,t))??n.outerRadius:((s=n.innerRadiusAtAngle)==null?void 0:s.call(n,t))??n.innerRadius}function YE(n,t,e){const i=_c(n,t,!1),s=_c(n,t,!0);return i+(s-i)*e}function qE(n,t,e){const i=fe(e?t+.04:t-.04);return Dh(i,n)}class KE{constructor(){z(this,"root",new me);z(this,"leading",null);z(this,"trailing",null);z(this,"washBody",null);z(this,"washCrest",null);z(this,"capacity",0);z(this,"washCapacity",0);const t=new Ye({color:15268095,transparent:!0,opacity:.75,roughness:.3,metalness:.05}),e=new Ye({color:9357536,transparent:!0,opacity:.45,roughness:.5,metalness:.05}),i=new Ye({color:16777215,transparent:!0,opacity:.94,roughness:.14,metalness:.02,emissive:13691647,emissiveIntensity:.24}),s=new Ye({color:16777215,transparent:!0,opacity:.82,roughness:.1,metalness:.04,emissive:16777215,emissiveIntensity:.14});this.capacity=to*4;const r=Math.max(.35,ho*.08);this.leading=new fi(new be(1,r,.08),t,this.capacity),this.trailing=new fi(new be(1,r,.08),e,this.capacity),this.washCapacity=Er*eo*no*2,this.washBody=new fi(new be(1,1,1),i,this.washCapacity),this.washCrest=new fi(new be(1,1,1),s,this.washCapacity),this.leading.visible=!1,this.trailing.visible=!1,this.washBody.visible=!1,this.washCrest.visible=!1,this.root.add(this.leading,this.trailing,this.washBody,this.washCrest)}sync(t){if(!t||!this.leading||!this.trailing||!this.washBody||!this.washCrest){for(const o of[this.leading,this.trailing,this.washBody,this.washCrest])o&&(o.visible=!1);return}const e=qe(t.centerX,t.centerY),i=Math.max(.35,ho*.08),s=[{angle:t.phaseRadians,leading:!0},{angle:fe(t.phaseRadians+t.sweepRadians),leading:!1}];let r=0,a=0;for(const o of s){const c=qE(t,o.angle,o.leading),l=o.leading?.18:.14,u=o.leading?this.leading:this.trailing;let d=o.leading?r:a;for(const h of[!1,!0]){const f=_c(t,o.angle,h);for(let g=0;g<=to&&!(d>=this.capacity);g+=1){const S=o.angle+l*(g/to-.5),p=f+(h?$u:-$u),m=e.x+Math.cos(S)*p,v=e.z+Math.sin(S)*p,E=Ph(o.leading?.04:.96),y=o.leading?.75+c*.9:.45+c*.55;y<.05?vn.makeScale(0,0,0):vn.makeScale(y,i*(.8+c*1.1),y*.65),vn.setPosition(m,E+i*.45,v),u.setMatrixAt(d,vn),d+=1}}o.leading?r=d:a=d}this.leading.count=r,this.leading.instanceMatrix.needsUpdate=!0,this.leading.visible=r>0,this.trailing.count=a,this.trailing.instanceMatrix.needsUpdate=!0,this.trailing.visible=a>0,this.syncCurlingWash(t,e)}syncCurlingWash(t,e){if(!this.washBody||!this.washCrest)return;const i=fe(t.phaseRadians+t.sweepRadians),s=ns;let r=0,a=0;for(let o=0;o<no;o+=1){const c=o/no,l=fe(i-c*.06),u=1-c*.22;for(let d=0;d<=Er;d+=1){const h=l+XE*(d/Er-.5),f=1-Math.abs(d/Er-.5)*1.15;for(let g=0;g<eo&&!(r>=this.washCapacity||a>=this.washCapacity);g+=1){const S=(g+.5)/eo,p=YE(t,h,S),m=e.x+Math.cos(h)*p,v=e.z+Math.sin(h)*p,E=s*u*(.9+g%3*.05)*f,y=1.55+S*1.05-c*.2,P=.72+S*.38;vn.makeScale(y,E,P),vn.setPosition(m,E*.5,v),this.washBody.setMatrixAt(r,vn),r+=1;const b=E*.32,C=E*.92,x=c*.35+S*.12,A=e.x+Math.cos(h-x)*(p-.15),I=e.z+Math.sin(h-x)*(p-.15);vn.makeScale(y*1.6,b,P*1.4),vn.setPosition(A,C+b*.42,I),this.washCrest.setMatrixAt(a,vn),a+=1}}}this.washBody.count=r,this.washBody.instanceMatrix.needsUpdate=!0,this.washBody.visible=r>0,this.washCrest.count=a,this.washCrest.instanceMatrix.needsUpdate=!0,this.washCrest.visible=a>0}dispose(){for(const t of[this.leading,this.trailing,this.washBody,this.washCrest])t&&(t.geometry.dispose(),t.material.dispose(),t.removeFromParent());this.leading=null,this.trailing=null,this.washBody=null,this.washCrest=null}}const Xi=.06,Tr=Xi/2,ZE=.35,Je=new ae,$E=.01,JE=.08,jE=.35,Ju=new ae().makeScale(0,0,0),QE=new Set(["coral_rideable","shallow"]),ju=new te(Be.reefExposed),tT=new te(Be.reefSubmerged);function Qu(n,t){const e=new Map;for(let i=0;i<n.heightTiles;i+=1)for(let s=0;s<n.widthTiles;s+=1){const r=n.tiles[i][s];let a=null;if(t&&(r==="grass"||r==="sand"))a=Zr(r);else if(!t&&r!=="deep_water"&&r!=="grass"&&r!=="sand"&&r!=="coral_rideable"){const c=Sf(r,s+.5,i+.5,null);a=Zr(c)}if(a===null)continue;const o=e.get(a)??[];o.push({tx:s,ty:i}),e.set(a,o)}return e}function eT(n){const t=[];for(let e=0;e<n.heightTiles;e+=1)for(let i=0;i<n.widthTiles;i+=1)n.tiles[e][i]==="coral_rideable"&&t.push({tx:i,ty:e});return t}function nT(n,t,e){return e==="grass"||e==="sand"?zi(n+.5,t+.5,e):Xi}function th(n,t,e,i){const s=[];for(const[r,a]of n){const o=new fi(new be(1,1,1),new Ye({color:r}),a.length);o.castShadow=!1,o.receiveShadow=!1;for(let c=0;c<a.length;c+=1){const{tx:l,ty:u}=a[c],d=t.tiles[u][l],h=i.landElevation?nT(l,u,d):i.flatHeight,f=i.landElevation?h/2:i.flatCenterY;Je.makeScale(1,h,1),Je.setPosition(l+.5,f,u+.5),o.setMatrixAt(c,Je),QE.has(d)&&e.push({tx:l,ty:u,mesh:o,index:c,baseCenterY:f,tileHeight:h,angle:0,inRing:!0,lastWave:Number.NaN})}o.instanceMatrix.needsUpdate=!0,s.push(o)}return s}function io(n){for(const t of n)t.geometry.dispose(),t.material.dispose()}class iT{constructor(){z(this,"root",new me);z(this,"tideEdges",new KE);z(this,"water",null);z(this,"landMeshes",[]);z(this,"overlayMeshes",[]);z(this,"tideAnimInstances",[]);z(this,"waterCaps",null);z(this,"coralMesh",null);z(this,"coralTiles",[]);z(this,"coralSubmerged",new Uint8Array(0));z(this,"polarReady",!1);z(this,"mapKey",null);this.root.add(this.tideEdges.root)}build(t,e){const i=`${t.widthTiles}x${t.heightTiles}:${vm()}`;if(this.mapKey===i)return;this.destroy();const s=new Ye({color:Be.deepWater,roughness:.85,metalness:.05});this.water=new $t(new Vs(t.widthTiles,t.heightTiles),s),this.water.rotation.x=-Math.PI/2,this.water.position.set(t.widthTiles/2,0,t.heightTiles/2),this.water.receiveShadow=!0,this.root.add(this.water);const r=Qu(t,!0);this.landMeshes=th(r,t,[],{landElevation:!0,flatHeight:Xi,flatCenterY:Tr});for(const a of this.landMeshes)this.root.add(a);this.rebuildOverlay(t,e),this.mapKey=i}rebuildOverlay(t,e){for(const s of this.overlayMeshes)this.root.remove(s);io(this.overlayMeshes),this.overlayMeshes=[],this.waterCaps&&(this.root.remove(this.waterCaps),this.waterCaps.geometry.dispose(),this.waterCaps.material.dispose(),this.waterCaps=null),this.coralMesh&&(this.root.remove(this.coralMesh),this.coralMesh.geometry.dispose(),this.coralMesh.material.dispose(),this.coralMesh=null),this.tideAnimInstances=[];const i=Qu(t,!1);this.overlayMeshes=th(i,t,this.tideAnimInstances,{landElevation:!1,flatHeight:Xi,flatCenterY:Tr});for(const s of this.overlayMeshes)this.root.add(s);if(this.buildCoralMesh(t),this.tideAnimInstances.length>0){this.waterCaps=new fi(new be(1,1,1),new Ye({color:Be.shallow,transparent:!0,opacity:.62,roughness:.35,metalness:.1}),this.tideAnimInstances.length);for(let s=0;s<this.tideAnimInstances.length;s+=1)this.waterCaps.setMatrixAt(s,Ju);this.waterCaps.instanceMatrix.needsUpdate=!0,this.root.add(this.waterCaps)}this.polarReady=!1,this.updateTideVisuals(t,e)}buildCoralMesh(t){if(this.coralTiles=eT(t),this.coralSubmerged=new Uint8Array(this.coralTiles.length).fill(255),this.coralTiles.length===0)return;const e=new fi(new be(1,1,1),new Ye({color:16777215}),this.coralTiles.length);e.castShadow=!1,e.receiveShadow=!1;for(let i=0;i<this.coralTiles.length;i+=1){const{tx:s,ty:r}=this.coralTiles[i];Je.makeScale(1,Xi,1),Je.setPosition(s+.5,Tr,r+.5),e.setMatrixAt(i,Je),e.setColorAt(i,ju),this.tideAnimInstances.push({tx:s,ty:r,mesh:e,index:i,baseCenterY:Tr,tileHeight:Xi,angle:0,inRing:!0,lastWave:Number.NaN})}e.instanceMatrix.needsUpdate=!0,this.coralMesh=e,this.root.add(e)}initPolarCache(t){var e,i;for(const s of this.tideAnimInstances){const r=s.tx+.5-t.centerX,a=s.ty+.5-t.centerY,o=Math.hypot(r,a);s.angle=Math.atan2(a,r);const c=((e=t.innerRadiusAtAngle)==null?void 0:e.call(t,s.angle))??t.innerRadius,l=((i=t.outerRadiusAtAngle)==null?void 0:i.call(t,s.angle))??t.outerRadius;s.inRing=o>=c-.5&&o<=l+.5,s.lastWave=Number.NaN}this.polarReady=!0}updateTideVisuals(t,e){var a;e&&!this.polarReady&&this.initPolarCache(e);const i=new Set;let s=!1,r=!1;for(let o=0;o<this.tideAnimInstances.length;o+=1){const c=this.tideAnimInstances[o],l=e&&c.inRing?yc(c.angle,e):0;if(Math.abs(l-c.lastWave)<$E)continue;c.lastWave=l;const u=l/ns,d=c.baseCenterY-u*uo;if(Je.makeScale(1,c.tileHeight,1),Je.setPosition(c.tx+.5,d,c.ty+.5),c.mesh.setMatrixAt(c.index,Je),i.add(c.mesh),this.waterCaps){if(l<JE)this.waterCaps.setMatrixAt(o,Ju);else{const h=c.baseCenterY-c.tileHeight/2-u*uo,f=Math.max(ZE,l-h);Je.makeScale(1,f,1),Je.setPosition(c.tx+.5,h+f/2,c.ty+.5),this.waterCaps.setMatrixAt(o,Je)}s=!0}if(this.coralMesh&&c.mesh===this.coralMesh){const h=u>jE?1:0;this.coralSubmerged[c.index]!==h&&(this.coralSubmerged[c.index]=h,this.coralMesh.setColorAt(c.index,h?tT:ju),r=!0)}}for(const o of i)o.instanceMatrix.needsUpdate=!0;s&&this.waterCaps&&(this.waterCaps.instanceMatrix.needsUpdate=!0),r&&((a=this.coralMesh)!=null&&a.instanceColor)&&(this.coralMesh.instanceColor.needsUpdate=!0),this.tideEdges.sync(e)}setWaterScroll(t,e){if(!this.water)return;const i=this.water.material;i.map=null}destroy(){this.water&&(this.water.geometry.dispose(),this.water.material.dispose(),this.root.remove(this.water),this.water=null);for(const t of this.landMeshes)this.root.remove(t);io(this.landMeshes),this.landMeshes=[];for(const t of this.overlayMeshes)this.root.remove(t);io(this.overlayMeshes),this.overlayMeshes=[],this.waterCaps&&(this.root.remove(this.waterCaps),this.waterCaps.geometry.dispose(),this.waterCaps.material.dispose(),this.waterCaps=null),this.coralMesh&&(this.root.remove(this.coralMesh),this.coralMesh.geometry.dispose(),this.coralMesh.material.dispose(),this.coralMesh=null),this.coralTiles=[],this.coralSubmerged=new Uint8Array(0),this.tideAnimInstances=[],this.polarReady=!1,this.tideEdges.sync(null),this.mapKey=null}}const sT=Math.PI*.75,rT=.55,aT=28,eh=.15,nh=1.45,oT=8,cT=160,ih=1.8,sh=1.2,rh=.004,lT=.08,uT=.6;class hT{constructor(t){z(this,"camera");z(this,"yaw",sT);z(this,"pitch",rT);z(this,"distance",aT);z(this,"focusTarget",new L);z(this,"focusCurrent",new L);z(this,"focusInitialized",!1);z(this,"scratch",new L);z(this,"middleMouseDragging",!1);z(this,"lastPointerX",0);z(this,"lastPointerY",0);z(this,"arrowLeft",!1);z(this,"arrowRight",!1);z(this,"arrowUp",!1);z(this,"arrowDown",!1);this.camera=new Qe(50,t,.1,500)}setAspect(t){this.camera.aspect=t,this.camera.updateProjectionMatrix()}setFocus(t,e){const i=qe(t,e,uT);this.focusTarget.set(i.x,i.y,i.z),this.focusInitialized||(this.focusCurrent.copy(this.focusTarget),this.focusInitialized=!0)}update(t){const e=1-Math.exp(-10*t);this.focusCurrent.lerp(this.focusTarget,e),this.arrowLeft&&(this.yaw+=ih*t),this.arrowRight&&(this.yaw-=ih*t),this.arrowUp&&(this.pitch=Math.min(nh,this.pitch+sh*t)),this.arrowDown&&(this.pitch=Math.max(eh,this.pitch-sh*t));const i=Math.cos(this.pitch),s=Math.sin(this.pitch),r=Math.cos(this.yaw),a=Math.sin(this.yaw);this.scratch.set(this.distance*i*r,this.distance*s,this.distance*i*a),this.camera.position.copy(this.focusCurrent).add(this.scratch),this.camera.lookAt(this.focusCurrent)}handleKeyDown(t){switch(t){case"ArrowLeft":return this.arrowLeft=!0,!0;case"ArrowRight":return this.arrowRight=!0,!0;case"ArrowUp":return this.arrowUp=!0,!0;case"ArrowDown":return this.arrowDown=!0,!0;default:return!1}}handleKeyUp(t){switch(t){case"ArrowLeft":return this.arrowLeft=!1,!0;case"ArrowRight":return this.arrowRight=!1,!0;case"ArrowUp":return this.arrowUp=!1,!0;case"ArrowDown":return this.arrowDown=!1,!0;default:return!1}}onPointerDown(t){t.button===1&&(t.preventDefault(),this.middleMouseDragging=!0,this.lastPointerX=t.clientX,this.lastPointerY=t.clientY)}onPointerMove(t){if(!this.middleMouseDragging)return;const e=t.clientX-this.lastPointerX,i=t.clientY-this.lastPointerY;this.lastPointerX=t.clientX,this.lastPointerY=t.clientY,this.yaw+=e*rh,this.pitch=Math.max(eh,Math.min(nh,this.pitch+i*rh))}onPointerUp(t){t.button===1&&this.endMiddleMouseDrag()}onPointerCancel(){this.endMiddleMouseDrag()}endMiddleMouseDrag(){this.middleMouseDragging=!1}onWheel(t){const e=1+t*lT*.001;this.distance=Math.max(oT,Math.min(cT,this.distance*e))}getCompassRotationRadians(){return Wu-this.yaw}getViewFacingRadians(){return this.yaw+Math.PI}snapNorth(){this.yaw=Wu}}const xs=.2,dT=1.4,ah=.9;function fT(n,t,e=1){const i=new Oe;return i.setAttribute("position",new Me(n,3)),new c_(i,new Nd({color:t,transparent:e<1,opacity:e}))}class pT{constructor(){z(this,"root",new me);z(this,"walkClick",new me);z(this,"tide",new me);z(this,"facing",new me);z(this,"headingArrow",new me);z(this,"intendedGhost",new me);z(this,"lines",[]);this.root.add(this.walkClick,this.tide,this.facing,this.headingArrow,this.intendedGhost)}sync(t,e){this.clearDynamic(),this.drawWalkClick(t),this.drawTide(t),this.drawFacing(t,e),this.drawHeadingArrow(t),this.drawIntendedGhost(t)}clearDynamic(){for(const t of this.lines)t.geometry.dispose(),t.material.dispose(),t.removeFromParent();this.lines=[],this.walkClick.clear(),this.tide.clear(),this.facing.clear(),this.headingArrow.clear(),this.intendedGhost.clear()}addLine(t,e,i,s=1){const r=fT(e,i,s);t.add(r),this.lines.push(r)}drawWalkClick(t){if(t.boardMounted||t.walkTargetTx===null||t.walkTargetTy===null)return;const e=t.walkTargetTx,i=t.walkTargetTy,s=t.walkClickValid?16776960:16729156,r=.15;this.addLine(this.walkClick,[e+r,xs,i+r,e+1-r,xs,i+1-r],s),this.addLine(this.walkClick,[e+1-r,xs,i+r,e+r,xs,i+1-r],s)}drawTide(t){const e=t.tide;if(!e)return;const i=qe(e.centerX,e.centerY),s=[e.phaseRadians,fe(e.phaseRadians+e.sweepRadians)],r=.12,a=36;for(const o of s)for(const c of[e.innerRadius,e.outerRadius]){const l=[];for(let u=0;u<=a;u+=1){const d=o+r*(u/a-.5);l.push(i.x+Math.cos(d)*c,xs*.5,i.z+Math.sin(d)*c)}this.addLine(this.tide,l,12118271,.55)}}drawFacing(t,e){const i=qe(t.surfboard.position.x,t.surfboard.position.y);let s;if(!t.boardMounted){s=tn(t.surfboard.currentHeading)*Math.PI/180;const d=.35,h=i.y+.35;this.addLine(this.facing,[i.x,h,i.z,i.x+Math.cos(s)*d,h,i.z+Math.sin(s)*d],16777215);return}const r=yn(e,Math.floor(t.surfboard.position.x),Math.floor(t.surfboard.position.y));s=t.surfboard.speedState==="seated"&&r==="sand"?0:tn(t.surfboard.currentHeading)*Math.PI/180;const o=.55,c=i.x+Math.cos(s)*o,l=i.z+Math.sin(s)*o;this.addLine(this.facing,[i.x,i.y+.15,i.z,c,i.y+.15,l],16777215);const u=new $t(new sa(.01,.08,4,12),new zc({color:16777215}));u.position.set(c,i.y+.15,l),u.rotation.x=Math.PI/2,this.facing.add(u)}drawHeadingArrow(t){if(!t.boardMounted||t.hoverHeading===null||t.cursorWorldX===null||t.cursorWorldY===null)return;const e=qe(t.surfboard.position.x,t.surfboard.position.y),i=tn(t.hoverHeading)*Math.PI/180,s=e.x+Math.cos(i)*ah,r=e.z+Math.sin(i)*ah,a=t.clickValid?16777215:16729156;this.addLine(this.headingArrow,[e.x,e.y+.18,e.z,s,e.y+.18,r],a,.5);const o=dT*.5,c=s+Math.cos(i)*o,l=r+Math.sin(i)*o;this.addLine(this.headingArrow,[s,e.y+.18,r,c,e.y+.18,l],a)}drawIntendedGhost(t){if(!t.boardMounted||t.surfboard.currentHeading===t.surfboard.intendedHeading)return;const e=qe(t.surfboard.position.x,t.surfboard.position.y),i=tn(t.surfboard.intendedHeading)*Math.PI/180,s=.45;this.addLine(this.intendedGhost,[e.x,e.y+.16,e.z,e.x+Math.cos(i)*s,e.y+.16,e.z+Math.sin(i)*s],11193599,.6)}dispose(){this.clearDynamic()}}const mT=.06,gT=.2,tl="trick-hitbox",_T=1,yf=.55,xT=.12,Ef=.14,vT=2.2,MT=.5;function ST(n,t){switch(n){case"tunnel":return t*(Sc+jr+mp);case"wall_ride":return t*1.125;case"brain_coral":return t*.8;case"jump":return t*(yf+Ef*.5);case"rail":default:return t*.57}}function yT(n,t){return ST(n,t)+mT+gT}function Tf(n,t){return t?Nh(n.center.x,n.center.y,t)-Rr:0}function ET(n,t,e,i){const s=Tf(n,t);if(!i)return s;const r=Ap(n,t,e);return s-r*yT(n.type,n.radius)}function TT(n){switch(n){case"rail":return{base:16033721,accent:16041282};case"tunnel":return{base:10185727,accent:13219071};case"jump":return{base:16747586,accent:16769126};case"brain_coral":return{base:16740020,accent:16752338};case"wall_ride":return{base:7260415,accent:12117759};default:return{base:16033721,accent:16041282}}}function pn(n,t){return new Ye({color:n,transparent:t<1,opacity:t,roughness:.7,metalness:.1,flatShading:!0})}function bT(n,t,e,i){const s=n.getObjectByName(tl);{s&&(s.visible=!1);return}}function oh(n,t,e){const i=new me,s=n*.24,r=new $t(new be(n*2.3,n*.08,n*.12),pn(t.accent,e));r.position.y=s;for(const a of[-1,1]){const o=new $t(new be(n*.14,s,n*.14),pn(t.base,e));o.position.set(a*n*.85,s/2,0);const c=new $t(new be(n*.3,n*.06,n*.3),pn(t.base,e));c.position.set(a*n*.85,n*.03,0),i.add(o,c)}return i.add(r),i}function AT(n,t,e){const i=new me,s=new $t(new sa(n*Sc,n*jr,6,12,Math.PI),pn(t.accent,e));return s.scale.set(1,1,Sh),s.position.y=n*yh,i.add(s),i.rotation.y=Math.PI/2,i}function ch(n,t,e,i){const s=n*_T,r=n*yf,a=n*xT,o=n*Ef,c=n*vT,l=r+a,u=Math.atan2(l,s),d=s*MT,h=s+d,f=o/2*Math.cos(u)+h/2*Math.sin(u),g=r-f,S=-t*(o/2*Math.sin(u)-h/2*Math.cos(u)),p=new $t(new be(c,o,h),pn(e.base,i));return p.position.set(0,g,S),p.rotation.x=t*u,p}function RT(n,t,e){const i=new me;return i.add(ch(n,-1,t,e),ch(n,1,t,e)),i.rotation.y=Math.PI/2,i}function wT(n,t,e){const i=new me,s=new $t(new ws(n*.55,1),pn(t.base,e));s.position.y=n*.32,s.scale.y=.8;const r=new $t(new ws(n*.3,0),pn(t.accent,e));r.position.set(n*.25,n*.48,n*.15);const a=new $t(new ws(n*.2,0),pn(t.accent,e));return a.position.set(-n*.28,n*.42,-n*.18),i.add(s,r,a),i}function CT(n,t,e){const i=new me,s=new $t(new be(n*.24,n*1.15,n*1.35),pn(t.base,e));s.position.set(0,n*.48,0);const r=new $t(new be(n*.34,n*.14,n*1.45),pn(t.accent,e));return r.position.y=n*1.02,i.add(s,r),i.rotation.y=Math.PI/2,i}function PT(n,t,e,i){switch(n){case"rail":return oh(t,e,i);case"tunnel":return AT(t,e,i);case"jump":return RT(t,e,i);case"brain_coral":return wT(t,e,i);case"wall_ride":return CT(t,e,i);default:return oh(t,e,i)}}function IT(n,t,e,i){const s=pn(16774502,i*.9),r=t==="jump"?[-1,1]:[1];for(const a of r){const o=new me;o.rotation.y=Math.PI/2;for(const c of[-.72,-.52,-.32]){const l=new $t(new Os(e*.15,e*.25,3),s);l.rotation.x=Math.PI,l.rotation.z=Math.PI,l.position.set(0,e*.08,a*(e*c+e*.22)),o.add(l)}n.add(o)}}function LT(n){const t=n.children.filter(e=>e.name!==tl);for(const e of t)n.remove(e),e.traverse(i=>{if(i instanceof $t){i.geometry.dispose();const s=i.material;Array.isArray(s)?s.forEach(r=>r.dispose()):s.dispose()}})}function DT(n,t,e){const i=!n.tricked&&!e&&t.trickPrepare!==null&&t.trickPrepare.slot===n.prepareSlot;return`${n.id}:${n.type}:${n.radius}:${i}`}function NT(n,t){n.traverse(e=>{if(e instanceof $t&&e.name!==tl){const i=e.material;i.opacity=t,i.transparent=t<1}})}class UT{constructor(){z(this,"root",new me);z(this,"pool",[]);z(this,"meshKeys",[])}sync(t,e=0){const i=t.tide,s=t.trickZones;for(;this.pool.length<s.length;){const r=new me;this.pool.push(r),this.meshKeys.push(""),this.root.add(r)}for(let r=0;r<this.pool.length;r+=1){const a=this.pool[r];if(r>=s.length){a.visible=!1;continue}const o=s[r];a.visible=!0;const c=i?ei(o,i):!1,u=Ah(o,i,e),d=DT(o,t,c);if(this.meshKeys[r]!==d){LT(a);const g=TT(o.type),S=PT(o.type,o.radius,g,u);a.add(S),!o.tricked&&!c&&t.trickPrepare!==null&&t.trickPrepare.slot===o.prepareSlot&&IT(a,o.type,o.radius,u),this.meshKeys[r]=d}else NT(a,u);const h=qe(o.center.x,o.center.y),f=ET(o,i,e,c);Tf(o,i),bT(a,o.type,o.radius),a.position.set(h.x,f,h.z),a.rotation.y=xf(o.rotationRadians+(o.rotationJitterRadians??0))}}dispose(){for(const t of this.pool)t.traverse(e=>{e instanceof $t&&(e.geometry.dispose(),e.material.dispose())});this.pool=[],this.root.clear()}}const FT=10189884,OT=8018984,kT=7031338,BT=12096616,HT=[{angle:Math.PI/2-.35,distanceShare:.55,footprint:5,facing:Math.PI/2},{angle:Math.PI/2+.55,distanceShare:.6,footprint:3.6,facing:Math.PI/2+.6},{angle:-2.7,distanceShare:.58,footprint:4.2,facing:-2.7},{angle:-.2,distanceShare:.5,footprint:3.2,facing:-.2}];function br(n){return new Ye({color:n,roughness:.9,flatShading:!0})}function GT(n){const t=new me,e=n*.05,i=n*.24,s=n*.38,r=n*.5,a=n*.36,o=new $t(new be(r*2.2,e,a*2.3),br(BT));o.position.y=e/2,t.add(o);for(const d of[-1,1])for(const h of[-1,1]){const f=new $t(new ji(n*.035,n*.045,i,5),br(kT));f.position.set(d*r*.85,e+i/2,h*a*.85),t.add(f)}const c=e+i,l=new $t(new Os(n*.78,s,4),br(FT));l.scale.set(1.25,1,.95),l.rotation.y=Math.PI/4,l.position.y=c+s/2,t.add(l);const u=new $t(new Os(n*.16,s*.28,4),br(OT));return u.rotation.y=Math.PI/4,u.position.y=c+s+s*.1,t.add(u),t}function zT(){const n=new me;for(const t of HT){const e=Ec(t.angle)*t.distanceShare,i=nn+Math.cos(t.angle)*e,s=sn+Math.sin(t.angle)*e,r=zi(i,s,"grass"),a=GT(t.footprint),o=qe(i,s);a.position.set(o.x,r,o.z),a.rotation.y=-t.facing+Math.PI/2,n.add(a)}return n}function VT(n){n.traverse(t=>{t instanceof $t&&(t.geometry.dispose(),t.material.dispose())})}const so=new L,ro=new L,ao=new pt,Hi=new L;class WT{constructor(){z(this,"renderer",null);z(this,"scene",null);z(this,"orbitCamera",null);z(this,"raycaster",new nx);z(this,"mapMeshes",null);z(this,"entities",null);z(this,"tricks",null);z(this,"overlays",null);z(this,"village",null);z(this,"container",null);z(this,"lastFrameMs",0);z(this,"unbindPointer",null);z(this,"unbindCamera",null);z(this,"xpContainer",null)}async init(t,e){this.container=t,this.renderer=new jy({antialias:!0,alpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(Wi,pi,!1),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(Be.deepWater),t.appendChild(this.renderer.domElement),this.scene=new j0;const i=new Q_(16777215,.55),s=new j_(16774368,.85);s.position.set(40,80,30),this.scene.add(i,s),this.orbitCamera=new hT(Wi/pi),this.mapMeshes=new iT,this.entities=new WE,this.tricks=new UT,this.overlays=new pT,this.village=zT(),this.scene.add(this.mapMeshes.root,this.tricks.root,this.entities.root,this.overlays.root,this.village),this.xpContainer=document.createElement("div"),this.xpContainer.className="xp-drop-layer",this.xpContainer.style.cssText="position:absolute;inset:0;pointer-events:none;overflow:hidden;",t.style.position="relative",t.appendChild(this.xpContainer),this.bindCameraEvents(this.renderer.domElement)}getCanvas(){if(!this.renderer)throw new Error("Renderer not initialized");return this.renderer.domElement}bindPointerInput(t,e){var i;return(i=this.unbindPointer)==null||i.call(this),this.unbindPointer=xE(this.getCanvas(),t,e,(s,r)=>this.screenToWorld(s,r)),this.unbindPointer}handleKeyDown(t){var e;return((e=this.orbitCamera)==null?void 0:e.handleKeyDown(t.code))??!1}handleKeyUp(t){var e;return((e=this.orbitCamera)==null?void 0:e.handleKeyUp(t.code))??!1}resize(t){!this.renderer||!this.orbitCamera||(this.renderer.setSize(t.width,t.height,!1),this.orbitCamera.setAspect(t.width/t.height))}worldToScreen(t,e){if(!this.orbitCamera)return{x:0,y:0};const i=qe(t,e,.5);return Hi.set(i.x,i.y,i.z),Hi.project(this.orbitCamera.camera),{x:(Hi.x+1)/2*Wi,y:(-Hi.y+1)/2*pi}}screenToWorld(t,e){if(!this.orbitCamera)return{x:0,y:0};ao.x=t/Wi*2-1,ao.y=-(e/pi)*2+1,this.raycaster.setFromCamera(ao,this.orbitCamera.camera);const i=this.raycaster.ray;so.copy(i.origin),ro.copy(i.direction);const s=ro.y;if(Math.abs(s)<1e-6)return{x:NaN,y:NaN};const r=-so.y/s;return r<0?{x:NaN,y:NaN}:(Hi.copy(so).addScaledVector(ro,r),PE(Hi))}render(t,e,i=performance.now(),s=0){if(!this.renderer||!this.scene||!this.orbitCamera||!this.mapMeshes||!this.entities||!this.tricks||!this.overlays)return;const r=this.lastFrameMs>0?i-this.lastFrameMs:16;this.lastFrameMs=i;const a=Math.min(.1,r/1e3);this.mapMeshes.build(e,t.tide),this.mapMeshes.updateTideVisuals(e,t.tide),this.orbitCamera.setFocus(t.surfboard.position.x,t.surfboard.position.y),this.orbitCamera.update(a),this.tricks.sync(t,s),this.entities.sync(t,e),this.overlays.sync(t,e),this.renderer.render(this.scene,this.orbitCamera.camera)}getCompassRotationRadians(){var t;return((t=this.orbitCamera)==null?void 0:t.getCompassRotationRadians())??0}getViewFacingRadians(){var t;return((t=this.orbitCamera)==null?void 0:t.getViewFacingRadians())??0}snapCameraNorth(){var t;(t=this.orbitCamera)==null||t.snapNorth()}showXpDrop(t,e,i){if(!this.xpContainer)return;const s=this.worldToScreen(e,i),r=document.createElement("div");r.textContent=t,r.style.cssText="position:absolute;color:#7ecf8f;font:12px monospace;white-space:nowrap;",r.style.left=`${s.x}px`,r.style.top=`${s.y-10}px`,this.xpContainer.appendChild(r);const a=()=>{const o=parseFloat(r.style.top);if(r.style.top=`${o-.5}px`,r.style.opacity=`${parseFloat(r.style.opacity||"1")-.02}`,parseFloat(r.style.opacity||"1")<=0){r.remove();return}requestAnimationFrame(a)};requestAnimationFrame(a)}syncMapAfterTick(t,e){var i;(i=this.mapMeshes)==null||i.updateTideVisuals(e,t.tide)}destroy(){var t,e,i,s,r,a,o,c,l;(t=this.unbindPointer)==null||t.call(this),(e=this.unbindCamera)==null||e.call(this),(i=this.entities)==null||i.dispose(),(s=this.tricks)==null||s.dispose(),(r=this.overlays)==null||r.dispose(),this.village&&(VT(this.village),this.village=null),(a=this.mapMeshes)==null||a.destroy(),(o=this.renderer)==null||o.dispose(),(c=this.renderer)==null||c.domElement.remove(),(l=this.xpContainer)==null||l.remove(),this.renderer=null,this.scene=null,this.container}bindCameraEvents(t){const e=this.orbitCamera;if(!e)return;const i=l=>{e.onPointerDown(l),l.button===1&&t.setPointerCapture(l.pointerId)},s=l=>e.onPointerMove(l),r=l=>{l.button===1&&t.hasPointerCapture(l.pointerId)&&t.releasePointerCapture(l.pointerId),e.onPointerUp(l)},a=l=>{t.hasPointerCapture(l.pointerId)&&t.releasePointerCapture(l.pointerId),e.onPointerCancel()},o=l=>{l.preventDefault(),e.onWheel(l.deltaY)},c=l=>l.preventDefault();t.addEventListener("pointerdown",i),t.addEventListener("pointermove",s),t.addEventListener("pointerup",r),t.addEventListener("pointercancel",a),t.addEventListener("wheel",o,{passive:!1}),t.addEventListener("contextmenu",c),this.unbindCamera=()=>{t.removeEventListener("pointerdown",i),t.removeEventListener("pointermove",s),t.removeEventListener("pointerup",r),t.removeEventListener("pointercancel",a),t.removeEventListener("wheel",o),t.removeEventListener("contextmenu",c)}}}function XT(n,t,e){return{x:n.x+(t.x-n.x)*e,y:n.y+(t.y-n.y)*e}}function lh(n,t){return Math.hypot(n.x-t.x,n.y-t.y)}function bf(n){return Math.min(1,Math.max(0,n))}function Gs(n){return n?n.ticksElapsed/n.ticksTotal:0}function oo(n,t){const e={...n.position};return{segmentStart:e,segmentEnd:e,headingStart:n.currentHeading,headingEnd:n.currentHeading,intendedHeadingStart:n.intendedHeading,intendedHeadingEnd:n.intendedHeading,trickProgressStart:Gs(t),trickProgressEnd:Gs(t)}}function co(n,t,e,i,s){n.segmentStart={...t.position},n.segmentEnd={...e.position},n.headingStart=t.currentHeading,n.headingEnd=e.currentHeading,n.intendedHeadingStart=t.intendedHeading,n.intendedHeadingEnd=e.intendedHeading,n.trickProgressStart=Gs(i),n.trickProgressEnd=Gs(s)}function uh(n,t,e){if(e)return;const i=t.position,s=lh(n.segmentStart,n.segmentEnd);if(lh(i,n.segmentEnd)>Math.max(.2,s*.5+.05)){const a={...i};n.segmentStart=a,n.segmentEnd=a,n.headingStart=t.currentHeading,n.headingEnd=t.currentHeading,n.intendedHeadingStart=t.intendedHeading,n.intendedHeadingEnd=t.intendedHeading,n.trickProgressStart=0,n.trickProgressEnd=0}}function hh(n,t,e,i){const s=bf(i),r=e?n.trickProgressStart+(n.trickProgressEnd-n.trickProgressStart)*s:0,a=e!==null?Oh(e,r):XT(n.segmentStart,n.segmentEnd,s),o=e?{...e,progress:r}:null;return{surfboard:{...t,position:a,currentHeading:lo(n.headingStart,n.headingEnd,s),intendedHeading:lo(n.intendedHeadingStart,n.intendedHeadingEnd,s)},trickAnimation:o}}class YT{constructor(){z(this,"player",oo({position:{x:0,y:0},currentHeading:0,intendedHeading:0},null));z(this,"demoSurfers",new Map)}reset(t){co(this.player,t.surfboard,t.surfboard,t.trickAnimation,t.trickAnimation),this.demoSurfers.clear();for(const e of t.demoSurfers)this.demoSurfers.set(e.id,oo(e.surfboard,e.trickAnimation))}onSimulationTick(t,e){co(this.player,t.surfboard,e.surfboard,t.trickAnimation,e.trickAnimation);const i=new Set;for(const s of e.demoSurfers){i.add(s.id);let r=this.demoSurfers.get(s.id);r||(r=oo(s.surfboard,s.trickAnimation),this.demoSurfers.set(s.id,r));const a=t.demoSurfers.find(o=>o.id===s.id);co(r,(a==null?void 0:a.surfboard)??s.surfboard,s.surfboard,(a==null?void 0:a.trickAnimation)??null,s.trickAnimation)}for(const s of this.demoSurfers.keys())i.has(s)||this.demoSurfers.delete(s)}ensureSynced(t){uh(this.player,t.surfboard,t.trickAnimation);for(const e of t.demoSurfers){const i=this.demoSurfers.get(e.id);i&&uh(i,e.surfboard,e.trickAnimation)}}buildDisplaySnapshot(t,e,i){const s=hh(this.player,t.surfboard,t.trickAnimation,i);let r=t.tide;if(t.tide&&e!==null){const o=bf(i),c=e+t.tide.advancePerTick*o;r={...t.tide,phaseRadians:c}}const a=t.demoSurfers.map(o=>{const c=this.demoSurfers.get(o.id);if(!c)return{...o,trickAnimation:qT(o.trickAnimation)};const l=hh(c,o.surfboard,o.trickAnimation,i);return{...o,surfboard:l.surfboard,trickAnimation:l.trickAnimation}});return{...t,surfboard:s.surfboard,trickAnimation:s.trickAnimation,tide:r,demoSurfers:a}}}function qT(n){return n?{...n,progress:Gs(n)}:null}class KT{constructor(t,e,i){z(this,"root");z(this,"tuning");this.root=t,this.tuning={...e},this.root.classList.add("hidden"),this.root.innerHTML=`
      <div><strong>Debug</strong> [F3] hide, [1/2/3] tune turn/paddle/ride</div>
      <div id="debug-lines"></div>
    `,window.addEventListener("keydown",s=>{if(s.key==="F3"){s.preventDefault(),this.root.classList.toggle("hidden");return}this.root.classList.contains("hidden")||(s.key==="1"&&(this.tuning.turnRate=Math.max(5,this.tuning.turnRate-2.5),i(this.tuning)),s.key==="2"&&(this.tuning.speedPaddle=Math.max(1,this.tuning.speedPaddle-1),i(this.tuning)),s.key==="3"&&(this.tuning.speedRide=Math.max(1,this.tuning.speedRide-1),i(this.tuning)),s.key==="!"&&(this.tuning.turnRate+=2.5,i(this.tuning)),s.key==="@"&&(this.tuning.speedPaddle+=1,i(this.tuning)),s.key==="#"&&(this.tuning.speedRide+=1,i(this.tuning)))})}update(t){if(this.root.classList.contains("hidden"))return;const e=this.root.querySelector("#debug-lines");if(!e)return;const{surfboard:i}=t;e.innerHTML=`
      pos: ${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}<br/>
      heading: ${i.currentHeading} → ${i.intendedHeading}<br/>
      speed: ${i.speedState} | rotating: ${i.isRotating}<br/>
      turn: ${this.tuning.turnRate}° paddle: ${ml(this.tuning.speedPaddle)} ride: ${ml(this.tuning.speedRide)} tiles/tick<br/>
      tide: ${t.tide?`${(t.tide.phaseRadians*180/Math.PI).toFixed(0)}° sweep`:"off"}<br/>
      tick: ${t.tickCount}
    `}}const ZT="/osrs-surfing-sim/assets/osrs",$T="/osrs-surfing-sim/assets/surf";function ue(n){return`${ZT}/${n}`}function vs(n){return`${$T}/${n}`}const ge={fixed:{minimapFrame:ue("fixed_mode/minimap_and_compass_frame.png"),compassDial:ue("other/compass.png")},chatbox:{stones:ue("chatbox/buttons_background_stones.png")},tabs:{combat:ue("tab/combat.png"),stats:ue("tab/stats.png"),quests:ue("tab/quests.png"),inventory:ue("tab/inventory.png"),equipment:ue("tab/equipment.png"),prayer:ue("tab/prayer.png"),magic:ue("tab/magic.png"),friends:ue("tab/friends.png"),ignores:ue("tab/ignores.png"),clanChannel:ue("tab/clan_channel.png"),accountManagement:ue("tab/account_management.png"),logout:ue("tab/logout.png"),options:ue("tab/options.png"),emotes:ue("tab/emotes.png")},sailing:{raft:vs("surfboard.svg"),setSails:vs("wave_ride.svg"),unsetSailsFast:vs("wave_stop.svg"),reverse:vs("wave_lie_down.svg"),steering:ue("sailing/steering.png"),notSteering:ue("sailing/not_steering.png"),tabFacilities:ue("sailing/tab_facilities.png"),tabCrew:ue("sailing/tab_crew.png"),viewSailingOptions:vs("wave_panel.svg")},skill:{agility:ue("skill/agility.png"),sailing:ue("skill/sailing.png")},chevron:{up:ue("chevron/yellow_up_single.png"),upDouble:ue("chevron/yellow_up_double.png"),down:ue("chevron/yellow_down_single.png"),downStop:ue("chevron/yellow_down_stop.png")}},JT=50;class jT{constructor(t){z(this,"root");z(this,"messagesEl");z(this,"lines",[]);this.root=t,this.root.className="osrs-chatbox";const e=ge;this.root.innerHTML=`
      <div class="osrs-chatbox-messages" id="chat-messages"></div>
      <div class="osrs-chatbox-stones">
        <img src="${e.chatbox.stones}" alt="" class="osrs-chatbox-stones-bg" />
      </div>
    `,this.messagesEl=this.root.querySelector("#chat-messages"),this.push("Welcome to Ura Ura Swell.","game")}push(t,e="game"){const i=e==="xp"?'<span class="chat-xp">':e==="system"?'<span class="chat-sys">':"<span>";this.lines.push(`${i}${t}</span>`),this.lines.length>JT&&this.lines.shift(),this.messagesEl.innerHTML=this.lines.join("<br/>"),this.messagesEl.scrollTop=this.messagesEl.scrollHeight}}const QT=.35,tb=.04;class eb{constructor(t,e,i,s){z(this,"canvas");z(this,"ctx");z(this,"compassNeedle");z(this,"baseCanvas",null);z(this,"tideCanvas",null);z(this,"tideCtx",null);z(this,"lastTidePhase",Number.NaN);z(this,"baseMap",null);z(this,"coralTiles",[]);i.src=ge.fixed.minimapFrame,i.alt="",i.decoding="async",this.canvas=document.createElement("canvas"),this.canvas.width=Gi,this.canvas.height=Gi,this.canvas.className="osrs-minimap-canvas",t.appendChild(this.canvas);const r=this.canvas.getContext("2d");if(!r)throw new Error("Minimap canvas unsupported");this.ctx=r;const a=e.querySelector("img");if(!a)throw new Error("Minimap compass needle missing");this.compassNeedle=a,this.compassNeedle.src=ge.fixed.compassDial,this.compassNeedle.alt="Compass",e.addEventListener("click",s)}setCompassRotation(t){const e=t*180/Math.PI;this.compassNeedle.style.transform=`rotate(${e}deg)`}ensureBaseCanvas(t){if(this.baseMap===t&&this.baseCanvas)return;const e=Gi,i=document.createElement("canvas");i.width=e,i.height=e;const s=i.getContext("2d");if(!s)throw new Error("Minimap base canvas unsupported");const r=e/t.widthTiles,a=e/t.heightTiles;this.coralTiles=[];for(let c=0;c<t.heightTiles;c+=1)for(let l=0;l<t.widthTiles;l+=1){const u=t.tiles[c][l];let d=Sf(u,l+.5,c+.5,null);u==="coral_rideable"&&(this.coralTiles.push({tx:l,ty:c,angle:Number.NaN}),d="reef_exposed");const h=Zr(d);s.fillStyle=`#${h.toString(16).padStart(6,"0")}`,s.fillRect(l*r,c*a,Math.ceil(r),Math.ceil(a))}this.baseCanvas=i;const o=document.createElement("canvas");o.width=e,o.height=e,this.tideCanvas=o,this.tideCtx=o.getContext("2d"),this.lastTidePhase=Number.NaN,this.baseMap=t}repaintTideOverlay(t,e){const i=this.tideCtx;if(!i||Math.abs(t.phaseRadians-this.lastTidePhase)<tb)return;this.lastTidePhase=t.phaseRadians;const r=Gi,a=r/e.widthTiles,o=r/e.heightTiles;i.clearRect(0,0,r,r);const c=Zr("reef_submerged");i.fillStyle=`#${c.toString(16).padStart(6,"0")}`;for(const l of this.coralTiles)Number.isNaN(l.angle)&&(l.angle=Math.atan2(l.ty+.5-t.centerY,l.tx+.5-t.centerX)),yc(l.angle,t)/ns>QT&&i.fillRect(l.tx*a,l.ty*o,Math.ceil(a),Math.ceil(o))}update(t,e){this.ensureBaseCanvas(e),t.tide&&this.repaintTideOverlay(t.tide,e);const i=this.ctx,s=Gi,r=s/2,a=s/e.widthTiles,o=s/e.heightTiles;i.clearRect(0,0,s,s),i.save(),i.beginPath(),i.arc(r,r,r,0,Math.PI*2),i.clip(),this.baseCanvas&&i.drawImage(this.baseCanvas,0,0),this.tideCanvas&&i.drawImage(this.tideCanvas,0,0);const c=t.surfboard.position.x*a,l=t.surfboard.position.y*o;i.fillStyle="#ffff00",i.beginPath(),i.arc(c,l,3,0,Math.PI*2),i.fill(),i.strokeStyle="#000",i.lineWidth=1,i.stroke(),i.restore()}}const nb={Bronze:"linear-gradient(180deg, #e8a55c 0%, #8b5a2b 100%)",Iron:"linear-gradient(180deg, #d8d8d8 0%, #6a6a6a 100%)",Steel:"linear-gradient(180deg, #c8d4e0 0%, #6a7a8a 100%)",Mithril:"linear-gradient(180deg, #7eb8e8 0%, #2a5080 100%)",Adamant:"linear-gradient(180deg, #5ecf8a 0%, #1a5c38 100%)",Rune:"linear-gradient(180deg, #7ec8f0 0%, #2868a8 100%)",Dragon:"linear-gradient(180deg, #f0a050 0%, #8b2020 100%)"};function dh(n,t){const e=ge;switch(t){case"toggle-full":return{icon:n==="riding"?e.sailing.unsetSailsFast:e.sailing.setSails,title:n==="riding"?"Stop":"Full speed ahead",disabled:!1,targetState:n==="riding"?"seated":"riding"};case"speed-down":return n==="riding"?{icon:e.chevron.down,title:"Slow down",disabled:!1,targetState:"paddling"}:n==="paddling"?{icon:e.chevron.downStop,title:"Stop",disabled:!1,targetState:"seated"}:n==="seated"?{icon:e.sailing.reverse,title:"Reverse",disabled:!1,targetState:"reversing"}:{icon:e.sailing.reverse,title:"Reverse",disabled:!0,targetState:null};case"speed-up":return n==="reversing"?{icon:e.sailing.unsetSailsFast,title:"Stop",disabled:!1,targetState:"seated"}:n==="seated"?{icon:e.chevron.up,title:"Increase speed",disabled:!1,targetState:"paddling"}:n==="paddling"?{icon:e.chevron.upDouble,title:"Full speed",disabled:!1,targetState:"riding"}:{icon:e.chevron.up,title:"Full speed",disabled:!0,targetState:null}}}class ib{constructor(t,e){z(this,"root");z(this,"callbacks");z(this,"activeTab","movement");z(this,"speedState","seated");this.root=t,this.callbacks=e,this.root.className="osrs-control-panel osrs-sailing-panel",this.root.innerHTML=this.renderShell(),this.bindEvents()}update(t){this.speedState=t.surfboard.speedState;const e=this.root.querySelector("#steering-icon");e&&(e.src=t.surfboard.speedState==="seated"?ge.sailing.notSteering:ge.sailing.steering),this.updateNavButtons(t.surfboard.speedState);const i=this.root.querySelector("#combo-bar-fill"),s=this.root.querySelector("#combo-label");if(i&&s){const r=t.progression.session.combo,a=Gg(r);i.style.width=r>0?`${a/10*100}%`:"0%",i.style.background=nb[Rl(r)],s.textContent=r>0?`${Rl(r)} · ${r}`:"Combo"}this.syncTokenDisplay(t.progression.coralTokens),this.root.querySelectorAll("[data-prepare-slot]").forEach(r=>{var l;const a=Number(r.dataset.prepareSlot),o=t.trickPrepare!==null&&t.trickPrepare.slot===a&&t.trickPrepare.ticksSincePrepare>0;r.classList.toggle("primed",o);const c=r.querySelector(".prepare-ticks");c&&(c.textContent=((l=t.trickPrepare)==null?void 0:l.slot)===a?String(t.trickPrepare.ticksSincePrepare):"·")})}setVisible(t){this.root.classList.toggle("hidden",!t)}renderShell(){const t=ge;return`
      <div class="osrs-panel-chrome">
        <div class="osrs-panel-header">
          <img src="${t.sailing.viewSailingOptions}" alt="" class="osrs-panel-icon" width="20" height="20" />
          <span class="osrs-panel-title">Ura Ura Board</span>
          <img src="${t.sailing.raft}" alt="" class="osrs-boat-thumb" width="32" height="32" />
        </div>
        <div class="osrs-hp-bar">
          <div class="osrs-hp-bar-fill" id="combo-bar-fill"></div>
          <span class="osrs-hp-bar-label" id="combo-label">Combo</span>
        </div>
        <div class="osrs-tab-row">
          <button type="button" class="osrs-tab active" data-tab="movement" title="Facilities">
            <img src="${t.sailing.tabFacilities}" alt="Facilities" width="28" height="28" />
          </button>
          <button type="button" class="osrs-tab" data-tab="rewards" title="Crew">
            <img src="${t.sailing.tabCrew}" alt="Crew" width="28" height="28" />
          </button>
        </div>
        <div class="osrs-tab-body active" data-panel="movement">
          <p class="osrs-section-label">Navigation</p>
          <div class="osrs-nav-row">
            <button type="button" class="osrs-sprite-btn" data-nav-btn="toggle-full" title="Full speed ahead">
              <img src="${t.sailing.setSails}" alt="" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-nav-btn="speed-down" title="Slow down">
              <img src="${t.chevron.down}" alt="" />
            </button>
            <button type="button" class="osrs-sprite-btn" data-nav-btn="speed-up" title="Increase speed">
              <img src="${t.chevron.up}" alt="" />
            </button>
            <img src="${t.sailing.steering}" alt="" class="osrs-steering-badge" id="steering-icon" />
          </div>
          <p class="osrs-section-label">Stance</p>
          <div class="osrs-trick-prepare-row">
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="0" title="Low stance (1) — rail, brain coral">
              <span class="prepare-label">${ha(0)}</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="1" title="Medium stance (2) — tunnel, wall ride">
              <span class="prepare-label">${ha(1)}</span>
              <span class="prepare-ticks">·</span>
            </button>
            <button type="button" class="osrs-trick-prepare-btn" data-prepare-slot="2" title="High stance (3) — jump">
              <span class="prepare-label">${ha(2)}</span>
              <span class="prepare-ticks">·</span>
            </button>
          </div>
          <p class="osrs-hint">Prime Low, Medium, or High 1–4 ticks before the matching feature. Too early or late = bail.</p>
        </div>
        <div class="osrs-tab-body" data-panel="rewards">
          <p class="osrs-section-label">Coral Token Shop</p>
          <div class="osrs-stat-line">Balance: <span id="coral-tokens-rewards">0</span></div>
          <button type="button" class="osrs-stone-btn" id="shop-btn">Open Reward Shop</button>
        </div>
      </div>
    `}bindEvents(){var t;for(const e of this.root.querySelectorAll(".osrs-tab"))e.addEventListener("click",()=>{const i=e.dataset.tab;this.activeTab=i,this.root.querySelectorAll(".osrs-tab").forEach(s=>s.classList.remove("active")),e.classList.add("active"),this.root.querySelectorAll(".osrs-tab-body").forEach(s=>{s.classList.toggle("active",s.dataset.panel===i)})});this.root.querySelectorAll("[data-nav-btn]").forEach(e=>{e.addEventListener("click",()=>{if(e.disabled)return;const i=e.dataset.navBtn,s=dh(this.speedState,i);s.targetState&&this.callbacks.onSpeedState(s.targetState)})}),this.root.querySelectorAll("[data-prepare-slot]").forEach(e=>{e.addEventListener("click",()=>{const i=Number(e.dataset.prepareSlot);this.callbacks.onPrepareTrick(i)})}),(t=this.root.querySelector("#shop-btn"))==null||t.addEventListener("click",()=>{this.callbacks.onOpenShop()})}updateNavButtons(t){this.root.querySelectorAll("[data-nav-btn]").forEach(e=>{const i=e.dataset.navBtn,s=dh(t,i);e.disabled=s.disabled,e.title=s.title;const r=e.querySelector("img");r&&(r.src=s.icon,r.alt=s.title),e.classList.toggle("active",i==="toggle-full"&&t==="riding")})}syncTokenDisplay(t){const e=this.root.querySelector("#coral-tokens-rewards");e&&(e.textContent=String(t))}}class sb{constructor(t,e){z(this,"root");z(this,"onPurchase");z(this,"visible",!1);this.root=t,this.onPurchase=e,this.root.className="osrs-shop-panel hidden"}toggle(){this.visible=!this.visible,this.root.classList.toggle("hidden",!this.visible)}hide(){this.visible=!1,this.root.classList.add("hidden")}update(t){this.root.innerHTML=`
      <div class="osrs-shop-chrome">
        <div class="osrs-panel-header">
          <img src="${ge.sailing.tabCrew}" alt="" width="20" height="20" />
          <span class="osrs-panel-title">Coral Rewards</span>
        </div>
        <p class="osrs-stat-line">Coral Tokens: <strong>${t.coralTokens}</strong></p>
        <div class="osrs-shop-list">
          ${Gr.map(e=>this.renderUnlock(e,t)).join("")}
        </div>
      </div>
    `;for(const e of Gr){const i=this.root.querySelector(`[data-unlock="${e.id}"]`);!i||e.earnOnly||i.addEventListener("click",()=>this.onPurchase(e.id))}}renderUnlock(t,e){const i=e.unlocked.has(t.id),s=hd(e,t),r=t.tokenCost===null?"Earn only":`${t.tokenCost} Coral Tokens`,a=i?"Unlocked":s.ok?"Purchase":s.reason??"Locked";return`
      <div class="osrs-shop-item">
        <div class="osrs-shop-item-title">${t.name}</div>
        <div class="osrs-shop-item-desc">${t.description}</div>
        <div class="osrs-shop-item-cost">${r}</div>
        <button type="button" class="osrs-stone-btn" data-unlock="${t.id}" ${i||!s.ok?"disabled":""}>
          ${a}
        </button>
      </div>
    `}}class rb{constructor(t){z(this,"root");this.root=t,this.root.className="osrs-control-panel osrs-skills-panel hidden",this.root.innerHTML=this.renderShell()}update(t){const e=t.progression.xp.agility,i=t.progression.xp.sailing;this.updateSkillRow("agility",go(e),e%1e3,1e3),this.updateSkillRow("sailing",_o(i),i%1200,1200);const s=this.root.querySelector("#tricks-landed");s&&(s.textContent=String(t.progression.session.tricksLanded));const r=this.root.querySelector("#coral-tokens");r&&(r.textContent=String(t.progression.coralTokens));const a=go(e)+_o(i),o=this.root.querySelector("#total-level");o&&(o.textContent=String(a))}setVisible(t){this.root.classList.toggle("hidden",!t)}renderShell(){const t=ge;return`
      <div class="osrs-panel-chrome">
        <p class="osrs-section-label">Skills</p>
        <div class="osrs-stat-row">
          <img src="${t.skill.agility}" alt="" width="18" height="18" />
          <span id="agility-label">Agility 1</span>
          <div class="osrs-xp-track"><div class="osrs-xp-fill agility" id="agility-fill"></div></div>
        </div>
        <div class="osrs-stat-row">
          <img src="${t.skill.sailing}" alt="" width="18" height="18" />
          <span id="sailing-label">Sailing 1</span>
          <div class="osrs-xp-track"><div class="osrs-xp-fill sailing" id="sailing-fill"></div></div>
        </div>
        <div class="osrs-stat-line">Total level: <span id="total-level">2</span></div>
        <p class="osrs-section-label">Session</p>
        <div class="osrs-stat-line">Tricks: <span id="tricks-landed">0</span></div>
        <div class="osrs-stat-line">Coral Tokens: <span id="coral-tokens">0</span></div>
      </div>
    `}updateSkillRow(t,e,i,s){const r=this.root.querySelector(`#${t}-label`),a=this.root.querySelector(`#${t}-fill`);r&&(r.textContent=`${t==="agility"?"Agility":"Sailing"} ${e}`),a&&(a.style.width=`${Math.min(100,i/s*100)}%`)}}const ab=[{id:"combat",icon:ge.tabs.combat,label:"Sailing Options"},{id:"stats",icon:ge.tabs.stats,label:"Skills"},{icon:ge.tabs.quests,label:"Quest List"},{icon:ge.tabs.inventory,label:"Inventory"},{icon:ge.tabs.equipment,label:"Worn Equipment"},{icon:ge.tabs.prayer,label:"Prayer"},{icon:ge.tabs.magic,label:"Magic"}],ob=[{icon:ge.tabs.friends,label:"Friends List"},{icon:ge.tabs.ignores,label:"Ignore List"},{icon:ge.tabs.clanChannel,label:"Chat-channel"},{icon:ge.tabs.accountManagement,label:"Account Management"},{icon:ge.tabs.logout,label:"Logout"},{icon:ge.tabs.options,label:"Settings"},{icon:ge.tabs.emotes,label:"Emotes"}];class cb{constructor(t,e,i){z(this,"topRoot");z(this,"bottomRoot");z(this,"activeTab","combat");z(this,"onTabChange");this.topRoot=t,this.bottomRoot=e,this.onTabChange=i,this.render()}setActiveTab(t){this.activeTab=t,this.syncActiveState()}render(){this.topRoot.className="osrs-tab-strip osrs-tab-strip-top",this.bottomRoot.className="osrs-tab-strip osrs-tab-strip-bottom",this.topRoot.innerHTML='<div class="osrs-tab-strip-inner"></div>',this.bottomRoot.innerHTML='<div class="osrs-tab-strip-inner"></div>';const t=this.topRoot.querySelector(".osrs-tab-strip-inner"),e=this.bottomRoot.querySelector(".osrs-tab-strip-inner");if(!(!t||!e)){t.innerHTML=ab.map(i=>this.tabButtonHtml(i)).join(""),e.innerHTML=ob.map(i=>this.tabButtonHtml(i,!1)).join("");for(const i of t.querySelectorAll("[data-tab]")){const s=i.dataset.tab;s!=="combat"&&s!=="stats"||i.addEventListener("click",()=>{this.activeTab=s,this.syncActiveState(),this.onTabChange(s)})}}}tabButtonHtml(t,e=!0){const i=e&&(t.id==="combat"||t.id==="stats");return`
      <button
        type="button"
        class="osrs-game-tab ${t.id===this.activeTab?"active":""}"
        title="${t.label}"
        ${t.id?`data-tab="${t.id}"`:""}
        ${i?"":"disabled"}
      >
        <img src="${t.icon}" alt="${t.label}" />
      </button>
    `}syncActiveState(){this.topRoot.querySelectorAll("[data-tab]").forEach(t=>{t.classList.toggle("active",t.dataset.tab===this.activeTab)})}}const fh=32,lb=.5;function ub(){const n=window.innerWidth-fh,t=window.innerHeight-fh;return Math.max(lb,Math.min(n/Zc,t/$c))}function ph(n,t){const e=ub();return n.style.width=`${Zc*e}px`,n.style.height=`${$c*e}px`,t.style.transform=`scale(${e})`,t.style.transformOrigin="top left",e}const hb={Digit1:0,Digit2:1,Digit3:2},db=["Click the ground to walk. Click Kaulu to talk.","Click your surfboard on the sand ring to paddle out.","Prime Low, Medium, or High stance 1–4 ticks before you hit the matching coral feature."];class el{constructor(t,e,i,s,r,a,o,c,l){z(this,"simulation");z(this,"renderer");z(this,"chatbox");z(this,"sailingPanel");z(this,"skillsPanel");z(this,"tabStrip");z(this,"shopPanel");z(this,"debugPanel");z(this,"minimap");z(this,"unbindPointer",null);z(this,"visualFrameId",null);z(this,"lastVisualFrameMs",0);z(this,"lastSimTickTimeMs",0);z(this,"motion",new YT);z(this,"tidePhaseFrom",null);z(this,"paused",!1);z(this,"lastDisplayPosition",{x:0,y:0});z(this,"lastTickBlend",0);z(this,"lastSavedProgressionFingerprint","");z(this,"onKeyDown",t=>{if(this.renderer.handleKeyDown(t)){t.preventDefault();return}const e=hb[t.code];e!==void 0&&(t.preventDefault(),this.simulation.prepareTrick(e))});z(this,"onKeyUp",t=>{this.renderer.handleKeyUp(t)&&t.preventDefault()});this.simulation=t,this.renderer=e,this.chatbox=i,this.sailingPanel=s,this.skillsPanel=r,this.tabStrip=a,this.shopPanel=o,this.debugPanel=c,this.minimap=l}static async mount(){var X;const t=document.getElementById("osrs-scale-shell"),e=document.getElementById("osrs-scale-wrap");t&&e&&(ph(t,e),window.addEventListener("resize",()=>ph(t,e)));const i=e0(),s=new t0({arena:Cg(),initialProgression:i??void 0}),r=document.getElementById("game-root"),a=document.getElementById("sailing-panel"),o=document.getElementById("skills-panel"),c=document.getElementById("shop-panel"),l=document.getElementById("debug-panel"),u=document.getElementById("chatbox-root"),d=document.getElementById("tab-strip-top"),h=document.getElementById("tab-strip-bottom"),f=document.getElementById("minimap-map"),g=document.getElementById("minimap-compass"),S=document.getElementById("minimap-frame");if(!r||!a||!o||!c||!l||!u||!d||!h||!f||!g||!S)throw new Error("Missing required DOM elements");const p=new WT;await p.init(r,1);const m=new eb(f,g,S,()=>p.snapCameraNorth()),v=new jT(u);for(const W of db)v.push(W,"game");const E={turnRate:Yi.turnRateDegPerTick,speedPaddle:Yi.speedPaddle,speedRide:Yi.speedRide};s.setStats({turnRateDegPerTick:E.turnRate,speedPaddle:E.speedPaddle,speedRide:E.speedRide});const y=new KT(l,E,W=>{s.setStats({turnRateDegPerTick:W.turnRate,speedPaddle:W.speedPaddle,speedRide:W.speedRide})}),P={sailing:null,skills:null},b=new sb(c,W=>{var k,j;const N=s.tryPurchaseUnlock(W);N&&v.push(N,"system");const B=s.getSnapshot();Pl(B.progression),b.update(B.progression),(k=P.sailing)==null||k.update(B),(j=P.skills)==null||j.update(B)}),C=new rb(o);P.skills=C;const x=new ib(a,{onSpeedState:W=>s.setSpeedState(W),onOpenShop:()=>{b.toggle(),b.update(s.getSnapshot().progression)},onPrepareTrick:W=>s.prepareTrick(W)});P.sailing=x;const A=(W,N)=>{x.setVisible(W==="combat"),C.setVisible(W==="stats"),N.setActiveTab(W)},I=new cb(d,h,W=>A(W,I)),R=new el(s,p,v,x,C,I,b,y,m);A("combat",I);const F=s.getSnapshot();return i&&R.seedProgressionFingerprint(F.progression),R.motion.reset(F),R.tidePhaseFrom=((X=F.tide)==null?void 0:X.phaseRadians)??null,R.wireViewport(),R.startTickLoop(),window.addEventListener("keydown",R.onKeyDown),window.addEventListener("keyup",R.onKeyUp),window.addEventListener("beforeunload",()=>R.destroy()),R}wireViewport(){this.unbindPointer=this.renderer.bindPointerInput((t,e)=>{if(Number.isNaN(t)){this.simulation.clearCursor();return}this.simulation.setCursor(t,e)},(t,e)=>{this.simulation.clickWorld(t,e)})}setPaused(t){if(this.paused=t,!t){const e=performance.now();this.lastVisualFrameMs=e,this.lastSimTickTimeMs=e}}resetTickBlendTimer(){this.lastSimTickTimeMs=performance.now(),this.lastTickBlend=0}startTickLoop(){const t=performance.now();this.lastVisualFrameMs=t,this.lastSimTickTimeMs=t,this.visualFrameId=requestAnimationFrame(e=>this.onVisualFrame(e))}onGameTick(){var s;const t=this.simulation.getSnapshot();this.tidePhaseFrom=((s=t.tide)==null?void 0:s.phaseRadians)??null,this.simulation.setCameraFacing(this.renderer.getViewFacingRadians()),this.simulation.tick();const e=this.simulation.getSnapshot();this.motion.onSimulationTick(t,e);const i=this.simulation.getArena().map;this.renderer.syncMapAfterTick(e,i),this.sailingPanel.update(e),this.skillsPanel.update(e),this.shopPanel.update(e.progression),this.persistProgressionIfChanged(e.progression),this.debugPanel.update(e);for(const r of this.simulation.consumeDialogue())this.chatbox.push(r,"game");for(const r of this.simulation.consumeXpDrops()){const a=r.tokens>0?` +${r.tokens} Tokens`:"";this.renderer.showXpDrop(`+${r.agility} Agil +${r.sailing} Sail${a}`,r.x,r.y);const o=r.tokens>0?`, +${r.tokens} Coral Tokens`:"";this.chatbox.push(`+${r.agility} Agility XP, +${r.sailing} Sailing XP${o}`,"xp")}}onVisualFrame(t){if(!this.paused){const e=this.simulation.tickMs;t-this.lastSimTickTimeMs>=e&&(this.onGameTick(),this.lastSimTickTimeMs+=e,t-this.lastSimTickTimeMs>=e&&(this.lastSimTickTimeMs=t));const i=Math.min(1,Math.max(0,(t-this.lastSimTickTimeMs)/e));this.renderVisuals(t,i)}this.lastVisualFrameMs=t,this.visualFrameId=requestAnimationFrame(e=>this.onVisualFrame(e))}renderVisuals(t=performance.now(),e=0){const i=this.simulation.getSnapshot(),s=this.simulation.getArena().map;this.motion.ensureSynced(i);const r=this.motion.buildDisplaySnapshot(i,this.tidePhaseFrom,e);this.lastDisplayPosition={...r.surfboard.position},this.lastTickBlend=e,this.renderer.render(r,s,t,e),this.minimap.update(r,s),this.minimap.setCompassRotation(this.renderer.getCompassRotationRadians())}renderFrame(){this.renderVisuals(performance.now(),this.lastTickBlend)}getDisplayPosition(){return{...this.lastDisplayPosition}}getTickBlend(){return this.lastTickBlend}seedProgressionFingerprint(t){this.lastSavedProgressionFingerprint=this.progressionFingerprint(t)}progressionFingerprint(t){return JSON.stringify({xp:t.xp,coralTokens:t.coralTokens,unlocked:[...t.unlocked].sort(),combo:t.session.combo,maxCombo:t.session.maxCombo,tricksLanded:t.session.tricksLanded})}persistProgressionIfChanged(t){const e=this.progressionFingerprint(t);e!==this.lastSavedProgressionFingerprint&&(this.lastSavedProgressionFingerprint=e,Pl(t))}destroy(){var t;this.persistProgressionIfChanged(this.simulation.getSnapshot().progression),this.visualFrameId!==null&&cancelAnimationFrame(this.visualFrameId),(t=this.unbindPointer)==null||t.call(this),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),this.renderer.destroy()}}const Jt=n=>`${n}px`;function fb(){const n=document.documentElement,t={"--osrs-frame-width":Jt(Zc),"--osrs-frame-height":Jt($c),"--osrs-window-top-height":Jt(Qy),"--osrs-grid-height":Jt(cf),"--osrs-viewport-width":Jt(Wi),"--osrs-viewport-height":Jt(pi),"--osrs-chat-height":Jt(of),"--osrs-chat-messages-height":Jt(rf),"--osrs-chat-stones-height":Jt(af),"--osrs-sidebar-width":Jt(sf),"--osrs-sidebar-content-left":Jt(Ws),"--osrs-minimap-height":Jt(lf),"--osrs-minimap-left-edge":Jt(uf),"--osrs-minimap-right-edge":Jt(tE),"--osrs-minimap-frame-left":Jt(Jc),"--osrs-minimap-frame-width":Jt(eE),"--osrs-minimap-frame-height":Jt(nE),"--osrs-minimap-map-left":Jt(aE),"--osrs-minimap-map-top":Jt(rE),"--osrs-minimap-map-size":Jt(Gi),"--osrs-minimap-compass-left":Jt(oE),"--osrs-minimap-compass-top":Jt(cE),"--osrs-minimap-compass-size":Jt(lE),"--osrs-minimap-bottom-left":Jt(hE),"--osrs-minimap-bottom-width":Jt(uE),"--osrs-minimap-bottom-height":Jt(iE),"--osrs-tab-strip-width":Jt(dE),"--osrs-tab-strip-left":Jt(fE),"--osrs-tab-slot-count":String(mE),"--osrs-tab-bar-height":Jt(hf),"--osrs-sidebar-body-height":Jt(df),"--osrs-interface-panel-height":Jt(ff),"--osrs-interface-row-width":Jt(gf),"--osrs-interface-row-left":Jt(_E),"--osrs-side-panel-edge-width":Jt(pf),"--osrs-side-panel-width":Jt(mf),"--osrs-side-panel-height":Jt(gE)};for(const[e,i]of Object.entries(t))n.style.setProperty(e,i)}const pb={"--osrs-url-window-top":"fixed_mode/window_frame_edge_top.png","--osrs-url-top-right-corner":"fixed_mode/top_right_corner.png","--osrs-url-chatbox-bg":"chatbox/background.png","--osrs-url-minimap-left":"fixed_mode/minimap_left_edge.png","--osrs-url-minimap-right":"fixed_mode/minimap_right_edge.png","--osrs-url-minimap-frame":"fixed_mode/minimap_and_compass_frame.png","--osrs-url-minimap-bottom":"fixed_mode/minimap_frame_bottom.png","--osrs-url-tabs-top":"fixed_mode/tabs_top_row.png","--osrs-url-tabs-bottom":"fixed_mode/tabs_row_bottom.png","--osrs-url-tab-selected":"tab_stone_middle_selected.png","--osrs-url-side-panel":"fixed_mode/side_panel_background.png","--osrs-url-side-panel-edge-left":"side_panel_edge_left.png","--osrs-url-side-panel-edge-right":"side_panel_edge_right.png"};function mb(){const n=document.documentElement;for(const[t,e]of Object.entries(pb))n.style.setProperty(t,`url("${ue(e)}")`)}mb();fb();el.mount().catch(n=>{console.error(n)});
