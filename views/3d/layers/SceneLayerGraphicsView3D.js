// COPYRIGHT © 2017 Esri
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
// See http://js.arcgis.com/4.6/esri/copyright.txt for details.

define(["require","exports","../../../core/tsSupport/declareExtendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessorSupport/decorators","../../../core/Logger","./graphics/Graphics3DLayerViewCore","./support/LayerViewUpdatingPercentage","../../../Graphic","../../../geometry","../../../renderers/support/renderingInfoUtils","../../../core/Collection","../../../core/HandleRegistry","../../../core/promiseUtils","../lib/glMatrix","./LayerView3D","./i3s/I3SUtil","./i3s/I3SQueryEngine","../support/aaBoundingBox","../support/PreallocArray","../support/projectionUtils"],function(e,t,r,n,i,o,a,s,d,l,u,p,h,c,g,f,y,_,v,b,E){function x(e,t){return e.xmin-=t,e.ymin-=t,e.xmax+=t,e.ymax+=t,e.hasZ&&(e.zmin-=t,e.zmax+=t),e.hasM&&(e.mmin-=t,e.mmax+=t),e}var I=o.getLogger("esri.views.3d.layers.SceneLayerGraphicsView3D"),A=function(e){function t(t){var r=e.call(this)||this;return r._queryEngine=null,r.supportsHeightUnitConversion=!0,r._isUpdating=!1,r._definitionExpressionErrors=0,r._maxDefinitionExpressionErrors=20,r._nodesAddedToStage={},r.loadedGraphics=new p,r.supportsDraping=!0,r._overlayUpdating=null,r._controllerCreated=!1,r._handles=new h,r}return r(t,e),t.prototype.initialize=function(){var e=this;y.checkSpatialReferences(this.layer,this.view.spatialReference,this.view.viewingMode),this._handles.add([this.layer.watch("renderer",function(t,r){return e._rendererChange(t,r)}),this.layer.watch("objectIdFilter",function(){return e._objectIdFilterChange()}),this.layer.watch("_controller.parsedDefinitionExpression",function(){return e._definitionExpressionChange()})]),this._layerViewCore=new a({owner:this,layer:this.layer,spatialIndexRequired:!1,labelingEnabled:!0,frustumVisibilityEnabled:!1,elevationAlignmentEnabled:!0,elevationFeatureExpressionEnabled:!1,verticalScaleEnabled:this.supportsHeightUnitConversion,highlightsEnabled:!0,updateSuspendResumeExtent:function(){return e._updateSuspendResumeExtent()},updateClippingExtent:function(t){return e._updateClippingExtent(t)},getGraphicsInExtent:function(t,r,n){return e._getGraphicsInExtent(t,r,n)}}),this.addResolvingPromise(this._layerViewCore.initialize()),this.drawingOrder=this.view.getDrawingOrder(this.layer.uid),this._createController()},t.prototype.destroy=function(){this._layerViewCore&&(this._layerViewCore.destroy(),this._layerViewCore=null),this._controller&&(this._controller.destroy(),this._controller=null),this._elevationUpdateNodes=null,this._intersectingGraphicIds=null,this._nodesAddedToStage=null,this._handles&&(this._handles.destroy(),this._handles=null)},Object.defineProperty(t.prototype,"hasDraped",{get:function(){return this._layerViewCore.graphicsCore.hasDraped},enumerable:!0,configurable:!0}),t.prototype.whenGraphicAttributes=function(e,t){var r=this,n=function(){var t=r._findGraphicNodeAndIndex(e);return{node:t.node,indices:[t.index]}};return y.whenGraphicAttributes(this.layer,[e],this._getObjectIdField(),t,n,{ignoreUnavailableFields:!0,populateObjectId:!0}).then(function(e){return e[0]})},t.prototype.getGraphicsFromStageObject=function(e,t){if(!this.loadedGraphics)return c.reject();var r=e.getMetadata().graphicId,n=this.loadedGraphics.find(function(e){return e.uid===r}),i=this._getObjectIdField();return n&&n.attributes&&n.attributes[i]?c.resolve(n):c.reject()},t.prototype.whenGraphicBounds=function(e){return this._layerViewCore.graphicsCore.whenGraphicBounds(e)},t.prototype.canResume=function(){return this.inherited(arguments)&&(!this._controller||this._controller.rootNodeVisible)},t.prototype.isUpdating=function(){return this._isUpdating||!this._controllerCreated?!0:!(!this._controller||!this._controller.updating)},t.prototype.getRenderingInfo=function(e){var t=u.getRenderingInfo(e,{renderer:this.layer.renderer});if(t&&t.color){var r=t.color;r[0]=r[0]/255,r[1]=r[1]/255,r[2]=r[2]/255}return t},t.prototype.getSymbolUpdateType=function(){return this._layerViewCore.graphicsCore.getSymbolUpdateType()},t.prototype._findGraphicNodeAndIndex=function(e){for(var t=e.attributes[this.layer.objectIdField],r=0,n=Object.keys(this._nodesAddedToStage);r<n.length;r++)for(var i=n[r],o=this._nodesAddedToStage[i].bundles,a=0;a<o.length;a++){var s=this._findGraphicIndex(o[a],t);if(s>=0)return{node:this._controller.nodeIndex[i],nodeId:i,bundleNr:a,index:s}}return null},t.prototype._forAllFeatures=function(e,t){for(var r=0,n=Object.keys(this._nodesAddedToStage);r<n.length;r++)for(var i=n[r],o=this._nodesAddedToStage[i],a=o.bundles,s=0;s<a.length;s++){for(var d=a[s],l=0;l<d.length;l++)for(var u=d[l].graphics,p=0;p<u.length;p++){var h=u[p],c=d[l].featureIds[p];h.visible&&e(c,l,h)}null!=t&&t({nodeId:i,bundleNr:s})}},t.prototype._getGraphicIndices=function(e,t,r){for(var n=this._nodesAddedToStage[e],i=n.bundles[t],o=this._getObjectIdField(),a=[],s=0,d=r;s<d.length;s++){var l=d[s],u=l.attributes[o],p=this._findGraphicIndex(i,u);p>=0&&a.push(p)}return a},t.prototype._findGraphicIndex=function(e,t){for(var r=0;r<e.length;r++)for(var n=0,i=e[r].featureIds;n<i.length;n++){var o=i[n];if(o===t)return r}return-1},t.prototype._getGraphicsInExtent=function(e,t,r){v[2]=-(1/0),v[3]=1/0;var n=v.fromRect(w,e),i=t;null==this._elevationUpdateNodes&&(this._elevationUpdateNodes=new b(10));var o=this._elevationUpdateNodes;o.clear(),this._controller&&this._controller.updateElevationChanged(n,i,o);var a=o.length;this._intersectingGraphicIds||(this._intersectingGraphicIds=new b(10));var s=this._intersectingGraphicIds;s.clear();for(var d=0;a>d;d++){var l=o.data[d],u=this._nodesAddedToStage[l.id];if(null!=u)for(var p=u.bundles,h=0;h<p.length;h++)for(var c=p[h],g=0;g<c.length;g++)for(var f=c[g].graphics,y=0;y<f.length;y++)s.push(f[y].uid)}r(this._intersectingGraphicIds.data,this._intersectingGraphicIds.length)},t.prototype._evaluateUpdatingState=function(){var e=!1;if(this._layerViewCore.elevationAlignment){var t=0;t+=this._layerViewCore.elevationAlignment.numNodesUpdating(),t+=this._layerViewCore.graphicsCore.numNodesUpdating();var r=!1;r=r||!this._controllerCreated,r=r||this._overlayUpdating,r=r||this._layerViewCore.graphicsCore.needsIdleUpdate(),e=e||t>0,e=e||r}this._isUpdating!==e&&(this._isUpdating=e,this.notifyChange("updating"))},t.prototype._notifySuspendedChange=function(){},t.prototype._notifyDrapedDataChange=function(){this.notifyChange("hasDraped"),this.emit("draped-data-change")},t.prototype.highlight=function(e,t){return this._layerViewCore.highlight(e,t,this.layer.objectIdField)},t.prototype._createController=function(){var e=this,t={addBundle:function(t,r,n){return e._addBundle(t,r,n)},isBundleAlreadyAddedToStage:function(t,r){return e._isBundleAlreadyAddedToStage(t,r)},isOverMemory:function(){return e._isOverMemory()},removeNodeData:function(t){return e._removeNodeData(t)},getAddedNodeIDs:function(){return e._getAddedNodeIDs()},areAllBundlesLoaded:function(t){return e._areAllBundlesLoaded(t)}},r={traversalOptions:{initDepthFirst:!1,neighborhood:!1,perLevelTraversal:!0,allowPartialOverlaps:!1,errorMetricPreference:["distanceRangeFromDefaultCamera","screenSpaceRelative"]},getLoadedAttributes:function(t){return e._getLoadedAttributes(t)},setAttributeData:function(t,r,n){return e._setAttributeData(t,r,n)}};this.layer.createGraphicsController({layerView:this,layerViewRequiredFunctions:t,layerViewOptionalFunctions:r}).then(function(t){e._controller=t,t.watch("rootNodeVisible",function(){e.notifyChange("suspended")})}).always(function(){e._controllerCreated=!0,e._evaluateUpdatingState()})},t.prototype._addBundle=function(e,t,r){var n=r.allGeometryData,i=r.attributeDataInfo,o=[],a=this._controller.crsIndex,s=this._getObjectIdField();null==this._nodesAddedToStage[e.id]&&(this._nodesAddedToStage[e.id]={bundles:[],attributeData:i?i.attributeData:null,loadedAttributes:i?i.loadedAttributes:null}),this._nodesAddedToStage[e.id].bundles[t]=o;var u;if(this.layer.objectIdFilter){var p=this.layer.objectIdFilter.ids,h="include"===this.layer.objectIdFilter.method;u=function(e){var t=p.indexOf(e)>=0;return t===h}}for(var g=this.layer.fullExtent&&x(this.layer.fullExtent.clone(),.5),f=[],y=0;y<n.length;y++)for(var _=n[y],v=_.featureDataPosition,b=_.geometries||m,E=_.featureIds,A=0;A<b.length;A++){var w=b[A],C=[],S=A<E.length?A:0,D=E[S],F={};if(null!=D){if(u&&!u(D))continue;F[s]=D}var G=w.params.type,T=void 0,N=void 0;"Embedded"===w.type&&(T=w.params.vertexAttributes.position,N=3);var O=void 0;if("lines"===G){for(var j=[],V=0;V<T.length;V+=N)j.push([T[V]+e.mbs[0],T[V+1]+e.mbs[1]]);var U=new l.Polyline(a);U.addPath(j),O=U,C.push(new d(O,null,F))}else if("points"===G)for(var V=0;V<T.length;V+=N)O=new l.Point({x:T[V]+v[0],y:T[V+1]+v[1],z:N>2?T[V+2]+v[2]:void 0,spatialReference:a}),g&&!g.contains(O)&&I.error("Service Error: Point coordinates outside of layer extent"),C.push(new d(O,null,F));for(var R=0,B=C;R<B.length;R++){var q=B[R];q.layer=this.layer}f.push.apply(f,C),o.push({featureIds:_.featureIds,graphics:C})}this.loadedGraphics.addMany(f);var L=this._nodesAddedToStage[e.id];return this._setBundleAttributes(L.bundles[t],L.loadedAttributes,L.attributeData),this._filterNode(L),c.resolve()},t.prototype._areAllBundlesLoaded=function(e){var t=this._nodesAddedToStage[e.id];if(null==t)return!1;for(var r=0;r<e.featureData.length;r++)if(null==t.bundles[r])return!1;return!0},t.prototype._isBundleAlreadyAddedToStage=function(e,t){return null!=this._nodesAddedToStage[e.id]&&null!=this._nodesAddedToStage[e.id].bundles[t]},t.prototype._isOverMemory=function(){return!1},t.prototype._removeNodeData=function(e){var t=this._nodesAddedToStage[e.id];if(null!=t){var r=t.bundles,n=[];for(var i in r)for(var o in r[i])n.push.apply(n,r[i][o].graphics);this.loadedGraphics.removeMany(n),delete this._nodesAddedToStage[e.id]}},t.prototype._getAddedNodeIDs=function(){return Object.keys(this._nodesAddedToStage)},t.prototype._getLoadedAttributes=function(e){var t=this._nodesAddedToStage[e.id];return t?t.loadedAttributes:void 0},t.prototype._setAttributeData=function(e,t,r){var n=this._nodesAddedToStage[e.id];n&&(n.loadedAttributes=t,n.attributeData=r,this._setNodeAttributes(n,t,r),this._filterNode(n),this._layerViewCore.labeling.layerLabelsEnabled()&&this._layerViewCore.labeling.updateLabelingInfo())},t.prototype._setNodeAttributes=function(e,t,r){var n=e.bundles;for(var i in n){var o=n[i];this._setBundleAttributes(o,t,r)}},t.prototype._setBundleAttributes=function(e,t,r){for(var n=0;n<e.length;n++)for(var i=e[n],o=0,a=i.graphics;o<a.length;o++){var s=a[o];if(s.attributes||(s.attributes={}),t)for(var d=0,l=t;d<l.length;d++){var u=l[d].name;r[u]&&(s.attributes[u]=y.getCachedAttributeValue(r[u],n))}}},t.prototype._updateSuspendResumeExtent=function(){if(this.layer.fullExtent){this._suspendResumeExtent||(this._suspendResumeExtent=g.vec4d.create());var e=this.layer.fullExtent;E.extentToBoundingRect(e,this._suspendResumeExtent,this.view.spatialReference)||(this._suspendResumeExtent=null)}else this._suspendResumeExtent=null;return this._suspendResumeExtent},t.prototype._updateClippingExtent=function(e){return this._controller&&this._controller.updateClippingArea(e),!1},t.prototype._getObjectIdField=function(){return this.layer.objectIdField||"OBJECTID"},t.prototype._rendererChange=function(e,t){var r=this,n=e?e.requiredFields:[],i=t?t.requiredFields:[];n.length===i.length&&n.every(function(e,t){return n[t]===i[t]})||Object.keys(this._nodesAddedToStage).forEach(function(e){r._removeNodeData({id:e})})},t.prototype._objectIdFilterChange=function(){var e=this;Object.keys(this._nodesAddedToStage).forEach(function(t){e._removeNodeData({id:t})}),this._controller&&this._controller.restartNodeLoading()},t.prototype._definitionExpressionChange=function(){this._definitionExpressionErrors=0},t.prototype._evaluateClause=function(e,t){try{return!!e.calculateValue(t)}catch(r){return this._definitionExpressionErrors<this._maxDefinitionExpressionErrors&&I.error("Error while evaluating definitionExpression: "+r),this._definitionExpressionErrors++,this._definitionExpressionErrors===this._maxDefinitionExpressionErrors&&I.error("Further errors are ignored"),!1}},t.prototype._filterNode=function(e){var t=this._controller.parsedDefinitionExpression;for(var r in e.bundles)for(var n=e.bundles[r],i=0,o=n;i<o.length;i++)for(var a=o[i],s=0,d=a.graphics;s<d.length;s++){var l=d[s];l.visible=null!=t?this._evaluateClause(t,l):!0}},t.prototype.queryExtent=function(e){return this._ensureQueryEngine().queryExtent(e)},t.prototype.queryFeatureCount=function(e){return this._ensureQueryEngine().queryFeatureCount(e)},t.prototype.queryFeatures=function(e){var t=this;return this._ensureQueryEngine().queryFeatures(e).then(function(e){for(var r=0,n=e.features;r<n.length;r++){var i=n[r];i.layer=t.layer}return e})},t.prototype.queryObjectIds=function(e){return this._ensureQueryEngine().queryObjectIds(e)},t.prototype._ensureQueryEngine=function(){return this._queryEngine||(this._queryEngine=this._createQueryEngine()),this._queryEngine},t.prototype._createQueryEngine=function(){var e=this,t={id:0,index:0,graphic:null};return new _({forAll:function(r,n){function i(e,n,i){t.id=e,t.index=n,t.graphic=i,r(t)}e._forAllFeatures(i,n)},createGraphic:function(e){return e.graphic.clone()},requestFields:function(t,r,n){var i=function(){var n=e._getGraphicIndices(t.nodeId,t.bundleNr,r);return{node:e._controller.nodeIndex[t.nodeId],indices:n}};return y.whenGraphicAttributes(e.layer,r,e._getObjectIdField(),n,i,{ignoreUnavailableFields:!1})},createExtentBuilder:function(){var t=v.create(v.NEGATIVE_INFINITY),r=e.layer.spatialReference;return{add:function(e){return v.expand(t,e.graphic.geometry)},getExtent:function(){return v.toExtent(t,r)}}}},{enableObjectId:!0,enableOutFields:!!this.layer.objectIdField})},t.prototype.getStats=function(){var e=this.inherited(arguments)||{};return e.nodecount=Object.keys(this._nodesAddedToStage).length,e.featurecount=this.loadedGraphics.length,e},n([i.property()],t.prototype,"loadedGraphics",void 0),n([i.property()],t.prototype,"layer",void 0),n([i.property()],t.prototype,"hasDraped",null),n([i.property()],t.prototype,"_controller",void 0),n([i.property({dependsOn:["_controller.updating"]})],t.prototype,"updating",void 0),n([i.property({aliasOf:"_controller.updatingPercentage"})],t.prototype,"updatingPercentageValue",void 0),t=n([i.subclass("esri.views.3d.layers.SceneLayerGraphicsView3D")],t)}(i.declared(f,s)),m=[{type:"Embedded",params:{type:"points",vertexAttributes:{position:[0,0,0]}}}],w=v.create(v.POSITIVE_INFINITY);return A});