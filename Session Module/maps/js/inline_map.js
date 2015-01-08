

		
        var Zoomer = {};
        Zoomer.realTileSize = 256;
        Zoomer.map = null;
        // XXX todo: do this conditionally (e.g. chrome doesn't need it)
        Zoomer.tilePad = 0; // how many pixels to pad the tiles to avoid gaps in some browsers
        Zoomer.roundingSlop = 0.001;//.001; // lat/long padding for setMaxBounds (avoid rounding errors)

        // override so we can allow full-scaling of flat images.
        Zoomer.Map = L.Map.extend({
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
                if (Zoomer.tiles) {
                    // round it away from the bottom if we're close: scale issues
                    if (zoom-1 < min) {
                        zoom = min;
                    }
                    // this is exactly like getZoomScale but we need to figure out the *next higher* zoomer level instead of
                    var crs = this.options.crs;
                    var nextZoom = (zoom <= -1) ? 0 : Math.ceil(zoom)
                    var scale = crs.scale(zoom) / crs.scale(nextZoom);
                    // do the clever work of setting the tileSize here so the tiles fill the view
                    Zoomer.tiles.options.tileSize = Math.ceil(Zoomer.realTileSize*(scale));
                }
                if (Zoomer.tiles && Math.round(zoom) == zoom) {
                    // we need to be explicit with whole tiles: no scale
                    Zoomer.tiles.options.tileSize = Zoomer.realTileSize;
                }
                return zoom;
            }
        })

        // override so we can make the map stick on the mouse instead of recentering (same as scrollwheel)
        Zoomer.Map.DoubleClickZoom = L.Map.DoubleClickZoom.extend({
            _onDoubleClick: function (e) {
                zoom = Zoomer.map._limitZoom(Zoomer.map._zoom + 1)
                var scale = Zoomer.map.getZoomScale(Zoomer.map._zoom + 1),
                    viewHalf = Zoomer.map.getSize()._divideBy(2),
                    centerOffset = e.containerPoint._subtract(viewHalf)._multiplyBy(1 - 1 / scale),
                    newCenterPoint = Zoomer.map._getTopLeftPoint()._add(viewHalf)._add(centerOffset);
                center = Zoomer.map.unproject(newCenterPoint);
                this.setView(center, zoom);
            }
        });

        // call after zoom so we can rebuild the maxBounds based on the zoom level:
        // always constrain to the smallest bounds that allow full image visibility plus whitespace slop
        Zoomer.postZoom = function() {
            // I think we should use bounds.extend: function (point) ??
            // ... surely there's a better way to do this that I can't figure out.
            var currentBounds = Zoomer.map.getBounds();
            var currentHeight = currentBounds._northEast.lat - currentBounds._southWest.lat;
            var currentWidth = currentBounds._northEast.lng - currentBounds._southWest.lng;
            var imageHeight = Zoomer.imageBounds._northEast.lat - Zoomer.imageBounds._southWest.lat;
            var imageWidth = Zoomer.imageBounds._northEast.lng - Zoomer.imageBounds._southWest.lng;
            var maxBoundsHeight = Math.max(imageHeight, currentHeight) + Zoomer.roundingSlop;
            var maxBoundsWidth= Math.max(imageWidth, currentWidth) + Zoomer.roundingSlop;
            if (currentHeight > imageHeight) { maxBoundsHeight += (currentHeight-imageHeight); }
            if (currentWidth > imageWidth) { maxBoundsWidth += (currentWidth-imageWidth); }
            var maxBounds = new L.LatLngBounds( [Zoomer.imageCenter.lat-maxBoundsHeight/2,Zoomer.imageCenter.lng-maxBoundsWidth/2],
                                                [Zoomer.imageCenter.lat+maxBoundsHeight/2,Zoomer.imageCenter.lng+maxBoundsWidth/2] );
            
            // this should work but it doesn't. Recenters when it doesn't need to.
            //return Zoomer.map.setMaxBounds(maxBounds);
            
            // following code is EXACTLY setMaxBounds except calling getBoundsZoom with inside=false.
            bounds = L.latLngBounds(maxBounds);

            Zoomer.map.options.maxBounds = bounds;

            if (!bounds) {
                Zoomer.map._boundsMinZoom = null;
                return;
            }

            var minZoom = Zoomer.map.getBoundsZoom(bounds, false);

            Zoomer.map._boundsMinZoom = minZoom;

            if (Zoomer.map._loaded) {
                if (Zoomer.map._zoom < minZoom) {
                    Zoomer.map.setView(bounds.getCenter(), minZoom);
                } else {
                    Zoomer.map.panInsideBounds(bounds);
                }
            }
        }

        // utility to center image and fill viewport. Call immediately before addTileLayer. (or after? May be fine.)
        Zoomer.fullImage = function() {
            // figure out where the image is in the "world" and record those bounds to limit zoom
            south = -1*(Zoomer.imageHeight/Zoomer.canvasSize)+Zoomer.roundingSlop;
            west = Zoomer.roundingSlop;
            north = 0-Zoomer.roundingSlop;
            east = Zoomer.imageWidth/Zoomer.canvasSize-Zoomer.roundingSlop
            Zoomer.imageBounds = new L.LatLngBounds( [south,west],[north,east] )
            // Sometimes this isn't giving us the right view?? roundingSlop above seems to help.
            Zoomer.map.fitBounds(Zoomer.imageBounds);
            Zoomer.imageCenter = Zoomer.imageBounds.getCenter();
            Zoomer.map.options.minZoom = Zoomer.map.getBoundsZoom(Zoomer.imageBounds);
        }

        // we call this on every tile to handle scaling and also non-square tiles at the edges of our "maps".
        Zoomer.scaleTile = function(data) {
            inWidth = data.tile.naturalWidth;
            inHeight = data.tile.naturalHeight;
            if (inHeight < Zoomer.realTileSize) {
                data.tile.style.height = Math.ceil(inHeight * (Zoomer.tiles.options.tileSize/Zoomer.realTileSize)+Zoomer.tilePad)+'px';
                data.tile.style.marginBottom = Math.ceil((Zoomer.realTileSize-inHeight) * (Zoomer.tiles.options.tileSize/Zoomer.realTileSize)+Zoomer.tilePad)+'px';
            } else {
                data.tile.style.height = Zoomer.tiles.options.tileSize+Zoomer.tilePad+'px';
                data.tile.style.marginTop = '';
            }
            if (inWidth < Zoomer.realTileSize) {
                data.tile.style.width = Math.ceil(inWidth * (Zoomer.tiles.options.tileSize/Zoomer.realTileSize)+Zoomer.tilePad)+'px';
                data.tile.style.marginRight = Math.ceil((Zoomer.realTileSize-inWidth) * (Zoomer.tiles.options.tileSize/Zoomer.realTileSize)+Zoomer.tilePad)+'px';

            } else {
                data.tile.style.width = Zoomer.tiles.options.tileSize+Zoomer.tilePad+'px';
                data.tile.style.marginRight = '';
            }
        }

        // Flat image projection
        L.CRS.Simple = L.Util.extend({}, L.CRS, {
            projection: L.Projection.LonLat,
            transformation: new L.Transformation(1, 0, -1, 0),
            scale: function (zoom) {
                return (Zoomer.realTileSize * Math.pow(2, zoom));
            }
        });

        // override so we can always get a non-fractional tile {z}, rounded up so we only scale down.
        Zoomer.TileLayer = L.TileLayer.extend({
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
        Zoomer.zoom_image = function (containerIn,tileURLIn,imageWidthIn,imageHeightIn) {
            Zoomer.container = $('#'+containerIn);
            Zoomer.containerName = containerIn;
            Zoomer.imageWidth = imageWidthIn;
            Zoomer.imageHeight = imageHeightIn;
            Zoomer.tileURL = tileURLIn;
            
            var bigSide = Math.max(Zoomer.imageWidth,Zoomer.imageHeight);

            Zoomer.maxZoom = 1;
            while ((Zoomer.realTileSize * Math.pow(2,Zoomer.maxZoom)) < bigSide) {
                Zoomer.maxZoom++;
            }
            Zoomer.canvasSize = Zoomer.realTileSize * Math.pow(2, Zoomer.maxZoom);
            
            //====================================
            // Compute tile size to fill container evenly
            Zoomer.imageAR = Zoomer.imageWidth/Zoomer.imageHeight;
            Zoomer.containerAR = Zoomer.container.innerWidth()/Zoomer.container.innerHeight();
            Zoomer.containerMin = Math.min(Zoomer.container.innerWidth(), Zoomer.container.innerHeight());
            if (Zoomer.imageAR < Zoomer.containerAR) {
                Zoomer.verticalScale = false;
                Zoomer.tileSize_ = Zoomer.container.innerHeight()/Zoomer.imageHeight*4*Zoomer.realTileSize;
            } else {
                Zoomer.verticalScale = true;
                Zoomer.tileSize_ = Zoomer.container.innerWidth()/Zoomer.imageWidth*4*Zoomer.realTileSize;
            }
            while (Zoomer.tileSize_ < Zoomer.realTileSize/2 && Zoomer.tileSize_ < Zoomer.containerMin) {
                Zoomer.tileSize_ *= 2;
            }
            
            //====================================
            // Setup the map if don't have one
            if (!Zoomer.map) {
                Zoomer.map =  new Zoomer.Map(Zoomer.containerName, {
                    crs: L.CRS.Simple,
                    worldCopyJump: false,
                    center: new L.LatLng(0.0, 0.0),
                    zoom: 0,
                    maxZoom: Zoomer.maxZoom,
                    zoomControl: false, // we want custom buttons!
                    scrollWheelZoom: true, // too much page jumping
                    doubleClickZoom: true, // we'll use our own handler
                    trackResize: false // we'll do it ourselves, thanks.

                });
            }
            // Critical: on repeat calls this needs to act like a brand new map was created so we can get the scale right.
            Zoomer.map._zoom = 2;
            
           
            // we need a map object to call getScaleZoom, so set this now
            Zoomer.map.attributionControl.setPrefix(''); /*removes leaflet attribution*/
            var scale = Zoomer.tileSize_ / Zoomer.realTileSize;
            Zoomer.map.options.minZoom = Zoomer.map.getScaleZoom(scale);
            Zoomer.map.options.maxZoom = Zoomer.maxZoom;
            
            // Declare a tile layer and add to map
            Zoomer.tiles = new Zoomer.TileLayer(Zoomer.tileURL, {
               noWrap: true,
                continuousWorld: false,
                maxZoom: Zoomer.maxZoom,
                minZoom: Zoomer.map.options.minZoom,
                tms: false,
                detectRetina: false,
                tileSize : Zoomer.realTileSize,
                zoomOffset: 0,
                unloadInvisibleTiles: false,
                reuseTiles: false,
                updateWhenIdle: false,
                opacity:1
            });
           
            
            // not sure this matters: set the scale and position before we add the layer
            Zoomer.fullImage();
            Zoomer.map.addLayer(Zoomer.tiles);

            Zoomer.map.setView(roomcenter, 2);
            
            // Make sure we set the bounds initially so they can't pan out of the image
            Zoomer.postZoom();

            // configure a few things
            Zoomer.map.options['doubleClickZoom']=true; // now we DO want this option...
            Zoomer.map.addHandler('doubleClickZoom', Zoomer.Map.DoubleClickZoom); // ...but use ours.



            // turn off old binding if we're loading a new tileLayer...
            Zoomer.map.off('zoomend', Zoomer.postZoom);
            // ...otherwise they all fire
            Zoomer.map.on('zoomend', Zoomer.postZoom);

            

           L.marker(roomcenter).addTo(Zoomer.map);



           
            
        };
   // };

      

        // start it up!