//Company : Navshar Software
//Project : Smart Pudhari
//Author  : Sourabh Raut
//Created On : 23-Feb-2021
//Version: 1.0
//Description : To common function 

var Constant = (function Constant() {
    'use strict';
    var contentType = 'application/json; charset=utf-8';
    var urlPrefix = window.location.origin + '/SmartPudhari';
    var dataType = "json";

    return {
        contentType: contentType,
        urlPrefix: urlPrefix,
        dataType: dataType
    }
})();