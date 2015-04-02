var ConfigManager = function(controlBar, viewer) {
    'use strict';

    var url = 'http://localhost:8000/api/configs',
        dataType = 'json';

    this.saveConfigButton = function() {
        var anchor = document.createElement('button');
        anchor.innerHTML = '<i class="fa fa-star"></i>';
        anchor.id = 'saveConfigButton';
        var handleSaveConfigButton = function(e) {
            e.preventDefault();
            saveConfig();
        };
        anchor.addEventListener('click', handleSaveConfigButton, false);
        anchor.addEventListener('touchstart', handleSaveConfigButton, false);
        var element = document.createElement('div');
        element.className = 'saveConfigButton ol-control ol-unselectable';
        element.appendChild(anchor);
        ol.control.Control.call(this, {
            element: element,
        });
    };
    ol.inherits(this.saveConfigButton, ol.control.Control);
    viewer.map.addControl(new this.saveConfigButton());

    // this.loadConfigButton = function() {
    //     var anchor = document.createElement('button');
    //     anchor.innerHTML = '<i class="fa fa-refresh"></i>';
    //     anchor.id = 'loadConfigButton';
    //     var handleLoadConfigButton = function(e) {
    //         e.preventDefault();
    //         loadConfig('551030d02e2b671e0937b3d8');
    //     };
    //     anchor.addEventListener('click', handleLoadConfigButton, false);
    //     anchor.addEventListener('touchstart', handleLoadConfigButton, false);
    //     var element = document.createElement('div');
    //     element.className = 'loadConfigButton ol-control ol-unselectable';
    //     element.appendChild(anchor);
    //     ol.control.Control.call(this, {
    //         element: element,
    //     });
    // };
    // ol.inherits(this.loadConfigButton, ol.control.Control);
    // ui.map.addControl(new this.loadConfigButton());

    // var loadConfig = function(id) {
    //     $.ajax({
    //         type: 'GET',
    //         url: url+'/'+id,
    //         success: function(data) {
    //             console.log(data);
    //             config = data;
    //             console.log(config);
    //             ui.updateMap();
    //             ui.updateControlTools();                
    //         },
    //         dataType: dataType
    //     });
    // };

    var saveConfig = function() {
        $.ajax({
            type: 'POST',
            url: url,
            data: viewer.config.get(),
            beforeSend : function (){
                //
            },
            success: function(data) {
                loadAllConfigs();
                controlBar.updateConfigStore();       
            },
            dataType: dataType
        });
    };

    var loadAllConfigs = function() {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                controlBar.updateConfigStore(data);                
            },
            error: function(data) {
                controlBar.controls.config.cont.hide();                
            },            
            dataType: dataType
        });
    };

    // load all available configs and push to gui selectbox
    loadAllConfigs();
};