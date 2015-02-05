goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control');
goog.require('ol.control.ScaleLine');
goog.require('ol.source.XYZ');
goog.require('ol.layer.Tile');
goog.require('ol.layer.TileDem');
goog.require('ol.proj');
goog.require('ol.source.OSM');
goog.require('ol.source.Stamen');
goog.require('ol.source.BingMaps');
goog.require('ol.source.TileDebug');

goog.require('ol.dom.Input');

$(document).ready(function() {
    'use strict';
    if (webgl_detect()) {

        var dem, osm, stamen, bing, debug, vector, ol3DemMap, ol3demUi;

        dem = new ol.layer.TileDem({
            source: new ol.source.XYZ({
                attributions: [new ol.Attribution({
                    html: '<a href="http://www.eea.europa.eu/data-and-maps/data/eu-dem" target="_blank">Produced using Copernicus data and information funded by the European Union - EU-DEM layers</a>'
                })],
                url: '../demo/tiles/{z}/{x}/{y}.png'
            })
        });

        osm = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        osm.t = 'Open Street Map';

        stamen = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        });
        stamen.t = 'Stamen Watercolor';

        bing = new ol.layer.Tile({
            source: new ol.source.BingMaps({
            key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
            imagerySet: 'Aerial'
            })
        });
        bing.t = "Bing Aerial";

        debug = [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
              source: new ol.source.TileDebug({
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.XYZ({
                  maxZoom: 22
                })
              })
            })
          ];

        ol3DemMap = new ol.Map({
            controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
            target: 'map',
            renderer: 'webgl',
            layers: [osm, stamen, bing, dem], // base dem has always to be the last added layer
            // renderer: exampleNS.getRendererFromQueryString(),
            // layers: debug,
            view: new ol.View({ center: ol.proj.transform([7.754974, 46.375803], 'EPSG:4326', 'EPSG:3857'), // alps
                                zoom: 10,
                                maxZoom: 12,
                                minZoom: 6})
        });

        ol3demUi = new Ol3demUi(ol3DemMap);

        ol3DemMap.on('click', function(evt){
            var coord = evt.coordinate;
            var transformed_coordinate = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
            var elevation = ol3DemMap.getRenderer().getLayerRenderer(dem).getElevation(coord,ol3DemMap.getView().getZoom());
            console.log(transformed_coordinate,elevation+' meters');
        });

    } else {
        $('body').append('<div class="webglMissing"><p><span class="title">WebGL Not Supported!</span><br> WebGL is required for this application, and your Web browser does not support WebGL. Google Chrome or Firefox are recommended browsers with WebGL support. Click <a href="http://www.browserleaks.com/webgl" target="_blank">here</a> to check the WebGL specifications of your browser.</p></div>');
    }
});