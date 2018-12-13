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

define(["require","exports"],function(e,d){function r(e,d,r){for(var t=e.typedBuffer,f=e.typedBufferStride,n=d.typedBuffer,u=d.typedBufferStride,o=r?r.count:d.count,c=(r&&r.dstIndex?r.dstIndex:0)*f,i=(r&&r.srcIndex?r.srcIndex:0)*u,p=0;p<o;++p)t[c]=n[i],t[c+1]=n[i+1],t[c+2]=n[i+2],c+=f,i+=u}Object.defineProperty(d,"__esModule",{value:!0}),d.copy=r});