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
// See http://js.arcgis.com/4.12/esri/copyright.txt for details.

define(["require","exports","../../../../core/has","../../../webgl","./GeometryUtils","./Rect","./RectangleBinPack"],function(t,e,c,h,n,_,g){return function(){function s(t,e,i){if(void 0===i&&(i=0),this._size=[],this._mosaicsData=[],this._textures=[],this._dirties=[],this._maxItemSize=0,this._currentPage=0,this._fixSpriteLocationsTable=c("fix-sprite-locations"),this._pageWidth=0,this._pageHeight=0,this._mosaicRects=new Map,this._spriteCopyQueue=[],this.pixelRatio=1,(t<=0||e<=0)&&console.error("Sprites mosaic defaultWidth and defaultHeight must be greater than zero!"),this._pageWidth=t,this._pageHeight=e,0<i&&(this._maxItemSize=i),this.pixelRatio=window.devicePixelRatio||1,this._fixSpriteLocationsTable){var s=[];for(var a in this._fixSpriteLocationsTable){var h=this._fixSpriteLocationsTable[a];s[h.page]=h.pageSize}for(var r=0,o=s;r<o.length;r++){var p=o[r];this._mosaicsData.push(new Uint32Array(p[0]*p[1])),this._dirties.push(!0),this._size.push([p[0],p[1]]),this._textures.push(void 0)}}this._binPack=new g(this._pageWidth-4,this._pageHeight-4);var n=Math.floor(this._pageWidth),_=Math.floor(this._pageHeight);this._mosaicsData.push(new Uint32Array(n*_)),this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0)}return s.prototype.getWidth=function(t){return t>=this._size.length?-1:this._size[t][0]},s.prototype.getHeight=function(t){return t>=this._size.length?-1:this._size[t][1]},s.prototype.getPage=function(t){return t<this._textures.length?this._textures[t]:null},s.prototype.has=function(t){return this._mosaicRects.has(t)},Object.defineProperty(s.prototype,"itemCount",{get:function(){return this._mosaicRects.size},enumerable:!0,configurable:!0}),s.prototype.getSpriteItem=function(t){return this._mosaicRects.get(t)},s.prototype.addSpriteItem=function(t,e,i,s,a,h){var r,o,p,n;if(this._mosaicRects.has(t))return this._mosaicRects.get(t);if(this._fixSpriteLocationsTable&&this._fixSpriteLocationsTable[t]){var _=this._fixSpriteLocationsTable[t];o=_.rect,p=_.page,n=_.pageSize}else o=(r=this._allocateImage(e[0],e[1]))[0],p=r[1],n=r[2];if(o.width<=0||o.height<=0)return null;var c={rect:o,width:e[0],height:e[1],sdf:a,simplePattern:h,pixelRatio:1,page:p};return this._mosaicRects.set(t,c),this._copy({rect:o,spriteSize:e,spriteData:i,page:p,pageSize:n,repeat:s,sdf:a}),c},s.prototype.hasItemsToProcess=function(){return 0!==this._spriteCopyQueue.length},s.prototype.processNextItem=function(){var t=this._spriteCopyQueue.pop();t&&this._copy(t)},s.prototype.getSpriteItems=function(t){for(var e={},i=0,s=t;i<s.length;i++){var a=s[i];e[a]=this.getSpriteItem(a)}return e},s.prototype.getMosaicItemPosition=function(t,e){var i=this.getSpriteItem(t),s=i&&i.rect;if(!s)return null;s.width=i.width,s.height=i.height;var a=i.width,h=i.height;return{size:[i.width,i.height],tl:[(s.x+1)/this._size[i.page][0],(s.y+1)/this._size[i.page][1]],br:[(s.x+1+a)/this._size[i.page][0],(s.y+1+h)/this._size[i.page][1]],page:i.page}},s.prototype.bind=function(t,e,i,s){void 0===i&&(i=0),void 0===s&&(s=0),this._textures[i]||(this._textures[i]=new h.Texture(t,{pixelFormat:6408,dataType:5121,width:this._size[i][0],height:this._size[i][1]},new Uint8Array(this._mosaicsData[i].buffer)));var a=this._textures[i];a.setSamplingMode(e),this._dirties[i]&&(a.setData(new Uint8Array(this._mosaicsData[i].buffer)),a.generateMipmap()),t.bindTexture(a,s),this._dirties[i]=!1},s._copyBits=function(t,e,i,s,a,h,r,o,p,n,_){var c=s*e+i,g=o*h+r;if(_){g-=h;for(var u=-1;u<=n;c=((++u+n)%n+s)*e+i,g+=h)for(var l=-1;l<=p;l++)a[g+l]=t[c+(l+p)%p]}else for(u=0;u<n;u++){for(l=0;l<p;l++)a[g+l]=t[c+l];c+=e,g+=h}},s.prototype._copy=function(t){if(!(t.page>=this._mosaicsData.length)){var e=t.spriteData,i=this._mosaicsData[t.page];i&&e||console.error("Source or target images are uninitialized!");s._copyBits(e,t.spriteSize[0],0,0,i,t.pageSize[0],t.rect.x+1,t.rect.y+1,t.spriteSize[0],t.spriteSize[1],t.repeat),this._dirties[t.page]=!0}},s.prototype._allocateImage=function(t,e){t+=2,e+=2;var i=Math.max(t,e);if(this._maxItemSize&&this._maxItemSize<i){var s=Math.pow(2,Math.ceil(n.log2(t))),a=Math.pow(2,Math.ceil(n.log2(e))),h=new _.default(0,0,t,e);return this._mosaicsData.push(new Uint32Array(s*a)),this._dirties.push(!0),this._size.push([s,a]),this._textures.push(void 0),[h,this._mosaicsData.length-1,[s,a]]}var r=t%4?4-t%4:0,o=e%4?4-e%4:0,p=this._binPack.allocate(t+r,e+o);return p.width<=0?(this._dirties[this._currentPage]||(this._mosaicsData[this._currentPage]=null),this._currentPage=this._mosaicsData.length,this._mosaicsData.push(new Uint32Array(this._pageWidth*this._pageHeight)),this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0),this._binPack=new g(this._pageWidth-4,this._pageHeight-4),this._allocateImage(t,e)):[p,this._currentPage,[this._pageWidth,this._pageHeight]]},s.prototype.dispose=function(){this._binPack=null;for(var t=0,e=this._textures;t<e.length;t++){var i=e[t];i&&i.dispose()}this._textures.length=0,this._mosaicsData.length=0,this._mosaicRects.clear()},s}()});