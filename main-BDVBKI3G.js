import{$ as M$1,$n as fd,$t as Wg,A as Gv,Ar as me$2,Br as pc,C as Fe$1,Cn as _n$1,Ct as Qg,D as Ga,Di as ye$3,Dn as ai$1,Dr as lt$3,Ei as y3,Er as lo$1,Fn as bt$3,Ft as Tg,Gr as rr$1,Hn as dE,Hr as qr,Ht as Ut$2,Ir as no$1,It as Tr,J as L$1,Jr as sb,Jt as Vg,K as Kg,Kt as VI,L as Hu,Lr as or$1,Mn as b$2,Mt as Sv,N as HE,Ni as r,Nn as b3,Nt as Sz,Oi as yt$2,On as an$2,Or as m$2,Pi as s,Pn as be$1,Pr as n$,Pt as T2,Q as Lt$1,Qn as fc,Qr as te$1,Rn as cS,Rr as os,Si as xg,Sn as _e$3,St as QS,T as G$2,Ti as y,Tn as a_,Tr as ln$2,Tt as Qy,W as Jv,Wn as dn$2,Wr as rS,Wt as V,Xn as ev,Xr as tC,Xt as Vs,Y as L3,Yn as en$2,Yr as si$1,Z as Le$2,Zn as fa,Zt as Vz,_i as wa,_t as Pb,a as $r,ai as ud,an as Xo,ar as gs,at as N2,b as En$1,bi as xa,bn as Zr,br as jy,bt as Pv,c as Be$2,ci as un$2,cn as YC,cr as hc,d as C,dn as Yd,dr as ho$1,dt as O,ei as th,en as Wn$2,er as fo$1,et as M2,f as C2,fi as vc,fn as Ye$1,g as Cw,gi as w2,gr as j3,h as Cu,hi as w$1,hr as it$3,ht as P$1,i as $g,ir as gb,it as Mx,j as Gw,jt as Sn$2,k as Gt$2,kr as mc,kt as Se$1,l as Bg,ln as YS,lr as hd,mr as ir$1,ni as to$1,nn as Ww,oi as ue$1,on as Xv,or as gv,ot as Na,p as Cb,pn as Yg,pr as ie$1,pt as Og,q as Kr,qn as eE,qr as sS,qt as Vf,rn as X$2,rt as Mt$3,si as ui$1,sr as hT,st as Ne$1,ti as ti$1,tn as Wv,tt as MS,ui as ut$3,ur as hn$1,ut as Ny,v as EC,vr as je$2,vt as Pg,wn as aS,wr as li$1,wt as Qv,x as Et$3,xr as lS,y as Ee,yn as Zg,yt as Pn$2}from"./chunk-CFfVwMel.js";var g=(()=>{class n{labelPosition=`after`;static ɵfac=function(i){return new(i||n)};static ɵcmp=(function(){return Fe$1({type:n,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(e,l){e&2&&yt$2(`mdc-form-field--align-end`,l.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:[`*`],decls:1,vars:0,template:function(e,l){e&1&&(ir$1(),it$3(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})})()}return n})();var m$1=new y(`MAT_DATE_LOCALE`,{providedIn:`root`,factory:()=>m$2(ui$1)});var a=`Method not implemented`;var l=class{locale;_localeChanges=new V;localeChanges=this._localeChanges;setTime(t,e,r,i){throw new Error(a)}getHours(t){throw new Error(a)}getMinutes(t){throw new Error(a)}getSeconds(t){throw new Error(a)}parseTime(t,e){throw new Error(a)}addSeconds(t,e){throw new Error(a)}getValidDateOrNull(t){return this.isDateInstance(t)&&this.isValid(t)?t:null}deserialize(t){return t==null||this.isDateInstance(t)&&this.isValid(t)?t:this.invalid()}setLocale(t){this.locale=t,this._localeChanges.next()}compareDate(t,e){return this.getYear(t)-this.getYear(e)||this.getMonth(t)-this.getMonth(e)||this.getDate(t)-this.getDate(e)}compareTime(t,e){return this.getHours(t)-this.getHours(e)||this.getMinutes(t)-this.getMinutes(e)||this.getSeconds(t)-this.getSeconds(e)}sameDate(t,e){if(t&&e){let r=this.isValid(t),i=this.isValid(e);return r&&i?!this.compareDate(t,e):r==i}return t==e}sameTime(t,e){if(t&&e){let r=this.isValid(t),i=this.isValid(e);return r&&i?!this.compareTime(t,e):r==i}return t==e}clampDate(t,e,r){return e&&this.compareDate(t,e)<0?e:r&&this.compareDate(t,r)>0?r:t}};var d=new y(`mat-date-formats`);var n=Symbol(`FIELD_TREE`);function se$1(e){return typeof e==`function`&&e[n]===!0}var oe$1=new y(``);var He$1=(()=>{class n{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,r){this._renderer=e,this._elementRef=r}setProperty(e,r){this._renderer.setProperty(this._elementRef.nativeElement,e,r)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty(`disabled`,e)}static ɵfac=function(r){return new(r||n)(bt$3($r),bt$3(ie$1))};static ɵdir=Ne$1({type:n})}return n})();var te=(()=>{class n extends He$1{static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,features:[Zr]})}return n})();var L=new y(``);var gt$2={provide:L,useExisting:gs(()=>$e$1),multi:!0};function yt$1(){let n=Lt$1()?Lt$1().getUserAgent():``;return/android (\d+)/.test(n.toLowerCase())}var vt$2=new y(``);var $e$1=(()=>{class n extends He$1{_compositionMode;_composing=!1;constructor(e,r,i){super(e,r),this._compositionMode=i,this._compositionMode??=!yt$1()}writeValue(e){let r=e??``;this.setProperty(`value`,r)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static ɵfac=function(r){return new(r||n)(bt$3($r),bt$3(ie$1),bt$3(vt$2,8))};static ɵdir=Ne$1({type:n,selectors:[[`input`,`formControlName`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControlName`,``,3,`ngNoCva`,``],[`input`,`formControl`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControl`,``,3,`ngNoCva`,``],[`input`,`ngModel`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`ngModel`,``,3,`ngNoCva`,``],[``,`ngDefaultControl`,``]],hostBindings:function(r,i){r&1&&Wg(`input`,function(s){return i._handleInput(s.target.value)})(`blur`,function(){return i.onTouched()})(`compositionstart`,function(){return i._compositionStart()})(`compositionend`,function(s){return i._compositionEnd(s.target.value)})},standalone:!1,features:[gb([gt$2]),Zr]})}return n})();function pe$1(n){return n==null||fe$1(n)===0}function fe$1(n){return n==null?null:Array.isArray(n)||typeof n==`string`?n.length:n instanceof Set?n.size:null}var U$1=new y(``);var me$1=new y(``);var _t$1=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;var de$1=class{static min(t){return qe$1(t)}static max(t){return Ct$2(t)}static required(t){return We$1(t)}static requiredTrue(t){return bt$2(t)}static email(t){return Vt$1(t)}static minLength(t){return Dt$3(t)}static maxLength(t){return At$1(t)}static pattern(t){return Mt$2(t)}static nullValidator(t){return q$1()}static compose(t){return Qe(t)}static composeAsync(t){return Je$1(t)}};function qe$1(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e<n?{min:{min:n,actual:t.value}}:null}}function Ct$2(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e>n?{max:{max:n,actual:t.value}}:null}}function We$1(n){return pe$1(n.value)?{required:!0}:null}function bt$2(n){return n.value===!0?null:{required:!0}}function Vt$1(n){return pe$1(n.value)||_t$1.test(n.value)?null:{email:!0}}function Dt$3(n){return t=>{let e=t.value?.length??fe$1(t.value);return e===null||e===0?null:e<n?{minlength:{requiredLength:n,actualLength:e}}:null}}function At$1(n){return t=>{let e=t.value?.length??fe$1(t.value);return e!==null&&e>n?{maxlength:{requiredLength:n,actualLength:e}}:null}}function Mt$2(n){if(!n)return q$1;let t,e;return typeof n==`string`?(e=``,n.charAt(0)!==`^`&&(e+=`^`),e+=n,n.charAt(n.length-1)!==`$`&&(e+=`$`),t=new RegExp(e)):(e=n.toString(),t=n),r=>{if(pe$1(r.value))return null;let i=r.value;return t.test(i)?null:{pattern:{requiredPattern:e,actualValue:i}}}}function q$1(n){return null}function ze$1(n){return n!=null}function Ye(n){return wa(n)?lt$3(n):n}function Xe(n){let t={};return n.forEach(e=>{t=e!=null?r(r({},t),e):t}),Object.keys(t).length===0?null:t}function Ze(n,t){return t.map(e=>e(n))}function Et$2(n){return!n.validate}function Ke(n){return n.map(t=>Et$2(t)?t:e=>t.validate(e))}function Qe(n){if(!n)return null;let t=n.filter(ze$1);return t.length==0?null:function(e){return Xe(Ze(e,t))}}function ge$2(n){return n!=null?Qe(Ke(n)):null}function Je$1(n){if(!n)return null;let t=n.filter(ze$1);return t.length==0?null:function(e){let r=Ze(e,t).map(Ye);return mc(r).pipe(G$2(Xe))}}function ye$2(n){return n!=null?Je$1(Ke(n)):null}function Oe$1(n,t){return n===null?[t]:Array.isArray(n)?[...n,t]:[n,t]}function et$1(n){return n._rawValidators}function tt$1(n){return n._rawAsyncValidators}function ce$1(n){return n?Array.isArray(n)?n:[n]:[]}function W$1(n,t){return Array.isArray(n)?n.includes(t):n===t}function we(n,t){let e=ce$1(t);return ce$1(n).forEach(i=>{W$1(e,i)||e.push(i)}),e}function Re$1(n,t){return ce$1(t).filter(e=>!W$1(n,e))}var z=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(t){this._rawValidators=t||[],this._composedValidatorFn=ge$2(this._rawValidators)}_setAsyncValidators(t){this._rawAsyncValidators=t||[],this._composedAsyncValidatorFn=ye$2(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(t){this._onDestroyCallbacks.push(t)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(t=>t()),this._onDestroyCallbacks=[]}reset(t=void 0){this.control?.reset(t)}hasError(t,e){return this.control?this.control.hasError(t,e):!1}getError(t,e){return this.control?this.control.getError(t,e):null}};var v=class extends z{name;get formDirective(){return null}get path(){return null}};var T$1=`VALID`;var $$1=`INVALID`;var x=`PENDING`;var P=`DISABLED`;var _=class{};var Y$1=class extends _{value;source;constructor(t,e){super(),this.value=t,this.source=e}};var G$1=class extends _{pristine;source;constructor(t,e){super(),this.pristine=t,this.source=e}};var B=class extends _{touched;source;constructor(t,e){super(),this.touched=t,this.source=e}};var I=class extends _{status;source;constructor(t,e){super(),this.status=t,this.source=e}};var X$1=class extends _{source;constructor(t){super(),this.source=t}};var S=class extends _{source;constructor(t){super(),this.source=t}};function nt$2(n){return(ne(n)?n.validators:n)||null}function Nt$1(n){return Array.isArray(n)?ge$2(n):n||null}function rt$1(n,t){return(ne(t)?t.asyncValidators:n)||null}function xt$1(n){return Array.isArray(n)?ye$2(n):n||null}function ne(n){return n!=null&&!Array.isArray(n)&&typeof n==`object`}function It$2(n,t,e){let r=n.controls;if(!(t?Object.keys(r):r).length)throw new b$2(1e3,``);if(!it$2(r,e))throw new b$2(1001,``)}function St$2(n,t,e){n._forEachChild((r,i)=>{if(e[i]===void 0)throw new b$2(-1002,``)})}var Ft=Symbol();var Z$1=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=be$1(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(t,e){this[Ft]=!0,this._assignValidators(t),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(t){this._rawValidators=this._composedValidatorFn=t,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(t){this._rawAsyncValidators=this._composedAsyncValidatorFn=t}get parent(){return this._parent}get status(){return Kr(this.statusReactive)}set status(t){Kr(()=>this.statusReactive.set(t))}_status=Le$2(()=>this.statusReactive());statusReactive=be$1(void 0);get valid(){return this.status===T$1}get invalid(){return this.status===$$1}get pending(){return this.status===x}get disabled(){return this.status===P}get enabled(){return this.status!==P}errors;get pristine(){return Kr(this.pristineReactive)}set pristine(t){Kr(()=>this.pristineReactive.set(t))}_pristine=Le$2(()=>this.pristineReactive());pristineReactive=be$1(!0);get dirty(){return!this.pristine}get touched(){return Kr(this.touchedReactive)}set touched(t){Kr(()=>this.touchedReactive.set(t))}_touched=Le$2(()=>this.touchedReactive());touchedReactive=be$1(!1);get untouched(){return!this.touched}_events=new V;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:`change`}setValidators(t){this._assignValidators(t)}setAsyncValidators(t){this._assignAsyncValidators(t)}addValidators(t){this.setValidators(we(t,this._rawValidators))}addAsyncValidators(t){this.setAsyncValidators(we(t,this._rawAsyncValidators))}removeValidators(t){this.setValidators(Re$1(t,this._rawValidators))}removeAsyncValidators(t){this.setAsyncValidators(Re$1(t,this._rawAsyncValidators))}hasValidator(t){return W$1(this._rawValidators,t)}hasAsyncValidator(t){return W$1(this._rawAsyncValidators,t)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(t={}){let e=this.touched===!1;this.touched=!0;let r$21=t.sourceControl??this;t.onlySelf||this._parent?.markAsTouched(s(r({},t),{sourceControl:r$21})),e&&t.emitEvent!==!1&&this._events.next(new B(!0,r$21))}markAllAsDirty(t={}){this.markAsDirty({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(t))}markAllAsTouched(t={}){this.markAsTouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(t))}markAsUntouched(t={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let r=t.sourceControl??this;this._forEachChild(i=>{i.markAsUntouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:r})}),t.onlySelf||this._parent?._updateTouched(t,r),e&&t.emitEvent!==!1&&this._events.next(new B(!1,r))}markAsDirty(t={}){let e=this.pristine===!0;this.pristine=!1;let r$22=t.sourceControl??this;t.onlySelf||this._parent?.markAsDirty(s(r({},t),{sourceControl:r$22})),e&&t.emitEvent!==!1&&this._events.next(new G$1(!1,r$22))}markAsPristine(t={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let r=t.sourceControl??this;this._forEachChild(i=>{i.markAsPristine({onlySelf:!0,emitEvent:t.emitEvent})}),t.onlySelf||this._parent?._updatePristine(t,r),e&&t.emitEvent!==!1&&this._events.next(new G$1(!0,r))}markAsPending(t={}){this.status=x;let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new I(this.status,e)),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.markAsPending(s(r({},t),{sourceControl:e}))}disable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=P,this.errors=null,this._forEachChild(i=>{i.disable(s(r({},t),{onlySelf:!0}))}),this._updateValue();let r$23=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Y$1(this.value,r$23)),this._events.next(new I(this.status,r$23)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(s(r({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!0))}enable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=T$1,this._forEachChild(r$24=>{r$24.enable(s(r({},t),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent}),this._updateAncestors(s(r({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!1))}_updateAncestors(t,e){t.onlySelf||(this._parent?.updateValueAndValidity(t),t.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(t){this._parent=t}getRawValue(){return this.value}updateValueAndValidity(t={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let r=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===T$1||this.status===x)&&this._runAsyncValidator(r,t.emitEvent)}let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Y$1(this.value,e)),this._events.next(new I(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.updateValueAndValidity(s(r({},t),{sourceControl:e}))}_updateTreeValidity(t={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(t)),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?P:T$1}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(t,e){if(this.asyncValidator){this.status=x,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:t!==!1};let r=Ye(this.asyncValidator(this));this._asyncValidationSubscription=r.subscribe(i=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(i,{emitEvent:e,shouldHaveEmitted:t})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let t=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,t}return!1}setErrors(t,e={}){this.errors=t,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(t){let e=t;return e==null||(Array.isArray(e)||(e=e.split(`.`)),e.length===0)?null:e.reduce((r,i)=>r&&r._find(i),this)}getError(t,e){let r=e?this.get(e):this;return r?.errors?r.errors[t]:null}hasError(t,e){return!!this.getError(t,e)}get root(){let t=this;for(;t._parent;)t=t._parent;return t}_updateControlsErrors(t,e,r){this.status=this._calculateStatus(),t&&this.statusChanges.emit(this.status),(t||r)&&this._events.next(new I(this.status,e)),this._parent&&this._parent._updateControlsErrors(t,e,r)}_initObservables(){this.valueChanges=new _e$3,this.statusChanges=new _e$3}_calculateStatus(){return this._allControlsDisabled()?P:this.errors?$$1:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(x)?x:this._anyControlsHaveStatus($$1)?$$1:T$1}_anyControlsHaveStatus(t){return this._anyControls(e=>e.status===t)}_anyControlsDirty(){return this._anyControls(t=>t.dirty)}_anyControlsTouched(){return this._anyControls(t=>t.touched)}_updatePristine(t,e){let r=!this._anyControlsDirty(),i=this.pristine!==r;this.pristine=r,t.onlySelf||this._parent?._updatePristine(t,e),i&&this._events.next(new G$1(this.pristine,e))}_updateTouched(t={},e){this.touched=this._anyControlsTouched(),this._events.next(new B(this.touched,e)),t.onlySelf||this._parent?._updateTouched(t,e)}_onDisabledChange=[];_registerOnCollectionChange(t){this._onCollectionChange=t}_setUpdateStrategy(t){ne(t)&&t.updateOn!=null&&(this._updateOn=t.updateOn)}_parentMarkedDirty(t){return!t&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(t){return null}_assignValidators(t){this._rawValidators=Array.isArray(t)?t.slice():t,this._composedValidatorFn=Nt$1(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(t){this._rawAsyncValidators=Array.isArray(t)?t.slice():t,this._composedAsyncValidatorFn=xt$1(this._rawAsyncValidators)}_updateHasRequiredValidator(){Kr(()=>this._hasRequired.set(this.hasValidator(de$1.required)))}};function it$2(n,t){return Object.hasOwn(n,t)}function kt$1(n){return n.tagName===`INPUT`||n.tagName===`SELECT`||n.tagName===`TEXTAREA`}function Ot$1(n,t,e,r){switch(e){case`name`:n.setAttribute(t,e,r);break;case`disabled`:case`readonly`:case`required`:r?n.setAttribute(t,e,``):n.removeAttribute(t,e);break;case`max`:case`min`:case`minLength`:case`maxLength`:r!==void 0?n.setAttribute(t,e,r.toString()):n.removeAttribute(t,e)}}var he$1=class{kind;context;control;message;constructor({kind:t,context:e,control:r}){this.kind=t,this.context=e,this.control=r}};var wt$2=new y(``);var re$1=new y(``,{factory:()=>ve$2});var ve$2=`always`;function Rt$3(n,t){return[...t.path,n]}function Te(n,t,e=ve$2){_e$2(n,t),t.valueAccessor.writeValue(n.value),(n.disabled||e===`always`)&&t.valueAccessor.setDisabledState?.(n.disabled),Pt(n,t),Gt$1(n,t),jt(n,t),Tt$3(n,t)}function Pe$1(n,t,e=!0){let r=()=>{};t?.valueAccessor?.registerOnChange(r),t?.valueAccessor?.registerOnTouched(r),Q(n,t),n&&(t._invokeOnDestroyCallbacks(),n._registerOnCollectionChange(()=>{}))}function K(n,t){n.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(t)})}function Tt$3(n,t){if(t.valueAccessor.setDisabledState){let e=r=>{t.valueAccessor.setDisabledState(r)};n.registerOnDisabledChange(e),t._registerOnDestroy(()=>{n._unregisterOnDisabledChange(e)})}}function _e$2(n,t){let e=et$1(n);t.validator!==null?n.setValidators(Oe$1(e,t.validator)):typeof e==`function`&&n.setValidators([e]);let r=tt$1(n);t.asyncValidator!==null?n.setAsyncValidators(Oe$1(r,t.asyncValidator)):typeof r==`function`&&n.setAsyncValidators([r]);let i=()=>n.updateValueAndValidity();K(t._rawValidators,i),K(t._rawAsyncValidators,i)}function Q(n,t){let e=!1;if(n!==null){if(t.validator!==null){let i=et$1(n);if(Array.isArray(i)&&i.length>0){let o=i.filter(s=>s!==t.validator);o.length!==i.length&&(e=!0,n.setValidators(o))}}if(t.asyncValidator!==null){let i=tt$1(n);if(Array.isArray(i)&&i.length>0){let o=i.filter(s=>s!==t.asyncValidator);o.length!==i.length&&(e=!0,n.setAsyncValidators(o))}}}let r=()=>{};return K(t._rawValidators,r),K(t._rawAsyncValidators,r),e}function Pt(n,t){t.valueAccessor.registerOnChange(e=>{n._pendingValue=e,n._pendingChange=!0,n._pendingDirty=!0,n.updateOn===`change`&&ot$2(n,t)})}function jt(n,t){t.valueAccessor.registerOnTouched(()=>{n._pendingTouched=!0,n.updateOn===`blur`&&n._pendingChange&&ot$2(n,t),n.updateOn!==`submit`&&n.markAsTouched()})}function ot$2(n,t){n._pendingDirty&&n.markAsDirty(),n.setValue(n._pendingValue,{emitModelToViewChange:!1}),t.viewToModelUpdate(n._pendingValue),n._pendingChange=!1}function Gt$1(n,t){let e=(r,i)=>{t.valueAccessor.writeValue(r),i&&t.viewToModelUpdate(r)};n.registerOnChange(e),t._registerOnDestroy(()=>{n._unregisterOnChange(e)})}function st$2(n,t){_e$2(n,t)}function Bt(n,t){return Q(n,t)}function Lt(n,t){if(!Object.hasOwn(n,`model`))return!1;let e=n.model;return e.isFirstChange()?!0:!Object.is(t,e.currentValue)}function Ut$1(n){return Object.getPrototypeOf(n.constructor)===te}function at$2(n,t){n._syncPendingControls(),t.forEach(e=>{let r=e.control;r.updateOn===`submit`&&r._pendingChange&&(e.viewToModelUpdate(r._pendingValue),r._pendingChange=!1)})}function Ht(n,t){if(!t)return null;let e,r,i;return t.forEach(o=>{o.constructor===$e$1?e=o:Ut$1(o)?r=o:i=o}),i||r||e||null}function $t$1(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}function qt(n){return typeof n==`number`?n:parseFloat(n)}var lt$2=(()=>{class n{_validator=q$1;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let r=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(r),this._validator=this._enabled?this.createValidator(r):q$1,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static ɵfac=function(r){return new(r||n)};static ɵdir=Ne$1({type:n,features:[Xo]})}return n})();var Wt$1={provide:U$1,useExisting:gs(()=>zt$1),multi:!0};var zt$1=(()=>{class n extends lt$2{min;inputName=`min`;normalizeInput=e=>qt(e);createValidator=e=>qe$1(e);static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[`input`,`type`,`number`,`min`,``,`formControlName`,``],[`input`,`type`,`number`,`min`,``,`formControl`,``],[`input`,`type`,`number`,`min`,``,`ngModel`,``]],hostVars:1,hostBindings:function(r,i){r&2&&or$1(`min`,i._enabled?i.min:null)},inputs:{min:`min`},standalone:!1,features:[gb([Wt$1]),Zr]})}return n})();var Yt$1={provide:U$1,useExisting:gs(()=>ut$2),multi:!0};var ut$2=(()=>{class n extends lt$2{required;inputName=`required`;normalizeInput=je$2;createValidator=e=>We$1;enabled(e){return e}static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[``,`required`,``,`formControlName`,``,3,`type`,`checkbox`],[``,`required`,``,`formControl`,``,3,`type`,`checkbox`],[``,`required`,``,`ngModel`,``,3,`type`,`checkbox`]],hostVars:1,hostBindings:function(r,i){r&2&&or$1(`required`,i._enabled?``:null)},inputs:{required:`required`},standalone:!1,features:[gb([Yt$1]),Zr]})}return n})();var Xt$1={provide:wt$2,useFactory:()=>{let n=m$2(F$1,{self:!0});return{setParseErrors:t=>{n.setParseErrorSource(t)},set onReset(t){n.onReset=t}}}};var F$1=class extends z{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(t){this.userOnReset=t,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof S&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=Ht(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;pendingCustomValue=void 0;hasPendingCustomValue=!1;constructor(t,e,r){super(),this.injector=t,this.renderer=e,this.rawValueAccessors=r,this.injector?.get(Se$1)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let t=this.control,e=this.injector?.get(EC);if(!t||!e)return;let r=e.markForCheck.bind(e);if(this.subscription=new te$1,this.subscription.add(()=>this.discardPendingCustomValue(t)),typeof t.registerOnChange==`function`){let i=(o,s)=>{this.discardPendingCustomValue(t),s&&this.viewToModelUpdate(o),r()};t.registerOnChange(i),this.subscription.add(()=>t._unregisterOnChange(i))}this.subscription.add(t.valueChanges.subscribe(r)),this.subscription.add(t.statusChanges.subscribe(r)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=t.events.subscribe(i=>{i instanceof S&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&t.addValidators(this.parseErrorsValidator)}ngControlCreate(t){!t.nativeElement.hasAttribute?.(`ngNoCva`)&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!t.customControl||(this.isCustomControlBased=!0,t.listenToCustomControlModel(i=>{let o=this.control;o&&(o._pendingValue=i,o._pendingChange=!0,o._pendingDirty=!0,this.pendingCustomValue=i,this.hasPendingCustomValue=!0,o.updateOn===`change`&&this.updateControlFromCustom(o))}),t.listenToCustomControlOutput(`touch`,()=>{let i=this.control;i&&(i._pendingTouched=!0,i.updateOn===`blur`&&i._pendingChange&&this.updateControlFromCustom(i),i.updateOn!==`submit`&&i.markAsTouched())}),this.customControlBindings={},this.isNativeFormElement=kt$1(t.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(i=>i instanceof ut$2))}updateControlFromCustom(t){let e=t._pendingValue;t._pendingChange=!1,this.clearPendingCustomValue(),this.customControlBindings&&(this.customControlBindings.value=e),t._pendingDirty&&t.markAsDirty(),t.setValue(e,{emitModelToViewChange:!1}),this.viewToModelUpdate(t.value)}discardPendingCustomValue(t){this.hasPendingCustomValue&&(this.customControlBindings&&(this.customControlBindings.value=this.pendingCustomValue),this.clearPendingCustomValue(),t._pendingValue=t.value,t._pendingChange=!1,t._pendingDirty=!1)}clearPendingCustomValue(){this.pendingCustomValue=void 0,this.hasPendingCustomValue=!1}ngControlUpdate(t,e){if(!this.isCustomControlBased)return;let r=this.control,i=this.customControlBindings;if(!r||!i)return;this.hasPendingCustomValue&&!r._pendingChange&&(i.value=this.pendingCustomValue,this.clearPendingCustomValue()),Object.is(i.value,r.value)||(this.discardPendingCustomValue(r),i.value=r.value,t.setCustomControlModelInput(r.value)),this.bindControlProperty(t,i,`touched`,r.touched),this.bindControlProperty(t,i,`dirty`,r.dirty),this.bindControlProperty(t,i,`valid`,r.valid),this.bindControlProperty(t,i,`invalid`,r.invalid),this.bindControlProperty(t,i,`pending`,r.pending),this.bindControlProperty(t,i,`disabled`,r.disabled),this.shouldBindRequired&&this.bindControlProperty(t,i,`required`,this.isRequired);let o=r.errors;if(i.errors!==o){i.errors=o;let s=this._convertErrors(o);t.setInputOnDirectives(`errors`,s)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(t,e,r,i){if(e[r]===i)return;e[r]=i;let o=t.setInputOnDirectives(r,i);this.isNativeFormElement&&!o&&(r===`disabled`||r===`required`)&&this.renderer&&Ot$1(this.renderer,t.nativeElement,r,i)}_convertErrors(t){if(t===null)return[];let e=this.control;return Object.entries(t).map(([r,i])=>new he$1({context:i,kind:r,control:e}))}setParseErrorSource(t){if(t===void 0)return;let e=null,r=Le$2(()=>{let i=t();return i.length===0?null:i.reduce((o,s)=>(o[s.kind]=s,o),{})});this.parseErrorsValidator=()=>(e=Kr(r),e),Vs(()=>{let i=r();i!==e&&(e=i,this.control?.updateValueAndValidity({emitEvent:!1}),this.injector?.get(EC)?.markForCheck())},{injector:this.injector})}removeParseErrorsValidator(t){this.parseErrorsValidator&&(t?.removeValidators(this.parseErrorsValidator),t?.updateValueAndValidity({emitEvent:!1}))}};var J$1=class{_cd;constructor(t){this._cd=t}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Sn$1=(()=>{class n extends J$1{constructor(e){super(e)}static ɵfac=function(r){return new(r||n)(bt$3(F$1,2))};static ɵdir=Ne$1({type:n,selectors:[[``,`formControlName`,``],[``,`ngModel`,``],[``,`formControl`,``]],hostVars:14,hostBindings:function(r,i){r&2&&yt$2(`ng-untouched`,i.isUntouched)(`ng-touched`,i.isTouched)(`ng-pristine`,i.isPristine)(`ng-dirty`,i.isDirty)(`ng-valid`,i.isValid)(`ng-invalid`,i.isInvalid)(`ng-pending`,i.isPending)},standalone:!1,features:[Zr]})}return n})();var Fn$1=(()=>{class n extends J$1{constructor(e){super(e)}static ɵfac=function(r){return new(r||n)(bt$3(v,10))};static ɵdir=Ne$1({type:n,selectors:[[``,`formGroupName`,``],[``,`formArrayName`,``],[``,`ngModelGroup`,``],[``,`formGroup`,``],[``,`formArray`,``],[`form`,3,`ngNoForm`,``],[``,`ngForm`,``]],hostVars:16,hostBindings:function(r,i){r&2&&yt$2(`ng-untouched`,i.isUntouched)(`ng-touched`,i.isTouched)(`ng-pristine`,i.isPristine)(`ng-dirty`,i.isDirty)(`ng-valid`,i.isValid)(`ng-invalid`,i.isInvalid)(`ng-pending`,i.isPending)(`ng-submitted`,i.isSubmitted)},standalone:!1,features:[Zr]})}return n})();var ee=class extends Z$1{constructor(t,e,r){super(nt$2(e),rt$1(r,e)),this.controls=t,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(t,e){return this._find(t)||(this.controls[t]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(t,e,r={}){this.registerControl(t,e),this.updateValueAndValidity({emitEvent:r.emitEvent}),this._onCollectionChange()}removeControl(t,e={}){let r=this._find(t);r&&r._registerOnCollectionChange(()=>{}),delete this.controls[t],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(t,e,r={}){let i=this._find(t);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[t],e&&this.registerControl(t,e),this.updateValueAndValidity({emitEvent:r.emitEvent}),this._onCollectionChange()}contains(t){return this._find(t)?.enabled===!0}setValue(t,e={}){Kr(()=>{St$2(this,!0,t),Object.keys(t).forEach(r=>{It$2(this,!0,r),this.controls[r].setValue(t[r],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(t,e={}){t!=null&&(Object.keys(t).forEach(r=>{let i=this._find(r);i&&i.patchValue(t[r],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(t={},e={}){this._forEachChild((r$25,i)=>{r$25.reset(t?t[i]:null,s(r({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new S(this))}getRawValue(){return this._reduceChildren({},(t,e,r)=>(t[r]=e.getRawValue(),t))}_syncPendingControls(){let t=this._reduceChildren(!1,(e,r)=>r._syncPendingControls()?!0:e);return t&&this.updateValueAndValidity({onlySelf:!0}),t}_forEachChild(t){Object.keys(this.controls).forEach(e=>{let r=this.controls[e];r&&t(r,e)})}_setUpControls(){this._forEachChild(t=>{t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(t){for(let[e,r]of Object.entries(this.controls))if(this.contains(e)&&t(r))return!0;return!1}_reduceValue(){return this._reduceChildren({},(e,r,i)=>((r.enabled||this.disabled)&&(e[i]=r.value),e))}_reduceChildren(t,e){let r=t;return this._forEachChild((i,o)=>{r=e(r,i,o)}),r}_allControlsDisabled(){for(let t of Object.keys(this.controls))if(this.controls[t].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(t){return it$2(this.controls,t)?this.controls[t]:null}};var Zt$1={provide:v,useExisting:gs(()=>Kt$1)};var j$1=Promise.resolve();var Kt$1=(()=>{class n extends v{callSetDisabledState;get submitted(){return Kr(this.submittedReactive)}_submitted=Le$2(()=>this.submittedReactive());submittedReactive=be$1(!1);_directives=/* @__PURE__ */ new Set;form;ngSubmit=new _e$3;options;constructor(e,r,i){super(),this.callSetDisabledState=i,this.form=new ee({},ge$2(e),ye$2(r))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){j$1.then(()=>{e.control=this._findContainer(e.path).registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){j$1.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){j$1.then(()=>{let r=this._findContainer(e.path),i=new ee({});st$2(i,e),r.registerControl(e.name,i),i.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){j$1.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,r){j$1.then(()=>{this.form.get(e.path).setValue(r)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),at$2(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new X$1(this.control)),e?.target?.method===`dialog`}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static ɵfac=function(r){return new(r||n)(bt$3(U$1,10),bt$3(me$1,10),bt$3(re$1,8))};static ɵdir=Ne$1({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`formGroup`,``,3,`formArray`,``],[`ng-form`],[``,`ngForm`,``]],hostBindings:function(r,i){r&1&&Wg(`submit`,function(s){return i.onSubmit(s)})(`reset`,function(){return i.onReset()})},inputs:{options:[0,`ngFormOptions`,`options`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[gb([Zt$1]),Zr]})}return n})();function je$1(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}function Ge$1(n){return typeof n==`object`&&n!==null&&Object.keys(n).length===2&&`value`in n&&`disabled`in n}var dt$2=class extends Z$1{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(t=null,e,r){super(nt$2(e),rt$1(r,e)),this._applyFormState(t),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),ne(e)&&(e.nonNullable||e.initialValueIsDefault)&&(Ge$1(t)?this.defaultValue=t.value:this.defaultValue=t)}setValue(t,e={}){Kr(()=>{this.value=this._pendingValue=t,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(r=>r(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(t,e={}){this.setValue(t,e)}reset(t=this.defaultValue,e={}){this._applyFormState(t),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new S(this))}_updateValue(){}_anyControls(t){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(t){this._onChange.push(t)}_unregisterOnChange(t){je$1(this._onChange,t)}registerOnDisabledChange(t){this._onDisabledChange.push(t)}_unregisterOnDisabledChange(t){je$1(this._onDisabledChange,t)}_forEachChild(t){}_syncPendingControls(){return this.updateOn===`submit`&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(t){Ge$1(t)?(this.value=this._pendingValue=t.value,t.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=t}};var Qt$1=n=>n instanceof dt$2;var Jt$1=(()=>{class n extends v{callSetDisabledState;get submitted(){return Kr(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=Le$2(()=>this._submittedReactive());_submittedReactive=be$1(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,r,i){super(),this.callSetDisabledState=i,this._setValidators(e),this._setAsyncValidators(r)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){if(!this.form)throw new b$2(1052,!1);Object.hasOwn(e,`form`)&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(Q(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let r=this.form.get(e.path);if(!r)throw new b$2(-1055,!1);return e._setupWithForm(r,this.callSetDisabledState),r.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),r}getControl(e){return this.form.get(e.path)}removeControl(e){Pe$1(e.control||null,e,!1),$t$1(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,r){this.form.get(e.path).setValue(r)}onReset(){this.resetForm()}resetForm(e=void 0,r={}){this.form.reset(e,r),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,at$2(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new X$1(this.control)),e?.target?.method===`dialog`}_updateDomValue(){this.directives.forEach(e=>{let r=e.control,i=this.form.get(e.path);r!==i&&(Pe$1(r||null,e),Qt$1(i)&&e._setupWithForm(i,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let r=this.form.get(e.path);st$2(r,e),r.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let r=this.form?.get(e.path);r&&Bt(r,e)&&r.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){_e$2(this.form,this),this._oldForm&&Q(this._oldForm,this)}static ɵfac=function(r){return new(r||n)(bt$3(U$1,10),bt$3(me$1,10),bt$3(re$1,8))};static ɵdir=Ne$1({type:n,features:[Zr,Xo]})}return n})();var en$1={provide:v,useExisting:gs(()=>tn$1)};var tn$1=(()=>{class n extends Jt$1{form=null;ngSubmit=new _e$3;get control(){return this.form}static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[``,`formGroup`,``]],hostBindings:function(r,i){r&1&&Wg(`submit`,function(s){return i.onSubmit(s)})(`reset`,function(){return i.onReset()})},inputs:{form:[0,`formGroup`,`form`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[gb([en$1]),Zr]})}return n})();var nn$1={provide:F$1,useExisting:gs(()=>rn$1)};var Be$1=Promise.resolve();var rn$1=(()=>{class n extends F$1{_changeDetectorRef;callSetDisabledState;control=new dt$2;static ngAcceptInputType_isDisabled;_registered=!1;_ngModelInjector;viewModel;name=``;isDisabled;model;options;update=new _e$3;constructor(e,r,i,o,s,d,g,k){super(g,k,o),this._changeDetectorRef=s,this.callSetDisabledState=d,this._parent=e,this._setValidators(r),this._setAsyncValidators(i)}ngOnChanges(e){if(this._registered,this._checkForErrors(),!this._registered||`name`in e){if(this._registered&&(this._checkName(),this.formDirective)){let r=e.name.previousValue;this.formDirective.removeControl({name:r,path:this._getPath(r)})}this._setUpControl()}`isDisabled`in e&&this._updateDisabled(e),Lt(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}ɵngControlCreate(e){super.ngControlCreate(e)}ɵngControlUpdate(e){super.ngControlUpdate(e,!1)}get shouldBindRequired(){return!1}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Te(this.control,this,this.callSetDisabledState)),this.control.updateValueAndValidity({emitEvent:!1})}_setupWithForm(e){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Te(this.control,this,e))}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){Be$1.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let r=e.isDisabled.currentValue,i=r!==0&&je$2(r);Be$1.then(()=>{i&&!this.control.disabled?this.control.disable():!i&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?Rt$3(e,this._parent):[e]}static ɵfac=function(r){return new(r||n)(bt$3(v,9),bt$3(U$1,10),bt$3(me$1,10),bt$3(L,10),bt$3(EC,8),bt$3(re$1,8),bt$3(X$2,8),bt$3($r,8))};static ɵdir=Ne$1({type:n,selectors:[[``,`ngModel`,``,3,`formControlName`,``,3,`formControl`,``]],inputs:{name:`name`,isDisabled:[0,`disabled`,`isDisabled`],model:[0,`ngModel`,`model`],options:[0,`ngModelOptions`,`options`]},outputs:{update:`ngModelChange`},exportAs:[`ngModel`],standalone:!1,features:[gb([nn$1,Xt$1]),Zr,Xo,Cw(null)]})}return n})();var On$1=(()=>{class n{static ɵfac=function(r){return new(r||n)};static ɵdir=Ne$1({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`ngNativeValidate`,``]],hostAttrs:[`novalidate`,``],standalone:!1})}return n})();var on$1={provide:L,useExisting:gs(()=>sn$1),multi:!0};var sn$1=(()=>{class n extends te{writeValue(e){let r=e??``;this.setProperty(`value`,r)}registerOnChange(e){this.onChange=r=>{e(r==``?null:parseFloat(r))}}static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[`input`,`type`,`number`,`formControlName`,``,3,`ngNoCva`,``],[`input`,`type`,`number`,`formControl`,``,3,`ngNoCva`,``],[`input`,`type`,`number`,`ngModel`,``,3,`ngNoCva`,``]],hostBindings:function(r,i){r&1&&Wg(`input`,function(s){return i.onChange(s.target.value)})(`blur`,function(){return i.onTouched()})},standalone:!1,features:[gb([on$1]),Zr]})}return n})();var an$1={provide:L,useExisting:gs(()=>ht$1),multi:!0};function ct$2(n,t){return n==null?`${t}`:(t&&typeof t==`object`&&(t=`Object`),`${n}: ${t}`.slice(0,50))}function ln$1(n){return n.split(`:`)[0]}var ht$1=(()=>{class n extends te{value;_optionMap=/* @__PURE__ */ new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;appRefInjector=m$2(rr$1).injector;destroyRef=m$2(Se$1);cdr=m$2(EC);_queuedWrite=!1;_writeValueAfterRender(){this._queuedWrite||this.appRefInjector.destroyed||(this._queuedWrite=!0,Hu({write:()=>{this.destroyRef.destroyed||(this._queuedWrite=!1,this.writeValue(this.value))}},{injector:this.appRefInjector}))}writeValue(e){this.cdr.markForCheck(),this.value=e;let i=ct$2(this._getOptionId(e),e);this.setProperty(`value`,i)}registerOnChange(e){this.onChange=r=>{this.value=this._getOptionValue(r),e(this.value)}}_registerOption(){return(this._idCounter++).toString()}_getOptionId(e){for(let r of this._optionMap.keys())if(this._compareWith(this._optionMap.get(r),e))return r;return null}_getOptionValue(e){let r=ln$1(e);return this._optionMap.has(r)?this._optionMap.get(r):e}static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[`select`,`formControlName`,``,3,`multiple`,``,3,`ngNoCva`,``],[`select`,`formControl`,``,3,`multiple`,``,3,`ngNoCva`,``],[`select`,`ngModel`,``,3,`multiple`,``,3,`ngNoCva`,``]],hostBindings:function(r,i){r&1&&Wg(`change`,function(s){return i.onChange(s.target.value)})(`blur`,function(){return i.onTouched()})},inputs:{compareWith:`compareWith`},standalone:!1,features:[gb([an$1]),Zr]})}return n})();var wn$1=(()=>{class n{_element;_renderer;_select;id;constructor(e,r,i){this._element=e,this._renderer=r,this._select=i,this._select&&(this.id=this._select._registerOption())}set ngValue(e){this._select!=null&&(this._select._optionMap.set(this.id,e),this._setElementValue(ct$2(this.id,e)),this._select._writeValueAfterRender())}set value(e){this._setElementValue(e),this._select?._writeValueAfterRender()}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,`value`,e)}ngOnDestroy(){this._select?._optionMap.delete(this.id),this._select?._writeValueAfterRender()}static ɵfac=function(r){return new(r||n)(bt$3(ie$1),bt$3($r),bt$3(ht$1,9))};static ɵdir=Ne$1({type:n,selectors:[[`option`]],inputs:{ngValue:`ngValue`,value:`value`},standalone:!1})}return n})();var Le$1=Symbol(`negativeZero`);var un$1={provide:L,useExisting:gs(()=>pt$2),multi:!0};function Ue$1(n,t){return n==null?`${t}`:(typeof t==`string`&&(t=`'${t}'`),t&&typeof t==`object`&&(t=`Object`),`${n}: ${t}`.slice(0,50))}function dn$1(n){return n.split(`:`)[0]}var pt$2=(()=>{class n extends te{value;_optionMap=/* @__PURE__ */ new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let r;if(Array.isArray(e)){let i=this._getOptionIds(e);r=(o,s)=>{o._setSelected(i.has(s))}}else r=i=>{i._setSelected(!1)};this._optionMap.forEach(r)}registerOnChange(e){this.onChange=r=>{let i=[],o=r.selectedOptions;if(o!==void 0){let s=o;for(let d=0;d<s.length;d++){let g=s[d],k=this._getOptionValue(g.value);i.push(k)}}else{let s=r.options;for(let d=0;d<s.length;d++){let g=s[d];if(g.selected){let k=this._getOptionValue(g.value);i.push(k)}}}this.value=i,e(i)}}_registerOption(e){let r=(this._idCounter++).toString();return this._optionMap.set(r,e),r}_getOptionIds(e){if(this._compareWith!==Object.is||e.length<2)return new Set(e.map(o=>this._getOptionId(o)).filter(o=>o!==null));let r=/* @__PURE__ */ new Set;e.forEach(o=>r.add(o===0&&Object.is(o,-0)?Le$1:o));let i=/* @__PURE__ */ new Set;for(let[o,s]of this._optionMap){if(r.size===0)break;let d=s._value,g=d===0&&Object.is(d,-0)?Le$1:d;r.delete(g)&&i.add(o)}return i}_getOptionId(e){for(let r of this._optionMap.keys())if(this._compareWith(this._optionMap.get(r)._value,e))return r;return null}_getOptionValue(e){let r=dn$1(e);return this._optionMap.has(r)?this._optionMap.get(r)._value:e}static ɵfac=(()=>{let e;return function(i){return(e||(e=th(n)))(i||n)}})();static ɵdir=Ne$1({type:n,selectors:[[`select`,`multiple`,``,`formControlName`,``,3,`ngNoCva`,``],[`select`,`multiple`,``,`formControl`,``,3,`ngNoCva`,``],[`select`,`multiple`,``,`ngModel`,``,3,`ngNoCva`,``]],hostBindings:function(r,i){r&1&&Wg(`change`,function(s){return i.onChange(s.target)})(`blur`,function(){return i.onTouched()})},inputs:{compareWith:`compareWith`},standalone:!1,features:[gb([un$1]),Zr]})}return n})();var Rn$1=(()=>{class n{_element;_renderer;_select;id;_value;constructor(e,r,i){this._element=e,this._renderer=r,this._select=i,this._select&&(this.id=this._select._registerOption(this))}set ngValue(e){this._select!=null&&(this._value=e,this._setElementValue(Ue$1(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._select?(this._value=e,this._setElementValue(Ue$1(this.id,e)),this._select.writeValue(this._select.value)):this._setElementValue(e)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,`value`,e)}_setSelected(e){this._renderer.setProperty(this._element.nativeElement,`selected`,e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static ɵfac=function(r){return new(r||n)(bt$3(ie$1),bt$3($r),bt$3(pt$2,9))};static ɵdir=Ne$1({type:n,selectors:[[`option`]],inputs:{ngValue:`ngValue`,value:`value`},standalone:!1})}return n})();var cn$1=(()=>{class n{static ɵfac=function(r){return new(r||n)};static ɵmod=ye$3({type:n});static ɵinj=ue$1({})}return n})();var Tn$2=(()=>{class n{static withConfig(e){return{ngModule:n,providers:[{provide:re$1,useValue:e.callSetDisabledState??ve$2}]}}static ɵfac=function(r){return new(r||n)};static ɵmod=ye$3({type:n});static ɵinj=ue$1({imports:[cn$1]})}return n})();var Bn$1=(()=>{class n{_animationsDisabled=to$1();state=`unchecked`;disabled=!1;appearance=`full`;static ɵfac=function(r){return new(r||n)};static ɵcmp=Fe$1({type:n,selectors:[[`mat-pseudo-checkbox`]],hostAttrs:[1,`mat-pseudo-checkbox`],hostVars:12,hostBindings:function(r,i){r&2&&yt$2(`mat-pseudo-checkbox-indeterminate`,i.state===`indeterminate`)(`mat-pseudo-checkbox-checked`,i.state===`checked`)(`mat-pseudo-checkbox-disabled`,i.disabled)(`mat-pseudo-checkbox-minimal`,i.appearance===`minimal`)(`mat-pseudo-checkbox-full`,i.appearance===`full`)(`_mat-animation-noopable`,i._animationsDisabled)},inputs:{state:`state`,disabled:`disabled`,appearance:`appearance`},decls:0,vars:0,template:function(r,i){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return n})();var kt=new y(`MAT_OPTION_PARENT_COMPONENT`);var zt=new y(`MatOptgroup`);var be=class{source;isUserInput;constructor(d,e=!1){this.source=d,this.isUserInput=e}};var Je=(()=>{class n{_element=m$2(ie$1);_changeDetectorRef=m$2(EC);_parent=m$2(kt,{optional:!0});group=m$2(zt,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue=``;get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=m$2(Yd).getId(`mat-option-`);get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=be$1(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new _e$3;_text;_stateChanges=new V;constructor(){let e=m$2(Ut$2);e.load(Qy),e.load(Ga),this._signalDisableRipple=!!this._parent&&an$2(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||``).trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let o=this._getHostElement();typeof o.focus==`function`&&o.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!jy(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new be(this,e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`text`],t=[[[`mat-icon`]],`*`],o=[`mat-icon`,`*`];function r(b,S){if(b&1&&Vg(0,`mat-pseudo-checkbox`,1),b&2){let l=rS();Bg(`disabled`,l.disabled)(`state`,l.selected?`checked`:`unchecked`)}}function f(b,S){if(b&1&&Vg(0,`mat-pseudo-checkbox`,3),b&2){let l=rS();Bg(`disabled`,l.disabled)}}function y(b,S){if(b&1&&(fa(0,`span`,4),MS(1),fd()),b&2){let l=rS();ti$1(),hd(`(`,l.group.label,`)`)}}return Fe$1({type:n,selectors:[[`mat-option`]],viewQuery:function(S,l){if(S&1&&Kg(e,7),S&2){let O;sS(O=aS())&&(l._text=O.first)}},hostAttrs:[`role`,`option`,1,`mat-mdc-option`,`mdc-list-item`],hostVars:11,hostBindings:function(S,l){S&1&&Wg(`click`,function(){return l._selectViaInteraction()})(`keydown`,function($){return l._handleKeydown($)}),S&2&&($g(`id`,l.id),or$1(`aria-selected`,l.selected)(`aria-disabled`,l.disabled.toString()),yt$2(`mdc-list-item--selected`,l.selected)(`mat-mdc-option-multiple`,l.multiple)(`mat-mdc-option-active`,l.active)(`mdc-list-item--disabled`,l.disabled))},inputs:{value:`value`,id:`id`,disabled:[2,`disabled`,`disabled`,je$2]},outputs:{onSelectionChange:`onSelectionChange`},exportAs:[`matOption`],ngContentSelectors:o,decls:8,vars:5,consts:[[`text`,``],[`aria-hidden`,`true`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`,`state`],[1,`mdc-list-item__primary-text`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`],[1,`cdk-visually-hidden`],[`aria-hidden`,`true`,`mat-ripple`,``,1,`mat-mdc-option-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`]],template:function(S,l){S&1&&(ir$1(t),si$1(0,r,1,2,`mat-pseudo-checkbox`,1),it$3(1),fa(2,`span`,2,0),it$3(4,1),fd(),si$1(5,f,1,1,`mat-pseudo-checkbox`,3),si$1(6,y,2,1,`span`,4),Vg(7,`div`,5)),S&2&&(ai$1(l.multiple?0:-1),ti$1(5),ai$1(!l.multiple&&l.selected&&!l.hideSingleSelectionIndicator?5:-1),ti$1(),ai$1(l.group&&l.group._inert?6:-1),ti$1(),Bg(`matRippleTrigger`,l._getHostElement())(`matRippleDisabled`,l.disabled||l.disableRipple))},dependencies:[Bn$1,Vz],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return n})();function Ut(n,d,e){if(e.length){let t=d.toArray(),o=e.toArray(),r=0;for(let f=0;f<n+1;f++)t[f].group&&t[f].group===o[r]&&r++;return r}return 0}function $t(n,d,e,t){return n<e?n:n+d>e+t?Math.max(0,n-t+d):e}var xe$1=class{_box;_destroyed=new V;_resizeSubject=new V;_resizeObserver;_elementObservables=/* @__PURE__ */ new Map;constructor(d){this._box=d,typeof ResizeObserver<`u`&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(d){return this._elementObservables.has(d)||this._elementObservables.set(d,new M$1(e=>{let t=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(d,{box:this._box}),()=>{this._resizeObserver?.unobserve(d),t.unsubscribe(),this._elementObservables.delete(d)}}).pipe(G$2(e=>e.filter(t=>t.target===d)),Be$2(e=>e.length>0),eE({bufferSize:1,refCount:!0}),ho$1(this._destroyed))),this._elementObservables.get(d)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}};var et=(()=>{class n{_cleanupErrorListener;_observers=/* @__PURE__ */ new Map;_ngZone=m$2(L$1);constructor(){}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,t){let o=t?.box||`content-box`;return this._observers.has(o)||this._observers.set(o,new xe$1(o)),this._observers.get(o).observe(e)}static ɵfac=function(t){return new(t||n)};static ɵprov=P$1({token:n,factory:n.ɵfac})}return n})();var ge$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[`mat-label`]]})}return n})();var rt=new y(`MatError`);var ve$1=(()=>{class n{align=`start`;id=m$2(Yd).getId(`mat-mdc-hint-`);static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[`mat-hint`]],hostAttrs:[1,`mat-mdc-form-field-hint`,`mat-mdc-form-field-bottom-align`],hostVars:4,hostBindings:function(t,o){t&2&&($g(`id`,o.id),or$1(`align`,null),yt$2(`mat-mdc-form-field-hint-end`,o.align===`end`))},inputs:{align:`align`,id:`id`}})}return n})();var _e$1=new y(`MatPrefix`);var Ot=(()=>{class n{set _isTextSelector(e){this._isText=!0}_isText=!1;static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[``,`matPrefix`,``],[``,`matIconPrefix`,``],[``,`matTextPrefix`,``]],inputs:{_isTextSelector:[0,`matTextPrefix`,`_isTextSelector`]},features:[gb([{provide:_e$1,useExisting:n}])]})}return n})();var ye$1=new y(`MatSuffix`);var Et$1=(()=>{class n{set _isTextSelector(e){this._isText=!0}_isText=!1;static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[``,`matSuffix`,``],[``,`matIconSuffix`,``],[``,`matTextSuffix`,``]],inputs:{_isTextSelector:[0,`matTextSuffix`,`_isTextSelector`]},features:[gb([{provide:ye$1,useExisting:n}])]})}return n})();var dt$1=new y(`FloatingLabelParent`);var tt=(()=>{class n{_elementRef=m$2(ie$1);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=m$2(et);_ngZone=m$2(L$1);_parent=m$2(dt$1);_resizeSubscription=new te$1;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return Rt$2(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:`border-box`}).subscribe(()=>this._handleResize())})}static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[`label`,`matFormFieldFloatingLabel`,``]],hostAttrs:[1,`mdc-floating-label`,`mat-mdc-floating-label`],hostVars:2,hostBindings:function(t,o){t&2&&yt$2(`mdc-floating-label--float-above`,o.floating)},inputs:{floating:`floating`,monitorResize:`monitorResize`}})}return n})();function Rt$2(n){let d=n;if(d.offsetParent!==null)return d.scrollWidth;let e=d.cloneNode(!0);e.style.setProperty(`position`,`absolute`),e.style.setProperty(`transform`,`translate(-9999px, -9999px)`),document.documentElement.appendChild(e);let t=e.scrollWidth;return e.remove(),t}var nt$1=`mdc-line-ripple--active`;var re=`mdc-line-ripple--deactivating`;var it$1=(()=>{class n{_elementRef=m$2(ie$1);_cleanupTransitionEnd;constructor(){let e=m$2(L$1),t=m$2($r);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=t.listen(this._elementRef.nativeElement,`transitionend`,this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(re),e.add(nt$1)}deactivate(){this._elementRef.nativeElement.classList.add(re)}_handleTransitionEnd=e=>{let t=this._elementRef.nativeElement.classList,o=t.contains(re);e.propertyName===`opacity`&&o&&t.remove(nt$1,re)};ngOnDestroy(){this._cleanupTransitionEnd()}static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n,selectors:[[`div`,`matFormFieldLineRipple`,``]],hostAttrs:[1,`mdc-line-ripple`]})}return n})();var ot$1=(()=>{class n{_elementRef=m$2(ie$1);_ngZone=m$2(L$1);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,t=e.querySelector(`.mdc-floating-label`);t?(e.classList.add(`mdc-notched-outline--upgraded`),typeof requestAnimationFrame==`function`&&(t.style.transitionDuration=`0s`,this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>t.style.transitionDuration=``)}))):e.classList.add(`mdc-notched-outline--no-label`)}_setNotchWidth(e){let t=this._notch.nativeElement;!this.open||!e?t.style.width=``:t.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty(`--mat-form-field-notch-max-width`,`calc(100% - ${e}px)`)}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`notch`];return Fe$1({type:n,selectors:[[`div`,`matFormFieldNotchedOutline`,``]],viewQuery:function(r,f){if(r&1&&Kg(e,5),r&2){let y;sS(y=aS())&&(f._notch=y.first)}},hostAttrs:[1,`mdc-notched-outline`],hostVars:2,hostBindings:function(r,f){r&2&&yt$2(`mdc-notched-outline--notched`,f.open)},inputs:{open:[0,`matFormFieldNotchedOutlineOpen`,`open`]},ngContentSelectors:[`*`],decls:5,vars:0,consts:[[`notch`,``],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__leading`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__notch`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__trailing`]],template:function(r,f){r&1&&(ir$1(),dn$2(0,`div`,1),ln$2(1,`div`,2,0),it$3(3),un$2(),dn$2(4,`div`,3))},encapsulation:2})})()}return n})();var mt$1=(()=>{class n{id;ngField=null;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;stateChanges=null;value;static ɵfac=function(t){return new(t||n)};static ɵdir=Ne$1({type:n})}return n})();var ct$1=new y(`MatFormField`);var st$1=new y(`MAT_FORM_FIELD_DEFAULT_OPTIONS`);var at$1=`fill`;var Tt$2=`auto`;var lt$1=`fixed`;var Dt$2=`translateY(-50%)`;var ft$2=(()=>{class n{_elementRef=m$2(ie$1);_changeDetectorRef=m$2(EC);_platform=m$2(Ee);_idGenerator=m$2(Yd);_ngZone=m$2(L$1);_defaults=m$2(st$1,{optional:!0});_currentDirection;_unwrapMaybeSignal(e){return an$2(e)?e():e}_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=C2(`iconPrefixContainer`);_textPrefixContainerSignal=C2(`textPrefixContainer`);_iconSuffixContainerSignal=C2(`iconSuffixContainer`);_textSuffixContainerSignal=C2(`textSuffixContainer`);_prefixSuffixContainers=Le$2(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=T2(ge$1);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=Sz(e)}_hideRequiredMarker=!1;color=`primary`;get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||Tt$2}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let t=e||this._defaults?.appearance||at$1;this._appearanceSignal.set(t)}_appearanceSignal=be$1(at$1);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||lt$1}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||lt$1}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel=``;_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId(`mat-mdc-form-field-label-`);_hintLabelId=this._idGenerator.getId(`mat-mdc-hint-`);_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new V;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=to$1();constructor(){let e=this._defaults,t=m$2(Mx);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),Vs(()=>this._currentDirection=t.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add(`mat-form-field-animations-enabled`)},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=se$1(this._control.ngField)?null:this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&!se$1(this._control.ngField)&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=Le$2(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel=`always`)}_initializeControl(e){let t=this._control,o=`mat-mdc-form-field-type-`;e&&this._elementRef.nativeElement.classList.remove(o+e.controlType),t.controlType&&this._elementRef.nativeElement.classList.add(o+t.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=t.stateChanges?.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=t.stateChanges?.pipe(vc([void 0,void 0]),G$2(()=>[this._unwrapMaybeSignal(t.errorState),t.userAriaDescribedBy]),Jv(),Be$2(([[r,f],[y,b]])=>r!==y||f!==b)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),t.ngControl&&t.ngControl.valueChanges&&!se$1(t.ngField)&&(this._valueChanges=t.ngControl.valueChanges.pipe(ho$1(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),Gv(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._unwrapMaybeSignal(this._control.focused);e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle(`mat-focused`,e),this._textField?.nativeElement.classList.toggle(`mdc-text-field--focused`,e)}_syncOutlineLabelOffset(){N2({earlyRead:()=>{if(this._appearanceSignal()!==`outline`)return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:`border-box`})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel===`always`}_hasOutline(){return this.appearance===`outline`}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=Le$2(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._shouldAlwaysFloat()||this._unwrapMaybeSignal(this._control.shouldLabelFloat):!1}_shouldForward(e){let t=this._control?.ngField||this._control?.ngControl;if(!t)return!1;if(se$1(t)){let o=t();return e===`valid`?o.valid():e===`dirty`?o.dirty():e===`touched`?o.touched():e===`pending`?o.pending():e===`untouched`?!o.touched():e===`pristine`?!o.dirty():e===`invalid`?!o.valid():!1}else{let o=t;return e===`valid`?o.valid:e===`dirty`?o.dirty:e===`touched`?o.touched:e===`pending`?o.pending:e===`untouched`?o.untouched:e===`pristine`?o.pristine:e===`invalid`?o.invalid:!1}}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._unwrapMaybeSignal(this._control.errorState)?`error`:`hint`}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy==`string`&&e.push(...this._control.userAriaDescribedBy.split(` `)),this._getSubscriptMessageType()===`hint`){let r=this._hintChildren?this._hintChildren.find(y=>y.align===`start`):null,f=this._hintChildren?this._hintChildren.find(y=>y.align===`end`):null;r?e.push(r.id):this._hintLabel&&e.push(this._hintLabelId),f&&e.push(f.id)}else this._errorChildren&&e.push(...this._errorChildren.map(r=>r.id));let t=this._control.describedByIds,o;if(t){let r=this._describedByIds||e;o=e.concat(t.filter(f=>f&&!r.includes(f)))}else o=e;this._control.setDescribedByIds(o),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return[``,null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,t=this._textPrefixContainer?.nativeElement,o=this._iconSuffixContainer?.nativeElement,r=this._textSuffixContainer?.nativeElement,f=e?.getBoundingClientRect().width??0,y=t?.getBoundingClientRect().width??0,b=o?.getBoundingClientRect().width??0,S=r?.getBoundingClientRect().width??0;return[`var(--mat-mdc-form-field-label-transform, ${Dt$2} translateX(${`calc(${this._currentDirection===`rtl`?`-1`:`1`} * (${`${f+y}px`} + var(--mat-mdc-form-field-label-offset-x, 0px)))`}))`,f+y+b+S]}_writeOutlinedLabelStyles(e){if(e!==null){let[t,o]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=t),o!==null&&this._notchedOutline?._setMaxWidth(o)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let t=e.getRootNode();return t&&t!==e}return document.documentElement.contains(e)}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`iconPrefixContainer`],t=[`textPrefixContainer`],o=[`iconSuffixContainer`],r=[`textSuffixContainer`],f=[`textField`],y=[`*`,[[`mat-label`]],[[``,`matPrefix`,``],[``,`matIconPrefix`,``]],[[``,`matTextPrefix`,``]],[[``,`matTextSuffix`,``]],[[``,`matSuffix`,``],[``,`matIconSuffix`,``]],[[`mat-error`],[``,`matError`,``]],[[`mat-hint`,3,`align`,`end`]],[[`mat-hint`,`align`,`end`]]],b=[`*`,`mat-label`,`[matPrefix], [matIconPrefix]`,`[matTextPrefix]`,`[matTextSuffix]`,`[matSuffix], [matIconSuffix]`,`mat-error, [matError]`,`mat-hint:not([align='end'])`,`mat-hint[align='end']`];function S(a,m){a&1&&Vg(0,`span`,21)}function l(a,m){if(a&1&&(fa(0,`label`,20),it$3(1,1),si$1(2,S,1,0,`span`,21),fd()),a&2){let i=rS(2);Bg(`floating`,i._shouldLabelFloat())(`monitorResize`,i._hasOutline())(`id`,i._labelId),or$1(`for`,i._control.disableAutomaticLabeling?null:i._control.id),ti$1(2),ai$1(!i.hideRequiredMarker&&i._unwrapMaybeSignal(i._control.required)?2:-1)}}function O(a,m){if(a&1&&si$1(0,l,3,5,`label`,20),a&2){let i=rS();ai$1(i._hasFloatingLabel()?0:-1)}}function $(a,m){a&1&&Vg(0,`div`,7)}function de(a,m){}function me(a,m){if(a&1&&Og(0,de,0,0,`ng-template`,13),a&2){rS(2);let i=lS(1);Bg(`ngTemplateOutlet`,i)}}function ce(a,m){if(a&1&&(fa(0,`div`,9),si$1(1,me,1,1,null,13),fd()),a&2){let i=rS();Bg(`matFormFieldNotchedOutlineOpen`,i._shouldLabelFloat()),ti$1(),ai$1(i._forceDisplayInfixLabel()?-1:1)}}function ht(a,m){a&1&&(fa(0,`div`,10,2),it$3(2,2),fd())}function bt(a,m){a&1&&(fa(0,`div`,11,3),it$3(2,3),fd())}function xt(a,m){}function gt(a,m){if(a&1&&Og(0,xt,0,0,`ng-template`,13),a&2){rS();let i=lS(1);Bg(`ngTemplateOutlet`,i)}}function vt(a,m){a&1&&(fa(0,`div`,14,4),it$3(2,4),fd())}function _t(a,m){a&1&&(fa(0,`div`,15,5),it$3(2,5),fd())}function yt(a,m){a&1&&Vg(0,`div`,16)}function St(a,m){a&1&&(fa(0,`div`,18),it$3(1,6),fd())}function wt(a,m){if(a&1&&(fa(0,`mat-hint`,22),MS(1),fd()),a&2){let i=rS(2);Bg(`id`,i._hintLabelId),ti$1(),sb(i.hintLabel)}}function Nt(a,m){if(a&1&&(fa(0,`div`,19),si$1(1,wt,2,2,`mat-hint`,22),it$3(2,7),Vg(3,`div`,23),it$3(4,8),fd()),a&2){let i=rS();ti$1(),ai$1(i.hintLabel?1:-1)}}return Fe$1({type:n,selectors:[[`mat-form-field`]],contentQueries:function(m,i,c){if(m&1&&(Yg(c,i._labelChild,ge$1,5),Zg(c,mt$1,5)(c,_e$1,5)(c,ye$1,5)(c,rt,5)(c,ve$1,5)),m&2){cS();let w;sS(w=aS())&&(i._formFieldControl=w.first),sS(w=aS())&&(i._prefixChildren=w),sS(w=aS())&&(i._suffixChildren=w),sS(w=aS())&&(i._errorChildren=w),sS(w=aS())&&(i._hintChildren=w)}},viewQuery:function(m,i){if(m&1&&(Qg(i._iconPrefixContainerSignal,e,5)(i._textPrefixContainerSignal,t,5)(i._iconSuffixContainerSignal,o,5)(i._textSuffixContainerSignal,r,5),Kg(f,5)(e,5)(t,5)(o,5)(r,5)(tt,5)(ot$1,5)(it$1,5)),m&2){cS(4);let c;sS(c=aS())&&(i._textField=c.first),sS(c=aS())&&(i._iconPrefixContainer=c.first),sS(c=aS())&&(i._textPrefixContainer=c.first),sS(c=aS())&&(i._iconSuffixContainer=c.first),sS(c=aS())&&(i._textSuffixContainer=c.first),sS(c=aS())&&(i._floatingLabel=c.first),sS(c=aS())&&(i._notchedOutline=c.first),sS(c=aS())&&(i._lineRipple=c.first)}},hostAttrs:[1,`mat-mdc-form-field`],hostVars:38,hostBindings:function(m,i){m&2&&yt$2(`mat-mdc-form-field-label-always-float`,i._shouldAlwaysFloat())(`mat-mdc-form-field-has-icon-prefix`,i._hasIconPrefix)(`mat-mdc-form-field-has-icon-suffix`,i._hasIconSuffix)(`mat-form-field-invalid`,i._unwrapMaybeSignal(i._control.errorState))(`mat-form-field-disabled`,i._unwrapMaybeSignal(i._control.disabled))(`mat-form-field-autofilled`,i._unwrapMaybeSignal(i._control.autofilled))(`mat-form-field-appearance-fill`,i.appearance==`fill`)(`mat-form-field-appearance-outline`,i.appearance==`outline`)(`mat-form-field-hide-placeholder`,i._hasFloatingLabel()&&!i._shouldLabelFloat())(`mat-primary`,i.color!==`accent`&&i.color!==`warn`)(`mat-accent`,i.color===`accent`)(`mat-warn`,i.color===`warn`)(`ng-untouched`,i._shouldForward(`untouched`))(`ng-touched`,i._shouldForward(`touched`))(`ng-pristine`,i._shouldForward(`pristine`))(`ng-dirty`,i._shouldForward(`dirty`))(`ng-valid`,i._shouldForward(`valid`))(`ng-invalid`,i._shouldForward(`invalid`))(`ng-pending`,i._shouldForward(`pending`))},inputs:{hideRequiredMarker:`hideRequiredMarker`,color:`color`,floatLabel:`floatLabel`,appearance:`appearance`,subscriptSizing:`subscriptSizing`,hintLabel:`hintLabel`},exportAs:[`matFormField`],features:[gb([{provide:ct$1,useExisting:n},{provide:dt$1,useExisting:n}])],ngContentSelectors:b,decls:18,vars:21,consts:[[`labelTemplate`,``],[`textField`,``],[`iconPrefixContainer`,``],[`textPrefixContainer`,``],[`textSuffixContainer`,``],[`iconSuffixContainer`,``],[1,`mat-mdc-text-field-wrapper`,`mdc-text-field`,3,`click`],[1,`mat-mdc-form-field-focus-overlay`],[1,`mat-mdc-form-field-flex`],[`matFormFieldNotchedOutline`,``,3,`matFormFieldNotchedOutlineOpen`],[1,`mat-mdc-form-field-icon-prefix`],[1,`mat-mdc-form-field-text-prefix`],[1,`mat-mdc-form-field-infix`],[3,`ngTemplateOutlet`],[1,`mat-mdc-form-field-text-suffix`],[1,`mat-mdc-form-field-icon-suffix`],[`matFormFieldLineRipple`,``],[`aria-atomic`,`true`,`aria-live`,`polite`,1,`mat-mdc-form-field-subscript-wrapper`,`mat-mdc-form-field-bottom-align`],[1,`mat-mdc-form-field-error-wrapper`],[1,`mat-mdc-form-field-hint-wrapper`],[`matFormFieldFloatingLabel`,``,3,`floating`,`monitorResize`,`id`],[`aria-hidden`,`true`,1,`mat-mdc-form-field-required-marker`,`mdc-floating-label--required`],[3,`id`],[1,`mat-mdc-form-field-hint-spacer`]],template:function(m,i){if(m&1&&(ir$1(y),Og(0,O,1,1,`ng-template`,null,0,YS),fa(2,`div`,6,1),Wg(`click`,function(w){return i._control.onContainerClick(w)}),si$1(4,$,1,0,`div`,7),fa(5,`div`,8),si$1(6,ce,2,2,`div`,9),si$1(7,ht,3,0,`div`,10),si$1(8,bt,3,0,`div`,11),fa(9,`div`,12),si$1(10,gt,1,1,null,13),it$3(11),fd(),si$1(12,vt,3,0,`div`,14),si$1(13,_t,3,0,`div`,15),fd(),si$1(14,yt,1,0,`div`,16),fd(),fa(15,`div`,17),si$1(16,St,2,0,`div`,18)(17,Nt,5,1,`div`,19),fd()),m&2){let c,w=i._unwrapMaybeSignal(i._control.disabled);ti$1(2),yt$2(`mdc-text-field--filled`,!i._hasOutline())(`mdc-text-field--outlined`,i._hasOutline())(`mdc-text-field--no-label`,!i._hasFloatingLabel())(`mdc-text-field--disabled`,w)(`mdc-text-field--invalid`,i._unwrapMaybeSignal(i._control.errorState)),ti$1(2),ai$1(!i._hasOutline()&&!w?4:-1),ti$1(2),ai$1(i._hasOutline()?6:-1),ti$1(),ai$1(i._hasIconPrefix?7:-1),ti$1(),ai$1(i._hasTextPrefix?8:-1),ti$1(2),ai$1(!i._hasOutline()||i._forceDisplayInfixLabel()?10:-1),ti$1(2),ai$1(i._hasTextSuffix?12:-1),ti$1(),ai$1(i._hasIconSuffix?13:-1),ti$1(),ai$1(i._hasOutline()?-1:14),ti$1(),yt$2(`mat-mdc-form-field-subscript-dynamic-size`,i.subscriptSizing===`dynamic`);let Ct=i._getSubscriptMessageType();ti$1(),ai$1((c=Ct)===`error`?16:c===`hint`?17:-1)}},dependencies:[tt,ot$1,YC,it$1,ve$1],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-filled-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-outlined-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-filled-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-outlined-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-top-right-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) {
  background-color: var(--%NS%mat-form-field-filled-container-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--%NS%mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-hover-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-filled-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-filled-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-filled-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-filled-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-outlined-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-outlined-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-outlined-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-outlined-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-outline-color, var(--%NS%mat-sys-outline));
  border-width: var(--%NS%mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-hover-outline-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-focus-outline-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-hover-outline-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-focus-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--%NS%mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--%NS%mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--%NS%mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-active-indicator-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-hover-active-indicator-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-active-indicator-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-hover-active-indicator-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--%NS%mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-focus-active-indicator-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-focus-active-indicator-color, var(--%NS%mat-sys-error));
}

.mdc-line-ripple--%NS%active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--%NS%deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--%NS%no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --%NS%mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--%NS%mat-form-field-container-height, 56px);
  padding-top: var(--%NS%mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--%NS%mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--%NS%mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--%NS%mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--%NS%mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--%NS%mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --%NS%mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--%NS%mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--%NS%mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--%NS%mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--%NS%mat-form-field-error-text-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-subscript-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-form-field-subscript-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-form-field-subscript-text-size, var(--%NS%mat-sys-body-small-size));
  letter-spacing: var(--%NS%mat-form-field-subscript-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  font-weight: var(--%NS%mat-form-field-subscript-text-weight, var(--%NS%mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-form-field-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--%NS%mat-form-field-select-option-text-color, var(--%NS%mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--%NS%mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--%NS%mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--%NS%mat-form-field-enabled-select-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-focus-select-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --%NS%mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-container-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-form-field-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-form-field-container-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-form-field-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
  font-weight: var(--%NS%mat-form-field-container-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--%NS%mat-form-field-outlined-label-text-populated-size) * var(--%NS%mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--%NS%mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-trailing-icon-color, var(--%NS%mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-hover-trailing-icon-color, var(--%NS%mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-focus-trailing-icon-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--%NS%filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})})()}return n})();var Tn$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ye$3({type:n});static ɵinj=ue$1({imports:[Ny,ft$2,no$1]})}return n})();var Pn$1=(()=>{class n{isErrorState(e,t){return!!(e&&e.invalid&&(e.touched||t&&t.submitted))}isSignalErrorState(e){if(!e)return!1;let t=e().invalid(),o=e().touched();return t&&o}static ɵfac=function(t){return new(t||n)};static ɵprov=P$1({token:n,factory:n.ɵfac})}return n})();var pt$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ye$3({type:n});static ɵinj=ue$1({imports:[no$1]})}return n})();var Wn$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ye$3({type:n});static ɵinj=ue$1({imports:[ev,pt$1,Je,no$1]})}return n})();var ut$1=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(d,e,t,o,r){this._defaultMatcher=d,this._parentFormGroup=t,this._parentForm=o,this._stateChanges=r,e?an$2(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let d=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==d&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(d){if(this.formField&&d?.isSignalErrorState)return d.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,t=this.ngControl?this.ngControl.control:null;return d?.isErrorState(t,e)??!1}};var f=`primary`;var Fe=Symbol(`RouteTitle`);var Yt=class{params;constructor(n){this.params=n||{}}has(n){return Object.hasOwn(this.params,n)}get(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e[0]:e}return null}getAll(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e:[e]}return[]}get keys(){return Object.keys(this.params)}};function oe(t){return new Yt(t)}function Vt(t,n,e){for(let r=0;r<t.length;r++){let i=t[r],o=n[r];if(i[0]===`:`)e[i.substring(1)]=o;else if(i!==o.path)return!1}return!0}function sn(t,n,e){let r=e.path.split(`/`),i=r.indexOf(`**`);if(i===-1){if(r.length>t.length||e.pathMatch===`full`&&(n.hasChildren()||r.length<t.length))return null;let s={},u=t.slice(0,r.length);return Vt(r,u,s)?{consumed:u,posParams:s}:null}if(i!==r.lastIndexOf(`**`))return null;let o=r.slice(0,i),a=r.slice(i+1);if(o.length+a.length>t.length||e.pathMatch===`full`&&n.hasChildren()&&e.path!==`**`)return null;let c={};return!Vt(o,t.slice(0,o.length),c)||!Vt(a,t.slice(t.length-a.length),c)?null:{consumed:t,posParams:c}}function ct(t){return new Promise((n,e)=>{t.pipe(Qv()).subscribe({next:r=>n(r),error:r=>e(r)})})}function ti(t,n){if(t.length!==n.length)return!1;for(let e=0;e<t.length;++e)if(!H(t[e],n[e]))return!1;return!0}function H(t,n){let e=t?Zt(t):void 0,r=n?Zt(n):void 0;if(!e||!r||e.length!=r.length)return!1;let i;for(let o=0;o<e.length;o++)if(i=e[o],!cn(t[i],n[i]))return!1;return!0}function Zt(t){return[...Object.keys(t),...Object.getOwnPropertySymbols(t)]}function cn(t,n){if(Array.isArray(t)&&Array.isArray(n)){if(t.length!==n.length)return!1;let e=[...t].sort(),r=[...n].sort();return e.every((i,o)=>r[o]===i)}else return t===n}function ri(t){return t.length>0?t[t.length-1]:null}function Be(t){return Pv(t)?t:wa(t)?lt$3(Promise.resolve(t)):Ye$1(t)}function un(t){return Pv(t)?ct(t):Promise.resolve(t)}var ni={exact:dn,subset:hn};var ln={exact:ii,subset:oi,ignored:()=>!0};var dr={paths:`exact`,fragment:`ignored`,matrixParams:`ignored`,queryParams:`exact`};var pe={paths:`subset`,fragment:`ignored`,matrixParams:`ignored`,queryParams:`subset`};function hr(t,n,e){let r=t instanceof M?t:n.parseUrl(t);return Le$2(()=>ut(n.lastSuccessfulNavigation()?.finalUrl??new M,r,e))}function ut(t,n,e){let r$1=r(r({},pe),e||{});return ni[r$1.paths](t.root,n.root,r$1.matrixParams)&&ln[r$1.queryParams](t.queryParams,n.queryParams)&&!(r$1.fragment===`exact`&&t.fragment!==n.fragment)}function ii(t,n){return H(t,n)}function dn(t,n,e){if(!ie(t.segments,n.segments)||!ot(t.segments,n.segments,e)||t.numberOfChildren!==n.numberOfChildren)return!1;for(let r in n.children)if(!t.children[r]||!dn(t.children[r],n.children[r],e))return!1;return!0}function oi(t,n){return Object.keys(n).length<=Object.keys(t).length&&Object.keys(n).every(e=>cn(t[e],n[e]))}function hn(t,n,e){return fn(t,n,n.segments,e)}function fn(t,n,e,r){if(t.segments.length>e.length){let i=t.segments.slice(0,e.length);return!(!ie(i,e)||n.hasChildren()||!ot(i,e,r))}else if(t.segments.length===e.length){if(!ie(t.segments,e)||!ot(t.segments,e,r))return!1;for(let i in n.children)if(!t.children[i]||!hn(t.children[i],n.children[i],r))return!1;return!0}else{let i=e.slice(0,t.segments.length),o=e.slice(t.segments.length);return!ie(t.segments,i)||!ot(t.segments,i,r)||!t.children[f]?!1:fn(t.children[f],n,o,r)}}function ot(t,n,e){return n.every((r,i)=>ln[e](t[i].parameters,r.parameters))}var M=class{root;queryParams;fragment;_queryParamMap;constructor(n=new m([],{}),e={},r=null){this.root=n,this.queryParams=e,this.fragment=r}get queryParamMap(){return this._queryParamMap??=oe(this.queryParams),this._queryParamMap}toString(){return ui.serialize(this)}};var m=class{segments;children;parent=null;constructor(n,e){this.segments=n,this.children=e,Object.values(e).forEach(r=>r.parent=this)}hasChildren(){return this.numberOfChildren>0}get numberOfChildren(){return Object.keys(this.children).length}toString(){return at(this)}};var Y=class{path;parameters;_parameterMap;constructor(n,e){this.path=n,this.parameters=e}get parameterMap(){return this._parameterMap??=oe(this.parameters),this._parameterMap}toString(){return gn(this)}};function ai(t,n){return ie(t,n)&&t.every((e,r)=>H(e.parameters,n[r].parameters))}function ie(t,n){return t.length!==n.length?!1:t.every((e,r)=>e.path===n[r].path)}function si(t,n){let e=[];return Object.entries(t.children).forEach(([r,i])=>{r===f&&(e=e.concat(n(i,r)))}),Object.entries(t.children).forEach(([r,i])=>{r!==f&&(e=e.concat(n(i,r)))}),e}var Re=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:()=>new Z})}return t})();var Z=class{parse(n){let e=new Xt(n);return new M(e.parseRootSegment(),e.parseQueryParams(),e.parseFragment())}serialize(n){let e=`/${le(n.root,!0)}`;ci(e)&&(e=`/`);let r=fi(n.queryParams),i=typeof n.fragment==`string`?`#${di(n.fragment)}`:``;return`${e}${r}${i}`}};var Xr=`http://fake`;function ci(t){try{let n=new URL(t,Xr);return n.origin!==Xr||n.pathname.startsWith(`//`)}catch{return!0}}var ui=new Z;function at(t){return t.segments.map(n=>gn(n)).join(`/`)}function le(t,n){if(!t.hasChildren())return at(t);if(n){let e=t.children[f]?le(t.children[f],!1):``,r=[];return Object.entries(t.children).forEach(([i,o])=>{i!==f&&r.push(`${i}:${le(o,!1)}`)}),r.length>0?`${e}(${r.join(`//`)})`:e}else{if(Object.keys(t.children).length===1&&t.children[f]!=null)return`${at(t)}/${le(t.children[f],!1)}`;let e=si(t,(r,i)=>i===f?[li(le(t.children[f],!1))]:[`${i}:${le(r,!1)}`]);return`${at(t)}/(${e.join(`//`)})`}}function li(t){return t.replace(vn,n=>n.replace(/:/g,`%3A`))}function pn(t){return encodeURIComponent(t).replace(/%40/g,`@`).replace(/%3A/gi,`:`).replace(/%24/g,`$`).replace(/%2C/gi,`,`)}function nt(t){return pn(t).replace(/%3B/gi,`;`)}function di(t){return encodeURI(t)}function Jt(t){return pn(t).replace(/\(/g,`%28`).replace(/\)/g,`%29`).replace(/%26/gi,`&`)}function st(t){return decodeURIComponent(t)}function en(t){return st(t.replace(/\+/g,`%20`))}function gn(t){return`${Jt(t.path)}${hi(t.parameters)}`}function hi(t){return Object.entries(t).map(([n,e])=>`;${Jt(n)}=${Jt(e)}`).join(``)}function fi(t){let n=Object.entries(t).map(([e,r])=>Array.isArray(r)?r.map(i=>`${nt(e)}=${nt(i)}`).join(`&`):`${nt(e)}=${nt(r)}`).filter(e=>e);return n.length?`?${n.join(`&`)}`:``}var Gt=1073741824;function lt(t,n,e){Number(n)>=32&&!Object.hasOwn(t,Gt)&&(t[Gt]=e,delete t[Gt]),t[n]=e}var vn=/^[^\/()?;#]+/;function Wt(t){let n=t.match(vn);return n?n[0]:``}var pi=/^[^\/()?;=#]+/;function gi(t){let n=t.match(pi);return n?n[0]:``}var vi=/^[^=?&#]+/;function mi(t){let n=t.match(vi);return n?n[0]:``}var yi=/^[^&#]+/;function Ri(t){let n=t.match(yi);return n?n[0]:``}var Xt=class{url;remaining;constructor(n){this.url=n,this.remaining=n}parseRootSegment(){for(;this.consumeOptional(`/`););return this.remaining===``||this.peekStartsWith(`?`)||this.peekStartsWith(`#`)?new m([],{}):new m([],this.parseChildren())}parseQueryParams(){let n={};if(this.consumeOptional(`?`))do this.parseQueryParam(n);while(this.consumeOptional(`&`));return n}parseFragment(){return this.consumeOptional(`#`)?decodeURIComponent(this.remaining):null}parseChildren(n=0){if(n>50)throw new b$2(4010,!1);if(this.remaining===``)return{};this.consumeOptional(`/`);let e=[];for(this.peekStartsWith(`(`)||e.push(this.parseSegment());this.peekStartsWith(`/`)&&!this.peekStartsWith(`//`)&&!this.peekStartsWith(`/(`);)this.capture(`/`),e.push(this.parseSegment());let r={};this.peekStartsWith(`/(`)&&(this.capture(`/`),r=this.parseParens(!0,n));let i={};return this.peekStartsWith(`(`)&&(i=this.parseParens(!1,n)),(e.length>0||Object.keys(r).length>0)&&(i[f]=new m(e,r)),i}parseSegment(){let n=Wt(this.remaining);if(n===``&&this.peekStartsWith(`;`))throw new b$2(4009,!1);return this.capture(n),new Y(st(n),this.parseMatrixParams())}parseMatrixParams(){let n={};for(;this.consumeOptional(`;`);)this.parseParam(n);return n}parseParam(n){let e=gi(this.remaining);if(!e)return;this.capture(e);let r=``;if(this.consumeOptional(`=`)){let i=Wt(this.remaining);i&&(r=i,this.capture(r))}lt(n,st(e),st(r))}parseQueryParam(n){let e=mi(this.remaining);if(!e)return;this.capture(e);let r=``;if(this.consumeOptional(`=`)){let a=Ri(this.remaining);a&&(r=a,this.capture(r))}let i=en(e),o=en(r);if(Object.hasOwn(n,i)){let a=n[i];Array.isArray(a)||(a=[a],n[i]=a),a.push(o)}else n[i]=o}parseParens(n,e){let r=Object.create(null);for(this.capture(`(`);!this.consumeOptional(`)`)&&this.remaining.length>0;){let i=Wt(this.remaining),o=this.remaining[i.length];if(o!==`/`&&o!==`)`&&o!==`;`)throw new b$2(4010,!1);let a;i.indexOf(`:`)>-1?(a=i.slice(0,i.indexOf(`:`)),this.capture(a),this.capture(`:`)):n&&(a=f);let c=this.parseChildren(e+1),s=Object.keys(c).length===1&&c[f]?c[f]:new m([],c);lt(r,a??f,s),this.consumeOptional(`//`)}return r}peekStartsWith(n){return this.remaining.startsWith(n)}consumeOptional(n){return this.peekStartsWith(n)?(this.remaining=this.remaining.substring(n.length),!0):!1}capture(n){if(!this.consumeOptional(n))throw new b$2(4011,!1)}};function mn(t){return t.segments.length>0?new m([],{[f]:t}):t}function yn(t){let n=Object.create(null);for(let[r,i]of Object.entries(t.children)){let o=yn(i);if(r===f&&o.segments.length===0&&o.hasChildren())for(let[a,c]of Object.entries(o.children))lt(n,a,c);else(o.segments.length>0||o.hasChildren())&&lt(n,r,o)}return Si(new m(t.segments,n))}function Si(t){if(t.numberOfChildren===1&&t.children[f]){let n=t.children[f];return new m(t.segments.concat(n.segments),n.children)}return t}function J(t){return t instanceof M}function Rn(t,n,e=null,r=null,i=new Z){return Cn(Sn(t),n,e,r,i)}function Sn(t){let n;function e(o){let a={};for(let s of o.children){let u=e(s);a[s.outlet]=u}let c=new m(o.url,a);return o===t&&(n=c),c}let i=mn(e(t.root));return n??i}function Cn(t,n,e,r,i){let o=t;for(;o.parent;)o=o.parent;if(n.length===0)return Qt(o,o,o,e,r,i);let a=Ci(n);if(a.toRoot())return Qt(o,o,new m([],{}),e,r,i);let c=wi(a,o,t),s=c.processChildren?_e(c.segmentGroup,c.index,a.commands):bn(c.segmentGroup,c.index,a.commands);return Qt(o,c.segmentGroup,s,e,r,i)}function dt(t){return typeof t==`object`&&t!=null&&!t.outlets&&!t.segmentPath}function Le(t){return typeof t==`object`&&t!=null&&t.outlets}function tn(t,n,e){t||=`ɵ`;let r=new M;return r.queryParams={[t]:n},e.parse(e.serialize(r)).queryParams[t]}function Qt(t,n,e,r,i,o){let a={};for(let[u,l]of Object.entries(r??{}))l!=null&&(a[u]=Array.isArray(l)?l.map(v=>tn(u,v,o)):tn(u,l,o));let c;t===n?c=e:c=wn(t,n,e);return new M(mn(yn(c)),a,i)}function wn(t,n,e){let r=Object.create(null);return Object.entries(t.children).forEach(([i,o])=>{o===n?r[i]=e:r[i]=wn(o,n,e)}),new m(t.segments,r)}var ht=class{isAbsolute;numberOfDoubleDots;commands;constructor(n,e,r){if(this.isAbsolute=n,this.numberOfDoubleDots=e,this.commands=r,n&&r.length>0&&dt(r[0]))throw new b$2(4003,!1);let i=r.find(Le);if(i&&i!==ri(r))throw new b$2(4004,!1)}toRoot(){return this.isAbsolute&&this.commands.length===1&&this.commands[0]==`/`}};function Ci(t){if(typeof t[0]==`string`&&t.length===1&&t[0]===`/`)return new ht(!0,0,t);let n=0,e=!1,r=t.reduce((i,o,a)=>{if(typeof o==`object`&&o!=null){if(o.outlets){let c={};return Object.entries(o.outlets).forEach(([s,u])=>{c[s]=typeof u==`string`?u.split(`/`):u}),[...i,{outlets:c}]}if(o.segmentPath)return[...i,o.segmentPath]}return typeof o!=`string`?[...i,o]:a===0?(o.split(`/`).forEach((c,s)=>{s==0&&c===`.`||(s==0&&c===``?e=!0:c===`..`?n++:c!=``&&i.push(c))}),i):[...i,o]},[]);return new ht(e,n,r)}var he=class{segmentGroup;processChildren;index;constructor(n,e,r){this.segmentGroup=n,this.processChildren=e,this.index=r}};function wi(t,n,e){if(t.isAbsolute)return new he(n,!0,0);if(!e)return new he(n,!1,NaN);if(e.parent===null)return new he(e,!0,0);let r=dt(t.commands[0])?0:1;return bi(e,e.segments.length-1+r,t.numberOfDoubleDots)}function bi(t,n,e){let r=t,i=n,o=e;for(;o>i;){if(o-=i,r=r.parent,!r)throw new b$2(4005,!1);i=r.segments.length}return new he(r,!1,i-o)}function Ii(t){return Le(t[0])?t[0].outlets:{[f]:t}}function bn(t,n,e){if(t??=new m([],{}),t.segments.length===0&&t.hasChildren())return _e(t,n,e);let r=Ei(t,n,e),i=e.slice(r.commandIndex);if(r.match&&r.pathIndex<t.segments.length){let o=new m(t.segments.slice(0,r.pathIndex),{});return o.children[f]=new m(t.segments.slice(r.pathIndex),t.children),_e(o,0,i)}else return r.match&&i.length===0?new m(t.segments,{}):r.match&&!t.hasChildren()?er(t,n,e):r.match?_e(t,0,i):er(t,n,e)}function _e(t,n,e){if(e.length===0)return new m(t.segments,{});{let r=Ii(e),i=Object.create(null);if(Object.keys(r).some(o=>o!==f)&&t.children[f]&&t.numberOfChildren===1&&t.children[f].segments.length===0){let o=_e(t.children[f],n,e);return new m(t.segments,o.children)}return Object.entries(r).forEach(([o,a])=>{typeof a==`string`&&(a=[a]),a!==null&&(i[o]=bn(t.children[o],n,a))}),Object.entries(t.children).forEach(([o,a])=>{r[o]===void 0&&(i[o]=a)}),new m(t.segments,i)}}function Ei(t,n,e){let r=0,i=n,o={match:!1,pathIndex:0,commandIndex:0};for(;i<t.segments.length;){if(r>=e.length)return o;let a=t.segments[i],c=e[r];if(Le(c))break;let s=`${c}`,u=r<e.length-1?e[r+1]:null;if(i>0&&s===void 0)break;if(s&&u&&typeof u==`object`&&u.outlets===void 0){if(!nn(s,u,a))return o;r+=2}else{if(!nn(s,{},a))return o;r++}i++}return{match:!0,pathIndex:i,commandIndex:r}}function er(t,n,e){let r=t.segments.slice(0,n),i=0;for(;i<e.length;){let o=e[i];if(Le(o))return new m(r,Mi(o.outlets));if(i===0&&dt(e[0])){let s=t.segments[n];r.push(new Y(s.path,rn(e[0]))),i++;continue}let a=Le(o)?o.outlets[f]:`${o}`,c=i<e.length-1?e[i+1]:null;a&&c&&dt(c)?(r.push(new Y(a,rn(c))),i+=2):(r.push(new Y(a,{})),i++)}return new m(r,{})}function Mi(t){let n={};return Object.entries(t).forEach(([e,r])=>{typeof r==`string`&&(r=[r]),r!==null&&(n[e]=er(new m([],{}),0,r))}),n}function rn(t){let n={};return Object.entries(t).forEach(([e,r])=>n[e]=`${r}`),n}function nn(t,n,e){return t==e.path&&H(n,e.parameters)}var ft$1=class{rootInjector;outlet=null;route=null;children;attachRef=null;get injector(){return this.route?.snapshot._environmentInjector??this.rootInjector}constructor(n){this.rootInjector=n,this.children=new ae(this.rootInjector)}resetChildren(){this.children=new ae(this.rootInjector)}};var ae=(()=>{class t{rootInjector;contexts=/* @__PURE__ */ new Map;constructor(e){this.rootInjector=e}onChildOutletCreated(e,r){let i=this.getOrCreateContext(e);i.outlet=r,this.contexts.set(e,i)}onChildOutletDestroyed(e){let r=this.getContext(e);r&&(r.outlet=null,r.attachRef=null)}onOutletDeactivated(){let e=this.contexts;return this.contexts=/* @__PURE__ */ new Map,e}onOutletReAttached(e){this.contexts=e}getOrCreateContext(e){let r=this.getContext(e);return r||(r=new ft$1(this.rootInjector),this.contexts.set(e,r)),r}getContext(e){return this.contexts.get(e)||null}static ɵfac=function(r){return new(r||t)(w$1(me$2))};static ɵprov=C({token:t,factory:t.ɵfac,providedIn:`root`})}return t})();var pt=class{_root;constructor(n){this._root=n}get root(){return this._root.value}parent(n){let e=this.pathFromRoot(n);return e.length>1?e[e.length-2]:null}children(n){let e=tr(n,this._root);return e?e.children.map(r=>r.value):[]}firstChild(n){let e=tr(n,this._root);return e&&e.children.length>0?e.children[0].value:null}siblings(n){let e=rr(n,this._root);return e.length<2?[]:e[e.length-2].children.map(i=>i.value).filter(i=>i!==n)}pathFromRoot(n){return rr(n,this._root).map(e=>e.value)}};function tr(t,n){if(t===n.value)return n;for(let e of n.children){let r=tr(t,e);if(r)return r}return null}function rr(t,n){if(t===n.value)return[n];for(let e of n.children){let r=rr(t,e);if(r.length)return r.unshift(n),r}return[]}var E=class{value;children;constructor(n,e){this.value=n,this.children=e}toString(){return`TreeNode(${this.value})`}};function de(t){let n={};return t&&t.children.forEach(e=>n[e.value.outlet]=e),n}var je=class extends pt{snapshot;constructor(n,e){super(n),this.snapshot=e,pr(this,n)}toString(){return this.snapshot.toString()}};function In(t,n){let e=Ai(t,n),r=new En$1([new Y(``,{})]),i=new En$1({}),o=new En$1({}),s=new G(r,i,new En$1({}),new En$1(``),o,f,t,e.root);return s.snapshot=e.root,new je(new E(s,[]),e)}function Ai(t,n){return new xe(``,new E(new ge([],{},{},``,{},f,t,null,{},n),[]))}var G=class{urlSubject;paramsSubject;queryParamsSubject;fragmentSubject;dataSubject;outlet;component;snapshot;_futureSnapshot;_routerState;_paramMap;_queryParamMap;title;url;params;queryParams;fragment;data;resources;_localInjector;pending;paramsSignal;queryParamsSignal;paramMapSignal;queryParamMapSignal;fragmentSignal;dataSignal;constructor(n,e,r,i,o,a,c,s){this.urlSubject=n,this.paramsSubject=e,this.queryParamsSubject=r,this.fragmentSubject=i,this.dataSubject=o,this.outlet=a,this.component=c,this._futureSnapshot=s,this.title=this.dataSubject?.pipe(G$2(u=>u[Fe]))??Ye$1(void 0),this.url=n,this.params=e,this.queryParams=r,this.fragment=i,this.data=o}get routeConfig(){return this._futureSnapshot.routeConfig}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=this.params.pipe(G$2(n=>oe(n))),this._paramMap}get queryParamMap(){return this._queryParamMap??=this.queryParams.pipe(G$2(n=>oe(n))),this._queryParamMap}toString(){return this.snapshot?this.snapshot.toString():`Future(${this._futureSnapshot})`}_setPending(n){this._futureSnapshot=n,this.pending?.set(!0)}};var Ti=`always`;function fr(t,n,e){let r$2,{routeConfig:i}=t;return n!==null&&(e===`always`||i?.path===``||!n.component&&!n.routeConfig?.loadComponent)?r$2={params:Object.keys(t.params).length===0?n.params:Object.freeze(r(r({},n.params),t.params)),data:Object.freeze(r(r({},n.data),t.data)),resolve:r(r(r(r({},t.data),n.data),i?.data),t._resolvedData)}:r$2={params:Object.freeze(r({},t.params)),data:Object.freeze(r({},t.data)),resolve:r(r({},t.data),t._resolvedData??{})},i&&Mn(i)&&(r$2.resolve[Fe]=i.title),r$2}var ge=class{url;params;queryParams;fragment;data;outlet;component;routeConfig;_resolve;_resolvedData;_routerState;_paramMap;_queryParamMap;_environmentInjector;resources;get title(){return this.data?.[Fe]}constructor(n,e,r,i,o,a,c,s,u,l){this.url=n,this.params=e,this.queryParams=r,this.fragment=i,this.data=o,this.outlet=a,this.component=c,this.routeConfig=s,this._resolve=u,this._environmentInjector=l}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=oe(this.params),this._paramMap}get queryParamMap(){return this._queryParamMap??=oe(this.queryParams),this._queryParamMap}toString(){return`Route(url:'${this.url.map(r=>r.toString()).join(`/`)}', path:'${this.routeConfig?this.routeConfig.path:``}')`}};var xe=class extends pt{url;constructor(n,e){super(e),this.url=n,pr(this,e)}toString(){return En(this._root)}};function pr(t,n){n.value._routerState=t,n.children.forEach(e=>pr(t,e))}function En(t){let n=t.children.length>0?` { ${t.children.map(En).join(`, `)} } `:``;return`${t.value}${n}`}function Kt(t){if(t.snapshot){let n=t.snapshot,e=t._futureSnapshot;t.snapshot=e,H(n.queryParams,e.queryParams)||t.queryParamsSubject.next(e.queryParams),n.fragment!==e.fragment&&t.fragmentSubject.next(e.fragment),H(n.params,e.params)||t.paramsSubject.next(e.params),ti(n.url,e.url)||t.urlSubject.next(e.url),H(n.data,e.data)||t.dataSubject.next(e.data)}else t.snapshot=t._futureSnapshot,t.dataSubject.next(t._futureSnapshot.data)}function nr(t,n){let e=H(t.params,n.params)&&ai(t.url,n.url),r=!t.parent!=!n.parent;return e&&!r&&(!t.parent||nr(t.parent,n.parent))}function Mn(t){return typeof t.title==`string`||t.title===null}var An=new y(``);var gr=(()=>{class t{activated=null;get activatedComponentRef(){return this.activated}_activatedRoute=null;name=f;activateEvents=new _e$3;deactivateEvents=new _e$3;attachEvents=new _e$3;detachEvents=new _e$3;routerOutletData=Cb();parentContexts=m$2(ae);location=m$2(qr);changeDetector=m$2(EC);inputBinder=m$2(Ve,{optional:!0});supportsBindingToComponentInputs=!0;ngOnChanges(e){if(e.name){let{firstChange:r,previousValue:i}=e.name;if(r)return;this.isTrackedInParentContexts(i)&&(this.deactivate(),this.parentContexts.onChildOutletDestroyed(i)),this.initializeOutletWithName()}}ngOnDestroy(){this.isTrackedInParentContexts(this.name)&&this.parentContexts.onChildOutletDestroyed(this.name),this.inputBinder?.unsubscribeFromRouteData(this)}isTrackedInParentContexts(e){return this.parentContexts.getContext(e)?.outlet===this}ngOnInit(){this.initializeOutletWithName()}initializeOutletWithName(){if(this.parentContexts.onChildOutletCreated(this.name,this),this.activated)return;let e=this.parentContexts.getContext(this.name);e?.route&&(e.attachRef?this.attach(e.attachRef,e.route):this.activateWith(e.route,e.injector))}get isActivated(){return!!this.activated}get component(){if(!this.activated)throw new b$2(4012,!1);return this.activated.instance}get activatedRoute(){if(!this.activated)throw new b$2(4012,!1);return this._activatedRoute}get activatedRouteData(){return this._activatedRoute?this._activatedRoute.snapshot.data:{}}detach(){if(!this.activated)throw new b$2(4012,!1);this.location.detach();let e=this.activated;return this.activated=null,this._activatedRoute=null,this.detachEvents.emit(e.instance),e}attach(e,r){this.activated=e,this._activatedRoute=r,this.location.insert(e.hostView),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.attachEvents.emit(e.instance)}deactivate(){if(this.activated){let e=this.component;this.inputBinder?.unsubscribeFromRouteData(this),this.activated.destroy(),this.activated=null,this._activatedRoute=null,this.deactivateEvents.emit(e)}}activateWith(e,r){if(this.isActivated)throw new b$2(4013,!1);this._activatedRoute=e;let i=this.location,a=e.snapshot.component,c=this.parentContexts.getOrCreateContext(this.name).children,s=new ir(e,c,i.injector,this.routerOutletData);this.activated=i.createComponent(a,{index:i.length,injector:s,environmentInjector:r}),this.changeDetector.markForCheck(),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.activateEvents.emit(this.activated.instance)}static ɵfac=function(r){return new(r||t)};static ɵdir=Ne$1({type:t,selectors:[[`router-outlet`]],inputs:{name:`name`,routerOutletData:[1,`routerOutletData`]},outputs:{activateEvents:`activate`,deactivateEvents:`deactivate`,attachEvents:`attach`,detachEvents:`detach`},exportAs:[`outlet`],features:[Xo]})}return t})();var ir=class{route;childContexts;parent;outletData;constructor(n,e,r,i){this.route=n,this.childContexts=e,this.parent=r,this.outletData=i}get(n,e){return n===G?this.route:n===ae?this.childContexts:n===An?this.outletData:this.parent.get(n,e)}};var Ve=new y(``);var Tn=(()=>{class t{options;feature;outletDataSubscriptions=/* @__PURE__ */ new Map;outletSeenKeys=/* @__PURE__ */ new Map;outletEffects=/* @__PURE__ */ new Map;constructor(e,r=null){this.options=e,this.feature=r,this.options.queryParams??=!0}bindActivatedRouteToOutletComponent(e,r){this.unsubscribeFromRouteData(e),this.subscribeToRouteData(e,r)}unsubscribeFromRouteData(e){this.outletDataSubscriptions.get(e)?.unsubscribe(),this.outletDataSubscriptions.delete(e),this.outletSeenKeys.delete(e),this.outletEffects.get(e)?.forEach(r=>r.destroy()),this.outletEffects.delete(e)}subscribeToRouteData(e,r$3){let{activatedRoute:i}=e,o=[],a=[];if(this.feature?.createResourceOutletBindingEffects&&e.activatedComponentRef){let{handledKeys:s,createdEffects:u}=this.feature.createResourceOutletBindingEffects(e.activatedComponentRef,i);o.push(...u),a=s}o.length>0&&this.outletEffects.set(e,o);let c=pc([this.options.queryParams?i.queryParams:Ye$1({}),i.params,i.data]).pipe(Vf(([s,u,l],v)=>(l=r(r(r(r({},s),u),l),i.resources),v===0?Ye$1(l):Promise.resolve(l)))).subscribe(s=>{if(!e.isActivated||!e.activatedComponentRef||e.activatedRoute!==i||i.component===null){this.unsubscribeFromRouteData(e);return}let u=M2(i.component);if(!u){this.unsubscribeFromRouteData(e);return}let l=this.outletSeenKeys.get(e);l||(l=/* @__PURE__ */ new Set,this.outletSeenKeys.set(e,l));for(let p of Object.keys(s))l.add(p);let v=this.options.unmatchedInputBehavior??`alwaysUndefined`;for(let{templateName:p}of u.inputs){if(a.includes(p))continue;let y=s[p];(y!==void 0||v===`alwaysUndefined`||l.has(p))&&e.activatedComponentRef.setInput(p,y)}});this.outletDataSubscriptions.set(e,c)}static ɵfac=function(r){VI()};static ɵprov=C({token:t,factory:t.ɵfac})}return t})();var vr=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵcmp=Fe$1({type:t,selectors:[[`ng-component`]],exportAs:[`emptyRouterOutlet`],decls:1,vars:0,template:function(r,i){r&1&&Vg(0,`router-outlet`)},dependencies:[gr],encapsulation:2,changeDetection:1})}return t})();function mr(t){let n=t.children&&t.children.map(mr),e=n?s(r({},t),{children:n}):r({},t);return!e.component&&!e.loadComponent&&(n||e.loadChildren)&&e.outlet&&e.outlet!==f&&(e.component=vr),e}var Ue=`imperative`;var w=(function(t){return t[t.NavigationStart=0]=`NavigationStart`,t[t.NavigationEnd=1]=`NavigationEnd`,t[t.NavigationCancel=2]=`NavigationCancel`,t[t.NavigationError=3]=`NavigationError`,t[t.RoutesRecognized=4]=`RoutesRecognized`,t[t.ResolveStart=5]=`ResolveStart`,t[t.ResolveEnd=6]=`ResolveEnd`,t[t.GuardsCheckStart=7]=`GuardsCheckStart`,t[t.GuardsCheckEnd=8]=`GuardsCheckEnd`,t[t.RouteConfigLoadStart=9]=`RouteConfigLoadStart`,t[t.RouteConfigLoadEnd=10]=`RouteConfigLoadEnd`,t[t.ChildActivationStart=11]=`ChildActivationStart`,t[t.ChildActivationEnd=12]=`ChildActivationEnd`,t[t.ActivationStart=13]=`ActivationStart`,t[t.ActivationEnd=14]=`ActivationEnd`,t[t.Scroll=15]=`Scroll`,t[t.NavigationSkipped=16]=`NavigationSkipped`,t})(w||{});var U=class{id;url;constructor(n,e){this.id=n,this.url=e}};var se=class extends U{type=w.NavigationStart;navigationTrigger;restoredState;constructor(n,e,r=`imperative`,i=null){super(n,e),this.navigationTrigger=r,this.restoredState=i}toString(){return`NavigationStart(id: ${this.id}, url: '${this.url}')`}};var $=class extends U{urlAfterRedirects;type=w.NavigationEnd;constructor(n,e,r){super(n,e),this.urlAfterRedirects=r}toString(){return`NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`}};var b$1=(function(t){return t[t.Redirect=0]=`Redirect`,t[t.SupersededByNewNavigation=1]=`SupersededByNewNavigation`,t[t.NoDataFromResolver=2]=`NoDataFromResolver`,t[t.GuardRejected=3]=`GuardRejected`,t[t.Aborted=4]=`Aborted`,t})(b$1||{});var ke=(function(t){return t[t.IgnoredSameUrlNavigation=0]=`IgnoredSameUrlNavigation`,t[t.IgnoredByUrlHandlingStrategy=1]=`IgnoredByUrlHandlingStrategy`,t})(ke||{});var j=class extends U{reason;code;type=w.NavigationCancel;constructor(n,e,r,i){super(n,e),this.reason=r,this.code=i}toString(){return`NavigationCancel(id: ${this.id}, url: '${this.url}')`}};function Dn(t){return t instanceof j&&(t.code===b$1.Redirect||t.code===b$1.SupersededByNewNavigation)}var W=class extends U{reason;code;type=w.NavigationSkipped;constructor(n,e,r,i){super(n,e),this.reason=r,this.code=i}};var ce=class extends U{error;target;type=w.NavigationError;constructor(n,e,r,i){super(n,e),this.error=r,this.target=i}toString(){return`NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`}};var $e=class extends U{urlAfterRedirects;state;type=w.RoutesRecognized;constructor(n,e,r,i){super(n,e),this.urlAfterRedirects=r,this.state=i}toString(){return`RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var gt$1=class extends U{urlAfterRedirects;state;type=w.GuardsCheckStart;constructor(n,e,r,i){super(n,e),this.urlAfterRedirects=r,this.state=i}toString(){return`GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var vt$1=class extends U{urlAfterRedirects;state;shouldActivate;type=w.GuardsCheckEnd;constructor(n,e,r,i,o){super(n,e),this.urlAfterRedirects=r,this.state=i,this.shouldActivate=o}toString(){return`GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`}};var mt=class extends U{urlAfterRedirects;state;type=w.ResolveStart;constructor(n,e,r,i){super(n,e),this.urlAfterRedirects=r,this.state=i}toString(){return`ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var yt=class extends U{urlAfterRedirects;state;type=w.ResolveEnd;constructor(n,e,r,i){super(n,e),this.urlAfterRedirects=r,this.state=i}toString(){return`ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var Rt$1=class{route;type=w.RouteConfigLoadStart;constructor(n){this.route=n}toString(){return`RouteConfigLoadStart(path: ${this.route.path})`}};var St$1=class{route;type=w.RouteConfigLoadEnd;constructor(n){this.route=n}toString(){return`RouteConfigLoadEnd(path: ${this.route.path})`}};var Ct$1=class{snapshot;type=w.ChildActivationStart;constructor(n){this.snapshot=n}toString(){return`ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var wt$1=class{snapshot;type=w.ChildActivationEnd;constructor(n){this.snapshot=n}toString(){return`ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var bt$1=class{snapshot;type=w.ActivationStart;constructor(n){this.snapshot=n}toString(){return`ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var It$1=class{snapshot;type=w.ActivationEnd;constructor(n){this.snapshot=n}toString(){return`ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var ve=class{};var ze=class{};var me=class{url;navigationBehaviorOptions;constructor(n,e){this.url=n,this.navigationBehaviorOptions=e}};function Di(t){return!(t instanceof ve)&&!(t instanceof me)&&!(t instanceof ze)}function Ni(t,n,e){let r=/* @__PURE__ */ new Set;return{newlyCreatedRoutes:r,state:new je(qe(t,n._root,e?e._root:void 0,r),n)}}function qe(t,n,e,r){if(e&&t.shouldReuseRoute(n.value,e.value.snapshot)){let i=e.value;i._setPending(n.value);return new E(i,_i(t,n,e,r))}else{if(t.shouldAttach(n.value)){let a=t.retrieve(n.value);if(a!==null){let c=a.route;return c.value._setPending(n.value),c.children=n.children.map(s=>qe(t,s,void 0,r)),c}}let i=Ui(n.value);i._setPending(n.value),r.add(i);return new E(i,n.children.map(a=>qe(t,a,void 0,r)))}}function _i(t,n,e,r){return n.children.map(i=>{for(let o of e.children)if(t.shouldReuseRoute(i.value,o.value.snapshot))return qe(t,i,o,r);return qe(t,i,void 0,r)})}function Ui(t){return new G(new En$1(t.url),new En$1(t.params),new En$1(t.queryParams),new En$1(t.fragment),new En$1(t.data),t.outlet,t.component,t)}var X=class t extends Error{redirectTo;navigationBehaviorOptions;constructor(n,e){super(),this.redirectTo=n,this.navigationBehaviorOptions=e,Object.setPrototypeOf(this,t.prototype)}};var Nn=`ngNavigationCancelingError`;function Oe(t,n){let{redirectTo:e,navigationBehaviorOptions:r}=J(n)?{redirectTo:n,navigationBehaviorOptions:void 0}:n,i=_n(!1,b$1.Redirect);return i.url=e,i.navigationBehaviorOptions=r,i}function _n(t,n){let e=/* @__PURE__ */ new Error(`NavigationCancelingError: ${t||``}`);return e[Nn]=!0,e.cancellationCode=n,e}function Oi(t){return Un(t)&&J(t.url)}function Un(t){return!!t&&t[Nn]}var or=class{routeReuseStrategy;futureState;currState;forwardEvent;inputBindingEnabled;constructor(n,e,r,i,o){this.routeReuseStrategy=n,this.futureState=e,this.currState=r,this.forwardEvent=i,this.inputBindingEnabled=o}activate(n){let e=this.futureState._root,r=this.currState?this.currState._root:null;this.deactivateChildRoutes(e,r,n),Kt(this.futureState.root),this.activateChildRoutes(e,r,n)}deactivateChildRoutes(n,e,r){let i=de(e);n.children.forEach(o=>{let a=o.value.outlet;this.deactivateRoutes(o,i[a],r),delete i[a]}),Object.values(i).forEach(o=>{this.deactivateRouteAndItsChildren(o,r)})}deactivateRoutes(n,e,r){let i=n.value,o=e?e.value:null;if(i===o)if(i.component){let a=r.getContext(i.outlet);a&&this.deactivateChildRoutes(n,e,a.children)}else this.deactivateChildRoutes(n,e,r);else o&&this.deactivateRouteAndItsChildren(e,r)}deactivateRouteAndItsChildren(n,e){n.value.component&&this.routeReuseStrategy.shouldDetach(n.value.snapshot)?this.detachAndStoreRouteSubtree(n,e):this.deactivateRouteAndOutlet(n,e)}detachAndStoreRouteSubtree(n,e){let r=e.getContext(n.value.outlet),i=r&&n.value.component?r.children:e,o=de(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,i);if(r&&r.outlet){let a=r.outlet.detach(),c=r.children.contexts;r.resetChildren(),this.routeReuseStrategy.store(n.value.snapshot,{componentRef:a,route:n,contexts:c})}}deactivateRouteAndOutlet(n,e){let r=e.getContext(n.value.outlet),i=r&&n.value.component?r.children:e,o=de(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,i);r&&(r.outlet&&(r.outlet.deactivate(),r.children.onOutletDeactivated()),r.attachRef=null,r.route=null),n.value._localInjector?.destroy()}activateChildRoutes(n,e,r){let i=de(e);n.children.forEach(o=>{this.activateRoutes(o,i[o.value.outlet],r),this.forwardEvent(new It$1(o.value.snapshot))}),n.children.length&&this.forwardEvent(new wt$1(n.value.snapshot))}activateRoutes(n,e,r){let i=n.value,o=e?e.value:null;if(Kt(i),i===o)if(i.component){let a=r.getOrCreateContext(i.outlet);this.activateChildRoutes(n,e,a.children)}else this.activateChildRoutes(n,e,r);else if(i.component){let a=r.getOrCreateContext(i.outlet);if(this.routeReuseStrategy.shouldAttach(i.snapshot)){let c=this.routeReuseStrategy.retrieve(i.snapshot);this.routeReuseStrategy.store(i.snapshot,null),a.children.onOutletReAttached(c.contexts),a.attachRef=c.componentRef,a.route=c.route.value,a.outlet&&a.outlet.attach(c.componentRef,c.route.value),Kt(c.route.value),this.activateChildRoutes(n,null,a.children)}else a.attachRef=null,a.route=i,a.outlet&&a.outlet.activateWith(i,a.injector),this.activateChildRoutes(n,null,a.children)}else this.activateChildRoutes(n,null,r)}};var Et=class{path;route;constructor(n){this.path=n,this.route=this.path[this.path.length-1]}};var fe=class{component;route;constructor(n,e){this.component=n,this.route=e}};function Pi(t,n,e){let r=t._root;return Ne(r,n?n._root:null,e,[r.value])}function Li(t){let n=t.routeConfig?t.routeConfig.canActivateChild:null;return!n||n.length===0?null:{node:t,guards:n}}function Se(t,n){let e=Symbol(),r=n.get(t,e);return r===e?typeof t==`function`&&!dE(t)?t:n.get(t):r}function Ne(t,n,e,r,i={canDeactivateChecks:[],canActivateChecks:[]}){let o=de(n);return t.children.forEach(a=>{ji(a,o[a.value.outlet],e,r.concat([a.value]),i),delete o[a.value.outlet]}),Object.entries(o).forEach(([a,c])=>Pe(c,e.getContext(a),e,i)),i}function ji(t,n,e,r,i={canDeactivateChecks:[],canActivateChecks:[]}){let o=t.value,a=n?n.value:null,c=e?e.getContext(t.value.outlet):null;if(a&&o.routeConfig===a.routeConfig){let s=xi(a,o,o.routeConfig.runGuardsAndResolvers);s?i.canActivateChecks.push(new Et(r)):(o.data=a.data,o._resolvedData=a._resolvedData),o.component?Ne(t,n,c?c.children:null,r,i):Ne(t,n,e,r,i),s&&c&&c.outlet&&c.outlet.isActivated&&i.canDeactivateChecks.push(new fe(c.outlet.component,a))}else a&&Pe(n,c,e,i),i.canActivateChecks.push(new Et(r)),o.component?Ne(t,null,c?c.children:null,r,i):Ne(t,null,e,r,i);return i}function xi(t,n,e){if(typeof e==`function`)return Tr(n._environmentInjector,()=>e(t,n));switch(e){case`pathParamsChange`:return!ie(t.url,n.url);case`pathParamsOrQueryParamsChange`:return!ie(t.url,n.url)||!H(t.queryParams,n.queryParams);case`always`:return!0;case`paramsOrQueryParamsChange`:return!nr(t,n)||!H(t.queryParams,n.queryParams);default:return!nr(t,n)}}function Pe(t,n,e,r){let i=de(t),o=t.value;Object.entries(i).forEach(([a,c])=>{o.component?n?Pe(c,n.children.getContext(a),n.children,r):Pe(c,null,null,r):Pe(c,e?e.getContext(a):null,e,r)}),o.component?n&&n.outlet&&n.outlet.isActivated?r.canDeactivateChecks.push(new fe(n.outlet.component,o)):r.canDeactivateChecks.push(new fe(null,o)):r.canDeactivateChecks.push(new fe(null,o))}function Ge(t){return typeof t==`function`}function ki(t){return typeof t==`boolean`}function $i(t){return t&&Ge(t.canLoad)}function zi(t){return t&&Ge(t.canActivate)}function qi(t){return t&&Ge(t.canActivateChild)}function Hi(t){return t&&Ge(t.canDeactivate)}function Fi(t){return t&&Ge(t.canMatch)}function On(t){return t instanceof hn$1||t?.name===`EmptyError`}var it=Symbol(`INITIAL_VALUE`);function ye(){return Vf(t=>pc(t.map(n=>n.pipe(ut$3(1),os(e=>{if(e instanceof X)return Ye$1(e);throw e}),vc(it)))).pipe(G$2(n=>{for(let e of n)if(e!==!0){if(e===it)return it;if(e===!1||Bi(e))return e}return!0}),Be$2(n=>n!==it),ut$3(1)))}function Bi(t){return J(t)||t instanceof X}function Pn(t){return new M$1(n=>{if(t.aborted){n.next(),n.complete();return}let e=()=>{n.next(),n.complete()};return t.addEventListener(`abort`,e),()=>t.removeEventListener(`abort`,e)})}function Ln(t){return ho$1(Pn(t))}function Vi(t){return Et$3(n=>{let{targetSnapshot:e,currentSnapshot:r$4,guards:{canActivateChecks:i,canDeactivateChecks:o}}=n;return o.length===0&&i.length===0?Ye$1(s(r({},n),{guardsResult:!0})):Gi(o,e,r$4).pipe(Et$3(a=>a&&ki(a)?Wi(e,i,t):Ye$1(a)),G$2(a=>s(r({},n),{guardsResult:a})))})}function Gi(t,n,e){return lt$3(t).pipe(Et$3(r=>Ji(r.component,r.route,e,n)),Qv(r=>r!==!0,!0))}function Wi(t,n,e){return lt$3(n).pipe(hc(r=>Gt$2(Ki(r.route.parent,e),Qi(r.route,e),Zi(t,r.path),Yi(t,r.route))),Qv(r=>r!==!0,!0))}function Qi(t,n){return t!==null&&n&&n(new bt$1(t)),Ye$1(!0)}function Ki(t,n){return t!==null&&n&&n(new Ct$1(t)),Ye$1(!0)}function Yi(t,n){let e=n.routeConfig?n.routeConfig.canActivate:null;if(!e||e.length===0)return Ye$1(!0);let r=e.map(i=>Wv(()=>{let o=n._environmentInjector,a=Se(i,o);return Be(zi(a)?a.canActivate(n,t):Tr(o,()=>a(n,t))).pipe(Qv())}));return Ye$1(r).pipe(ye())}function Zi(t,n){let e=n[n.length-1],i=n.slice(0,n.length-1).reverse().map(o=>Li(o)).filter(o=>o!==null).map(o=>Wv(()=>{let a=o.guards.map(c=>{let s=o.node._environmentInjector,u=Se(c,s);return Be(qi(u)?u.canActivateChild(e,t):Tr(s,()=>u(e,t))).pipe(Qv())});return Ye$1(a).pipe(ye())}));return Ye$1(i).pipe(ye())}function Ji(t,n,e,r){let i=n&&n.routeConfig?n.routeConfig.canDeactivate:null;if(!i||i.length===0)return Ye$1(!0);let o=i.map(a=>{let c=n._environmentInjector,s=Se(a,c);return yr(()=>Hi(s)?s.canDeactivate(t,n,e,r):Tr(c,()=>s(t,n,e,r))).pipe(Qv())});return Ye$1(o).pipe(ye())}function Xi(t,n,e,r,i){let o=n.canLoad;if(o===void 0||o.length===0)return Ye$1(!0);let a=o.map(c=>{let s=Se(c,t),u=yr(()=>$i(s)?s.canLoad(n,e):Tr(t,()=>s(n,e)));return i?u.pipe(Ln(i)):u});return Ye$1(a).pipe(ye(),jn(r))}function yr(t){try{return Be(t())}catch(n){return new M$1(e=>e.error(n))}}function jn(t){return Sv(Sn$2(n=>{if(typeof n!=`boolean`)throw Oe(t,n)}),G$2(n=>n===!0))}function eo(t,n,e,r,i,o){let a=n.canMatch;if(!a||a.length===0)return Ye$1(!0);let c=a.map(s=>{let u=Se(s,t);return yr(()=>Fi(u)?u.canMatch(n,e,i):Tr(t,()=>u(n,e,i))).pipe(Ln(o))});return Ye$1(c).pipe(ye(),jn(r))}var q=class t extends Error{name=`NoMatch`;segmentGroup;constructor(n){super(),this.segmentGroup=n||null,Object.setPrototypeOf(this,t.prototype)}};var He=class t extends Error{urlTree;name=`AbsoluteRedirect`;constructor(n){super(),this.urlTree=n,Object.setPrototypeOf(this,t.prototype)}};function to(t){throw new b$2(4e3,!1)}function ro(t){throw _n(!1,b$1.GuardRejected)}var ar=class{urlSerializer;urlTree;constructor(n,e){this.urlSerializer=n,this.urlTree=e}async lineralizeSegments(n,e){let r=[],i=e.root;for(;;){if(r=r.concat(i.segments),i.numberOfChildren===0)return r;if(i.numberOfChildren>1||!i.children[f])throw to(`${n.redirectTo}`);i=i.children[f]}}async applyRedirectCommands(n,e,r,i,o){let a=await no(e,i,o);if(a instanceof M)throw new He(a);let c=this.applyRedirectCreateUrlTree(a,this.urlSerializer.parse(a),n,r);if(a[0]===`/`)throw new He(c);return c}applyRedirectCreateUrlTree(n,e,r,i){return new M(this.createSegmentGroup(n,e.root,r,i),this.createQueryParams(e.queryParams,this.urlTree.queryParams),e.fragment)}createQueryParams(n,e){let r={};return Object.entries(n).forEach(([i,o])=>{if(typeof o==`string`&&o[0]===`:`){let c=o.substring(1);r[i]=e[c]}else r[i]=o}),r}createSegmentGroup(n,e,r,i){let o=this.createSegments(n,e.segments,r,i),a=Object.create(null);return Object.entries(e.children).forEach(([c,s])=>{a[c]=this.createSegmentGroup(n,s,r,i)}),new m(o,a)}createSegments(n,e,r,i){return e.map(o=>o.path[0]===`:`?this.findPosParam(n,o,i):this.findOrReturn(o,r))}findPosParam(n,e,r){let i=r[e.path.substring(1)];if(!i)throw new b$2(4001,!1);return i}findOrReturn(n,e){let r=0;for(let i of e){if(i.path===n.path)return e.splice(r),i;r++}return n}};function no(t,n,e){if(typeof t==`string`)return Promise.resolve(t);let r=t;return ct(Be(Tr(e,()=>r(n))))}function io(t,n){return t.providers&&!t._injector&&(t._injector=xg(t.providers,n,`Route: ${t.path}`)),t._injector??n}function F(t){return t.outlet||f}function oo(t,n){let e=t.filter(r=>F(r)===n);return e.push(...t.filter(r=>F(r)!==n)),e}var sr={matched:!1,consumedSegments:[],remainingSegments:[],parameters:{},positionalParamSegments:{}};function xn(t){return{routeConfig:t.routeConfig,url:t.url,params:t.params,queryParams:t.queryParams,fragment:t.fragment,data:t.data,outlet:t.outlet,title:t.title,paramMap:t.paramMap,queryParamMap:t.queryParamMap}}function ao(t,n,e,r$5,i,o,a){let c=kn(t,n,e);if(!c.matched)return Ye$1(c);let s=xn(o(c));return r$5=io(n,r$5),eo(r$5,n,e,i,s,a).pipe(G$2(u=>u===!0?c:r({},sr)))}function kn(t,n,e){if(n.path===``)return n.pathMatch===`full`&&(t.hasChildren()||e.length>0)?r({},sr):{matched:!0,consumedSegments:[],remainingSegments:e,parameters:{},positionalParamSegments:{}};let i=(n.matcher||sn)(e,t,n);if(!i)return r({},sr);let o={};Object.entries(i.posParams??{}).forEach(([c,s])=>{o[c]=s.path});let a=i.consumed.length>0?r(r({},o),i.consumed[i.consumed.length-1].parameters):o;return{matched:!0,consumedSegments:i.consumed,remainingSegments:e.slice(i.consumed.length),parameters:a,positionalParamSegments:i.posParams??{}}}function on(t,n,e,r){return e.length>0&&uo(t,e,r)?{segmentGroup:new m(n,co(r,new m(e,t.children))),slicedSegments:[]}:e.length===0&&lo(t,e,r)?{segmentGroup:new m(t.segments,so(t,e,r,t.children)),slicedSegments:e}:{segmentGroup:new m(t.segments,t.children),slicedSegments:e}}function so(t,n,e,r$6){let i={};for(let o of e)if(At(t,n,o)&&!r$6[F(o)]){let a=new m([],{});i[F(o)]=a}return r(r({},r$6),i)}function co(t,n){let e={};e[f]=n;for(let r of t)if(r.path===``&&F(r)!==f){let i=new m([],{});e[F(r)]=i}return e}function uo(t,n,e){return e.some(r=>At(t,n,r)&&F(r)!==f)}function lo(t,n,e){return e.some(r=>At(t,n,r))}function At(t,n,e){return(t.hasChildren()||n.length>0)&&e.pathMatch===`full`?!1:e.path===``}function ho(t,n,e){return n.length===0&&!t.hasChildren()}var cr=class{};async function fo(t,n,e,r,i,o,a,c){return new ur(t,n,e,r,i,a,o,c).recognize()}var po=31;var ur=class{injector;configLoader;rootComponentType;config;urlTree;paramsInheritanceStrategy;urlSerializer;abortSignal;applyRedirects;absoluteRedirectCount=0;allowRedirects=!0;queryParams;constructor(n,e,r$7,i,o,a,c,s){this.injector=n,this.configLoader=e,this.rootComponentType=r$7,this.config=i,this.urlTree=o,this.paramsInheritanceStrategy=a,this.urlSerializer=c,this.abortSignal=s,this.applyRedirects=new ar(this.urlSerializer,this.urlTree),this.queryParams=Object.freeze(r({},this.urlTree.queryParams))}noMatchError(n){return new b$2(4002,`'${n.segmentGroup}'`)}async recognize(){let n=on(this.urlTree.root,[],[],this.config).segmentGroup,{children:e,rootSnapshot:r}=await this.match(n),o=new xe(``,new E(r,e)),a=Rn(r,[],this.urlTree.queryParams,this.urlTree.fragment);return a.queryParams=this.urlTree.queryParams,o.url=this.urlSerializer.serialize(a),{state:o,tree:a}}async match(n){let e=new ge([],Object.freeze({}),this.queryParams,this.urlTree.fragment,Object.freeze({}),f,this.rootComponentType,null,{},this.injector);try{return{children:await this.processSegmentGroup(this.injector,this.config,n,f,e),rootSnapshot:e}}catch(r$8){if(r$8 instanceof He)return this.absoluteRedirectCount++,this.absoluteRedirectCount>po&&(this.allowRedirects=!1),this.urlTree=r$8.urlTree,this.queryParams=Object.freeze(r({},this.urlTree.queryParams)),this.match(r$8.urlTree.root);throw r$8 instanceof q?this.noMatchError(r$8):r$8}}async processSegmentGroup(n,e,r,i,o){if(r.segments.length===0&&r.hasChildren())return this.processChildren(n,e,r,o);let a=await this.processSegment(n,e,r,r.segments,i,!0,o);return a instanceof E?[a]:[]}async processChildren(n,e,r,i){let o=[];for(let s of Object.keys(r.children))s===`primary`?o.unshift(s):o.push(s);let a=[];for(let s of o){let u=r.children[s],l=oo(e,s),v=await this.processSegment(n,l,u,u.segments,s,!0,i);v instanceof E&&a.push(v)}let c=$n(a);return go(c),c}async processSegment(n,e,r,i,o,a,c){for(let s of e)try{return await this.processSegmentAgainstRoute(s._injector??n,e,s,r,i,o,a,c)}catch(u){if(u instanceof q||On(u))continue;throw u}if(ho(r,i))return new cr;throw new q(r)}async processSegmentAgainstRoute(n,e,r,i,o,a,c,s){if(F(r)!==a&&(a===f||!At(i,o,r)||!r.children?.length&&!r.loadChildren||o.length===0&&!i.hasChildren()))throw new q(i);if(r.redirectTo===void 0)return this.matchSegmentAgainstRoute(n,i,r,o,a,s);if(this.allowRedirects&&c)return this.expandSegmentAgainstRouteUsingRedirect(n,i,e,r,o,a,s);throw new q(i)}async expandSegmentAgainstRouteUsingRedirect(n,e,r,i,o,a,c){let{matched:s,parameters:u,consumedSegments:l,positionalParamSegments:v,remainingSegments:p}=kn(e,i,o);if(!s)throw new q(e);let y=this.createSnapshot(n,i,o,u,c);if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let x=await this.applyRedirects.applyRedirectCommands(l,i.redirectTo,v,xn(y),n),B=await this.applyRedirects.lineralizeSegments(i,x);return this.processSegment(n,r,e,B.concat(p),a,!1,c)}createSnapshot(n,e,r,i,o){let a=new ge(r,i,this.queryParams,this.urlTree.fragment,yo(e),F(e),e.component??e._loadedComponent??null,e,Ro(e),n),c=fr(a,o,this.paramsInheritanceStrategy);return a.params=c.params,a.data=c.data,a}async matchSegmentAgainstRoute(n,e,r,i,o,a){if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let c=ee=>this.createSnapshot(n,r,ee.consumedSegments,ee.parameters,a),s=await ct(ao(e,r,i,n,this.urlSerializer,c,this.abortSignal));if(r.path===`**`&&(e.children={}),!s?.matched)throw new q(e);n=r._injector??n;let{routes:u}=await this.getChildConfig(n,r,i),l=r._loadedInjector??n,{parameters:v,consumedSegments:p,remainingSegments:y}=s,x=this.createSnapshot(n,r,p,v,a),B=F(r)===o,{segmentGroup:we,slicedSegments:be}=B?on(e,p,y,u):{segmentGroup:e,slicedSegments:y};if(B&&be.length===0&&we.hasChildren())return new E(x,await this.processChildren(l,u,we,x));if(B&&u.length===0&&be.length===0)return new E(x,[]);let Ie=await this.processSegment(l,u,we,be,B?f:o,!0,x);if(!B&&!(Ie instanceof E))throw new q(e);return new E(x,Ie instanceof E?[Ie]:[])}async getChildConfig(n,e,r){if(e.children)return{routes:e.children,injector:n};if(e.loadChildren){if(e._loadedRoutes!==void 0){let o=e._loadedNgModuleFactory;return o&&!e._loadedInjector&&(e._loadedInjector=o.create(n).injector),{routes:e._loadedRoutes,injector:e._loadedInjector}}if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);if(await ct(Xi(n,e,r,this.urlSerializer,this.abortSignal))){let o=await this.configLoader.loadChildren(n,e);return e._loadedRoutes=o.routes,e._loadedInjector=o.injector,e._loadedNgModuleFactory=o.factory,o}throw ro(e)}return{routes:[],injector:n}}};function go(t){t.sort((n,e)=>n.value.outlet===f?-1:e.value.outlet===f?1:n.value.outlet.localeCompare(e.value.outlet))}function vo(t){let n=t.value.routeConfig;return n&&n.path===``}function $n(t){let n=[],e=/* @__PURE__ */ new Set;for(let i of t){if(!vo(i)){n.push(i);continue}let o=n.find(a=>i.value.routeConfig===a.value.routeConfig);o!==void 0?(o.children.push(...i.children),e.add(o)):n.push(i)}for(let i of e){let o=$n(i.children);n.push(new E(i.value,o))}let r=n.filter(i=>!e.has(i));return mo(r),r}function mo(t){let n=Object.create(null);t.forEach(e=>{let r=n[e.value.outlet];if(r){r.url.map(a=>a.toString()).join(`/`);e.value.url.map(a=>a.toString()).join(`/`);throw new b$2(4006,!1)}n[e.value.outlet]=e.value})}function yo(t){return t.data||{}}function Ro(t){return t.resolve||{}}function So(t,n,e,r$9,i,o,a){return Et$3(async c=>{let{state:s$1,tree:u}=await fo(t,n,e,r$9,c.extractedUrl,i,o,a);return s(r({},c),{targetSnapshot:s$1,urlAfterRedirects:u})})}function Co(t){return Et$3(n=>{let{targetSnapshot:e,guards:{canActivateChecks:r}}=n;if(!r.length)return Ye$1(n);let i=new Set(r.map(c=>c.route)),o=/* @__PURE__ */ new Set;for(let c of i)if(!o.has(c))for(let s of zn(c))o.add(s);let a=0;return lt$3(o).pipe(hc(c=>i.has(c)?wo(c,e,t):(c.data=fr(c,c.parent,t).resolve,Ye$1(void 0))),Sn$2(()=>a++),Xv(1),Et$3(c=>a===o.size?Ye$1(n):_n$1))})}function zn(t){return[t,...t.children.map(e=>zn(e)).flat()]}function wo(t,n,e){let r$10=t.routeConfig,i=t._resolve;return r$10?.title!==void 0&&!Mn(r$10)&&(i[Fe]=r$10.title),Wv(()=>(t.data=fr(t,t.parent,e).resolve,bo(i,t,n).pipe(G$2(o=>(t._resolvedData=o,t.data=r(r({},t.data),o),null)))))}function bo(t,n,e){let r=Zt(t);if(r.length===0)return Ye$1({});let i={};return lt$3(r).pipe(Et$3(o=>Io(t[o],n,e).pipe(Qv(),Sn$2(a=>{if(a instanceof X)throw Oe(new Z,a);i[o]=a}))),Xv(1),G$2(()=>i),os(o=>On(o)?_n$1:fc(o)))}function Io(t,n,e){let r=n._environmentInjector,i=Se(t,r);return Be(i.resolve?i.resolve(n,e):Tr(r,()=>i(n,e)))}var Rr=new y(``);function lr(t){return Vf(n=>{let e=t(n);return e?lt$3(e).pipe(G$2(()=>n)):Ye$1(n)})}var Sr=(()=>{class t{buildTitle(e){let r,i=e.root;for(;i!==void 0;)r=this.getResolvedTitleForRoute(i)??r,i=i.children.find(o=>o.outlet===f);return r}getResolvedTitleForRoute(e){return e.data[Fe]}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:()=>m$2(qn)})}return t})();var qn=(()=>{class t extends Sr{title;constructor(e){super(),this.title=e}updateTitle(e){let r=this.buildTitle(e);r!==void 0&&this.title.setTitle(r)}static ɵfac=function(r){return new(r||t)(w$1(n$))};static ɵprov=C({token:t,factory:t.ɵfac,providedIn:`root`})}return t})();var Ce=new y(``,{factory:()=>({})});var We=new y(``);var Hn=(()=>{class t{componentLoaders=/* @__PURE__ */ new WeakMap;childrenLoaders=/* @__PURE__ */ new WeakMap;onLoadStartListener;onLoadEndListener;compiler=m$2(QS);async loadComponent(e,r){if(this.componentLoaders.get(r))return this.componentLoaders.get(r);if(r._loadedComponent)return Promise.resolve(r._loadedComponent);this.onLoadStartListener&&this.onLoadStartListener(r);let i=(async()=>{try{let o=await un(Tr(e,()=>r.loadComponent())),a=await Bn(w2(o));return this.onLoadEndListener&&this.onLoadEndListener(r),r._loadedComponent=a,a}finally{this.componentLoaders.delete(r)}})();return this.componentLoaders.set(r,i),i}loadChildren(e,r){if(this.childrenLoaders.get(r))return this.childrenLoaders.get(r);if(r._loadedRoutes)return Promise.resolve({routes:r._loadedRoutes,injector:r._loadedInjector});this.onLoadStartListener&&this.onLoadStartListener(r);let i=(async()=>{try{let o=await Fn(r,this.compiler,e,this.onLoadEndListener);return r._loadedRoutes=o.routes,r._loadedInjector=o.injector,r._loadedNgModuleFactory=o.factory,o}finally{this.childrenLoaders.delete(r)}})();return this.childrenLoaders.set(r,i),i}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();async function Fn(t,n,e,r){let i=await un(Tr(e,()=>t.loadChildren())),o=await Bn(w2(i)),a;o instanceof Tg||Array.isArray(o)?a=o:a=await n.compileModuleAsync(o),r&&r(t);let c,s,l;return Array.isArray(a)?s=a:(c=a.create(e).injector,l=a,s=c.get(We,[],{optional:!0,self:!0}).flat()),{routes:s.map(mr),injector:c,factory:l}}async function Bn(t){return t}var Tt$1=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:()=>m$2(Eo)})}return t})();var Eo=(()=>{class t{shouldProcessUrl(e){return!0}extract(e){return e}merge(e,r){return e}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();var Vn=new y(``);var Mo=()=>{};var Gn=new y(``);var Wn=(()=>{class t{currentNavigation=be$1(null,{equal:()=>!1});currentTransition=null;lastSuccessfulNavigation=be$1(null);events=new V;transitionAbortWithErrorSubject=new V;configLoader=m$2(Hn);environmentInjector=m$2(me$2);destroyRef=m$2(Se$1);urlSerializer=m$2(Re);rootContexts=m$2(ae);location=m$2(Pb);inputBindingEnabled=m$2(Ve,{optional:!0})!==null;titleStrategy=m$2(Sr);options=m$2(Ce,{optional:!0})||{};paramsInheritanceStrategy=this.options.paramsInheritanceStrategy||Ti;urlHandlingStrategy=m$2(Tt$1);createViewTransition=m$2(Vn,{optional:!0});navigationErrorHandler=m$2(Gn,{optional:!0});routerResourcesFeature=m$2(Rr,{optional:!0});navigationId=0;get hasRequestedNavigation(){return this.navigationId!==0}transitions;afterPreactivation=()=>Ye$1(void 0);rootComponentType=null;destroyed=!1;constructor(){let e=i=>this.events.next(new Rt$1(i)),r=i=>this.events.next(new St$1(i));this.configLoader.onLoadEndListener=r,this.configLoader.onLoadStartListener=e,this.destroyRef.onDestroy(()=>{this.destroyed=!0})}complete(){this.transitions?.complete()}handleNavigationRequest(e){let r$11=++this.navigationId;Kr(()=>{this.transitions?.next(s(r({},e),{extractedUrl:this.urlHandlingStrategy.extract(e.rawUrl),targetSnapshot:null,targetRouterState:null,guards:{canActivateChecks:[],canDeactivateChecks:[]},guardsResult:null,id:r$11,routesRecognizeHandler:{},beforeActivateHandler:{}}))})}setupNavigations(e){return this.transitions=new En$1(null),this.transitions.pipe(Be$2(r=>r!==null),Vf(r$12=>{let i=!0,o=!1,a=new AbortController,c=()=>!o&&this.currentTransition?.id===r$12.id;return Ye$1(r$12).pipe(Vf(s$2=>{if(this.navigationId>r$12.id)return this.cancelNavigationTransition(r$12,``,b$1.SupersededByNewNavigation),_n$1;this.currentTransition=r$12;let u=this.lastSuccessfulNavigation();this.currentNavigation.set({id:s$2.id,initialUrl:s$2.rawUrl,extractedUrl:s$2.extractedUrl,targetBrowserUrl:typeof s$2.extras.browserUrl==`string`?this.urlSerializer.parse(s$2.extras.browserUrl):s$2.extras.browserUrl,trigger:s$2.source,extras:s$2.extras,previousNavigation:u?s(r({},u),{previousNavigation:null}):null,abort:()=>a.abort(),routesRecognizeHandler:s$2.routesRecognizeHandler,beforeActivateHandler:s$2.beforeActivateHandler});let l=!e.navigated||this.isUpdatingInternalState()||this.isUpdatedBrowserUrl(),v=s$2.extras.onSameUrlNavigation??e.onSameUrlNavigation;if(!l&&v!==`reload`)return this.events.next(new W(s$2.id,this.urlSerializer.serialize(s$2.rawUrl),``,ke.IgnoredSameUrlNavigation)),s$2.resolve(!1),_n$1;if(this.urlHandlingStrategy.shouldProcessUrl(s$2.rawUrl))return Ye$1(s$2).pipe(Vf(p=>(this.events.next(new se(p.id,this.urlSerializer.serialize(p.extractedUrl),p.source,p.restoredState)),p.id!==this.navigationId?_n$1:Promise.resolve(p))),So(this.environmentInjector,this.configLoader,this.rootComponentType,e.config,this.urlSerializer,this.paramsInheritanceStrategy,a.signal),Sn$2(p=>{r$12.targetSnapshot=p.targetSnapshot,r$12.urlAfterRedirects=p.urlAfterRedirects,this.currentNavigation.update(y=>(y.finalUrl=p.urlAfterRedirects,y)),this.events.next(new ze)}),Vf(p=>lt$3(r$12.routesRecognizeHandler.deferredHandle??Ye$1(void 0)).pipe(G$2(()=>p))),Sn$2(()=>{let p=new $e(s$2.id,this.urlSerializer.serialize(s$2.extractedUrl),this.urlSerializer.serialize(s$2.urlAfterRedirects),s$2.targetSnapshot);this.events.next(p)}));if(l&&this.urlHandlingStrategy.shouldProcessUrl(s$2.currentRawUrl)){let{id:p,extractedUrl:y,source:x,restoredState:B,extras:we}=s$2,be=new se(p,this.urlSerializer.serialize(y),x,B);this.events.next(be);let Ie=In(this.rootComponentType,this.environmentInjector).snapshot;return this.currentTransition=r$12=s(r({},s$2),{targetSnapshot:Ie,urlAfterRedirects:y,extras:s(r({},we),{skipLocationChange:!1,replaceUrl:!1})}),this.currentNavigation.update(ee=>(ee.finalUrl=y,ee)),Ye$1(r$12)}else return this.events.next(new W(s$2.id,this.urlSerializer.serialize(s$2.extractedUrl),``,ke.IgnoredByUrlHandlingStrategy)),s$2.resolve(!1),_n$1}),G$2(s$3=>{let u=new gt$1(s$3.id,this.urlSerializer.serialize(s$3.extractedUrl),this.urlSerializer.serialize(s$3.urlAfterRedirects),s$3.targetSnapshot);return this.events.next(u),this.currentTransition=r$12=s(r({},s$3),{guards:Pi(s$3.targetSnapshot,s$3.currentSnapshot,this.rootContexts)}),r$12}),Vi(s=>this.events.next(s)),Vf(s=>{if(r$12.guardsResult=s.guardsResult,s.guardsResult&&typeof s.guardsResult!=`boolean`)throw Oe(this.urlSerializer,s.guardsResult);let u=new vt$1(s.id,this.urlSerializer.serialize(s.extractedUrl),this.urlSerializer.serialize(s.urlAfterRedirects),s.targetSnapshot,!!s.guardsResult);if(this.events.next(u),!c())return _n$1;if(!s.guardsResult)return this.cancelNavigationTransition(s,``,b$1.GuardRejected),_n$1;if(s.guards.canActivateChecks.length===0)return Ye$1(s);let l=new mt(s.id,this.urlSerializer.serialize(s.extractedUrl),this.urlSerializer.serialize(s.urlAfterRedirects),s.targetSnapshot);if(this.events.next(l),!c())return _n$1;let v=!1;return Ye$1(s).pipe(Co(this.paramsInheritanceStrategy),Sn$2({next:()=>{v=!0;let p=new yt(s.id,this.urlSerializer.serialize(s.extractedUrl),this.urlSerializer.serialize(s.urlAfterRedirects),s.targetSnapshot);this.events.next(p)},complete:()=>{v||this.cancelNavigationTransition(s,``,b$1.NoDataFromResolver)}}))}),lr(s=>{let u=v=>{let p=[];if(v.routeConfig?._loadedComponent)v.component=v.routeConfig?._loadedComponent;else if(v.routeConfig?.loadComponent){let y=v._environmentInjector;p.push(this.configLoader.loadComponent(y,v.routeConfig).then(x=>{v.component=x}))}for(let y of v.children)p.push(...u(y));return p},l=u(s.targetSnapshot.root);return l.length===0?Ye$1(s):lt$3(Promise.all(l).then(()=>s))}),Vf(s$4=>{let{newlyCreatedRoutes:u,state:l}=Ni(e.routeReuseStrategy,s$4.targetSnapshot,s$4.currentRouterState);return this.currentTransition=r$12=s$4=s(r({},s$4),{targetRouterState:l,newlyCreatedRoutes:u}),this.currentNavigation.update(v=>(v.targetRouterState=l,v)),Ye$1(s$4)}),this.routerResourcesFeature?.setupAndRunResources(a.signal)??(s=>s),lr(()=>this.afterPreactivation()),Vf(()=>{let{currentSnapshot:s,targetSnapshot:u}=r$12,l=this.createViewTransition?.(this.environmentInjector,s.root,u.root,r$12.hasUAVisualTransition);return l?lt$3(l).pipe(G$2(()=>r$12)):Ye$1(r$12)}),ut$3(1),Vf(s=>{i=!1,this.events.next(new ve);let u=r$12.beforeActivateHandler.deferredHandle;return u?lt$3(u.then(()=>s)):Ye$1(s)}),Sn$2(s=>{new or(e.routeReuseStrategy,r$12.targetRouterState,r$12.currentRouterState,u=>this.events.next(u),this.inputBindingEnabled).activate(this.rootContexts),s.newlyCreatedRoutes?.clear(),c()&&(Qn(s.targetRouterState),o=!0,this.currentNavigation.update(u=>(u.abort=Mo,u)),this.lastSuccessfulNavigation.set(Kr(this.currentNavigation)),this.events.next(new $(s.id,this.urlSerializer.serialize(s.extractedUrl),this.urlSerializer.serialize(s.urlAfterRedirects))),this.titleStrategy?.updateTitle(s.targetRouterState.snapshot),s.resolve(!0))}),ho$1(Pn(a.signal).pipe(Be$2(()=>!o&&i),Sn$2(()=>{this.cancelNavigationTransition(r$12,a.signal.reason+``,b$1.Aborted)}))),Sn$2({complete:()=>{o=!0}}),ho$1(this.transitionAbortWithErrorSubject.pipe(Sn$2(s=>{throw s}))),fo$1(()=>{a.abort(),o||this.cancelNavigationTransition(r$12,``,b$1.SupersededByNewNavigation),this.currentTransition?.id===r$12.id&&(this.currentNavigation.set(null),this.currentTransition=null)}),os(s=>{if(o=!0,an(r$12),this.destroyed)return r$12.resolve(!1),_n$1;if(s instanceof X&&(s=Oe(this.urlSerializer,s)),Un(s))this.events.next(new j(r$12.id,this.urlSerializer.serialize(r$12.extractedUrl),s.message,s.cancellationCode)),Oi(s)?this.events.next(new me(s.url,s.navigationBehaviorOptions)):r$12.resolve(!1);else{let u=new ce(r$12.id,this.urlSerializer.serialize(r$12.extractedUrl),s,r$12.targetSnapshot??void 0);try{let l=Tr(this.environmentInjector,()=>this.navigationErrorHandler?.(u));if(l instanceof X){let{message:v,cancellationCode:p}=Oe(this.urlSerializer,l);this.events.next(new j(r$12.id,this.urlSerializer.serialize(r$12.extractedUrl),v,p)),this.events.next(new me(l.redirectTo,l.navigationBehaviorOptions))}else throw this.events.next(u),s}catch(l){this.options.resolveNavigationPromiseOnError?r$12.resolve(!1):r$12.reject(l)}}return _n$1}))}))}cancelNavigationTransition(e,r,i){an(e);let o=new j(e.id,this.urlSerializer.serialize(e.extractedUrl),r,i);this.events.next(o),e.resolve(!1)}isUpdatingInternalState(){return this.currentTransition?.extractedUrl.toString()!==this.currentTransition?.currentUrlTree.toString()}isUpdatedBrowserUrl(){let e=this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),r=Kr(this.currentNavigation),i=r?.targetBrowserUrl??r?.extractedUrl;return e.toString()!==i?.toString()&&!r?.extras.skipLocationChange}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();function Ao(t){return t!==Ue}function an(t){for(let n of t.newlyCreatedRoutes??[])n._localInjector?.destroy(),n._localInjector=void 0;Qn(t.targetRouterState)}function Qn(t){if(!t)return;let n=e=>{e.value.pending?.set(!1),e.children.forEach(n)};n(t._root)}var Kn=new y(``);var Yn=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:()=>m$2(To)})}return t})();var Mt$1=class{shouldDetach(n){return!1}store(n,e){}shouldAttach(n){return!1}retrieve(n){return null}shouldReuseRoute(n,e){return n.routeConfig===e.routeConfig}shouldDestroyInjector(n){return!0}};var To=(()=>{class t extends Mt$1{static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();var Dt$1=(()=>{class t{urlSerializer=m$2(Re);options=m$2(Ce,{optional:!0})||{};canceledNavigationResolution=this.options.canceledNavigationResolution||`replace`;location=m$2(Pb);urlHandlingStrategy=m$2(Tt$1);urlUpdateStrategy=this.options.urlUpdateStrategy||`deferred`;currentUrlTree=new M;getCurrentUrlTree(){return this.currentUrlTree}rawUrlTree=this.currentUrlTree;getRawUrlTree(){return this.rawUrlTree}createBrowserPath({finalUrl:e,initialUrl:r,targetBrowserUrl:i}){let o=e!==void 0?this.urlHandlingStrategy.merge(e,r):r,a=i??o;return a instanceof M?this.urlSerializer.serialize(a):a}routerUrlState(e){return e?.targetBrowserUrl===void 0||e?.finalUrl===void 0?{}:{ɵrouterUrl:this.urlSerializer.serialize(e.finalUrl)}}commitTransition({targetRouterState:e,finalUrl:r,initialUrl:i}){r&&e?(this.currentUrlTree=r,this.rawUrlTree=this.urlHandlingStrategy.merge(r,i),this.routerState=e):this.rawUrlTree=i}routerState=In(null,m$2(me$2));getRouterState(){return this.routerState}_stateMemento=this.createStateMemento();get stateMemento(){return this._stateMemento}updateStateMemento(){this._stateMemento=this.createStateMemento()}createStateMemento(){return{rawUrlTree:this.rawUrlTree,currentUrlTree:this.currentUrlTree,routerState:this.routerState}}restoredState(){return this.location.getState()}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:()=>m$2(Do)})}return t})();var Do=(()=>{class t extends Dt$1{currentPageId=0;lastSuccessfulId=-1;get browserPageId(){return this.canceledNavigationResolution!==`computed`?this.currentPageId:this.restoredState()?.ɵrouterPageId??this.currentPageId}registerNonRouterCurrentEntryChangeListener(e){return this.location.subscribe(r=>{r.type===`popstate`&&setTimeout(()=>{e(r.url,r.state,`popstate`,{replaceUrl:!0},r.hasUAVisualTransition)})})}handleRouterEvent(e,r){e instanceof se?this.updateStateMemento():e instanceof W?this.commitTransition(r):e instanceof $e?this.urlUpdateStrategy===`eager`&&(r.extras.skipLocationChange||this.setBrowserUrl(this.createBrowserPath(r),r)):e instanceof ve?(this.commitTransition(r),this.urlUpdateStrategy===`deferred`&&!r.extras.skipLocationChange&&this.setBrowserUrl(this.createBrowserPath(r),r)):e instanceof j?Dn(e)?e.code===b$1.Redirect&&this.routerState===r.targetRouterState&&this.resetInternalState(r):this.restoreHistory(r):e instanceof ce?this.restoreHistory(r,!0):e instanceof $&&(this.lastSuccessfulId=e.id,this.currentPageId=this.browserPageId)}setBrowserUrl(e,r$13){let{extras:i,id:o}=r$13,{replaceUrl:a,state:c}=i;if(this.location.isCurrentPathEqualTo(e)||a){let s=this.browserPageId,u=r(r({},c),this.generateNgRouterState(o,s,r$13));this.location.replaceState(e,``,u)}else{let s=r(r({},c),this.generateNgRouterState(o,this.browserPageId+1,r$13));this.location.go(e,``,s)}}restoreHistory(e,r=!1){if(this.canceledNavigationResolution===`computed`){let i=this.browserPageId,o=this.currentPageId-i;o!==0&&this.lastSuccessfulId!==-1?this.location.historyGo(o):this.getCurrentUrlTree()===e.finalUrl&&o===0&&(this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}else this.canceledNavigationResolution===`replace`&&(r&&this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}resetInternalState({finalUrl:e}){this.routerState=this.stateMemento.routerState,this.currentUrlTree=this.stateMemento.currentUrlTree,this.rawUrlTree=this.urlHandlingStrategy.merge(this.currentUrlTree,e??this.rawUrlTree)}resetUrlToCurrentUrlTree(){this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()),``,this.generateNgRouterState(this.lastSuccessfulId,this.currentPageId))}generateNgRouterState(e,r$14,i){return this.canceledNavigationResolution===`computed`?r({navigationId:e,ɵrouterPageId:r$14},this.routerUrlState(i)):r({navigationId:e},this.routerUrlState(i))}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();function Cr(t,n){t.events.pipe(Be$2(e=>e instanceof $||e instanceof j||e instanceof ce||e instanceof W),G$2(e=>e instanceof $||e instanceof W?0:(e instanceof j?e.code===b$1.Redirect||e.code===b$1.SupersededByNewNavigation:!1)?2:1),Be$2(e=>e!==2),ut$3(1)).subscribe(()=>{n()})}var ue=(()=>{class t{get currentUrlTree(){return this.stateManager.getCurrentUrlTree()}get rawUrlTree(){return this.stateManager.getRawUrlTree()}disposed=!1;nonRouterCurrentEntryChangeSubscription;console=m$2(Pg);stateManager=m$2(Dt$1);options=m$2(Ce,{optional:!0})||{};pendingTasks=m$2(Wn$2);urlUpdateStrategy=this.options.urlUpdateStrategy||`deferred`;navigationTransitions=m$2(Wn);urlSerializer=m$2(Re);location=m$2(Pb);urlHandlingStrategy=m$2(Tt$1);injector=m$2(me$2);_events=new V;get events(){return this._events}get routerState(){return this.stateManager.getRouterState()}navigated=!1;routeReuseStrategy=m$2(Yn);injectorCleanup=m$2(Kn,{optional:!0});onSameUrlNavigation=this.options.onSameUrlNavigation||`ignore`;config=m$2(We,{optional:!0})?.flat()??[];componentInputBindingEnabled=!!m$2(Ve,{optional:!0});currentNavigation=this.navigationTransitions.currentNavigation.asReadonly();constructor(){this.resetConfig(this.config),this.navigationTransitions.setupNavigations(this).subscribe({error:e=>{}}),this.subscribeToNavigationEvents()}eventsSubscription=new te$1;subscribeToNavigationEvents(){let e=this.navigationTransitions.events.subscribe(r$15=>{try{let i=this.navigationTransitions.currentTransition,o=Kr(this.navigationTransitions.currentNavigation);if(i!==null&&o!==null){if(this.stateManager.handleRouterEvent(r$15,o),r$15 instanceof j&&r$15.code!==b$1.Redirect&&r$15.code!==b$1.SupersededByNewNavigation)this.navigated=!0;else if(r$15 instanceof $)this.navigated=!0,this.injectorCleanup?.(this.routeReuseStrategy,this.routerState,this.config);else if(r$15 instanceof me){let a=r$15.navigationBehaviorOptions,c=this.urlHandlingStrategy.merge(r$15.url,i.currentRawUrl),s=r({scroll:i.extras.scroll,browserUrl:i.extras.browserUrl,info:i.extras.info,skipLocationChange:i.extras.skipLocationChange,replaceUrl:i.extras.replaceUrl||this.urlUpdateStrategy===`eager`||Ao(i.source)},a);this.scheduleNavigation(c,Ue,null,s,i.hasUAVisualTransition,{resolve:i.resolve,reject:i.reject,promise:i.promise})}}Di(r$15)&&this._events.next(r$15)}catch(i){this.navigationTransitions.transitionAbortWithErrorSubject.next(i)}});this.eventsSubscription.add(e)}resetRootComponentType(e){this.routerState.root.component=e,this.navigationTransitions.rootComponentType=e}initialNavigation(){this.setUpLocationChangeListener(),this.navigationTransitions.hasRequestedNavigation||this.navigateToSyncWithBrowser(this.location.path(!0),Ue,this.stateManager.restoredState(),{replaceUrl:!0})}setUpLocationChangeListener(){this.nonRouterCurrentEntryChangeSubscription??=this.stateManager.registerNonRouterCurrentEntryChangeListener((e,r,i,o,a)=>{this.navigateToSyncWithBrowser(e,i,r,o,a)})}navigateToSyncWithBrowser(e,r$16,i,o,a){let c=i?.navigationId?i:null,s$5=i?.ɵrouterUrl??e;if(i?.ɵrouterUrl&&(o=s(r({},o),{browserUrl:e})),i){let l=r({},i);delete l.navigationId,delete l.ɵrouterPageId,delete l.ɵrouterUrl,Object.keys(l).length!==0&&(o.state=l)}let u=this.parseUrl(s$5);this.scheduleNavigation(u,r$16,c,o,a).catch(l=>{this.disposed||this.injector.get(Mt$3)(l)})}get url(){return this.serializeUrl(this.currentUrlTree)}getCurrentNavigation(){return Kr(this.navigationTransitions.currentNavigation)}get lastSuccessfulNavigation(){return this.navigationTransitions.lastSuccessfulNavigation}resetConfig(e){this.config=e.map(mr),this.navigated=!1}ngOnDestroy(){this.dispose()}dispose(){this._events.unsubscribe(),this.navigationTransitions.complete(),this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),this.nonRouterCurrentEntryChangeSubscription=void 0,this.disposed=!0,this.eventsSubscription.unsubscribe()}createUrlTree(e,r$17={}){let{relativeTo:i,queryParams:o,fragment:a,queryParamsHandling:c,preserveFragment:s}=r$17,u=s?this.currentUrlTree.fragment:a,l=null;switch(c??this.options.defaultQueryParamsHandling){case`merge`:l=r(r({},this.currentUrlTree.queryParams),o);break;case`preserve`:l=this.currentUrlTree.queryParams;break;default:l=o||null}let v;try{v=Sn(i?i.snapshot:this.routerState.snapshot.root)}catch{(typeof e[0]!=`string`||e[0][0]!==`/`)&&(e=[]),v=this.currentUrlTree.root}return Cn(v,e,l,u??null,this.urlSerializer)}navigateByUrl(e,r={skipLocationChange:!1}){let i=J(e)?e:this.parseUrl(e),o=this.urlHandlingStrategy.merge(i,this.rawUrlTree);return this.scheduleNavigation(o,Ue,null,r)}navigate(e,r={skipLocationChange:!1}){return No(e),this.navigateByUrl(this.createUrlTree(e,r),r)}serializeUrl(e){return this.urlSerializer.serialize(e)}parseUrl(e){try{return this.urlSerializer.parse(e)}catch{return this.console.warn(en$2(4018,!1)),this.urlSerializer.parse(`/`)}}isActive(e,r$18){let i;if(r$18===!0?i=r({},dr):r$18===!1?i=r({},pe):i=r(r({},pe),r$18),J(e))return ut(this.currentUrlTree,e,i);let o=this.parseUrl(e);return ut(this.currentUrlTree,o,i)}scheduleNavigation(e,r,i,o,a,c){if(this.disposed)return Promise.resolve(!1);let s,u,l;c?(s=c.resolve,u=c.reject,l=c.promise):l=new Promise((p,y)=>{s=p,u=y});let v=this.pendingTasks.add();return Cr(this,()=>{queueMicrotask(()=>this.pendingTasks.remove(v))}),this.navigationTransitions.handleNavigationRequest({source:r,restoredState:i,currentUrlTree:this.currentUrlTree,currentRawUrl:this.currentUrlTree,rawUrl:e,extras:o,hasUAVisualTransition:a,resolve:s,reject:u,promise:l,currentSnapshot:this.routerState.snapshot,currentRouterState:this.routerState}),l.catch(Promise.reject.bind(Promise))}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();function No(t){for(let n=0;n<t.length;n++)if(t[n]==null)throw new b$2(4008,!1)}var Uo=(()=>{class t{router=m$2(ue);stateManager=m$2(Dt$1);fragment=be$1(``);queryParams=be$1({});path=be$1(``);serializer=m$2(Re);constructor(){this.updateState(),this.router.events?.subscribe(e=>{e instanceof $&&this.updateState()})}updateState(){let{fragment:e,root:r,queryParams:i}=this.stateManager.getCurrentUrlTree();this.fragment.set(e),this.queryParams.set(i),this.path.set(this.serializer.serialize(new M(r)))}static ɵfac=function(r){return new(r||t)};static ɵprov=P$1({token:t,factory:t.ɵfac})}return t})();var Nt=(()=>{class t{router;route;tabIndexAttribute;renderer;el;locationStrategy;hrefAttributeValue=m$2(new xa(`href`),{optional:!0});reactiveHref=tC(()=>{if(!this.isAnchorElement)return this.hrefAttributeValue;this.reactiveRouterState.path(),this._preserveFragment()&&this.reactiveRouterState.fragment();let e=r=>r===`preserve`||r===`merge`;return(e(this._queryParamsHandling())||e(this.options?.defaultQueryParamsHandling))&&this.reactiveRouterState.queryParams(),this.computeHref(this.createUrlTree())});get href(){return Kr(this.reactiveHref)}set href(e){this.reactiveHref.set(e)}set target(e){this._target.set(e)}get target(){return Kr(this._target)}_target=be$1(void 0);set queryParams(e){this._queryParams.set(e)}get queryParams(){return Kr(this._queryParams)}_queryParams=be$1(void 0,{equal:()=>!1});set fragment(e){this._fragment.set(e)}get fragment(){return Kr(this._fragment)}_fragment=be$1(void 0);set queryParamsHandling(e){this._queryParamsHandling.set(e)}get queryParamsHandling(){return Kr(this._queryParamsHandling)}_queryParamsHandling=be$1(void 0);set state(e){this._state.set(e)}get state(){return Kr(this._state)}_state=be$1(void 0,{equal:()=>!1});set info(e){this._info.set(e)}get info(){return Kr(this._info)}_info=be$1(void 0,{equal:()=>!1});set relativeTo(e){this._relativeTo.set(e)}get relativeTo(){return Kr(this._relativeTo)}_relativeTo=be$1(void 0);set preserveFragment(e){this._preserveFragment.set(e)}get preserveFragment(){return Kr(this._preserveFragment)}_preserveFragment=be$1(!1);set skipLocationChange(e){this._skipLocationChange.set(e)}get skipLocationChange(){return Kr(this._skipLocationChange)}_skipLocationChange=be$1(!1);set replaceUrl(e){this._replaceUrl.set(e)}get replaceUrl(){return Kr(this._replaceUrl)}_replaceUrl=be$1(!1);browserUrl=Cb(void 0);isAnchorElement;onChanges=new V;applicationErrorHandler=m$2(Mt$3);options=m$2(Ce,{optional:!0});reactiveRouterState=m$2(Uo);constructor(e,r,i,o,a,c){this.router=e,this.route=r,this.tabIndexAttribute=i,this.renderer=o,this.el=a,this.locationStrategy=c;let s=a.nativeElement.tagName?.toLowerCase();this.isAnchorElement=s===`a`||s===`area`||!!(typeof customElements==`object`&&customElements.get(s)?.observedAttributes?.includes?.(`href`))}setTabIndexIfNotOnNativeEl(e){this.tabIndexAttribute!=null||this.isAnchorElement||this.applyAttributeValue(`tabindex`,e)}ngOnChanges(e){this.onChanges.next(this)}routerLinkInput=be$1(null);set routerLink(e){e==null?(this.routerLinkInput.set(null),this.setTabIndexIfNotOnNativeEl(null)):(J(e)?this.routerLinkInput.set(e):this.routerLinkInput.set(Array.isArray(e)?e:[e]),this.setTabIndexIfNotOnNativeEl(`0`))}onClick(e,r$19,i,o,a){let c=this.urlTree;if(c===null||this.isAnchorElement&&(e!==0||r$19||i||o||a||typeof this.target==`string`&&this.target!=`_self`))return!0;let s=this.browserUrl(),u=r({skipLocationChange:this.skipLocationChange,replaceUrl:this.replaceUrl,state:this.state,info:this.info},s!==void 0&&{browserUrl:s});return this.router.navigateByUrl(c,u)?.catch(l=>{this.applicationErrorHandler(l)}),!this.isAnchorElement}ngOnDestroy(){}applyAttributeValue(e,r){let i=this.renderer,o=this.el.nativeElement;r!==null?i.setAttribute(o,e,r):i.removeAttribute(o,e)}createUrlTree(){let e=this.routerLinkInput();return e===null||!this.router.createUrlTree?null:J(e)?e:this.router.createUrlTree(e,{relativeTo:this._relativeTo()!==void 0?this._relativeTo():this.route,queryParams:this._queryParams(),fragment:this._fragment(),queryParamsHandling:this._queryParamsHandling(),preserveFragment:this._preserveFragment()})}get urlTree(){return Kr(()=>this.createUrlTree())}computeHref(e){return e!==null&&this.locationStrategy?this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(e))??``:null}static ɵfac=function(r){return new(r||t)(bt$3(ue),bt$3(G),Cu(`tabindex`),bt$3($r),bt$3(ie$1),bt$3(Na))};static ɵdir=Ne$1({type:t,selectors:[[``,`routerLink`,``]],hostVars:2,hostBindings:function(r,i){r&1&&Wg(`click`,function(a){return i.onClick(a.button,a.ctrlKey,a.shiftKey,a.altKey,a.metaKey)}),r&2&&or$1(`href`,i.reactiveHref(),a_)(`target`,i._target())},inputs:{target:`target`,queryParams:`queryParams`,fragment:`fragment`,queryParamsHandling:`queryParamsHandling`,state:`state`,info:`info`,relativeTo:`relativeTo`,preserveFragment:[2,`preserveFragment`,`preserveFragment`,je$2],skipLocationChange:[2,`skipLocationChange`,`skipLocationChange`,je$2],replaceUrl:[2,`replaceUrl`,`replaceUrl`,je$2],browserUrl:[1,`browserUrl`],routerLink:`routerLink`},features:[Xo]})}return t})();var Oo=(()=>{class t{router;element;renderer;cdr;links;classes=[];routerEventsSubscription;linkInputChangesSubscription;_isActive=!1;get isActive(){return this._isActive}routerLinkActiveOptions={exact:!1};ariaCurrentWhenActive;isActiveChange=new _e$3;link=m$2(Nt,{optional:!0});constructor(e,r,i,o){this.router=e,this.element=r,this.renderer=i,this.cdr=o,this.routerEventsSubscription=e.events.subscribe(a=>{a instanceof $&&this.update()})}ngAfterContentInit(){Ye$1(this.links.changes,Ye$1(null)).pipe(lo$1()).subscribe(e=>{this.update(),this.subscribeToEachLinkOnChanges()})}subscribeToEachLinkOnChanges(){this.linkInputChangesSubscription?.unsubscribe();let e=[...this.links.toArray(),this.link].filter(r=>!!r).map(r=>r.onChanges);this.linkInputChangesSubscription=lt$3(e).pipe(lo$1()).subscribe(r=>{this._isActive!==this.isLinkActive(this.router)(r)&&this.update()})}set routerLinkActive(e){let r=e==null?[]:(Array.isArray(e)?e:e.split(` `)).filter(i=>!!i);for(let i of this.classes)r.includes(i)||this.renderer.removeClass(this.element.nativeElement,i);this.classes=r}ngOnChanges(e){this.update()}ngOnDestroy(){this.routerEventsSubscription.unsubscribe(),this.linkInputChangesSubscription?.unsubscribe()}update(){!this.links||!this.router.navigated||this.routerLinkActiveOptions===null&&!this._isActive||queueMicrotask(()=>{let e=this.hasActiveLinks();this.classes.forEach(r=>{e?this.renderer.addClass(this.element.nativeElement,r):this.renderer.removeClass(this.element.nativeElement,r)}),e&&this.ariaCurrentWhenActive!==void 0?this.renderer.setAttribute(this.element.nativeElement,`aria-current`,this.ariaCurrentWhenActive.toString()):this.renderer.removeAttribute(this.element.nativeElement,`aria-current`),this._isActive!==e&&(this._isActive=e,this.cdr.markForCheck(),this.isActiveChange.emit(e))})}isLinkActive(e){let r$20=this.routerLinkActiveOptions;if(r$20===null)return()=>!1;let i;return r$20===void 0?i=r({},pe):Po(r$20)?i=r$20:r$20.exact??!1?i=r({},dr):i=r({},pe),o=>{let a=o.urlTree;return a?Kr(hr(a,e,i)):!1}}hasActiveLinks(){let e=this.isLinkActive(this.router);return this.link&&e(this.link)||this.links.some(e)}static ɵfac=function(r){return new(r||t)(bt$3(ue),bt$3(ie$1),bt$3($r),bt$3(EC))};static ɵdir=Ne$1({type:t,selectors:[[``,`routerLinkActive`,``]],contentQueries:function(r,i,o){if(r&1&&Zg(o,Nt,5),r&2){let a;sS(a=aS())&&(i.links=a)}},inputs:{routerLinkActiveOptions:`routerLinkActiveOptions`,ariaCurrentWhenActive:`ariaCurrentWhenActive`,routerLinkActive:`routerLinkActive`},outputs:{isActiveChange:`isActiveChange`},exportAs:[`routerLinkActive`],features:[Xo]})}return t})();function Po(t){let n=t;return!!(n.paths||n.matrixParams||n.queryParams||n.fragment)}var Lo=new y(``);function jo(t,...n){return Pn$2([{provide:We,multi:!0,useValue:t},{provide:G,useFactory:xo},{provide:ud,multi:!0,useFactory:$o},n.map(e=>e.ɵproviders)])}function xo(){return m$2(ue).routerState.root}function ko(t,n){return{ɵkind:t,ɵproviders:n}}function $o(){let t=m$2(X$2);return n=>{let e=t.get(rr$1);if(n!==e.components[0])return;let r=t.get(ue),i=t.get(zo);t.get(qo)===1&&r.initialNavigation(),t.get(Ho,null,{optional:!0})?.setUpPreloading(),t.get(Lo,null,{optional:!0})?.init(),r.resetRootComponentType(e.componentTypes[0]),i.closed||(i.next(),i.complete(),i.unsubscribe())}}var zo=new y(``,{factory:()=>new V});var qo=new y(``,{factory:()=>1});var Ho=new y(``);function Fo(t={}){return ko(8,[{provide:Ve,useFactory:()=>new Tn(t,m$2(Rr,{optional:!0}))}])}var wt=/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;var xt=/^(\d?\d)[:.](\d?\d)(?:[:.](\d?\d))?\s*(AM|PM)?$/i;function N(e,a){let t=Array(e);for(let o=0;o<e;o++)t[o]=a(o);return t}var Dt=(()=>{class e extends l{_matDateLocale=m$2(m$1,{optional:!0});constructor(){super();let t=m$2(m$1,{optional:!0});t!==void 0&&(this._matDateLocale=t),super.setLocale(this._matDateLocale)}getYear(t){return t.getFullYear()}getMonth(t){return t.getMonth()}getDate(t){return t.getDate()}getDayOfWeek(t){return t.getDay()}getMonthNames(t){let o=new Intl.DateTimeFormat(this.locale,{month:t,timeZone:`utc`});return N(12,n=>this._format(o,new Date(2017,n,1)))}getDateNames(){let t=new Intl.DateTimeFormat(this.locale,{day:`numeric`,timeZone:`utc`});return N(31,o=>this._format(t,new Date(2017,0,o+1)))}getDayOfWeekNames(t){let o=new Intl.DateTimeFormat(this.locale,{weekday:t,timeZone:`utc`});return N(7,n=>this._format(o,new Date(2017,0,n+1)))}getYearName(t){let o=new Intl.DateTimeFormat(this.locale,{year:`numeric`,timeZone:`utc`});return this._format(o,t)}getFirstDayOfWeek(){if(typeof Intl<`u`&&Intl.Locale){let t=new Intl.Locale(this.locale),o=(t.getWeekInfo?.()||t.weekInfo)?.firstDay??0;return o===7?0:o}return 0}getNumDaysInMonth(t){return this.getDate(this._createDateWithOverflow(this.getYear(t),this.getMonth(t)+1,0))}clone(t){return new Date(t.getTime())}createDate(t,o,n){let r=this._createDateWithOverflow(t,o,n);return r.getMonth(),r}today(){return/* @__PURE__ */ new Date}parse(t,o){return typeof t==`number`?new Date(t):t?new Date(Date.parse(t)):null}format(t,o){if(!this.isValid(t))throw Error(`NativeDateAdapter: Cannot format invalid date.`);let n=new Intl.DateTimeFormat(this.locale,s(r({},o),{timeZone:`utc`}));return this._format(n,t)}addCalendarYears(t,o){return this.addCalendarMonths(t,o*12)}addCalendarMonths(t,o){let n=this._createDateWithOverflow(this.getYear(t),this.getMonth(t)+o,this.getDate(t));return this.getMonth(n)!=((this.getMonth(t)+o)%12+12)%12&&(n=this._createDateWithOverflow(this.getYear(n),this.getMonth(n),0)),n}addCalendarDays(t,o){return this._createDateWithOverflow(this.getYear(t),this.getMonth(t),this.getDate(t)+o)}toIso8601(t){return[t.getUTCFullYear(),this._2digit(t.getUTCMonth()+1),this._2digit(t.getUTCDate())].join(`-`)}deserialize(t){if(typeof t==`string`){if(!t)return null;if(wt.test(t)){let o=new Date(t);if(this.isValid(o))return o}}return super.deserialize(t)}isDateInstance(t){return t instanceof Date}isValid(t){return!isNaN(t.getTime())}invalid(){return/* @__PURE__ */ new Date(NaN)}setTime(t,o,n,r){let i=this.clone(t);return i.setHours(o,n,r,0),i}getHours(t){return t.getHours()}getMinutes(t){return t.getMinutes()}getSeconds(t){return t.getSeconds()}parseTime(t,o){if(typeof t!=`string`)return t instanceof Date?new Date(t.getTime()):null;let n=t.trim();if(n.length===0)return null;let r=this._parseTimeString(n);if(r===null){let i=n.replace(/[^0-9:(AM|PM)]/gi,``).trim();i.length>0&&(r=this._parseTimeString(i))}return r||this.invalid()}addSeconds(t,o){return new Date(t.getTime()+o*1e3)}_createDateWithOverflow(t,o,n){let r=/* @__PURE__ */ new Date;return r.setFullYear(t,o,n),r.setHours(0,0,0,0),r}_2digit(t){return(`00`+t).slice(-2)}_format(t,o){let n=/* @__PURE__ */ new Date;return n.setUTCFullYear(o.getFullYear(),o.getMonth(),o.getDate()),n.setUTCHours(o.getHours(),o.getMinutes(),o.getSeconds(),o.getMilliseconds()),t.format(n)}_parseTimeString(t){let o=t.toUpperCase().match(xt);if(o){let n=parseInt(o[1]),r=parseInt(o[2]),i=o[3]==null?void 0:parseInt(o[3]),m=o[4];if(n===12?n=m===`AM`?0:n:m===`PM`&&(n+=12),T(n,0,23)&&T(r,0,59)&&(i==null||T(i,0,59)))return this.setTime(this.today(),n,r,i||0)}return null}static ɵfac=function(o){return new(o||e)};static ɵprov=P$1({token:e,factory:e.ɵfac,autoProvided:!1})}return e})();function T(e,a,t){return!isNaN(e)&&e>=a&&e<=t}var St={parse:{dateInput:null,timeInput:null},display:{dateInput:{year:`numeric`,month:`numeric`,day:`numeric`},timeInput:{hour:`numeric`,minute:`numeric`},monthYearLabel:{year:`numeric`,month:`short`},dateA11yLabel:{year:`numeric`,month:`long`,day:`numeric`},monthYearA11yLabel:{year:`numeric`,month:`long`},timeOptionLabel:{hour:`numeric`,minute:`numeric`}}};function ft(e=St){return[{provide:l,useClass:Dt},{provide:d,useValue:e}]}var bt={providers:[HE(),jo([{path:``,pathMatch:`full`,redirectTo:`schedules`},{path:`employees`,title:`Employees`,loadComponent:()=>import(`./chunk-6gKH892q.js`).then(e=>e.EmployeesPage)},{path:`employees/:id`,title:`Availability`,loadComponent:()=>import(`./chunk--MnrsMUn.js`).then(e=>e.RestrictionsPage)},{path:`shifts`,title:`Shifts`,loadComponent:()=>import(`./chunk-DLH3iJWM.js`).then(e=>e.ShiftsPage)},{path:`generate`,title:`Generate schedule`,loadComponent:()=>import(`./chunk-DqKtUySV.js`).then(e=>e.GeneratePage)},{path:`schedules`,title:`Schedules`,loadComponent:()=>import(`./chunk-DCfKXpk-.js`).then(e=>e.SchedulesPage)},{path:`schedules/:id`,title:`Schedule`,loadComponent:()=>import(`./chunk-CZC41CC-.js`).then(e=>e.ScheduleViewPage)},{path:`schedules/:id/print`,title:`Print schedule`,loadComponent:()=>import(`./chunk-DQg4JnGa.js`).then(e=>e.SchedulePrintPage)},{path:`rules`,title:`Rules`,loadComponent:()=>import(`./chunk-BCI8FR27.js`).then(e=>e.RulesPage)},{path:`schedules/:id/breaks`,title:`Breaks`,loadComponent:()=>import(`./chunk-CjgWIK32.js`).then(e=>e.BreaksPage)},{path:`schedules/:id/breaks/print`,title:`Print breaks`,loadComponent:()=>import(`./chunk-CO7EtW6o.js`).then(e=>e.BreaksPrintPage)},{path:`import`,title:`Import from Teams Shifts`,loadComponent:()=>import(`./chunk-ChQgbk0Y.js`).then(e=>e.ImportPage)},{path:`settings`,title:`Settings`,loadComponent:()=>import(`./chunk-DBBhXNLq.js`).then(e=>e.SettingsPage)},{path:`**`,redirectTo:`schedules`}],Fo()),ft(),{provide:st$1,useValue:{appearance:`outline`,subscriptSizing:`dynamic`}}]};function gt(e,a){let o=!a?.manualCleanup?a?.injector?.get(Se$1)??m$2(Se$1):null,n=Ct(a?.equal),r;a?.requireSync?r=be$1({kind:0},{equal:n}):r=be$1({kind:1,value:a?.initialValue},{equal:n});let i,m=e.subscribe({next:s=>r.set({kind:1,value:s}),error:s=>{r.set({kind:2,error:s}),i?.()},complete:()=>{i?.()}});if(a?.requireSync&&r().kind===0)throw new b$2(601,!1);return i=o?.onDestroy(m.unsubscribe.bind(m)),Le$2(()=>{let s=r();switch(s.kind){case 1:return s.value;case 2:throw s.error;case 0:throw new b$2(601,!1)}},{equal:a?.equal})}function Ct(e=Object.is){return(a,t)=>a.kind===1&&t.kind===1&&e(a.value,t.value)}var _t=(()=>{class e{static ɵfac=function(o){return new(o||e)};static ɵdir=Ne$1({type:e,selectors:[[`mat-toolbar-row`]],hostAttrs:[1,`mat-toolbar-row`],exportAs:[`matToolbarRow`]})}return e})();var vt=(()=>{class e{_elementRef=m$2(ie$1);_platform=m$2(Ee);_document=m$2(O);color;_toolbarRows;ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static ɵfac=function(o){return new(o||e)};static ɵcmp=(function(){let t=[`*`,[[`mat-toolbar-row`]]];return Fe$1({type:e,selectors:[[`mat-toolbar`]],contentQueries:function(r,i,m){if(r&1&&Zg(m,_t,5),r&2){let s;sS(s=aS())&&(i._toolbarRows=s)}},hostAttrs:[1,`mat-toolbar`],hostVars:6,hostBindings:function(r,i){r&2&&(li$1(i.color?`mat-`+i.color:``),yt$2(`mat-toolbar-multiple-rows`,i._toolbarRows.length>0)(`mat-toolbar-single-row`,i._toolbarRows.length===0))},inputs:{color:`color`},exportAs:[`matToolbar`],ngContentSelectors:[`*`,`mat-toolbar-row`],decls:2,vars:0,template:function(r,i){r&1&&(ir$1(t),it$3(0),it$3(1,1))},styles:[`.mat-toolbar {
  background: var(--%NS%mat-toolbar-container-background-color, var(--%NS%mat-sys-surface));
  color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--%NS%mat-toolbar-title-text-font, var(--%NS%mat-sys-title-large-font));
  font-size: var(--%NS%mat-toolbar-title-text-size, var(--%NS%mat-sys-title-large-size));
  line-height: var(--%NS%mat-toolbar-title-text-line-height, var(--%NS%mat-sys-title-large-line-height));
  font-weight: var(--%NS%mat-toolbar-title-text-weight, var(--%NS%mat-sys-title-large-weight));
  letter-spacing: var(--%NS%mat-toolbar-title-text-tracking, var(--%NS%mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --%NS%mat-button-text-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
  --%NS%mat-button-outlined-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2})})()}return e})();var Mt=(()=>{class e{static ɵfac=function(o){return new(o||e)};static ɵmod=ye$3({type:e});static ɵinj=ue$1({imports:[no$1]})}return e})();var Tt=(e,a)=>a.path;function It(e,a){if(e&1&&(fa(0,`a`,2)(1,`mat-icon`),MS(2),fd(),fa(3,`span`,3),MS(4),fd()()),e&2){let t=a.$implicit;Bg(`routerLink`,t.path),ti$1(2),sb(t.icon),ti$1(2),sb(t.label)}}function Rt(e,a){if(e&1&&(fa(0,`mat-toolbar`,0)(1,`a`,1)(2,`mat-icon`),MS(3,`event_available`),fd(),fa(4,`span`),MS(5),fd()(),fa(6,`nav`),Ww(7,It,5,3,`a`,2,Tt),fd()()),e&2){let t=rS();ti$1(5),sb(t.settings().businessName||`Scheduler`),ti$1(2),Gw(t.links)}}var b=class e{router=m$2(ue);settings=m$2(gv).settings;printMode=gt(this.router.events.pipe(Be$2(a=>a instanceof $),G$2(a=>a.urlAfterRedirects.endsWith(`/print`)||a.urlAfterRedirects.includes(`/print?`))),{initialValue:!1});links=[{path:`/schedules`,label:`Schedules`,icon:`calendar_month`},{path:`/generate`,label:`Generate`,icon:`auto_awesome`},{path:`/employees`,label:`Employees`,icon:`group`},{path:`/shifts`,label:`Shifts`,icon:`schedule`},{path:`/rules`,label:`Rules`,icon:`rule`},{path:`/settings`,label:`Settings`,icon:`settings`}];static ɵfac=function(t){return new(t||e)};static ɵcmp=Fe$1({type:e,selectors:[[`app-root`]],decls:3,vars:1,consts:[[1,`topbar`,`no-print`],[`routerLink`,`/`,1,`brand`],[`mat-button`,``,`routerLinkActive`,`active`,3,`routerLink`],[1,`label`]],template:function(t,o){t&1&&(si$1(0,Rt,9,1,`mat-toolbar`,0),fa(1,`main`),Vg(2,`router-outlet`),fd()),t&2&&ai$1(o.printMode()?-1:0)},dependencies:[gr,Nt,Oo,Mt,vt,y3,b3,j3,L3],styles:[`.topbar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:10;gap:16px;background:var(--%NS%mat-sys-surface-container);border-bottom:1px solid var(--%NS%mat-sys-outline-variant);overflow-x:auto}.brand[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;color:inherit;text-decoration:none;font:var(--%NS%mat-sys-title-medium);white-space:nowrap}nav[_ngcontent-%COMP%]{display:flex;gap:4px;margin-left:auto}nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}@media(max-width:720px){.label[_ngcontent-%COMP%]{display:none}}`]})};hT(b,bt).catch(e=>console.error(e));export{Tn$2 as A,zt$1 as B,F$1 as C,On$1 as D,L as E,sn$1 as F,d as H,tn$1 as I,ut$2 as L,de$1 as M,ht$1 as N,Rn$1 as O,rn$1 as P,v as R,Bn$1 as S,Kt$1 as T,l as U,oe$1 as V,g as W,mt$1 as _,Je as a,zt as b,Tn$1 as c,be as d,ct$1 as f,kt as g,ge$1 as h,Et$1 as i,U$1 as j,Sn$1 as k,Ut as l,ft$2 as m,ue as n,Ot as o,et as p,$t as r,Pn$1 as s,Nt as t,Wn$1 as u,ut$1 as v,Fn$1 as w,$e$1 as x,ve$1 as y,wn$1 as z};