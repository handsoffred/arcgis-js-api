// COPYRIGHT © 2018 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.10/esri/copyright.txt for details.

/**
   * Copyright 2016 Google Inc. All Rights Reserved.
   *
   * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
   *
   *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
   *
   */

define([],function(){"use strict";function t(t){this.time=t.time,this.target=t.target,this.rootBounds=t.rootBounds,this.boundingClientRect=t.boundingClientRect,this.intersectionRect=t.intersectionRect||c(),this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,n=e.width*e.height,o=this.intersectionRect,i=o.width*o.height;this.intersectionRatio=n?i/n:this.isIntersecting?1:0}function e(t,e){var n=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(n.root&&1!=n.root.nodeType)throw new Error("root must be an Element");this._checkForIntersections=o(this._checkForIntersections.bind(this),this.THROTTLE_TIMEOUT),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(n.rootMargin),this.thresholds=this._initThresholds(n.threshold),this.root=n.root||null,this.rootMargin=this._rootMarginValues.map(function(t){return t.value+t.unit}).join(" ")}function n(){return window.performance&&performance.now&&performance.now()}function o(t,e){var n=null;return function(){n||(n=setTimeout(function(){t(),n=null},e))}}function i(t,e,n,o){"function"==typeof t.addEventListener?t.addEventListener(e,n,o||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function r(t,e,n,o){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,o||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,n)}function s(t,e){var n=Math.max(t.top,e.top),o=Math.min(t.bottom,e.bottom),i=Math.max(t.left,e.left),r=Math.min(t.right,e.right),s=r-i,h=o-n;return s>=0&&h>=0&&{top:n,bottom:o,left:i,right:r,width:s,height:h}}function h(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):c()}function c(){return{top:0,bottom:0,left:0,right:0,width:0,height:0}}function u(t,e){for(var n=e;n;){if(n==t)return!0;n=a(n)}return!1}function a(t){var e=t.parentNode;return e&&11==e.nodeType&&e.host?e.host:e}if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype)return void("isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}}));var d=[];e.prototype.THROTTLE_TIMEOUT=100,e.prototype.POLL_INTERVAL=null,e.prototype.USE_MUTATION_OBSERVER=!0,e.prototype.observe=function(t){if(!this._observationTargets.some(function(e){return e.element==t})){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(),this._checkForIntersections()}},e.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter(function(e){return e.element!=t}),this._observationTargets.length||(this._unmonitorIntersections(),this._unregisterInstance())},e.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorIntersections(),this._unregisterInstance()},e.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},e.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter(function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]})},e.prototype._parseRootMargin=function(t){var e=t||"0px",n=e.split(/\s+/).map(function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}});return n[1]=n[1]||n[0],n[2]=n[2]||n[0],n[3]=n[3]||n[1],n},e.prototype._monitorIntersections=function(){this._monitoringIntersections||(this._monitoringIntersections=!0,this.POLL_INTERVAL?this._monitoringInterval=setInterval(this._checkForIntersections,this.POLL_INTERVAL):(i(window,"resize",this._checkForIntersections,!0),i(document,"scroll",this._checkForIntersections,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in window&&(this._domObserver=new MutationObserver(this._checkForIntersections),this._domObserver.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0}))))},e.prototype._unmonitorIntersections=function(){this._monitoringIntersections&&(this._monitoringIntersections=!1,clearInterval(this._monitoringInterval),this._monitoringInterval=null,r(window,"resize",this._checkForIntersections,!0),r(document,"scroll",this._checkForIntersections,!0),this._domObserver&&(this._domObserver.disconnect(),this._domObserver=null))},e.prototype._checkForIntersections=function(){var e=this._rootIsInDom(),o=e?this._getRootRect():c();this._observationTargets.forEach(function(i){var r=i.element,s=h(r),c=this._rootContainsTarget(r),u=i.entry,a=e&&c&&this._computeTargetAndRootIntersection(r,o),d=i.entry=new t({time:n(),target:r,boundingClientRect:s,rootBounds:o,intersectionRect:a});u?e&&c?this._hasCrossedThreshold(u,d)&&this._queuedEntries.push(d):u&&u.isIntersecting&&this._queuedEntries.push(d):this._queuedEntries.push(d)},this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)},e.prototype._computeTargetAndRootIntersection=function(t,e){if("none"!=window.getComputedStyle(t).display){for(var n=h(t),o=n,i=a(t),r=!1;!r;){var c=null,u=1==i.nodeType?window.getComputedStyle(i):{};if("none"==u.display)return;if(i==this.root||i==document?(r=!0,c=e):i!=document.body&&i!=document.documentElement&&"visible"!=u.overflow&&(c=h(i)),c&&!(o=s(c,o)))break;i=a(i)}return o}},e.prototype._getRootRect=function(){var t;if(this.root)t=h(this.root);else{var e=document.documentElement,n=document.body;t={top:0,left:0,right:e.clientWidth||n.clientWidth,width:e.clientWidth||n.clientWidth,bottom:e.clientHeight||n.clientHeight,height:e.clientHeight||n.clientHeight}}return this._expandRectByRootMargin(t)},e.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map(function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100}),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},e.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,o=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==o)for(var i=0;i<this.thresholds.length;i++){var r=this.thresholds[i];if(r==n||r==o||r<n!=r<o)return!0}},e.prototype._rootIsInDom=function(){return!this.root||u(document,this.root)},e.prototype._rootContainsTarget=function(t){return u(this.root||document,t)},e.prototype._registerInstance=function(){d.indexOf(this)<0&&d.push(this)},e.prototype._unregisterInstance=function(){var t=d.indexOf(this);-1!=t&&d.splice(t,1)},window.IntersectionObserver=e,window.IntersectionObserverEntry=t});