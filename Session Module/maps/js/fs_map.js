		

		
var FullZoomer = {};
        FullZoomer.realTileSize = 256;
        FullZoomer.map = null;
        // XXX todo: do this conditionally (e.g. chrome doesn't need it)
        FullZoomer.tilePad = 0; // how many pixels to pad the tiles to avoid gaps in some browsers
        FullZoomer.roundingSlop = 0.001;//.001; // lat/long padding for setMaxBounds (avoid rounding errors)

        // override so we can allow full-scaling of flat images.
        FullZoomer.Map = L.Map.extend({
            // _boundsMinZoom is getting set wrong in setMaxBounds. Not sure what a better fix is.
            getMinZoom: function () {
                return this.options.minZoom || 0;
            },
            
            // override so we can set the tileSize to fill the requested zoom scale
            _limitZoom: function (zoom) {
                var min = this.getMinZoom(),
                    max = this.getMaxZoom()
                // pre-adjust zoom so we can find a scale that's inside the limits
                zoom = Math.max(min, Math.min(max, zoom));
                if (FullZoomer.tiles) {
                    // round it away from the bottom if we're close: scale issues
                    if (zoom-1 < min) {
                        zoom = min;
                    }
                    // this is exactly like getZoomScale but we need to figure out the *next higher* zoomer level instead of
                    var crs = this.options.crs;
                    var nextZoom = (zoom <= -1) ? 0 : Math.ceil(zoom)
                    var scale = crs.scale(zoom) / crs.scale(nextZoom);
                    // do the clever work of setting the tileSize here so the tiles fill the view
                    FullZoomer.tiles.options.tileSize = Math.ceil(FullZoomer.realTileSize*(scale));
                }
                if (FullZoomer.tiles && Math.round(zoom) == zoom) {
                    // we need to be explicit with whole tiles: no scale
                    FullZoomer.tiles.options.tileSize = FullZoomer.realTileSize;
                }
                return zoom;
            }
        })

        // override so we can make the map stick on the mouse instead of recentering (same as scrollwheel)
        FullZoomer.Map.DoubleClickZoom = L.Map.DoubleClickZoom.extend({
            _onDoubleClick: function (e) {
                zoom = FullZoomer.map._limitZoom(FullZoomer.map._zoom + 1)
                var scale = FullZoomer.map.getZoomScale(FullZoomer.map._zoom + 1),
                    viewHalf = FullZoomer.map.getSize()._divideBy(2),
                    centerOffset = e.containerPoint._subtract(viewHalf)._multiplyBy(1 - 1 / scale),
                    newCenterPoint = FullZoomer.map._getTopLeftPoint()._add(viewHalf)._add(centerOffset);
                center = FullZoomer.map.unproject(newCenterPoint);
                this.setView(center, zoom);
            }
        });

        // call after zoom so we can rebuild the maxBounds based on the zoom level:
        // always constrain to the smallest bounds that allow full image visibility plus whitespace slop
        FullZoomer.postZoom = function() {
            // I think we should use bounds.extend: function (point) ??
            // ... surely there's a better way to do this that I can't figure out.
            var currentBounds = FullZoomer.map.getBounds();
            var currentHeight = currentBounds._northEast.lat - currentBounds._southWest.lat;
            var currentWidth = currentBounds._northEast.lng - currentBounds._southWest.lng;
            var imageHeight = FullZoomer.imageBounds._northEast.lat - FullZoomer.imageBounds._southWest.lat;
            var imageWidth = FullZoomer.imageBounds._northEast.lng - FullZoomer.imageBounds._southWest.lng;
            var maxBoundsHeight = Math.max(imageHeight, currentHeight) + FullZoomer.roundingSlop;
            var maxBoundsWidth= Math.max(imageWidth, currentWidth) + FullZoomer.roundingSlop;
            if (currentHeight > imageHeight) { maxBoundsHeight += (currentHeight-imageHeight); }
            if (currentWidth > imageWidth) { maxBoundsWidth += (currentWidth-imageWidth); }
            var maxBounds = new L.LatLngBounds( [FullZoomer.imageCenter.lat-maxBoundsHeight/2,FullZoomer.imageCenter.lng-maxBoundsWidth/2],
                                                [FullZoomer.imageCenter.lat+maxBoundsHeight/2,FullZoomer.imageCenter.lng+maxBoundsWidth/2] );
            
            // this should work but it doesn't. Recenters when it doesn't need to.
            //return FullZoomer.map.setMaxBounds(maxBounds);
            
            // following code is EXACTLY setMaxBounds except calling getBoundsZoom with inside=false.
            bounds = L.latLngBounds(maxBounds);

            FullZoomer.map.options.maxBounds = bounds;

            if (!bounds) {
                FullZoomer.map._boundsMinZoom = null;
                return;
            }

            var minZoom = FullZoomer.map.getBoundsZoom(bounds, false);

            FullZoomer.map._boundsMinZoom = minZoom;

            if (FullZoomer.map._loaded) {
                if (FullZoomer.map._zoom < minZoom) {
                    FullZoomer.map.setView(bounds.getCenter(), minZoom);
                } else {
                    FullZoomer.map.panInsideBounds(bounds);
                }
            }
        }

        // utility to center image and fill viewport. Call immediately before addTileLayer. (or after? May be fine.)
        FullZoomer.fullImage = function() {
            // figure out where the image is in the "world" and record those bounds to limit zoom
            south = -1*(FullZoomer.imageHeight/FullZoomer.canvasSize)+FullZoomer.roundingSlop;
            west = FullZoomer.roundingSlop;
            north = 0-FullZoomer.roundingSlop;
            east = FullZoomer.imageWidth/FullZoomer.canvasSize-FullZoomer.roundingSlop
            FullZoomer.imageBounds = new L.LatLngBounds( [south,west],[north,east] )
            // Sometimes this isn't giving us the right view?? roundingSlop above seems to help.
            FullZoomer.map.fitBounds(FullZoomer.imageBounds);
            FullZoomer.imageCenter = FullZoomer.imageBounds.getCenter();
            FullZoomer.map.options.minZoom = FullZoomer.map.getBoundsZoom(FullZoomer.imageBounds);
        }

        // we call this on every tile to handle scaling and also non-square tiles at the edges of our "maps".
        FullZoomer.scaleTile = function(data) {
            inWidth = data.tile.naturalWidth;
            inHeight = data.tile.naturalHeight;
            if (inHeight < FullZoomer.realTileSize) {
                data.tile.style.height = Math.ceil(inHeight * (FullZoomer.tiles.options.tileSize/FullZoomer.realTileSize)+FullZoomer.tilePad)+'px';
                data.tile.style.marginBottom = Math.ceil((FullZoomer.realTileSize-inHeight) * (FullZoomer.tiles.options.tileSize/FullZoomer.realTileSize)+FullZoomer.tilePad)+'px';
            } else {
                data.tile.style.height = FullZoomer.tiles.options.tileSize+FullZoomer.tilePad+'px';
                data.tile.style.marginTop = '';
            }
            if (inWidth < FullZoomer.realTileSize) {
                data.tile.style.width = Math.ceil(inWidth * (FullZoomer.tiles.options.tileSize/FullZoomer.realTileSize)+FullZoomer.tilePad)+'px';
                data.tile.style.marginRight = Math.ceil((FullZoomer.realTileSize-inWidth) * (FullZoomer.tiles.options.tileSize/FullZoomer.realTileSize)+FullZoomer.tilePad)+'px';

            } else {
                data.tile.style.width = FullZoomer.tiles.options.tileSize+FullZoomer.tilePad+'px';
                data.tile.style.marginRight = '';
            }
        }

        // Flat image projection
        L.CRS.Simple = L.Util.extend({}, L.CRS, {
            projection: L.Projection.LonLat,
            transformation: new L.Transformation(1, 0, -1, 0),
            scale: function (zoom) {
                return (FullZoomer.realTileSize * Math.pow(2, zoom));
            }
        });

        // override so we can always get a non-fractional tile {z}, rounded up so we only scale down.
        FullZoomer.TileLayer = L.TileLayer.extend({
            _getZoomForUrl: function () {

                var options = this.options,
                    zoom = this._map.getZoom();

                if (options.zoomReverse) {
                    zoom = options.maxZoom - zoom;
                }
                return (zoom <= -1) ? 0 : Math.ceil(zoom + options.zoomOffset);
            }
        });

        // this function sets everything up, and can be called multiple times for: viewport resized, new image to load, etc.
        FullZoomer.zoom_image = function (containerIn,tileURLIn,imageWidthIn,imageHeightIn) {
            FullZoomer.container = $('#'+containerIn);
            FullZoomer.containerName = containerIn;
            FullZoomer.imageWidth = imageWidthIn;
            FullZoomer.imageHeight = imageHeightIn;
            FullZoomer.tileURL = tileURLIn;
            
            var bigSide = Math.max(FullZoomer.imageWidth,FullZoomer.imageHeight);

            FullZoomer.maxZoom = 1;
            while ((FullZoomer.realTileSize * Math.pow(2,FullZoomer.maxZoom)) < bigSide) {
                FullZoomer.maxZoom++;
            }
            FullZoomer.canvasSize = FullZoomer.realTileSize * Math.pow(2, FullZoomer.maxZoom);
            
            //====================================
            // Compute tile size to fill container evenly
            FullZoomer.imageAR = FullZoomer.imageWidth/FullZoomer.imageHeight;
            FullZoomer.containerAR = FullZoomer.container.innerWidth()/FullZoomer.container.innerHeight();
            FullZoomer.containerMin = Math.min(FullZoomer.container.innerWidth(), FullZoomer.container.innerHeight());
            if (FullZoomer.imageAR < FullZoomer.containerAR) {
                FullZoomer.verticalScale = false;
                FullZoomer.tileSize_ = FullZoomer.container.innerHeight()/FullZoomer.imageHeight*4*FullZoomer.realTileSize;
            } else {
                FullZoomer.verticalScale = true;
                FullZoomer.tileSize_ = FullZoomer.container.innerWidth()/FullZoomer.imageWidth*4*FullZoomer.realTileSize;
            }
            while (FullZoomer.tileSize_ < FullZoomer.realTileSize/2 && FullZoomer.tileSize_ < FullZoomer.containerMin) {
                FullZoomer.tileSize_ *= 2;
            }
            
            //====================================
            // Setup the map if don't have one
            if (!FullZoomer.map) {
                FullZoomer.map =  new FullZoomer.Map(FullZoomer.containerName, {
                    crs: L.CRS.Simple,
                    worldCopyJump: false,
                    center: new L.LatLng(0.0, 0.0),
                    zoom: 0,
                    maxZoom: FullZoomer.maxZoom,
                    zoomControl: false, // we want custom buttons!
                    scrollWheelZoom: true, // too much page jumping
                    doubleClickZoom: true, // we'll use our own handler
                    trackResize: false // we'll do it ourselves, thanks.

                });
            }
            // Critical: on repeat calls this needs to act like a brand new map was created so we can get the scale right.
            FullZoomer.map._zoom = 0;
            // we need a map object to call getScaleZoom, so set this now
            FullZoomer.map.attributionControl.setPrefix(''); /*removes leaflet attribution*/
            var scale = FullZoomer.tileSize_ / FullZoomer.realTileSize;
            FullZoomer.map.options.minZoom = FullZoomer.map.getScaleZoom(scale);
            FullZoomer.map.options.maxZoom = FullZoomer.maxZoom;
            
            // Declare a tile layer and add to map
            FullZoomer.tiles = new FullZoomer.TileLayer(FullZoomer.tileURL, {
                noWrap: true,
                continuousWorld: false,
                maxZoom: FullZoomer.maxZoom,
                minZoom: FullZoomer.map.options.minZoom,
                tms: false,
                detectRetina: false,
                tileSize : FullZoomer.realTileSize,
                zoomOffset: 0,
                unloadInvisibleTiles: false,
                reuseTiles: false,
                updateWhenIdle: false,
                opacity:1
            });
            FullZoomer.tiles.on('tileload', FullZoomer.scaleTile);
            
            // not sure this matters: set the scale and position before we add the layer
            FullZoomer.fullImage();
            FullZoomer.map.addLayer(FullZoomer.tiles);
            
            // Make sure we set the bounds initially so they can't pan out of the image
            FullZoomer.postZoom();

            // configure a few things
            FullZoomer.map.options['doubleClickZoom']=true; // now we DO want this option...
            FullZoomer.map.addHandler('doubleClickZoom', FullZoomer.Map.DoubleClickZoom); // ...but use ours.

            // turn off old binding if we're loading a new tileLayer...
            FullZoomer.map.off('zoomend', FullZoomer.postZoom);
            // ...otherwise they all fire
            FullZoomer.map.on('zoomend', FullZoomer.postZoom);

            L.marker(roomcenter).addTo(FullZoomer.map);
            
        }

      
        // handle window resize
        FullZoomer.windowResized = function() {
            FullZoomer.map.removeLayer(FullZoomer.tiles);
            FullZoomer.map.options.minZoom = 0;
            FullZoomer.map._sizeChanged = true;
            FullZoomer.zoom_image(FullZoomer.containerName,FullZoomer.tileURL,FullZoomer.imageWidth,FullZoomer.imageHeight);

        }

        $(window).resize(function() {
            clearTimeout(FullZoomer.resizeTimer);
            FullZoomer.resizeTimer = setTimeout(FullZoomer.windowResized, 100);
        });



        
      

        // start it up!